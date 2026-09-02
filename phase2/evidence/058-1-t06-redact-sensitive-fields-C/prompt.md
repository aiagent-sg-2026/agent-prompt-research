Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Deeply redact configured sensitive object fields without changing the source value.
Requirements:
R1: Export redactSensitiveFields(value, fields = ['password','token','secret']).
R2: Fields must be an array of strings; throw TypeError otherwise.
R3: Recursively copy plain objects and arrays; when an object key exactly matches a configured field, replace its value with '[REDACTED]' without traversing that value.
R4: Preserve primitives and non-plain objects by reference; null remains null.
R5: Return a deep copy for arrays and plain objects and do not mutate the input.
R6: Use the configured field names exactly and case-sensitively.
Allowed target: src/redact-sensitive-fields.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
