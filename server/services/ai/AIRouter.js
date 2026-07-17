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
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        if (isJsonMode && provider.supportsJSONMode) {
          payload.generationConfig = { responseMimeType: "application/json" };
        }
        
        const response = await axios.post(`${provider.baseUrl}?key=${provider.apiKey}`, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        });
        responseText = response.data.candidates[0].content.parts[0].text;
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
}

export default new AIRouter();
