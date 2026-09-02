Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.

--- BEGIN CANONICAL TASK CONTRACT ---
Goal: Resolve allow and deny permission rules with deny precedence.
Requirements:
R1: Export resolvePermissions(rules, requested).
R2: Require rules to be an array and requested to be an array of strings or {permission, scope} objects; malformed entries throw TypeError.
R3: Each rule has string permission, boolean allow, and optional string scope; invalid records throw TypeError.
R4: A rule applies when its scope is absent or equals the requested entry's scope; requested entries may be strings or {permission, scope} objects.
R5: For each requested entry, the last applicable rule wins, and an explicit deny beats an allow at the same specificity; missing decisions are false.
R6: Return an array of {permission, scope, allowed} in requested order and do not mutate inputs.
Allowed target: src/resolve-permissions.js
Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.
--- END CANONICAL TASK CONTRACT ---
