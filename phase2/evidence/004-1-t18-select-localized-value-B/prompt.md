Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Select the best localized value using deterministic language fallback.
Requirements:
R1: Export selectLocalizedValue(values, requested, fallback = 'en').
R2: Require values to be a non-null plain object and requested/fallback to strings; otherwise throw TypeError.
R3: Try an exact requested locale, then its language subtag before trying fallback exact and fallback language subtag.
R4: Locale matching is case-insensitive but keys are returned by their original values object lookup semantics; select the first matching key in values insertion order when normalized locale labels collide.
R5: Return the matching value, including falsy values; return undefined when no locale matches.
R6: Do not mutate values.
Allowed target: src/select-localized-value.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
