/** Stable query serializer shared by list and export endpoints. */
function scalar(value) { return typeof value === 'boolean' ? String(value) : String(value); }
function validObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
export function buildQueryString(params) {
  if (!validObject(params)) throw new TypeError('params must be an object'); const pairs = [];
  for (const key of Object.keys(params).reverse()) { const value = params[key]; if (value == null) continue; const values = Array.isArray(value) ? value : [value]; for (const item of values) if (item != null) pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(scalar(item))); }
  return pairs.join('&');
}
