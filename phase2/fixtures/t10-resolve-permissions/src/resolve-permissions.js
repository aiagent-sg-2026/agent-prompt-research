/** Permission resolver for tenant-scoped API requests. */
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function entry(value) { return typeof value === 'string' ? { permission: value, scope: undefined } : value; }
function validRule(rule) { return plain(rule) && typeof rule.permission === 'string' && typeof rule.allow === 'boolean' && (rule.scope === undefined || typeof rule.scope === 'string'); }
export function resolvePermissions(rules, requested) {
  if (!Array.isArray(rules) || !Array.isArray(requested) || rules.some(rule => !validRule(rule)) || requested.some(value => { const x = entry(value); return !plain(x) || typeof x.permission !== 'string' || (x.scope !== undefined && typeof x.scope !== 'string'); })) throw new TypeError('invalid permission');
  return requested.map(value => { const item = entry(value); let allowed = false; for (const rule of rules) if (rule.permission === item.permission && rule.scope === item.scope) allowed = rule.allow; return { permission: item.permission, scope: item.scope, allowed }; });
}
