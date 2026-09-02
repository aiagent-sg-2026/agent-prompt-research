import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PILOT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)));
export const REPO_ROOT = resolve(PILOT_ROOT, '../../..');
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');
export const json = (file) => JSON.parse(readFileSync(file, 'utf8'));
export const atomicWrite = (file, value) => {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}`;
  writeFileSync(tmp, value);
  renameSync(tmp, file);
};
export const atomicJson = (file, value) => atomicWrite(file, `${JSON.stringify(value, null, 2)}\n`);
export const childDirs = (dir) => existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => resolve(dir, e.name)) : [];
export const safeId = (s) => String(s).replace(/[^a-z0-9_-]/gi, '_');
export function latestUsage(events) {
  let usage = null;
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (value.usage && typeof value.usage === 'object') usage = value.usage;
    if (value.token_usage && typeof value.token_usage === 'object') usage = value.token_usage;
    for (const nested of Object.values(value)) visit(nested);
  };
  events.forEach(visit);
  return usage;
}
export function countToolCalls(events) {
  let count = 0;
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    const type = String(value.type ?? '').toLowerCase();
    if (/(command_execution|tool_call|function_call|mcp_tool_call)/.test(type)) count++;
    for (const nested of Object.values(value)) visit(nested);
  };
  events.forEach(visit);
  return count;
}
