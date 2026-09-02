/** CSV header normalization used by import pipelines. */
const NON_WORD_RUN = /[^a-z0-9]+/gi;
function assertHeaderList(headers) { if (!Array.isArray(headers) || headers.some(value => typeof value !== 'string')) throw new TypeError('headers must be strings'); }
function normalizeHeader(header) { return header.trim().toLocaleLowerCase().replace(NON_WORD_RUN, '_').replace(/^_+|_+$/g, ''); }
export function normalizeCsvHeaders(headers) { assertHeaderList(headers); return headers.map(normalizeHeader); }
