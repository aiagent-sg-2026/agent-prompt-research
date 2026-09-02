import test from 'node:test'; import assert from 'node:assert/strict'; import { validateCustomerUpdate } from '../src/validate-customer-update.js';
// SPEC_REQUIREMENTS: R1,R2,R3,R4,R5,R6
test('accepts a valid partial update',()=>assert.deepEqual(validateCustomerUpdate({name:' Ada ',email:'ada@example.test',phone:'+1234567',marketingOptIn:false}),{valid:true,errors:[]}));
test('reports one stable error per field',()=>assert.deepEqual(validateCustomerUpdate({name:' ',email:'bad',extra:1}),{valid:false,errors:[{field:'name',message:'name must be a non-empty string'},{field:'email',message:'email must contain exactly one @ with non-empty sides'},{field:'extra',message:'unknown field'}]}));
test('validates phone boundaries',()=>{assert.equal(validateCustomerUpdate({phone:'1234567'}).valid,true); assert.equal(validateCustomerUpdate({phone:'12'}).valid,false);});
test('requires boolean marketing choice',()=>assert.equal(validateCustomerUpdate({marketingOptIn:'yes'}).valid,false));
test('validates object and does not mutate',()=>{const x={name:'A'}; validateCustomerUpdate(x); assert.deepEqual(x,{name:'A'}); assert.throws(()=>validateCustomerUpdate(null),TypeError);});
