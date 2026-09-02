Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Remove duplicate events while retaining the first occurrence order.
Requirements:
R1: Export dedupeEvents(events).
R2: Require an array of objects each containing a string id and finite numeric timestamp; throw TypeError otherwise.
R3: Events with the same id are duplicates regardless of timestamp; keep the event with the earliest array position.
R4: Return a new array in first-occurrence order and do not mutate events or event records.
R5: An empty input returns an empty array.
Allowed target: src/dedupe-events.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
