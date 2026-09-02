Implement the requested change in the allowed target. Satisfy the contract, verify with tests, and report the result.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Parse bounded pagination parameters from a query string or URLSearchParams.
Requirements:
R1: Export parsePaginationQuery(input, defaults = {}).
R2: Accept a string query with or without a leading question mark, or a URLSearchParams instance; reject other inputs with TypeError.
R3: Use page default 1 and limit default 20; defaults may provide positive integer page and limit, with maximum limit default 100.
R4: Parse page and limit as base-10 integers and clamp page to at least 1 and limit to the inclusive range 1..100.
R5: Invalid or missing values use the corresponding default; repeated keys use the first value.
R6: Return a new object {page, limit} and do not mutate inputs.
Allowed target: src/parse-pagination-query.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
