Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Canonicalize HTTP-like header names and values while preserving meaningful duplicates.
Requirements:
R1: Export canonicalizeHeaders(headers).
R2: Require a non-null plain object whose values are strings or arrays of strings; invalid values throw TypeError.
R3: Trim header names and values, lowercase names, and collapse each value's internal ASCII whitespace run to one space.
R4: Sort output entries by lowercase header name using default lexicographic order.
R5: For array values output one entry per value in original array order; preserve duplicate names as separate entries.
R6: Return an array of {name, value} and do not mutate headers.
Allowed target: src/canonicalize-headers.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
