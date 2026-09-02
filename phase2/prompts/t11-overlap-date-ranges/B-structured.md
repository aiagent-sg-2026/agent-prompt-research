Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

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
