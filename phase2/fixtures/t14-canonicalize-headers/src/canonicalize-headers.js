/** Converts an object header bag to deterministic wire-ready entries. */
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function clean(value) { return value.trim().replace(/[ \t\r\n]+/g, ' '); }
export function canonicalizeHeaders(headers) { if (!plain(headers)) throw new TypeError('headers must be an object'); const entries = []; for (const [rawName, rawValue] of Object.entries(headers)) { const values = Array.isArray(rawValue) ? rawValue : [rawValue]; if (values.some(value => typeof value !== 'string')) throw new TypeError('header values must be strings'); for (const value of values) entries.push({ name: rawName.trim().toLowerCase(), value: clean(value) }); } return entries.sort((a,b) => a.name > b.name ? -1 : a.name < b.name ? 1 : 0); }
