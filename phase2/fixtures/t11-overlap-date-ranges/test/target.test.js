import test from 'node:test'; import assert from 'node:assert/strict'; import { overlapDateRanges } from '../src/overlap-date-ranges.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('returns inclusive intersection',()=>assert.deepEqual(overlapDateRanges(['2026-01-01','2026-01-10'],['2026-01-10','2026-01-20']),['2026-01-10','2026-01-10']));
test('returns null for separated ranges',()=>assert.equal(overlapDateRanges(['2026-01-01','2026-01-02'],['2026-01-03','2026-01-04']),null));
test('accepts same-day ranges',()=>assert.deepEqual(overlapDateRanges(['2026-02-01','2026-02-01'],['2026-02-01','2026-02-03']),['2026-02-01','2026-02-01']));
test('rejects impossible dates',()=>assert.throws(()=>overlapDateRanges(['2026-02-30','2026-03-01'],['2026-03-01','2026-03-02']),TypeError));
test('rejects non ISO and reversed ranges',()=>{assert.throws(()=>overlapDateRanges(['2026-1-01','2026-02-01'],['2026-02-01','2026-03-01']),TypeError); assert.throws(()=>overlapDateRanges(['2026-03-01','2026-02-01'],['2026-02-01','2026-03-01']),TypeError);});
