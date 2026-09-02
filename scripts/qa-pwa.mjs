import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const docs = join(root, 'docs');
const failures = [];
const required = [
  'manifest.webmanifest', 'sw.js', 'PWA.md', 'i18n/en.json', 'i18n/zh-CN.json', 'i18n/zh-TW.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-512-maskable.png', 'icons/apple-touch-icon-180.png'
];
for (const file of required) if (!existsSync(join(docs, file))) failures.push(`missing ${file}`);
const read = (file) => readFileSync(join(root, file), 'utf8');
const flatten = (value, prefix = '', result = {}) => {
  for (const [key, item] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (item && typeof item === 'object' && !Array.isArray(item)) flatten(item, path, result);
    else result[path] = item;
  }
  return result;
};
const html = read('docs/index.html');
const app = read('docs/app.js');
const sw = read('docs/sw.js');
const manifest = JSON.parse(read('docs/manifest.webmanifest'));
const locales = ['en', 'zh-CN', 'zh-TW'].map((locale) => [locale, flatten(JSON.parse(read(`docs/i18n/${locale}.json`))) ]);
const enKeys = Object.keys(locales[0][1]).sort();
for (const [locale, dictionary] of locales) {
  const keys = Object.keys(dictionary).sort();
  if (JSON.stringify(keys) !== JSON.stringify(enKeys)) failures.push(`locale key mismatch: ${locale}`);
  if (Object.values(dictionary).some((value) => typeof value !== 'string' || !value.trim())) failures.push(`empty/non-string translation: ${locale}`);
}
const markerKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
const attrKeys = [...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((match) => match[1].split(';').map((entry) => entry.split(':')[1]));
for (const key of [...new Set([...markerKeys, ...attrKeys])]) if (!enKeys.includes(key)) failures.push(`HTML translation key missing: ${key}`);
for (const key of ['variant.A', 'variant.B', 'variant.C', 'task.t1-normalize-tags', 'task.t2-retry', 'task.t3-merge-preferences', 'common.yes', 'common.no', 'install.button', 'status.online', 'status.offline']) if (!enKeys.includes(key)) failures.push(`required translation key missing: ${key}`);

const pngSizes = { 'icons/icon-192.png': 192, 'icons/icon-512.png': 512, 'icons/icon-512-maskable.png': 512, 'icons/apple-touch-icon-180.png': 180 };
for (const [file, expected] of Object.entries(pngSizes)) {
  const bytes = readFileSync(join(docs, file));
  const valid = bytes.length >= 24 && bytes.readUInt32BE(0) === 0x89504e47 && bytes.readUInt32BE(16) === expected && bytes.readUInt32BE(20) === expected;
  if (!valid) failures.push(`invalid PNG dimensions/signature: ${file}`);
}
if (manifest.id !== './' || manifest.start_url !== './index.html' || manifest.scope !== './') failures.push('manifest is not project-path safe');
for (const field of ['name', 'short_name', 'description', 'theme_color', 'background_color']) if (typeof manifest[field] !== 'string' || !manifest[field]) failures.push(`manifest missing ${field}`);
if (manifest.display !== 'standalone' || manifest.prefer_related_applications !== false) failures.push('manifest install fields incorrect');
for (const icon of manifest.icons || []) if (!existsSync(join(docs, icon.src.replace(/^\.\//, '')))) failures.push(`manifest icon missing: ${icon.src}`);
for (const asset of ['./index.html', './styles.css', './app.js', './manifest.webmanifest', './data/summary.json', './i18n/en.json', './i18n/zh-CN.json', './i18n/zh-TW.json', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-512-maskable.png', './icons/apple-touch-icon-180.png']) if (!sw.includes(asset)) failures.push(`service worker precache missing: ${asset}`);
if (!sw.includes("request.method !== 'GET'") || !sw.includes('url.origin !== self.location.origin') || !sw.includes("caches.match('./index.html')") || !sw.includes('caches.delete')) failures.push('service worker safety/fallback/cleanup hook missing');
if (!html.includes('manifest.webmanifest') || !html.includes('apple-touch-icon-180.png') || !app.includes('serviceWorker') || !app.includes('beforeinstallprompt') || !app.includes("'online'") || !app.includes("'offline'")) failures.push('PWA HTML/app hooks missing');
if (html.includes('href="../') || html.includes("src=\"../")) failures.push('parent-relative HTML asset link found');
const repoBase = 'https://github.com/aiagent-sg-2026/agent-prompt-research/';
if (!html.includes(repoBase + 'blob/main/REPORT.md') || !html.includes(repoBase + 'tree/main/experiments/evidence')) failures.push('GitHub artifact links changed or missing');
const summary = JSON.parse(read('docs/data/summary.json'));
if (summary.status !== 'COMPLETE' || summary.runs?.length !== 9 || summary.by_variant?.length !== 3) failures.push('Phase 1 summary shape/status invariant changed');
for (const variant of summary.by_variant || []) if (variant.success_count !== 3 || variant.completed_count !== 3 || variant.success_rate !== 1 || variant.unrelated_edit_count?.total !== 0) failures.push(`Phase 1 invariant changed for ${variant.variant}`);
if (!app.includes("['A', 'B', 'C']") || !app.includes('data/summary.json') || !app.includes('Intl.NumberFormat')) failures.push('app.js rendering assumptions missing');
if (!app.includes("startsWith('zh-hant')") || !app.includes("startsWith('zh-hans')")) failures.push('BCP-47 Chinese locale family mapping missing');

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('PWA QA passed: manifest, icons, locale parity/coverage, safe paths, service worker, hooks, links, and Phase 1 invariants are valid.');
