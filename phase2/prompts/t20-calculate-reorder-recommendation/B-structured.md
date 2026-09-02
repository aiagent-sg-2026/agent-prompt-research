Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Calculate reorder quantity from stock, demand, and a safety-stock policy.
Requirements:
R1: Export calculateReorderRecommendation(input).
R2: Require a plain object with non-negative integer onHand, reserved, reorderPoint, and targetStock; invalid values throw TypeError.
R3: Available stock is max(0, onHand - reserved).
R4: If available stock is at least reorderPoint, recommend zero; otherwise recommend max(0, targetStock - available stock).
R5: Return {available, reorder, needsReorder} where needsReorder is reorder greater than zero.
R6: Do not mutate input and do not use randomness or time.
Allowed target: src/calculate-reorder-recommendation.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
