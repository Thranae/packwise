import axios from 'axios';
import ProviderRegistry from './ProviderRegistry.js';

class ProviderManager {
  /**
   * Initialize and register all providers.
   * Loads API keys securely from environment variables.
   */
  async initialize() {
    this._registerGemini();
    this._registerOpenAI();
    this._registerMistral();
    this._registerGroq();
    this._registerOpenRouter();

    await this._runHealthChecks();
    this._printStartupReport();
  }

  _registerGemini() {
    ProviderRegistry.registerProvider({
      id: 'gemini',
      name: 'Google Gemini',
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      model: 'gemini-2.0-flash',
      priority: 1,
      supportsStreaming: false,
      supportsToolCalling: true,
      supportsJSONMode: true,
      supportsVision: true
    });
  }

  _registerOpenAI() {
    ProviderRegistry.registerProvider({
      id: 'openai',
      name: 'OpenAI',
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini',
      priority: 2,
      supportsStreaming: true,
      supportsToolCalling: true,
      supportsJSONMode: true,
      supportsVision: true
    });
  }

  _registerMistral() {
    ProviderRegistry.registerProvider({
      id: 'mistral',
      name: 'Mistral',
      apiKey: process.env.MISTRAL_API_KEY,
      baseUrl: 'https://api.mistral.ai/v1/chat/completions',
      model: 'mistral-large-latest',
      priority: 4,
      supportsStreaming: true,
      supportsToolCalling: true,
      supportsJSONMode: true,
      supportsVision: false
    });
  }

  _registerGroq() {
    ProviderRegistry.registerProvider({
      id: 'groq',
      name: 'Groq',
      apiKey: process.env.GROQ_API_KEY,
      baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.3-70b-versatile',
      priority: 3,
      supportsStreaming: true,
      supportsToolCalling: true,
      supportsJSONMode: true,
      supportsVision: false
    });
  }

  _registerOpenRouter() {
    ProviderRegistry.registerProvider({
      id: 'openrouter',
      name: 'OpenRouter',
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'meta-llama/llama-3.3-70b-instruct',
      priority: 5,
      supportsStreaming: true,
      supportsToolCalling: true,
      supportsJSONMode: true,
      supportsVision: true
    });
  }

  /**
   * Perform an initial connection test to verify APIs are working
   */
  async _runHealthChecks() {
    const providers = ProviderRegistry.getAllProviders();
    const checks = providers.map(async (provider) => {
      if (provider.status === 'unconfigured') return;

      try {
        const startTime = Date.now();
        // A minimal lightweight prompt to test connection
        let response;
        if (provider.id === 'gemini') {
          response = await axios.post(`${provider.baseUrl}?key=${provider.apiKey}`, {
            contents: [{ parts: [{ text: "ping" }] }]
          }, { headers: { 'Content-Type': 'application/json' }, timeout: 5000 });
        } else {
          response = await axios.post(provider.baseUrl, {
            model: provider.model,
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 5
          }, { 
            headers: { 'Authorization': `Bearer ${provider.apiKey}`, 'Content-Type': 'application/json' },
            timeout: 5000 
          });
        }

        const latency = Date.now() - startTime;
        ProviderRegistry.updateProviderLatency(provider.id, latency);
        ProviderRegistry.updateProviderStatus(provider.id, 'active');
      } catch (error) {
        ProviderRegistry.updateProviderStatus(provider.id, 'error');
      }
    });

    await Promise.all(checks);
  }

  _printStartupReport() {
    console.log('\n==================================================');
    console.log('🤖 AI Provider Manager Startup Report');
    console.log('==================================================');
    
    const providers = ProviderRegistry.getAllProviders();
    
    providers.forEach(p => {
      const isConfigured = p.status !== 'unconfigured';
      const isHealthy = p.status === 'active';
      
      console.log(`\nProvider: ${p.name} [Priority: ${p.priority}]`);
      console.log(`- API Key Found: ${isConfigured ? '✅ Yes' : '❌ No (Missing from .env)'}`);
      
      if (isConfigured) {
        console.log(`- Connection Successful: ${isHealthy ? '✅ Yes' : '❌ Failed (Check Network or Quota)'}`);
        if (isHealthy) {
          console.log(`- Startup Latency: ${p.latencyMs}ms`);
        }
      }
      console.log(`- Provider Loaded: ${isConfigured && isHealthy ? '✅ Ready for Production' : '⚠️ Warning'}`);
    });
    
    console.log('\n==================================================\n');
  }
}

export default new ProviderManager();
