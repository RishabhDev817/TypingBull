import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DRILL_WORDS } from '../src/data/drillWords.ts';

test('every letter appears in enough drill words', () => {
  for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
    const n = DRILL_WORDS.filter((w) => w.includes(letter)).length;
    assert.ok(n >= 10, `only ${n} drill words contain "${letter}"`);
  }
});

test('drill words are plain lower-case words with no duplicates', () => {
  assert.ok(DRILL_WORDS.every((w) => /^[a-z]{2,}$/.test(w)));
  assert.equal(new Set(DRILL_WORDS).size, DRILL_WORDS.length);
});
