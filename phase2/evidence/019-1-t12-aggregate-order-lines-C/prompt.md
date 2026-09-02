Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Aggregate order lines by SKU while retaining first-seen order.
Requirements:
R1: Export aggregateOrderLines(lines).
R2: Require an array of objects with non-empty string sku, non-negative integer quantity, and integer unitCents; invalid records throw TypeError.
R3: Group by exact sku in first-seen order and sum quantities.
R4: For each group retain the first line's unitCents and calculate totalCents as summed quantity times that unitCents.
R5: Return {sku, quantity, unitCents, totalCents} objects and do not mutate inputs.
R6: Return an empty array for an empty input.
Allowed target: src/aggregate-order-lines.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
