import axios from 'axios';
import ProviderRegistry from './ProviderRegistry.js';

class AIRouter {
  /**
   * Determine the optimal provider based on the task type
   * @param {'planning'|'json'|'casual'|'lightweight'|'backup'} taskType 
   * @returns {string} providerId
   */
  _getPrimaryProviderForTask(taskType) {
    switch (taskType) {
      case 'json':
        return 'openai';
      case 'casual':
        return 'groq'; // The implementation uses groq for fast casual chat
      case 'lightweight':
        return 'mistral';
      case 'planning':
      default:
        return 'gemini';
    }
  }

  /**
   * Defines the fallback chain for a given provider
   * @param {string} providerId 
   * @returns {string[]} array of provider IDs to try sequentially
   */
  _getFallbackChain(providerId) {
    // The prompt requested: Gemini -> OpenAI -> OpenRouter
    if (providerId === 'gemini') {
      return ['gemini', 'openai', 'openrouter'];
    }
    
    // If starting with OpenAI (e.g. JSON), fallback to OpenRouter, then Gemini
    if (providerId === 'openai') {
      return ['openai', 'openrouter', 'gemini'];
    }

    // Default fallback chain for other models
    return [providerId, 'openai', 'openrouter', 'gemini'];
  }

  /**
   * Execute an API call to a specific provider
   * @param {Object} provider 
   * @param {string} prompt 
   * @param {boolean} isJsonMode 
   * @returns {string} Response text
   */
  async _executeProviderCall(provider, prompt, isJsonMode) {
    const startTime = Date.now();
    let responseText = "";

    try {
      if (provider.id === 'gemini') {
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
          timeout: 30000
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
            timeout: 30000
          });
          
          responseText = response.data.candidates[0].content.parts[0].text;
        } else {
          responseText = part.text;
        }
      } else {
        // OpenAI compatible (Groq, Mistral, OpenRouter, OpenAI)
        const headers = {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        };
        
        if (provider.id === 'openrouter') {
          headers['HTTP-Referer'] = 'http://localhost:3000';
          headers['X-Title'] = 'PackWise';
        }

        const payload = {
          model: provider.model,
          messages: [{ role: "user", content: prompt }]
        };

        if (isJsonMode && provider.supportsJSONMode) {
          payload.response_format = { type: "json_object" };
        }

        const response = await axios.post(provider.baseUrl, payload, { headers, timeout: 30000 });
        responseText = response.data.choices[0].message.content;
      }

      const latency = Date.now() - startTime;
      ProviderRegistry.updateProviderLatency(provider.id, latency);
      ProviderRegistry.updateProviderStatus(provider.id, 'active');
      
      return responseText;
    } catch (error) {
      ProviderRegistry.updateProviderStatus(provider.id, error.response?.status === 429 ? 'rate_limited' : 'error');
      console.error(`[AIRouter] Provider ${provider.name} failed: ${error.response?.data?.error?.message || error.message}`);
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
    console.log(`\n[AIRouter] Received request for task type: ${taskType} (JSON: ${isJsonMode})`);
    
    const primaryId = this._getPrimaryProviderForTask(taskType);
    const fallbackChain = this._getFallbackChain(primaryId);
    
    let lastError = null;

    for (const providerId of fallbackChain) {
      const provider = ProviderRegistry.getProvider(providerId);
      
      if (!provider || provider.status === 'unconfigured') {
        console.log(`[AIRouter] Skipping ${providerId} (unconfigured)`);
        continue;
      }

      if (provider.status === 'rate_limited' || provider.status === 'error') {
        // If it errored recently (within 30 seconds), skip to avoid penalizing users
        const isRecentError = provider.lastErrorTime && (Date.now() - provider.lastErrorTime.getTime() < 30000);
        if (isRecentError) {
          console.log(`[AIRouter] Skipping ${provider.name} (recent error)`);
          continue;
        }
      }

      console.log(`[AIRouter] Routing to ${provider.name}...`);
      
      try {
        const result = await this._executeProviderCall(provider, prompt, isJsonMode);
        console.log(`[AIRouter] Success via ${provider.name} (${provider.latencyMs}ms)`);
        return result;
      } catch (error) {
        lastError = error;
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
    // For simplicity, we use Groq/OpenAI compatible endpoints for streaming
    let provider = ProviderRegistry.getProvider('groq');
    if (!provider || provider.status === 'unconfigured') {
      provider = ProviderRegistry.getProvider('openai');
    }

    console.log(`[AIRouter] Starting stream via ${provider.name}...`);
    const headers = {
      'Authorization': `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json'
    };

    const payload = {
      model: provider.model,
      messages: [{ role: "user", content: prompt }],
      stream: true
    };

    const response = await axios.post(provider.baseUrl, payload, { 
      headers, 
      responseType: 'stream',
      timeout: 30000 
    });
    
    return response.data; // Node.js stream
  }
}

export default new AIRouter();
