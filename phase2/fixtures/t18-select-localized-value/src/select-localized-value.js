/** Locale selection with exact and language-subtag fallback. */
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const language = locale => locale.split('-')[0];
function find(values, wanted) { const normalized = wanted.toLowerCase(); const key = Object.keys(values).find(candidate => candidate.toLowerCase() === normalized); return key === undefined ? undefined : values[key]; }
export function selectLocalizedValue(values, requested, fallback = 'en') { if (!plain(values) || typeof requested !== 'string' || typeof fallback !== 'string') throw new TypeError('invalid locale input'); for (const candidate of [language(requested), requested, fallback, language(fallback)]) { const found = find(values, candidate); if (found !== undefined) return found; } return undefined; }
