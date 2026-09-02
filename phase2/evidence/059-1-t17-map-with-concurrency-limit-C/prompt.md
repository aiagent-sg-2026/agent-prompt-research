Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Map over inputs with a strict maximum number of active asynchronous workers.
Requirements:
R1: Export async mapWithConcurrencyLimit(items, limit, mapper).
R2: Require items to be an array, limit to be a positive integer, and mapper to be a function; otherwise reject with TypeError.
R3: Invoke mapper(value, index) for every item and return results in input order.
R4: Never have more than limit mapper calls active at once; start later work as earlier work settles.
R5: If a mapper rejects, reject the returned promise with that error while allowing already-started calls to settle.
R6: Do not mutate items.
Allowed target: src/map-with-concurrency-limit.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
