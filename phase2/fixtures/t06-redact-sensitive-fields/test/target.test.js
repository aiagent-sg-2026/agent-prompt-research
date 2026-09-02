import test from 'node:test'; import assert from 'node:assert/strict'; import { redactSensitiveFields } from '../src/redact-sensitive-fields.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('redacts nested plain objects',()=>assert.deepEqual(redactSensitiveFields({password:'x',profile:{token:'y',name:'A'}}),{password:'[REDACTED]',profile:{token:'[REDACTED]',name:'A'}}));
test('redacts arrays without mutation',()=>{const source={items:[{secret:1}]}; const out=redactSensitiveFields(source); assert.deepEqual(out.items,[{secret:'[REDACTED]'}]); assert.notStrictEqual(out.items,source.items); assert.equal(source.items[0].secret,1);});
test('preserves primitives and dates by reference',()=>{const date=new Date(0); const out=redactSensitiveFields({date,ok:false}); assert.strictEqual(out.date,date); assert.equal(out.ok,false);});
test('uses exact custom names',()=>assert.deepEqual(redactSensitiveFields({Token:'x',token:'y'},['Token']),{Token:'[REDACTED]',token:'y'}));
test('does not traverse redacted values',()=>{const source={token:{password:'keep'}}; assert.deepEqual(redactSensitiveFields(source),{token:'[REDACTED]'});});
test('validates field list',()=>assert.throws(()=>redactSensitiveFields({},['ok',2]),TypeError));
