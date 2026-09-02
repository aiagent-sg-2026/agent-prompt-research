Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

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
