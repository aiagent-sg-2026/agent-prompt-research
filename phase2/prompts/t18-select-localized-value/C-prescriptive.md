Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

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
