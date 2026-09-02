export function mergePreferences(defaults, overrides) {
  return { ...defaults, ...overrides };
}
