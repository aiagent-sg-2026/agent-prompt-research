Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Resolve feature flags from defaults, environment, and per-user overrides.
Requirements:
R1: Export resolveFeatureFlags(definitions, environment = {}, user = {}).
R2: Require each of the three arguments to be non-null plain objects; throw TypeError otherwise.
R3: Definitions map flag names to boolean defaults; non-boolean definitions are invalid and throw TypeError.
R4: Start with definition defaults, then apply environment values, then user values; only boolean overrides are accepted and unknown keys are ignored.
R5: Return a new object with definition keys in their original insertion order.
R6: Do not mutate any input object.
Allowed target: src/resolve-feature-flags.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
