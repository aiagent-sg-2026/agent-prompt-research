import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(new URL('.', import.meta.url).pathname);
const tasks = JSON.parse(readFileSync(join(root, 'task-specs.json'), 'utf8'));
const styles = {
  A: ['A-lean', 'Implement the requested change in the allowed target. Satisfy the contract, verify with tests, and report the result.'],
  B: ['B-structured', 'Work outcome-first using this structure: (1) inspect only the fixture context needed to understand the task, (2) implement the canonical contract in the allowed target, (3) run the fixture tests, (4) review the changed-file scope and final diff, and (5) report test and scope evidence. Do not change evaluator-owned files.'],
  C: ['C-prescriptive', 'Follow this procedure carefully. First inspect the target, tests, fixture documentation, and canonical contract before editing. Then map each canonical requirement to the target behavior and implement them one by one in the allowed file only. After editing, run the complete fixture test suite. If a test fails, diagnose the failure against the canonical contract, revise only the allowed target, and rerun the complete tests. Then inspect git status and the diff, confirm no evaluator-owned file changed, re-read every canonical requirement, and verify the final implementation satisfies each one. Before finishing, run the complete tests one final time and report the final test result, changed-file scope, and concise implementation summary. Do not modify tests, fixture documentation, package metadata, or unrelated source files.']
};
const block = task => ['--- BEGIN CANONICAL TASK CONTRACT ---', `Goal: ${task.goal}`, 'Requirements:', ...task.requirements.map(r => `${r.id}: ${r.text}`), `Allowed target: ${task.target}`, 'Success/evidence: Implement the requirements in the allowed target, pass the fixture tests, change no other fixture files, and leave a concise final report of tests and scope.', '--- END CANONICAL TASK CONTRACT ---'].join('\n');
for (const task of tasks) {
  const canonical = block(task);
  for (const [variant, [name, wrapper]] of Object.entries(styles)) {
    const text = `${wrapper}\n\n${canonical}\n`;
    const dir = join(root, 'prompts', task.id); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, `${name}.md`), text);
  }
}
console.log(`Generated ${tasks.length * 3} prompts.`);
console.log(JSON.stringify(Object.fromEntries(tasks.map(t => [t.id, createHash('sha256').update(block(t)).digest('hex')])), null, 2));
