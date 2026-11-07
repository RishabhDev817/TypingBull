import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fingerSourceKey, keyForSentence, drillableKeys } from '../src/engine/keyLabels.ts';

test('punctuation borrows the finger of the letter key in the same spot', () => {
  assert.equal(fingerSourceKey(','), 'k');
  assert.equal(fingerSourceKey('.'), 'l');
  assert.equal(fingerSourceKey('E'), 'e');
  assert.equal(fingerSourceKey('€'), null);
});

test('keys read clearly in a sentence', () => {
  assert.equal(keyForSentence('e'), 'E');
  assert.equal(keyForSentence(','), '“,”');
  assert.equal([',', '.'].map(keyForSentence).join(', '), '“,”, “.”');
});

test('only letters are drillable, de-duplicated and capped', () => {
  assert.deepEqual(drillableKeys([',', '.', 'Z', 'p', 'z', 'a', 'b', 'c']), ['z', 'p', 'a', 'b']);
  assert.deepEqual(drillableKeys([',', '.']), []);
});
