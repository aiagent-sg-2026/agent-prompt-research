Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

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
