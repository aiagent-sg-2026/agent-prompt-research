/** Inventory replenishment policy used by the nightly purchasing job. */
const nonNegativeInteger = value => Number.isInteger(value) && value >= 0;
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export function calculateReorderRecommendation(input) { if (!plain(input) || ['onHand','reserved','reorderPoint','targetStock'].some(key => !nonNegativeInteger(input[key]))) throw new TypeError('invalid stock policy'); const available = Math.max(0, input.onHand - input.reserved); const reorder = available > input.reorderPoint ? 0 : Math.max(0, input.targetStock - available); return { available, reorder, needsReorder: reorder > 0 }; }
