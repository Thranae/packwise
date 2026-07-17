import 'dotenv/config';
import pm from './services/ai/ProviderManager.js';
import ProviderRegistry from './services/ai/ProviderRegistry.js';
import axios from 'axios';

async function run() {
  const providers = ProviderRegistry.getAllProviders();
  for (const provider of providers) {
    if (provider.status === 'unconfigured') continue;
    try {
      let response;
      if (provider.id === 'gemini') {
        response = await axios.post(`${provider.baseUrl}?key=${provider.apiKey}`, {
          contents: [{ parts: [{ text: 'ping' }] }]
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 5000 });
      } else {
        response = await axios.post(provider.baseUrl, {
          model: provider.model,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5
        }, { 
          headers: { 'Authorization': `Bearer ${provider.apiKey}`, 'Content-Type': 'application/json' },
          timeout: 5000 
        });
      }
      console.log(provider.id, 'success');
    } catch (error) {
      console.error(provider.id, 'failed:', error.response?.status, error.response?.data?.error?.message || error.message);
    }
  }
}

// First, register them so the registry has them
pm._registerGemini();
pm._registerOpenAI();
pm._registerMistral();
pm._registerGroq();
pm._registerOpenRouter();

run();
