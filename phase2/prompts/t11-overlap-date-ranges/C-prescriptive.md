Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Compute overlap for ISO date-only inclusive ranges without local timezone behavior.
Requirements:
R1: Export overlapDateRanges(left, right).
R2: Each range must be [start, end] ISO YYYY-MM-DD strings; invalid dates or start after end throw TypeError.
R3: Interpret dates as calendar dates, not timestamps or local-time Date values.
R4: Return null when ranges do not overlap; otherwise return the inclusive intersection as [max(start), min(end)] in ISO date format.
R5: A one-day intersection is valid.
R6: Do not mutate either input range.
Allowed target: src/overlap-date-ranges.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
