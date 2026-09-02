import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTags } from '../src/normalize-tags.js';

test('normalizes, filters, deduplicates, preserves order, and does not mutate', () => {
  const input = ['  Foo ', 'BAR', 'foo', '   ', '\tbar\n', 'Baz'];
  const copy = [...input];
  assert.deepEqual(normalizeTags(input), ['foo', 'bar', 'baz']);
  assert.deepEqual(input, copy);
});

test('rejects non-arrays and non-string elements', () => {
  assert.throws(() => normalizeTags(null), TypeError);
  assert.throws(() => normalizeTags('foo'), TypeError);
  assert.throws(() => normalizeTags(['ok', 3]), TypeError);
});

test('handles an empty input', () => assert.deepEqual(normalizeTags([]), []));
