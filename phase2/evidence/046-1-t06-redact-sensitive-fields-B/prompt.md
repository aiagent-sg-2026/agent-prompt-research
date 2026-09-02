Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

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
