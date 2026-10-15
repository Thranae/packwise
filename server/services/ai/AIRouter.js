import axios from 'axios';
import ProviderRegistry from './ProviderRegistry.js';
import { TIERS, getTierName } from './modelCatalog.js';

const ANTHROPIC_VERSION = '2023-06-01';
const LEGACY_TIMEOUT_MS = 30000;
const ERROR_COOLDOWN_MS = 30000;

// Direct APIs are listed before their OpenRouter equivalents (lower latency); unconfigured providers are skipped instantly.
const CLAUDE = ['anthropic', 'openrouter-claude'];
const GPT = ['openai', 'openrouter-gpt'];
const OTHERS = ['gemini', 'nvidia', 'openrouter-nemotron', 'groq', 'mistral', 'openrouter'];

/**
 * Ordered provider chain per task type — the best model for each job first, the other flagship family as
 * the first fallback. Model per provider comes from the task's tier (see modelCatalog.js).
 */
const ROUTES = {
  planning: [...CLAUDE, ...GPT, ...OTHERS],    // smart: Claude Opus 5.5 → GPT-6.1 Sol (itineraries, plans, journals)
  json: [...GPT, ...CLAUDE, ...OTHERS],        // smart: GPT-6.1 Sol (native JSON mode) → Claude Opus 5.5
  casual: [...CLAUDE, ...GPT, ...OTHERS],      // fast:  Claude Sonnet 5.5 → GPT-6 Luna (chat assistant)
  lightweight: [...GPT, ...CLAUDE, ...OTHERS], // fast:  GPT-6 Luna → Claude Sonnet 5.5 (small lookups)
};

// /chat/stream pipes raw OpenAI-style SSE to the client, so only OpenAI-compatible providers qualify
const STREAM_ROUTE = ['openrouter-claude', 'openai', 'openrouter-gpt', 'nvidia', 'groq'];

const JSON_SYSTEM_PROMPT = 'Reply with a single valid JSON value only. No markdown code fences, no commentary.';

class AIRouter {
  /**
   * @param {'planning'|'json'|'casual'|'lightweight'|'backup'} taskType
   * @returns {string[]} provider IDs to try in order
   */
  _getRoute(taskType) {
    return ROUTES[taskType] || ROUTES.casual;
  }

  /** Model for this provider on the task's tier (tiered GPT/Claude providers), else the provider's single model. */
  _resolveModel(provider, tierName) {
    return provider.models?.[tierName] || provider.model;
  }

  _isCoolingDown(provider) {
    if (provider.status !== 'rate_limited' && provider.status !== 'error') return false;
    return Boolean(provider.lastErrorTime) && (Date.now() - provider.lastErrorTime.getTime() < ERROR_COOLDOWN_MS);
  }

  _chatHeaders(provider) {
    const headers = {
      'Authorization': `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json'
    };
    if (provider.id.startsWith('openrouter')) {
      headers['HTTP-Referer'] = 'http://localhost:3000';
      headers['X-Title'] = 'PackWise';
    }
    return headers;
  }

  /**
   * Build an OpenAI-compatible Chat Completions payload (OpenAI, OpenRouter, Groq, Mistral, NVIDIA).
   * GPT-6 and Claude 5.5 models always reason before answering, so they get an explicit effort and output cap.
   */
  _buildChatPayload(provider, model, prompt, isJsonMode, tier, stream = false) {
    const payload = {
      model,
      messages: [{ role: "user", content: prompt }]
    };

    if (provider.id === 'openai') {
      // Reasoning models: `reasoning_effort` + `max_completion_tokens` (`max_tokens` is not accepted)
      payload.reasoning_effort = tier.effort;
      payload.max_completion_tokens = tier.maxTokens;
    } else if (provider.models && provider.id.startsWith('openrouter')) {
      // OpenRouter's unified reasoning control; exclude keeps hidden reasoning out of the response body
      payload.reasoning = { effort: tier.effort, exclude: true };
      payload.max_tokens = tier.maxTokens;
    }

    if (provider.extraConfig) {
      Object.assign(payload, provider.extraConfig);
    }

    if (isJsonMode && provider.supportsJSONMode) {
      payload.response_format = { type: "json_object" };
    }

    if (stream) {
      payload.stream = true;
    }

    return payload;
  }

  async _callGemini(provider, prompt, isJsonMode) {
    const payload = { 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [{
        functionDeclarations: [
          {
            name: "getLiveCurrencyRate",
            description: "Get the live currency exchange rate between two currencies.",
            parameters: {
              type: "OBJECT",
              properties: {
                base: { type: "STRING", description: "Base currency code (e.g. USD)" },
                target: { type: "STRING", description: "Target currency code (e.g. EUR)" }
              },
              required: ["base", "target"]
            }
          }
        ]
      }]
    };
    
    if (isJsonMode && provider.supportsJSONMode) {
      payload.generationConfig = { responseMimeType: "application/json" };
    }
    
    let response = await axios.post(`${provider.baseUrl}?key=${provider.apiKey}`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: LEGACY_TIMEOUT_MS
    });
    
    const part = response.data.candidates[0].content.parts[0];

    // Handle Tool Call
    if (part.functionCall) {
      const call = part.functionCall;
      console.log(`[AIRouter] Gemini invoked Tool: ${call.name}`);
      
      let toolResult = { error: "Unknown tool" };
      if (call.name === "getLiveCurrencyRate") {
        // Mock Live Rate for demonstration
        toolResult = { base: call.args.base, target: call.args.target, rate: 1.45, timestamp: new Date().toISOString() };
      }

      // Step 2: Send the tool response back
      payload.contents.push(response.data.candidates[0].content); // Append model's call
      payload.contents.push({
        role: "function",
        parts: [{
          functionResponse: {
            name: call.name,
            response: toolResult
          }
        }]
      });

      response = await axios.post(`${provider.baseUrl}?key=${provider.apiKey}`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: LEGACY_TIMEOUT_MS
      });
      
      return response.data.candidates[0].content.parts[0].text;
    }

    return part.text;
  }

  /** Native Anthropic Messages API. */
  async _callAnthropic(provider, model, prompt, isJsonMode, tier) {
    const payload = {
      model,
      max_tokens: tier.maxTokens, // hard cap on thinking + answer combined
      output_config: { effort: tier.effort },
      messages: [{ role: "user", content: prompt }]
    };
    if (isJsonMode) {
      payload.system = JSON_SYSTEM_PROMPT;
    }

    const { data } = await axios.post(provider.baseUrl, payload, {
      headers: {
        'x-api-key': provider.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'Content-Type': 'application/json'
      },
      timeout: tier.timeoutMs
    });

    // Adaptive thinking returns `thinking` blocks ahead of the answer — keep only the text blocks
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    if (!text) {
      throw new Error(`Empty response from ${model} (stop_reason: ${data.stop_reason || 'unknown'})`);
    }
    if (isJsonMode && data.stop_reason === 'max_tokens') {
      throw new Error(`Truncated JSON from ${model} (hit max_tokens)`);
    }
    return text;
  }

  async _callChatCompletions(provider, model, prompt, isJsonMode, tier) {
    const payload = this._buildChatPayload(provider, model, prompt, isJsonMode, tier);
    const timeout = provider.models ? tier.timeoutMs : LEGACY_TIMEOUT_MS;
    const response = await axios.post(provider.baseUrl, payload, { headers: this._chatHeaders(provider), timeout });

    const choice = response.data.choices?.[0];
    const text = choice?.message?.content;

    // Reasoning models can spend the whole budget thinking and return no visible text — fall back instead
    if (!text || !text.trim()) {
      throw new Error(`Empty response from ${model} (finish_reason: ${choice?.finish_reason || 'unknown'})`);
    }
    if (isJsonMode && choice.finish_reason === 'length') {
      throw new Error(`Truncated JSON from ${model} (finish_reason: length)`);
    }
    return text;
  }

  /**
   * Execute an API call to a specific provider
   * @param {Object} provider 
   * @param {string} prompt 
   * @param {boolean} isJsonMode 
   * @param {string} tierName - 'smart' | 'fast'
   * @returns {Promise<string>} Response text
   */
  async _executeProviderCall(provider, prompt, isJsonMode, tierName = 'fast') {
    const startTime = Date.now();
    const tier = TIERS[tierName];
    const model = this._resolveModel(provider, tierName);

    try {
      let responseText;
      if (provider.id === 'gemini') {
        responseText = await this._callGemini(provider, prompt, isJsonMode);
      } else if (provider.id === 'anthropic') {
        responseText = await this._callAnthropic(provider, model, prompt, isJsonMode, tier);
      } else {
        responseText = await this._callChatCompletions(provider, model, prompt, isJsonMode, tier);
      }

      if (isJsonMode) {
        // AI models frequently hallucinate markdown code blocks around JSON.
        // Strip out ```json and ``` if they exist.
        if (responseText.startsWith('```')) {
          responseText = responseText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
        }
      }

      const latency = Date.now() - startTime;
      ProviderRegistry.updateProviderLatency(provider.id, latency);
      ProviderRegistry.updateProviderStatus(provider.id, 'active');
      
      return responseText;
    } catch (error) {
      ProviderRegistry.updateProviderStatus(provider.id, error.response?.status === 429 ? 'rate_limited' : 'error');
      console.error(`[AIRouter] Provider ${provider.name} (${model}) failed: ${error.response?.data?.error?.message || error.message}`);
      throw error;
    }
  }

  /**
   * Route a request through the AI architecture
   * @param {string} prompt 
   * @param {'planning'|'json'|'casual'|'lightweight'|'backup'} taskType 
   * @param {boolean} isJsonMode 
   * @returns {Promise<string>}
   */
  async routeRequest(prompt, taskType, isJsonMode = false) {
    const tierName = getTierName(taskType);
    console.log(`\n[AIRouter] Received request for task type: ${taskType} (tier: ${tierName}, JSON: ${isJsonMode})`);

    for (const providerId of this._getRoute(taskType)) {
      const provider = ProviderRegistry.getProvider(providerId);
      
      if (!provider || provider.status === 'unconfigured') {
        console.log(`[AIRouter] Skipping ${providerId} (unconfigured)`);
        continue;
      }

      // If it errored recently (within 30 seconds), skip to avoid penalizing users
      if (this._isCoolingDown(provider)) {
        console.log(`[AIRouter] Skipping ${provider.name} (recent error)`);
        continue;
      }

      const model = this._resolveModel(provider, tierName);
      console.log(`[AIRouter] Routing to ${provider.name} (${model})...`);
      
      try {
        const result = await this._executeProviderCall(provider, prompt, isJsonMode, tierName);
        console.log(`[AIRouter] Success via ${provider.name} (${model}, ${provider.latencyMs}ms)`);
        return result;
      } catch (error) {
        console.log(`[AIRouter] ${provider.name} failed. Falling back to next in chain...`);
        // Loop will continue to next provider
      }
    }

    console.error("[AIRouter] CRITICAL FAULT: All providers in the fallback chain failed.");
    throw new Error("All AI providers failed to process the request.");
  }

  /**
   * Route a request through the AI architecture as an SSE stream
   * @param {string} prompt 
   * @param {'casual'} taskType 
   * @returns {Promise<stream.Readable>}
   */
  async routeRequestStream(prompt, taskType = 'casual') {
    const tierName = getTierName(taskType);
    const tier = TIERS[tierName];

    for (const providerId of STREAM_ROUTE) {
      const provider = ProviderRegistry.getProvider(providerId);
      if (!provider || provider.status === 'unconfigured' || this._isCoolingDown(provider)) {
        continue;
      }

      const model = this._resolveModel(provider, tierName);
      try {
        console.log(`[AIRouter] Starting stream via ${provider.name} (${model})...`);
        const payload = this._buildChatPayload(provider, model, prompt, false, tier, true);
        const response = await axios.post(provider.baseUrl, payload, { 
          headers: this._chatHeaders(provider), 
          responseType: 'stream',
          timeout: provider.models ? tier.timeoutMs : LEGACY_TIMEOUT_MS
        });
        return response.data; // Node.js stream
      } catch (error) {
        ProviderRegistry.updateProviderStatus(provider.id, error.response?.status === 429 ? 'rate_limited' : 'error');
        console.error(`[AIRouter] Stream via ${provider.name} failed: ${error.message}. Trying next provider...`);
      }
    }

    throw new Error("No streaming-capable AI provider is available.");
  }
}

export default new AIRouter();
