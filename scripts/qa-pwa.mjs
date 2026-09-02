import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const docs = join(root, 'docs');
const failures = [];
const required = [
  'manifest.webmanifest', 'sw.js', 'PWA.md', 'tcm.html', 'i18n/en.json', 'i18n/zh-CN.json', 'i18n/zh-TW.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-512-maskable.png', 'icons/apple-touch-icon-180.png', 'data/summary.json', 'data/phase2-summary.json'
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
const tcm = read('docs/tcm.html');
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
const pages = [html, tcm];
const markerKeys = pages.flatMap((page) => [...page.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]));
const attrKeys = pages.flatMap((page) => [...page.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((match) => match[1].split(';').map((entry) => entry.split(':')[1])));
for (const key of [...new Set([...markerKeys, ...attrKeys])]) if (!enKeys.includes(key)) failures.push(`HTML translation key missing: ${key}`);
for (const key of ['variant.A', 'variant.B', 'variant.C', 'task.t1-normalize-tags', 'task.t2-retry', 'task.t3-merge-preferences', 'common.yes', 'common.no', 'install.button', 'status.online', 'status.offline', 'nav.home', 'nav.tracks', 'tracks.tcmTitle', 'tcm.title', 'tcm.noResults']) if (!enKeys.includes(key)) failures.push(`required translation key missing: ${key}`);

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
for (const asset of ['./index.html', './tcm.html', './styles.css', './app.js', './manifest.webmanifest', './data/summary.json', './data/phase2-summary.json', './i18n/en.json', './i18n/zh-CN.json', './i18n/zh-TW.json', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-512-maskable.png', './icons/apple-touch-icon-180.png']) if (!sw.includes(asset)) failures.push(`service worker precache missing: ${asset}`);
if (!sw.includes("request.method !== 'GET'") || !sw.includes('url.origin !== self.location.origin') || !sw.includes("request.mode === 'navigate'") || !sw.includes("'./index.html'") || !sw.includes("'./tcm.html'") || !sw.includes('caches.delete')) failures.push('service worker safety/fallback/cleanup hook missing');
if (!html.includes('manifest.webmanifest') || !tcm.includes('manifest.webmanifest') || !html.includes('apple-touch-icon-180.png') || !tcm.includes('apple-touch-icon-180.png') || !app.includes('serviceWorker') || !app.includes('beforeinstallprompt') || !app.includes("'online'") || !app.includes("'offline'")) failures.push('PWA HTML/app hooks missing');
if ([html, tcm].some((page) => page.includes('href="../') || page.includes('src="../'))) failures.push('parent-relative HTML asset link found');
const repoBase = 'https://github.com/aiagent-sg-2026/agent-prompt-research/';
if (!html.includes(repoBase + 'blob/main/REPORT.md') || !html.includes(repoBase + 'tree/main/experiments/evidence')) failures.push('GitHub artifact links changed or missing');
const summary = JSON.parse(read('docs/data/summary.json'));
if (summary.status !== 'COMPLETE' || summary.runs?.length !== 9 || summary.by_variant?.length !== 3) failures.push('Phase 1 summary shape/status invariant changed');
for (const variant of summary.by_variant || []) if (variant.success_count !== 3 || variant.completed_count !== 3 || variant.success_rate !== 1 || variant.unrelated_edit_count?.total !== 0) failures.push(`Phase 1 invariant changed for ${variant.variant}`);
if (!app.includes("['A', 'B', 'C']") || !app.includes('data/summary.json') || !app.includes('Intl.NumberFormat')) failures.push('app.js rendering assumptions missing');
if (!app.includes("startsWith('zh-hant')") || !app.includes("startsWith('zh-hans')")) failures.push('BCP-47 Chinese locale family mapping missing');

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }

const phase2 = JSON.parse(readFileSync(join(root, 'docs/data/phase2-summary.json'), 'utf8'));
if (phase2.total_cells !== 300 || !Number.isInteger(phase2.valid_cells) || phase2.valid_cells < 0 || phase2.valid_cells > 300) failures.push('Phase 2 public progress shape is invalid');
if (phase2.valid_cells < 300 && phase2.verdict !== null) failures.push('Phase 2 public verdict must remain null before 300/300');
if (phase2.success_count > phase2.valid_cells || phase2.unrelated_edit_count < 0) failures.push('Phase 2 public progress counts are invalid');
if (!html.includes('id="phase2"') || !html.includes('id="phase2-progress-value"') || !html.includes('data-i18n="phase2.pending"')) failures.push('Phase 2 site hooks are missing');
if (!app.includes("const phase2DataUrl = 'data/phase2-summary.json'" ) || !app.includes('renderPhase2') || !app.includes('loadPhase2')) failures.push('Phase 2 dynamic loader is missing');
if (!sw.includes("'./data/phase2-summary.json'") || !sw.includes("endsWith('/data/phase2-summary.json')")) failures.push('Phase 2 service-worker data strategy is missing');
for (const [locale, dictionary] of locales) {
  for (const key of ['phase2.eyebrow','phase2.title','phase2.intro','phase2.cells','phase2.success','phase2.scope','phase2.verdict','phase2.pending','phase2.warningTitle','phase2.warning','phase2.protocolLink','phase2.summaryLink','phase2.evidenceLink','phase2.recoveryLink','nav.phase2']) {
    if (!dictionary[key]) failures.push(`missing Phase 2 locale key ${locale}: ${key}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`PWA QA passed: manifest, icons, locale parity/coverage, offline hooks, TCM links, Phase 1 invariants, and Phase 2 ${phase2.valid_cells}/300 pending-state contract are valid.`);
