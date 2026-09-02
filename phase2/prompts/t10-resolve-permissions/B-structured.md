Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.

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
