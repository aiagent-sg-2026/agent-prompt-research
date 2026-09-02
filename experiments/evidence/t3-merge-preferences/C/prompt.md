# Task: merge preferences

Implement and export `mergePreferences(defaults, overrides)` in `src/merge-preferences.js`. Preserve the existing test setup. Edit only `src/merge-preferences.js`; do not edit unrelated source or documentation.

The contract is: both inputs must be plain objects (non-null objects, not arrays), otherwise throw `TypeError`; return a new recursively merged plain object; when corresponding values are plain objects, merge recursively; arrays and all non-plain-object override values replace defaults; an override value of `undefined` retains the default; include override-only keys; do not mutate either input or reuse nested plain-object/array references from either input in the result.

Follow this order:
1. Inspect the fixture, target, tests, and module configuration.
2. Implement the complete contract in the named target.
3. Re-check both root validations and the plain-object distinction.
4. Re-check recursive merging, override precedence, undefined retention, override-only keys, and cloning of nested plain objects and arrays.
5. Run deterministic `npm test` and use its result as the correctness check.
6. Inspect the final diff and ensure only the named target changed.

Keep the task facts above unchanged in meaning: do not add requirements or solution hints. Before finishing, verify the test result and target-only scope again, then report the change and evidence.
