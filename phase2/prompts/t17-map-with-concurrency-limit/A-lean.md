Implement the requested change in the allowed target. Satisfy the contract, verify with tests, and report the result.

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
