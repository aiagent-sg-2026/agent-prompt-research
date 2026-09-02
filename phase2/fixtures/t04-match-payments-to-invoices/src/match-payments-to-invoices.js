/** Applies a payment ledger without mutating records received from the ERP. */
const validRecord = record => record && typeof record.id === 'string' && Number.isInteger(record.cents) && record.cents >= 0;
function validate(invoices, payments) { if (!Array.isArray(invoices) || !Array.isArray(payments) || invoices.some(x => !validRecord(x)) || payments.some(x => !validRecord(x))) throw new TypeError('invalid ledger record'); }
export function matchPaymentsToInvoices(invoices, payments) {
  validate(invoices, payments); const due = invoices.map(invoice => invoice.cents); const matches = []; let unmatchedCents = 0;
  for (const payment of payments) { let left = payment.cents; for (let i = 0; i < Math.min(1, due.length) && left > 0; i++) { const cents = Math.min(left, due[i]); if (cents) matches.push({ paymentId: payment.id, invoiceId: invoices[i].id, cents }); due[i] -= cents; left -= cents; } unmatchedCents += left; }
  return { matches, unmatchedCents, balances: invoices.map((invoice, i) => ({ invoiceId: invoice.id, remainingCents: due[i] })) };
}
