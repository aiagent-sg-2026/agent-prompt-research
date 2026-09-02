# Task: merge preferences

Implement and export `mergePreferences(defaults, overrides)` in `src/merge-preferences.js`; preserve the existing test setup and edit only this target file.

Hard requirements: both inputs must be plain objects (non-null objects, not arrays), otherwise throw `TypeError`. Return a new recursively merged plain object. When corresponding values are plain objects, merge recursively. Arrays and all non-plain-object override values replace defaults. An override value of `undefined` retains the default. Include override-only keys. Do not mutate either input or reuse nested plain-object/array references from either input in the result.

Work structure:
1. Inspect the target, tests, and module configuration.
2. Implement the smallest complete contract-preserving change.
3. Run deterministic `npm test` and inspect the result.
4. Verify the diff contains only `src/merge-preferences.js`.

Success evidence: passing `npm test`, a target-only diff, and a concise report of the change and test result.
