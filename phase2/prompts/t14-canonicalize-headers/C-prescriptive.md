Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

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
