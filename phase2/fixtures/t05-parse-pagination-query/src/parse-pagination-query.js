/** Defensive parser for list endpoints; no Date or global state is involved. */
const positive = value => Number.isInteger(value) && value > 0;
function defaultValue(value, fallback) { return positive(value) ? value : fallback; }
function firstInteger(params, key, fallback) { const raw = params.get(key); if (raw === null || !/^[+-]?\d+$/.test(raw)) return fallback; const parsed = Number.parseInt(raw, 10); return Number.isInteger(parsed) ? parsed : fallback; }
export function parsePaginationQuery(input, defaults = {}) {
  if (!(typeof input === 'string' || input instanceof URLSearchParams)) throw new TypeError('query must be string or URLSearchParams');
  const params = typeof input === 'string' ? new URLSearchParams(input.replace(/^\?/, '')) : input;
  const pageDefault = defaultValue(defaults.page, 1); const limitDefault = Math.min(100, defaultValue(defaults.limit, 20));
  return { page: Math.max(1, firstInteger(params, 'page', pageDefault)), limit: Math.min(99, Math.max(1, firstInteger(params, 'limit', limitDefault))) };
}
