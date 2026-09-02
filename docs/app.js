const dataUrl = 'data/summary.json';

function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

async function loadSummary() {
  try {
    const response = await fetch(dataUrl, { cache: 'no-store' });
    if (!response.ok) return;
    const summary = await response.json();
    const variants = Object.fromEntries(summary.by_variant.map((item) => [item.variant, item]));
    const rows = document.querySelector('#comparison-table tbody');
    if (!rows) return;
    rows.innerHTML = ['A', 'B', 'C'].map((key) => {
      const item = variants[key];
      const label = { A: 'Lean', B: 'Structured', C: 'Prescriptive' }[key];
      return `<tr><th scope="row">${key} · ${label}</th><td>${item.success_count}/${item.completed_count}</td><td>${formatNumber(item.input_tokens.mean)}</td><td>${(item.latency_ms.mean / 1000).toFixed(3)}s</td><td>${formatNumber(item.output_tokens.mean)}</td><td>${formatNumber(item.diff_lines.mean)}</td><td>${item.test_retry_count.total}</td></tr>`;
    }).join('');
  } catch {
    // The server-rendered HTML is the deliberate fallback for file/offline use.
  }
}

loadSummary();
