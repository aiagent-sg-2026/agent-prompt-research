Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

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
