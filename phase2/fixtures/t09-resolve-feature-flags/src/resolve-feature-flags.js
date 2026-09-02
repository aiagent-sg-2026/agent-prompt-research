/** Layered feature configuration: definition, deployment environment, then account. */
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
export function resolveFeatureFlags(definitions, environment = {}, user = {}) {
  if (![definitions, environment, user].every(plain)) throw new TypeError('flag maps must be plain objects'); const result = {};
  for (const [name, value] of Object.entries(definitions)) { if (typeof value !== 'boolean') throw new TypeError('definition must be boolean'); result[name] = value; }
  for (const layer of [user, environment]) for (const [name, value] of Object.entries(layer)) if (name in result && typeof value === 'boolean') result[name] = value;
  return result;
}
