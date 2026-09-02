Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Plan contiguous upload chunks with a bounded chunk size.
Requirements:
R1: Export planUploadChunks(totalBytes, chunkSize).
R2: Require both arguments to be positive integers; otherwise throw TypeError.
R3: Return an array of {index, offset, size} covering exactly 0 through totalBytes without gaps or overlap.
R4: Each size is at most chunkSize, indexes start at 0, and offsets are zero-based.
R5: The final chunk may be smaller; exact multiples do not receive an extra empty chunk.
R6: Do not use randomness or mutate any input.
Allowed target: src/plan-upload-chunks.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
