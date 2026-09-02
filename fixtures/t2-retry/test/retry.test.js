import test from 'node:test';
import assert from 'node:assert/strict';
import { retry } from '../src/retry.js';

test('returns the first resolved value, including falsy values', async () => {
  for (const value of [0, false, '', null]) assert.equal(await retry(async () => value), value);
});

test('retries rejection and returns the later value', async () => {
  let attempts = 0;
  assert.equal(await retry(() => { attempts += 1; if (attempts < 3) throw new Error('temporary'); return 'ok'; }), 'ok');
  assert.equal(attempts, 3);
});

test('throws the final error unchanged after retries are exhausted', async () => {
  let attempts = 0; const finalError = new Error('final');
  await assert.rejects(() => retry(() => { attempts += 1; throw attempts === 3 ? finalError : new Error('earlier'); }), error => error === finalError);
  assert.equal(attempts, 3);
});

test('validates operation and retries', async () => {
  await assert.rejects(() => retry(null), TypeError);
  for (const retries of [-1, 1.5, '2', NaN]) await assert.rejects(() => retry(() => {}, { retries }), TypeError);
  assert.equal(await retry(() => 'x', { retries: 0 }), 'x');
});
