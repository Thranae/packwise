/**
 * Model catalog — the single place that decides which GPT / Claude models PackWise uses.
 *
 * Model IDs verified against the official OpenAI, Anthropic and OpenRouter model lists (October 2026).
 *
 * Every GPT/Claude provider exposes two tiers:
 *   - smart: deep-reasoning work (trip plans, itineraries, packing lists, structured JSON)
 *   - fast:  latency-sensitive work (chat replies, small lookups)
 *
 * Presets (env AI_MODEL_PRESET):
 *   - balanced (default) — the most intelligence per dollar and per second:
 *       smart → GPT-6.1 Sol ("near-Astra performance at a lower cost") and Claude Opus 5.5
 *               (Anthropic's recommended default; matches Fable 5.1 on most work)
 *       fast  → GPT-6 Luna and Claude Sonnet 5.5 ("best combination of speed and intelligence")
 *   - max — the single most capable model of each family, regardless of cost and latency:
 *       smart → GPT-6 Astra and Claude Fable 5.1 (~2.5–5x the price, slower)
 *       fast  → GPT-6.1 Sol and Claude Opus 5.5
 *
 * Any individual model can be overridden without code changes, e.g. when a newer model ships:
 *   OPENAI_MODEL_SMART, OPENAI_MODEL_FAST, ANTHROPIC_MODEL_SMART, ANTHROPIC_MODEL_FAST,
 *   OPENROUTER_GPT_MODEL_SMART, OPENROUTER_GPT_MODEL_FAST,
 *   OPENROUTER_CLAUDE_MODEL_SMART, OPENROUTER_CLAUDE_MODEL_FAST
 *
 * Note: the Anthropic API uses hyphenated IDs (claude-opus-5-5), OpenRouter uses dotted slugs
 * (anthropic/claude-opus-5.5) — keep that in mind when overriding.
 */

export const DEFAULT_PRESET = 'balanced';

export const PRESETS = {
  balanced: {
    openai:              { smart: 'gpt-6.1-sol',                fast: 'gpt-6-luna' },
    anthropic:           { smart: 'claude-opus-5-5',            fast: 'claude-sonnet-5-5' },
    'openrouter-gpt':    { smart: 'openai/gpt-6.1-sol',         fast: 'openai/gpt-6-luna' },
    'openrouter-claude': { smart: 'anthropic/claude-opus-5.5',  fast: 'anthropic/claude-sonnet-5.5' },
  },
  max: {
    openai:              { smart: 'gpt-6-astra',                fast: 'gpt-6.1-sol' },
    anthropic:           { smart: 'claude-fable-5-1',           fast: 'claude-opus-5-5' },
    'openrouter-gpt':    { smart: 'openai/gpt-6-astra',         fast: 'openai/gpt-6.1-sol' },
    'openrouter-claude': { smart: 'anthropic/claude-fable-5.1', fast: 'anthropic/claude-opus-5.5' },
  },
};

const ENV_PREFIX = {
  openai: 'OPENAI',
  anthropic: 'ANTHROPIC',
  'openrouter-gpt': 'OPENROUTER_GPT',
  'openrouter-claude': 'OPENROUTER_CLAUDE',
};

/**
 * Per-tier request settings. All current GPT and Claude models reason before answering, so
 * `effort` is the main speed/cost/quality dial and `maxTokens` caps thinking + answer combined.
 * `medium` is the documented default for GPT-6.1 Sol and Claude Opus 5.5; `low` keeps chat snappy.
 */
export const TIERS = {
  smart: { effort: 'medium', maxTokens: 16000, timeoutMs: 75000 },
  fast:  { effort: 'low',    maxTokens: 4000,  timeoutMs: 30000 },
};

/** Which tier each AIRouter task type runs on. */
export const TASK_TIER = {
  planning: 'smart',
  json: 'smart',
  casual: 'fast',
  lightweight: 'fast',
  backup: 'fast',
};

export function getTierName(taskType) {
  return TASK_TIER[taskType] || 'fast';
}

export function getPresetName(env = process.env) {
  const requested = (env.AI_MODEL_PRESET || DEFAULT_PRESET).trim().toLowerCase();
  return PRESETS[requested] ? requested : DEFAULT_PRESET;
}

/**
 * Resolve the { smart, fast } model IDs for a provider: env override > preset > balanced default.
 * @param {string} providerId
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {{ smart: string, fast: string } | null} null for providers without tiered models
 */
export function resolveModels(providerId, env = process.env) {
  const defaults = PRESETS[getPresetName(env)][providerId];
  if (!defaults) return null;

  const prefix = ENV_PREFIX[providerId];
  return {
    smart: env[`${prefix}_MODEL_SMART`]?.trim() || defaults.smart,
    fast: env[`${prefix}_MODEL_FAST`]?.trim() || defaults.fast,
  };
}
