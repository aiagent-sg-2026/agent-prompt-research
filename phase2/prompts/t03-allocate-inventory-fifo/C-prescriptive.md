Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Allocate a requested quantity from inventory lots in first-in-first-out order.
Requirements:
R1: Export allocateInventoryFifo(lots, requested).
R2: Require lots to be an array and requested to be a non-negative integer; each lot must have a string id and non-negative integer quantity, otherwise throw TypeError.
R3: Consume lots in array order, taking the smallest of remaining lot quantity and remaining requested quantity.
R4: Return {allocations, remaining}, where allocations contains only consumed lots as {id, quantity} and remaining is unmet quantity.
R5: Do not mutate lots and omit zero-quantity allocations.
R6: Return empty allocations and remaining zero for a zero request.
Allowed target: src/allocate-inventory-fifo.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
