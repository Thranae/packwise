import axios from 'axios';
import ProviderRegistry from './ProviderRegistry.js';
import { getPresetName, resolveModels } from './modelCatalog.js';

const ANTHROPIC_VERSION = '2023-06-01';
const HEALTH_CHECK_TIMEOUT_MS = 5000;

class ProviderManager {
  /**
   * Initialize and register all providers.
   * Loads API keys securely from environment variables.
   */
  async initialize() {
    this._registerGemini();
    this._registerNvidia();
    this._registerOpenAI();
    this._registerAnthropic();
    this._registerMistral();
    this._registerGroq();
    this._registerOpenRouterGPT();
    this._registerOpenRouterClaude();
    this._registerOpenRouterNemotron();
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

  _registerNvidia() {
    ProviderRegistry.registerProvider({
      id: 'nvidia',
      name: 'NVIDIA NIM',
      apiKey: process.env.NVIDIA_API_KEY,
      baseUrl: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1/chat/completions',
      model: 'nvidia/nemotron-3-super-120b-a12b',
      priority: 2,
      supportsStreaming: true,
      supportsToolCalling: true,
      supportsJSONMode: true,
      supportsVision: false,
      extraConfig: {
        temperature: 1,
        top_p: 0.95,
        max_tokens: 16384,
        reasoning_budget: 16384,
        chat_template_kwargs: {"enable_thinking":true}
      }
    });
  }

  _registerOpenAI() {
    const models = resolveModels('openai');
    ProviderRegistry.registerProvider({
      id: 'openai',
      name: 'OpenAI GPT',
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      model: models.smart,
      models,
      priority: 1,
      supportsStreaming: true,
      // GPT-6 Astra / GPT-6.1 Sol only support function calling on the Responses API, not Chat Completions
      supportsToolCalling: false,
      supportsJSONMode: true,
      supportsVision: true
    });
  }

  _registerAnthropic() {
    const models = resolveModels('anthropic');
    ProviderRegistry.registerProvider({
      id: 'anthropic',
      name: 'Anthropic Claude',
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseUrl: 'https://api.anthropic.com/v1/messages',
      model: models.smart,
      models,
      priority: 1,
      // Native Messages API streams a different SSE format, so /chat/stream uses OpenAI-compatible providers
      supportsStreaming: false,
      supportsToolCalling: true,
      // No generic JSON mode on the Messages API: JSON is requested via the system prompt and parsed leniently
      supportsJSONMode: false,
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

  _registerOpenRouterGPT() {
    const models = resolveModels('openrouter-gpt');
    ProviderRegistry.registerProvider({
      id: 'openrouter-gpt',
      name: 'OpenRouter GPT',
      apiKey: process.env.OPENROUTER_GPT_KEY,
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      model: models.smart,
      models,
      priority: 2,
      supportsStreaming: true,
      supportsToolCalling: true,
      supportsJSONMode: true,
      supportsVision: true
    });
  }

  _registerOpenRouterClaude() {
    const models = resolveModels('openrouter-claude');
    ProviderRegistry.registerProvider({
      id: 'openrouter-claude',
      name: 'OpenRouter Claude',
      apiKey: process.env.OPENROUTER_CLAUDE_KEY,
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      model: models.smart,
      models,
      priority: 2,
      supportsStreaming: true,
      supportsToolCalling: true,
      supportsJSONMode: true,
      supportsVision: true
    });
  }

  _registerOpenRouterNemotron() {
    ProviderRegistry.registerProvider({
      id: 'openrouter-nemotron',
      name: 'OpenRouter Nemotron',
      apiKey: process.env.OPENROUTER_NEMOTRON_KEY,
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      // Same model as the NVIDIA NIM provider, served through OpenRouter as an independent fallback.
      // (Replaces nvidia/nemotron-4-340b-instruct, which was retired and has no OpenRouter endpoints left.)
      model: 'nvidia/nemotron-3-super-120b-a12b',
      priority: 2,
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
        await this._checkProvider(provider);

        const latency = Date.now() - startTime;
        ProviderRegistry.updateProviderLatency(provider.id, latency);
        ProviderRegistry.updateProviderStatus(provider.id, 'active');
        provider.healthError = null;
      } catch (error) {
        ProviderRegistry.updateProviderStatus(provider.id, 'error');
        provider.healthError = error.response?.data?.error?.message || error.message;
      }
    });

    await Promise.all(checks);
  }

  /**
   * Throws if the provider is unreachable, the key is rejected, or a configured model is unavailable.
   * GPT/Claude providers use free metadata endpoints: their models always reason before answering, so a
   * tiny "ping" completion would either be rejected or come back empty, and it would bill tokens on every boot.
   */
  async _checkProvider(provider) {
    const timeout = HEALTH_CHECK_TIMEOUT_MS;
    const tierModels = provider.models ? [...new Set(Object.values(provider.models))] : [];

    if (provider.id === 'openai') {
      await Promise.all(tierModels.map((model) => axios.get(`https://api.openai.com/v1/models/${model}`, {
        headers: { 'Authorization': `Bearer ${provider.apiKey}` },
        timeout
      })));
      return;
    }

    if (provider.id === 'anthropic') {
      await Promise.all(tierModels.map((model) => axios.get(`https://api.anthropic.com/v1/models/${model}`, {
        headers: { 'x-api-key': provider.apiKey, 'anthropic-version': ANTHROPIC_VERSION },
        timeout
      })));
      return;
    }

    if (provider.models && provider.id.startsWith('openrouter')) {
      await axios.get('https://openrouter.ai/api/v1/key', {
        headers: { 'Authorization': `Bearer ${provider.apiKey}` },
        timeout
      });
      // Retired models keep their slug but lose every endpoint, so check that each one is still served
      await Promise.all(tierModels.map(async (model) => {
        const slug = model.split(':')[0]; // drop variant suffixes such as ":free"
        const { data } = await axios.get(`https://openrouter.ai/api/v1/models/${slug}/endpoints`, { timeout });
        if (!data?.data?.endpoints?.length) {
          throw new Error(`Model "${model}" has no live endpoints on OpenRouter (retired or misspelled)`);
        }
      }));
      return;
    }

    // A minimal lightweight prompt to test connection
    if (provider.id === 'gemini') {
      await axios.post(`${provider.baseUrl}?key=${provider.apiKey}`, {
        contents: [{ parts: [{ text: "ping" }] }]
      }, { headers: { 'Content-Type': 'application/json' }, timeout });
    } else {
      await axios.post(provider.baseUrl, {
        model: provider.model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5
      }, {
        headers: { 'Authorization': `Bearer ${provider.apiKey}`, 'Content-Type': 'application/json' },
        timeout
      });
    }
  }

  _printStartupReport() {
    console.log('\n==================================================');
    console.log('🤖 AI Provider Manager Startup Report');
    console.log(`Model preset: ${getPresetName()} (set AI_MODEL_PRESET=balanced|max)`);
    console.log('==================================================');
    
    const providers = ProviderRegistry.getAllProviders();
    
    providers.forEach(p => {
      const isConfigured = p.status !== 'unconfigured';
      const isHealthy = p.status === 'active';
      
      console.log(`\nProvider: ${p.name} [Priority: ${p.priority}]`);
      console.log(p.models
        ? `- Models: smart=${p.models.smart} · fast=${p.models.fast}`
        : `- Model: ${p.model}`);
      console.log(`- API Key Found: ${isConfigured ? '✅ Yes' : '❌ No (Missing from .env)'}`);
      
      if (isConfigured) {
        console.log(`- Connection Successful: ${isHealthy ? '✅ Yes' : '❌ Failed (Check Network or Quota)'}`);
        if (!isHealthy && p.healthError) {
          console.log(`- Reason: ${p.healthError}`);
        }
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
