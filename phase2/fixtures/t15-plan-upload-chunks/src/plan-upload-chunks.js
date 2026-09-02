/** Upload planner emits an immutable contiguous plan for resumable transfers. */
const positiveInteger = value => Number.isInteger(value) && value > 0;
function nextChunk(offset, total, size, index) { return { index, offset, size: Math.min(size, total - offset) }; }
export function planUploadChunks(totalBytes, chunkSize) { if (!positiveInteger(totalBytes) || !positiveInteger(chunkSize)) throw new TypeError('positive integers required'); const chunks = []; for (let offset = 0, index = 0; offset <= totalBytes; index++) { const chunk = nextChunk(offset, totalBytes, chunkSize, index); chunks.push(chunk); offset += chunk.size || 1; } return chunks; }
