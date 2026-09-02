# Task: merge preferences

In `src/merge-preferences.js`, implement and export `mergePreferences(defaults, overrides)`. Preserve the existing test setup and edit only this target file.

Requirements: both inputs must be plain objects (non-null objects, not arrays), otherwise throw `TypeError`. Return a new recursively merged plain object. When corresponding values are plain objects, merge recursively. Arrays and all non-plain-object override values replace defaults. An override value of `undefined` retains the default. Include override-only keys. Do not mutate either input or reuse nested plain-object/array references from either input in the result.

Success evidence: run deterministic `npm test`, make it pass, leave only the target changed, and report the change and test result.
