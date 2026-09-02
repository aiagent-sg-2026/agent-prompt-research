Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

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
