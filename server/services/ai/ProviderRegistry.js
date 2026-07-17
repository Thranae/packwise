/**
 * @typedef {Object} AIProvider
 * @property {string} id - Unique identifier (e.g., 'gemini', 'openai')
 * @property {string} name - Display name
 * @property {string} apiKey - API key loaded from env
 * @property {string} baseUrl - The base URL for the API
 * @property {string} model - The primary model to use
 * @property {number} priority - The priority order (lower is higher priority)
 * @property {boolean} supportsStreaming - True if streaming is supported
 * @property {boolean} supportsToolCalling - True if function/tool calling is supported
 * @property {boolean} supportsJSONMode - True if JSON object response format is natively supported
 * @property {boolean} supportsVision - True if image inputs are supported
 * @property {'active' | 'rate_limited' | 'error' | 'offline' | 'unconfigured'} status - Current operational status
 * @property {number} latencyMs - Last recorded latency in milliseconds
 * @property {Date} lastErrorTime - Timestamp of the last error
 */

/**
 * Registry of all available AI providers.
 * Holds their metadata, capabilities, and current health status.
 */
class ProviderRegistry {
  constructor() {
    /** @type {Map<string, AIProvider>} */
    this.providers = new Map();
  }

  /**
   * Register a new AI provider
   * @param {AIProvider} providerData 
   */
  registerProvider(providerData) {
    this.providers.set(providerData.id, {
      ...providerData,
      status: providerData.apiKey ? 'active' : 'unconfigured',
      latencyMs: 0,
      lastErrorTime: null
    });
  }

  /**
   * Get a provider by ID
   * @param {string} id 
   * @returns {AIProvider | undefined}
   */
  getProvider(id) {
    return this.providers.get(id);
  }

  /**
   * Get all registered providers
   * @returns {AIProvider[]}
   */
  getAllProviders() {
    return Array.from(this.providers.values());
  }

  /**
   * Get providers filtered by a specific capability
   * @param {'supportsStreaming' | 'supportsToolCalling' | 'supportsJSONMode' | 'supportsVision'} capability 
   * @returns {AIProvider[]}
   */
  getProvidersByCapability(capability) {
    return this.getAllProviders()
      .filter(p => p[capability] && p.status === 'active')
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Update the health status of a provider
   * @param {string} id 
   * @param {'active' | 'rate_limited' | 'error' | 'offline'} status 
   */
  updateProviderStatus(id, status) {
    const provider = this.getProvider(id);
    if (provider) {
      provider.status = status;
      if (status === 'error' || status === 'rate_limited') {
        provider.lastErrorTime = new Date();
      }
    }
  }

  /**
   * Update the latency of a provider
   * @param {string} id 
   * @param {number} latencyMs 
   */
  updateProviderLatency(id, latencyMs) {
    const provider = this.getProvider(id);
    if (provider) {
      // Exponential moving average for smooth latency tracking
      provider.latencyMs = provider.latencyMs === 0 
        ? latencyMs 
        : Math.round((provider.latencyMs * 0.7) + (latencyMs * 0.3));
    }
  }
}

export default new ProviderRegistry();
