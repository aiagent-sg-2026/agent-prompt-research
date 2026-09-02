const SUPPORTED_LOCALES = ['en', 'zh-CN', 'zh-TW'];
const dataUrl = 'data/summary.json';
const phase2DataUrl = 'data/phase2-summary.json';
const localeUrl = (locale) => `i18n/${locale}.json`;
let currentLocale = 'en';
let deferredInstallPrompt = null;
let activeDictionary = null;
function resolveDirection(locale) { return /^ar|^fa|^he|^ur/i.test(locale) ? 'rtl' : 'ltr'; }
function normalizeLocale(value) {
  const locale = String(value || '').trim().toLowerCase();
  if (locale === 'zh-tw' || locale.startsWith('zh-hant') || locale.startsWith('zh-tw') || locale.startsWith('zh-hk') || locale.startsWith('zh-mo')) return 'zh-TW';
  if (locale === 'zh-cn' || locale.startsWith('zh-hans') || locale.startsWith('zh-cn') || locale.startsWith('zh-sg') || locale.startsWith('zh-my') || locale === 'zh') return 'zh-CN';
  if (locale === 'en' || locale.startsWith('en-')) return 'en';
  return null;
}
function localeFromNavigator() { return (navigator.languages || [navigator.language]).map(normalizeLocale).find(Boolean) || 'en'; }
function resolveLocale() {
  const queryLocale = new URLSearchParams(location.search).get('lang');
  const queryMatch = normalizeLocale(queryLocale);
  if (queryMatch) return queryMatch;
  try { const saved = localStorage.getItem('apr-locale'); if (SUPPORTED_LOCALES.includes(saved)) return saved; } catch { /* Optional storage. */ }
  return localeFromNavigator();
}
function get(dictionary, key) { return key.split('.').reduce((value, part) => value?.[part], dictionary) ?? key; }
function formatNumber(value, digits = 2) { return new Intl.NumberFormat(currentLocale, { maximumFractionDigits: digits }).format(value); }
function formatSeconds(value) { return `${(value / 1000).toLocaleString(currentLocale, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}s`; }
function updateConnectionStatus(dictionary = null) {
  const status = document.querySelector('#connection-status'); if (!status) return;
  const key = navigator.onLine ? 'status.online' : 'status.offline'; const source = dictionary || activeDictionary; status.textContent = source ? get(source, key) : (navigator.onLine ? 'Online' : 'Offline'); status.classList.toggle('offline', !navigator.onLine);
}
function translate(dictionary) {
  activeDictionary = dictionary;
  document.documentElement.lang = currentLocale; document.documentElement.dir = resolveDirection(currentLocale);
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = get(dictionary, element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-attr]').forEach((element) => element.dataset.i18nAttr.split(';').forEach((entry) => { const [attribute, key] = entry.split(':'); element.setAttribute(attribute, get(dictionary, key)); }));
  const selector = document.querySelector('#language'); if (selector) selector.value = currentLocale; updateConnectionStatus(dictionary);
}
function cell(text, tag = 'td') { const element = document.createElement(tag); element.textContent = text; return element; }
function renderSummary(summary, dictionary) {
  const variants = Object.fromEntries(summary.by_variant.map((item) => [item.variant, item])); const comparison = document.querySelector('#comparison-table tbody');
  if (comparison) { comparison.replaceChildren(); ['A', 'B', 'C'].forEach((key) => { const item = variants[key]; const row = document.createElement('tr'); const head = cell(`${key} · ${get(dictionary, `variant.${key}`)}`, 'th'); head.scope = 'row'; row.append(head, cell(`${item.success_count}/${item.completed_count}`), cell(formatNumber(item.input_tokens.mean)), cell(formatSeconds(item.latency_ms.mean)), cell(formatNumber(item.output_tokens.mean)), cell(formatNumber(item.diff_lines.mean)), cell(formatNumber(item.test_retry_count.total))); comparison.append(row); }); }
  const tasks = document.querySelector('#task-table tbody');
  if (tasks) { tasks.replaceChildren(); summary.runs.forEach((item) => { const row = document.createElement('tr'); const head = cell(get(dictionary, `task.${item.task}`), 'th'); head.scope = 'row'; row.append(head, cell(item.variant), cell(formatNumber(item.input_tokens)), cell(formatSeconds(item.wall_clock_ms)), cell(formatNumber(item.diff_lines)), cell(item.task_success ? get(dictionary, 'common.yes') : get(dictionary, 'common.no'))); tasks.append(row); }); }
}

function renderPhase2(summary, dictionary) {
  const progress = document.querySelector('#phase2-progress-value');
  const success = document.querySelector('#phase2-success-value');
  const scope = document.querySelector('#phase2-scope-value');
  const verdict = document.querySelector('#phase2-verdict-value');
  if (progress) progress.textContent = `${formatNumber(summary.valid_cells, 0)}/${formatNumber(summary.total_cells, 0)}`;
  if (success) success.textContent = `${formatNumber(summary.success_count, 0)}/${formatNumber(summary.valid_cells, 0)}`;
  if (scope) scope.textContent = formatNumber(summary.unrelated_edit_count, 0);
  if (verdict) verdict.textContent = summary.verdict || get(dictionary, 'phase2.pending');
}
async function loadPhase2(dictionary) {
  if (!document.querySelector('#phase2-progress-value')) return;
  try { const response = await fetch(phase2DataUrl, { cache: 'no-store' }); if (response.ok) renderPhase2(await response.json(), dictionary); } catch { /* Server-rendered progress is the offline fallback. */ }
}
async function loadLocale(locale) {
  currentLocale = normalizeLocale(locale) || 'en'; let dictionary;
  try { const response = await fetch(localeUrl(currentLocale)); if (!response.ok) throw new Error('locale'); dictionary = await response.json(); } catch { currentLocale = 'en'; const response = await fetch(localeUrl('en')); dictionary = await response.json(); }
  translate(dictionary); try { localStorage.setItem('apr-locale', currentLocale); } catch { /* Optional preference. */ }
  try { const response = await fetch(dataUrl); if (response.ok) renderSummary(await response.json(), dictionary); } catch { /* Server-rendered HTML is the fallback. */ }
  await loadPhase2(dictionary);
}
function updateLocaleUrl(locale) {
  if (!window.history?.replaceState) return;
  const url = new URL(window.location.href); url.searchParams.set('lang', locale); window.history.replaceState(null, '', url);
}
function setupInstall() {
  const button = document.querySelector('#install-button'); if (!button) return;
  window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstallPrompt = event; button.hidden = false; });
  button.addEventListener('click', async () => { if (!deferredInstallPrompt) return; deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; button.hidden = true; });
  window.addEventListener('appinstalled', () => { button.hidden = true; deferredInstallPrompt = null; });
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#language')?.addEventListener('change', (event) => { const locale = normalizeLocale(event.target.value) || 'en'; updateLocaleUrl(locale); loadLocale(locale); });
  window.addEventListener('online', () => updateConnectionStatus()); window.addEventListener('offline', () => updateConnectionStatus()); setupInstall();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {}); loadLocale(resolveLocale());
});
