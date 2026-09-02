import test from 'node:test'; import assert from 'node:assert/strict'; import { selectLocalizedValue } from '../src/select-localized-value.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('prefers exact locale',()=>assert.equal(selectLocalizedValue({'pt-BR':'olá',pt:'oi',en:'hello'},'pt-BR'),'olá'));
test('falls back to language',()=>assert.equal(selectLocalizedValue({pt:'oi',en:'hello'},'pt-PT'),'oi'));
test('tries fallback exact and language',()=>assert.equal(selectLocalizedValue({'fr':'salut'},'ja','fr-FR'),'salut'));
test('returns falsy values and undefined when absent',()=>{assert.equal(selectLocalizedValue({en:0},'ja'),0); assert.equal(selectLocalizedValue({fr:false},'ja'),undefined);});
test('uses insertion order on case collision and validates',()=>{assert.equal(selectLocalizedValue({'EN':'upper',en:'lower'},'en'),'upper'); assert.throws(()=>selectLocalizedValue(null,'en'),TypeError);});
