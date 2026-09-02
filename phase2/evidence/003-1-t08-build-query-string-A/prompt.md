Implement the requested change in the allowed target. Satisfy the contract, verify with tests, and report the result.

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
