Implement the requested change in the allowed target. Satisfy the contract, verify with tests, and report the result.

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
