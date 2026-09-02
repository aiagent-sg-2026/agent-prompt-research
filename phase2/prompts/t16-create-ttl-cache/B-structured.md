Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Create a small TTL cache using an injected clock.
Requirements:
R1: Export createTtlCache(ttlMs, now).
R2: Require ttlMs to be a non-negative finite number and now to be a function; otherwise throw TypeError.
R3: Return an object with get(key), set(key, value), has(key), and delete(key) methods.
R4: A value is valid while now() minus its set time is less than ttlMs; expired entries are treated as absent and removed on access.
R5: set returns the cache object; delete returns whether an entry existed and get returns undefined for absent entries.
R6: Use the injected now function for every expiry check and do not use timers or wall-clock globals.
Allowed target: src/create-ttl-cache.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
