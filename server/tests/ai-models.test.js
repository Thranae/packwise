// Run with: npm test (from /server). HTTP is mocked — no API keys or network needed.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import ProviderRegistry from '../services/ai/ProviderRegistry.js';
import ProviderManager from '../services/ai/ProviderManager.js';
import AIRouter from '../services/ai/AIRouter.js';
import aiService, { parseModelJson } from '../services/ai.service.js';
import { resolveModels, getPresetName } from '../services/ai/modelCatalog.js';

const AI_ENV_VARS = [
  'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'OPENROUTER_GPT_KEY', 'OPENROUTER_CLAUDE_KEY', 'GEMINI_API_KEY',
  'NVIDIA_API_KEY', 'MISTRAL_API_KEY', 'GROQ_API_KEY', 'OPENROUTER_NEMOTRON_KEY', 'OPENROUTER_API_KEY',
  'AI_MODEL_PRESET', 'OPENAI_MODEL_SMART', 'OPENAI_MODEL_FAST', 'ANTHROPIC_MODEL_SMART', 'ANTHROPIC_MODEL_FAST',
  'OPENROUTER_GPT_MODEL_SMART', 'OPENROUTER_GPT_MODEL_FAST', 'OPENROUTER_CLAUDE_MODEL_SMART', 'OPENROUTER_CLAUDE_MODEL_FAST',
];
const REGISTER_METHODS = [
  '_registerGemini', '_registerNvidia', '_registerOpenAI', '_registerAnthropic', '_registerMistral',
  '_registerGroq', '_registerOpenRouterGPT', '_registerOpenRouterClaude', '_registerOpenRouterNemotron', '_registerOpenRouter',
];

const original = { post: axios.post, get: axios.get, log: console.log, error: console.error, env: { ...process.env } };
let calls = [];

/** Register every provider from a clean env (no health checks, no network). */
function setup(env = {}) {
  for (const name of AI_ENV_VARS) delete process.env[name];
  Object.assign(process.env, env);
  ProviderRegistry.providers.clear();
  for (const method of REGISTER_METHODS) ProviderManager[method]();
}

function mockPost(handler) {
  calls = [];
  axios.post = async (url, body, config) => {
    calls.push({ url, body, config });
    return handler(url, body, config);
  };
}

const chatReply = (content, finish_reason = 'stop') => ({ data: { choices: [{ message: { content }, finish_reason }] } });
const httpError = (status, message) => Object.assign(new Error(`Request failed with status code ${status}`), {
  response: { status, data: { error: { message } } },
});

beforeEach(() => {
  console.log = () => {};
  console.error = () => {};
});

afterEach(() => {
  axios.post = original.post;
  axios.get = original.get;
  console.log = original.log;
  console.error = original.error;
  for (const name of AI_ENV_VARS) delete process.env[name];
  Object.assign(process.env, original.env);
});

// ---------------------------------------------------------------- model catalog

test('balanced preset: GPT-6.1 Sol + Claude Opus 5.5 (smart), GPT-6 Luna + Claude Sonnet 5.5 (fast)', () => {
  assert.deepEqual(resolveModels('openai', {}), { smart: 'gpt-6.1-sol', fast: 'gpt-6-luna' });
  assert.deepEqual(resolveModels('anthropic', {}), { smart: 'claude-opus-5-5', fast: 'claude-sonnet-5-5' });
  assert.deepEqual(resolveModels('openrouter-gpt', {}), { smart: 'openai/gpt-6.1-sol', fast: 'openai/gpt-6-luna' });
  assert.deepEqual(resolveModels('openrouter-claude', {}), { smart: 'anthropic/claude-opus-5.5', fast: 'anthropic/claude-sonnet-5.5' });
  assert.equal(resolveModels('gemini', {}), null);
});

test('max preset, per-model env overrides, and unknown presets', () => {
  assert.deepEqual(resolveModels('openai', { AI_MODEL_PRESET: 'max' }), { smart: 'gpt-6-astra', fast: 'gpt-6.1-sol' });
  assert.deepEqual(resolveModels('anthropic', { AI_MODEL_PRESET: ' MAX ' }), { smart: 'claude-fable-5-1', fast: 'claude-opus-5-5' });
  assert.equal(resolveModels('openrouter-claude', { AI_MODEL_PRESET: 'max' }).smart, 'anthropic/claude-fable-5.1');
  assert.equal(resolveModels('openai', { OPENAI_MODEL_SMART: 'gpt-6-astra' }).smart, 'gpt-6-astra');
  assert.equal(resolveModels('openai', { OPENAI_MODEL_SMART: 'gpt-6-astra' }).fast, 'gpt-6-luna');
  assert.equal(getPresetName({ AI_MODEL_PRESET: 'turbo' }), 'balanced');
});

// ---------------------------------------------------------------- request shapes

test('planning → Claude Opus 5.5 via OpenRouter, medium effort, JSON mode, long timeout', async () => {
  setup({ OPENROUTER_CLAUDE_KEY: 'or-claude', OPENROUTER_GPT_KEY: 'or-gpt' });
  mockPost(() => chatReply('{"ok":true}'));

  assert.equal(await AIRouter.routeRequest('Plan Kyoto', 'planning', true), '{"ok":true}');
  assert.equal(calls.length, 1);
  const { url, body, config } = calls[0];
  assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions');
  assert.equal(body.model, 'anthropic/claude-opus-5.5');
  assert.deepEqual(body.reasoning, { effort: 'medium', exclude: true });
  assert.equal(body.max_tokens, 16000);
  assert.deepEqual(body.response_format, { type: 'json_object' });
  assert.equal(config.headers.Authorization, 'Bearer or-claude');
  assert.equal(config.headers['X-Title'], 'PackWise');
  assert.equal(config.timeout, 75000);
});

test('casual chat → Claude Sonnet 5.5 at low effort, no JSON mode', async () => {
  setup({ OPENROUTER_CLAUDE_KEY: 'or-claude' });
  mockPost(() => chatReply('Hello traveller!'));

  await AIRouter.routeRequest('hi', 'casual', false);
  assert.equal(calls[0].body.model, 'anthropic/claude-sonnet-5.5');
  assert.deepEqual(calls[0].body.reasoning, { effort: 'low', exclude: true });
  assert.equal(calls[0].body.max_tokens, 4000);
  assert.equal(calls[0].body.response_format, undefined);
  assert.equal(calls[0].config.timeout, 30000);
});

test('json → GPT-6.1 Sol on the OpenAI API with reasoning params and no max_tokens', async () => {
  setup({ OPENAI_API_KEY: 'sk-test', ANTHROPIC_API_KEY: 'ant-test' });
  mockPost(() => chatReply('{"destination":"Paris"}'));

  await AIRouter.routeRequest('Weekend in Paris', 'json', true);
  const { url, body, config } = calls[0];
  assert.equal(url, 'https://api.openai.com/v1/chat/completions');
  assert.equal(body.model, 'gpt-6.1-sol');
  assert.equal(body.reasoning_effort, 'medium');
  assert.equal(body.max_completion_tokens, 16000);
  assert.equal('max_tokens' in body, false);
  assert.equal('reasoning' in body, false);
  assert.deepEqual(body.response_format, { type: 'json_object' });
  assert.equal(config.headers.Authorization, 'Bearer sk-test');
  assert.equal(config.headers['X-Title'], undefined);
});

test('lightweight → GPT-6 Luna at low effort', async () => {
  setup({ OPENAI_API_KEY: 'sk-test' });
  mockPost(() => chatReply('Merino Wool T-Shirt'));

  await AIRouter.routeRequest('alternative item', 'lightweight', false);
  assert.equal(calls[0].body.model, 'gpt-6-luna');
  assert.equal(calls[0].body.reasoning_effort, 'low');
  assert.equal(calls[0].body.max_completion_tokens, 4000);
});

test('Anthropic Messages API: output_config.effort, version header, thinking blocks skipped', async () => {
  setup({ ANTHROPIC_API_KEY: 'ant-key', OPENAI_API_KEY: 'sk-test' });
  mockPost(() => ({
    data: {
      stop_reason: 'end_turn',
      content: [
        { type: 'thinking', thinking: 'Rome in 3 days: Colosseum first...', signature: 'sig' },
        { type: 'text', text: '{"days":' },
        { type: 'text', text: '3}' },
      ],
    },
  }));

  assert.equal(await AIRouter.routeRequest('Plan Rome', 'planning', true), '{"days":3}');
  const { url, body, config } = calls[0];
  assert.equal(url, 'https://api.anthropic.com/v1/messages');
  assert.equal(body.model, 'claude-opus-5-5');
  assert.deepEqual(body.output_config, { effort: 'medium' });
  assert.equal(body.max_tokens, 16000);
  assert.match(body.system, /JSON/);
  assert.equal('thinking' in body, false); // Opus 5.5 rejects thinking: { type: "disabled" }
  assert.equal('temperature' in body, false);
  assert.equal(config.headers['x-api-key'], 'ant-key');
  assert.equal(config.headers['anthropic-version'], '2023-06-01');
  assert.equal(config.headers.Authorization, undefined);
});

test('max preset routes heavy tasks to GPT-6 Astra / Claude Fable 5.1', async () => {
  setup({ AI_MODEL_PRESET: 'max', OPENROUTER_GPT_KEY: 'g', ANTHROPIC_API_KEY: 'a' });
  mockPost(() => ({ data: { stop_reason: 'end_turn', content: [{ type: 'text', text: '{}' }] } }));
  await AIRouter.routeRequest('plan', 'planning', true);
  assert.equal(calls[0].body.model, 'claude-fable-5-1');

  mockPost(() => chatReply('{}'));
  await AIRouter.routeRequest('parse', 'json', true);
  assert.equal(calls[0].body.model, 'openai/gpt-6-astra');
});

test('legacy OpenAI-compatible providers keep their original payload', async () => {
  setup({ GROQ_API_KEY: 'gq' });
  mockPost(() => chatReply('hey'));

  await AIRouter.routeRequest('hi', 'casual');
  assert.deepEqual(Object.keys(calls[0].body).sort(), ['messages', 'model']);
  assert.equal(calls[0].body.model, 'llama-3.3-70b-versatile');
  assert.equal(calls[0].config.timeout, 30000);
});

// ---------------------------------------------------------------- fallbacks

test('falls back to the other flagship family when the primary fails', async () => {
  setup({ OPENROUTER_CLAUDE_KEY: 'c', OPENROUTER_GPT_KEY: 'g' });
  mockPost((url, body) => {
    if (body.model.startsWith('anthropic/')) throw httpError(503, 'Overloaded');
    return chatReply('fallback answer');
  });

  assert.equal(await AIRouter.routeRequest('hi', 'casual'), 'fallback answer');
  assert.deepEqual(calls.map((c) => c.body.model), ['anthropic/claude-sonnet-5.5', 'openai/gpt-6-luna']);
  assert.equal(ProviderRegistry.getProvider('openrouter-claude').status, 'error');
});

test('empty replies and truncated JSON fall back instead of being returned', async () => {
  setup({ OPENAI_API_KEY: 'sk', OPENROUTER_GPT_KEY: 'g', OPENROUTER_CLAUDE_KEY: 'c' });
  mockPost((url, body) => {
    if (url.includes('api.openai.com')) return chatReply('', 'length');          // all budget spent reasoning
    if (body.model.startsWith('openai/')) return chatReply('{"dest', 'length'); // cut off mid-JSON
    return chatReply('{"destination":"Lisbon"}');
  });

  assert.equal(await AIRouter.routeRequest('Lisbon', 'json', true), '{"destination":"Lisbon"}');
  assert.deepEqual(calls.map((c) => c.body.model), ['gpt-6.1-sol', 'openai/gpt-6.1-sol', 'anthropic/claude-opus-5.5']);
});

test('an empty chat reply falls back to the next provider instead of showing a blank message', async () => {
  setup({ OPENROUTER_CLAUDE_KEY: 'c', OPENAI_API_KEY: 'sk' });
  mockPost((url) => (url.includes('openrouter') ? chatReply('   ', 'stop') : chatReply('Try the night markets!')));

  assert.equal(await AIRouter.routeRequest('food tips?', 'casual', false), 'Try the night markets!');
  assert.deepEqual(calls.map((c) => c.body.model), ['anthropic/claude-sonnet-5.5', 'gpt-6-luna']);
});

test('an empty Anthropic reply (e.g. refusal) falls back too', async () => {
  setup({ ANTHROPIC_API_KEY: 'a', OPENAI_API_KEY: 'sk' });
  mockPost((url) => (url.includes('anthropic')
    ? { data: { stop_reason: 'refusal', content: [] } }
    : chatReply('Here is a safe alternative.')));

  assert.equal(await AIRouter.routeRequest('hi', 'casual', false), 'Here is a safe alternative.');
  assert.deepEqual(calls.map((c) => c.body.model), ['claude-sonnet-5-5', 'gpt-6-luna']);
});

test('throws when every provider fails', async () => {
  setup({ OPENAI_API_KEY: 'sk' });
  mockPost(() => { throw httpError(401, 'Invalid API key'); });
  await assert.rejects(() => AIRouter.routeRequest('hi', 'casual'), /All AI providers failed/);
});

// ---------------------------------------------------------------- JSON handling in AIService

test('parseModelJson tolerates code fences and surrounding prose', () => {
  assert.deepEqual(parseModelJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(parseModelJson('Here is your plan:\n{"a":[1,2]}\nEnjoy!'), { a: [1, 2] });
  assert.deepEqual(parseModelJson('[{"x":1}]'), [{ x: 1 }]);
  assert.throws(() => parseModelJson('no json here'));
});

test('array endpoints unwrap JSON-mode objects ({"itinerary": [...]})', async () => {
  setup({ OPENAI_API_KEY: 'sk' });
  mockPost(() => chatReply('{"itinerary":[{"day":1,"title":"Arrival","activities":[]}]}'));
  assert.deepEqual(await aiService.generateItinerary('Rome', 1), [{ day: 1, title: 'Arrival', activities: [] }]);

  mockPost(() => chatReply('{"places":[{"name":"Colosseum"}]}'));
  const places = await aiService.recommendPlaces('Rome', 'Attractions');
  assert.equal(places.length, 1);
  assert.equal(places[0].name, 'Colosseum');
});

test('object endpoints are returned as-is and failures use the fallback', async () => {
  setup({ OPENAI_API_KEY: 'sk' });
  mockPost(() => chatReply('{"tips":["a","b","c"],"expectedDailyCost":120,"isSufficient":true}'));
  assert.equal((await aiService.generateBudgetAdvice('Rome', 2000, 'EUR')).expectedDailyCost, 120);

  mockPost(() => { throw httpError(500, 'boom'); });
  setup({ OPENAI_API_KEY: 'sk' }); // reset cooldown state
  const fallback = await aiService.generateBudgetAdvice('Rome', 2000, 'EUR');
  assert.deepEqual(fallback.tips, ['Use public transit', 'Eat like a local', 'Book in advance']);
});

// ---------------------------------------------------------------- health checks

test('health checks are token-free and flag retired OpenRouter models', async () => {
  setup({
    OPENAI_API_KEY: 'o',
    ANTHROPIC_API_KEY: 'a',
    OPENROUTER_CLAUDE_KEY: 'c',
    OPENROUTER_CLAUDE_MODEL_FAST: 'anthropic/claude-3.5-sonnet', // retired: slug exists, zero endpoints
  });
  const gets = [];
  axios.get = async (url, config) => {
    gets.push({ url, config });
    if (url.endsWith('/claude-3.5-sonnet/endpoints')) return { data: { data: { endpoints: [] } } };
    if (url.endsWith('/endpoints')) return { data: { data: { endpoints: [{ provider_name: 'Anthropic' }] } } };
    return { data: {} };
  };
  axios.post = async () => { throw new Error('GPT/Claude health checks must not create completions'); };

  await ProviderManager._runHealthChecks();

  const openrouterClaude = ProviderRegistry.getProvider('openrouter-claude');
  assert.equal(openrouterClaude.status, 'error');
  assert.match(openrouterClaude.healthError, /claude-3\.5-sonnet.*no live endpoints/);
  assert.equal(ProviderRegistry.getProvider('anthropic').status, 'active');
  assert.equal(ProviderRegistry.getProvider('openai').status, 'active');

  const urls = gets.map((g) => g.url);
  assert.ok(urls.includes('https://api.openai.com/v1/models/gpt-6.1-sol'));
  assert.ok(urls.includes('https://api.openai.com/v1/models/gpt-6-luna'));
  assert.ok(urls.includes('https://api.anthropic.com/v1/models/claude-opus-5-5'));
  assert.ok(urls.includes('https://api.anthropic.com/v1/models/claude-sonnet-5-5'));
  assert.ok(urls.includes('https://openrouter.ai/api/v1/key'));
  const anthropicCheck = gets.find((g) => g.url.startsWith('https://api.anthropic.com'));
  assert.equal(anthropicCheck.config.headers['anthropic-version'], '2023-06-01');
});

// ---------------------------------------------------------------- streaming

test('streaming prefers Claude Sonnet 5.5 and falls through to GPT on errors', async () => {
  setup({ OPENROUTER_CLAUDE_KEY: 'c', OPENAI_API_KEY: 'o' });
  mockPost((url) => {
    if (url.includes('openrouter')) throw httpError(500, 'boom');
    return { data: 'STREAM' };
  });

  assert.equal(await AIRouter.routeRequestStream('hi'), 'STREAM');
  assert.equal(calls[0].body.model, 'anthropic/claude-sonnet-5.5');
  assert.equal(calls[0].body.stream, true);
  assert.equal(calls[0].config.headers['X-Title'], 'PackWise');
  assert.equal(calls[1].body.model, 'gpt-6-luna');
  assert.equal(calls[1].body.stream, true);
  assert.equal(calls[1].config.responseType, 'stream');
});

test('streaming with no configured provider throws a clear error', async () => {
  setup({});
  await assert.rejects(() => AIRouter.routeRequestStream('hi'), /No streaming-capable AI provider/);
});
