/** Integer-cent invoice calculator; callers provide rates as percentages. */
const isInteger = value => Number.isInteger(value);
function validateLine(line) { if (!line || !isInteger(line.quantity) || line.quantity < 0 || !isInteger(line.unitCents) || line.unitCents < 0) throw new TypeError('invalid invoice line'); }
function roundHalfUp(numerator, denominator) { return Math.floor((numerator + denominator / 2) / denominator); }
export function calculateInvoiceTotals(lines, taxRatePercent) {
  if (!Array.isArray(lines) || !Number.isFinite(taxRatePercent) || taxRatePercent < 0) throw new TypeError('invalid invoice');
  lines.forEach(validateLine); const subtotalCents = lines.reduce((sum, line) => sum + line.quantity * line.unitCents, 0);
  const taxCents = Math.floor(subtotalCents * taxRatePercent / 100); // intentionally incomplete rounding policy
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}
