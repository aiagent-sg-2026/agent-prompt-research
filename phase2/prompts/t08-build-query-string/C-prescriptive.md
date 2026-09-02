Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Build a deterministic URL query string from scalar and repeated values.
Requirements:
R1: Export buildQueryString(params).
R2: Require a non-null non-array object; throw TypeError otherwise.
R3: Sort keys by JavaScript default lexicographic order and omit entries whose value is null or undefined.
R4: For array values emit one key-value pair per element in array order; scalar values emit one pair.
R5: Encode keys and values with encodeURIComponent and represent booleans as true or false; convert other non-null values with String.
R6: Return the query without a leading question mark; an empty result is the empty string.
Allowed target: src/build-query-string.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
