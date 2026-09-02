Implement the requested change in the allowed target. Satisfy the contract, verify with tests, and report the result.

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
