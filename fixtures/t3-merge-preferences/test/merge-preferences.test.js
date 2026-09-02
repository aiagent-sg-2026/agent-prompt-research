import test from 'node:test';
import assert from 'node:assert/strict';
import { mergePreferences } from '../src/merge-preferences.js';

const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
test('recursively merges plain objects and keeps override keys', () => {
  const defaults = { theme: { mode: 'light', font: 'sans' }, count: 1, list: ['a'] };
  const overrides = { theme: { mode: 'dark' }, count: 2, extra: true, list: ['b'] };
  const result = mergePreferences(defaults, overrides);
  assert.deepEqual(result, { theme: { mode: 'dark', font: 'sans' }, count: 2, extra: true, list: ['b'] });
  assert.notStrictEqual(result, defaults); assert.notStrictEqual(result.theme, defaults.theme); assert.notStrictEqual(result.list, overrides.list);
});

test('undefined retains defaults and values are independent', () => {
  const defaults = { nested: { value: 1 }, arr: [{ x: 1 }] };
  const overrides = { nested: { value: undefined } };
  const result = mergePreferences(defaults, overrides);
  assert.deepEqual(result, { nested: { value: 1 }, arr: [{ x: 1 }] });
  assert.notStrictEqual(result.nested, defaults.nested); assert.notStrictEqual(result.arr, defaults.arr); assert.notStrictEqual(result.arr[0], defaults.arr[0]);
});

test('validates both root inputs as non-null non-array objects', () => {
  for (const value of [null, [], 'x', 1, undefined]) assert.throws(() => mergePreferences(value, {}), TypeError);
  for (const value of [null, [], 'x', 1, undefined]) assert.throws(() => mergePreferences({}, value), TypeError);
});

test('non-plain override values replace defaults', () => {
  const date = new Date(0); const result = mergePreferences({ a: { x: 1 }, d: 'old' }, { a: date, d: undefined });
  assert.strictEqual(result.a, date); assert.equal(result.d, 'old'); assert.ok(plain(result));
});
