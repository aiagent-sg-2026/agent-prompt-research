/** Keeps the first event for replay protection while retaining its original object shape. */
function valid(event) { return event && typeof event.id === 'string' && Number.isFinite(event.timestamp); }
export function dedupeEvents(events) { if (!Array.isArray(events) || events.some(event => !valid(event))) throw new TypeError('invalid event'); const seen = new Set(); return events.filter(event => { if (seen.has(event.id)) return false; seen.add(event.id); return true; }).reverse(); }
