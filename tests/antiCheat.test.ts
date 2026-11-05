import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ResultValidator } from '../server/multiplayer/ResultValidator.ts';
import { isBulkInsert } from '../src/utils/typingGuard.ts';

const TEXT = 'x'.repeat(300);
const START = 1_000_000;

test('race: instant finish in the first seconds is rejected', () => {
  const r = ResultValidator.validateProgress(TEXT, START, 300, 0, 300, true, START + 3400);
  assert.equal(r.isCompleted, false);
  assert.equal(r.isValid, false);
  assert.ok(r.validatedWpm <= 320);
  assert.ok(r.validatedCorrectChars < 300);
});

test('race: padding typos cannot fake a finish', () => {
  const r = ResultValidator.validateProgress(TEXT, START, 0, 300, 300, true, START + 2000);
  assert.equal(r.isCompleted, false);
});

test('race: honest 60 WPM finish is accepted', () => {
  const r = ResultValidator.validateProgress(TEXT, START, 295, 5, 300, true, START + 60_000);
  assert.equal(r.isValid, true);
  assert.equal(r.isCompleted, true);
  assert.equal(r.validatedWpm, 59);
});

test('race: a fast first word is allowed (burst allowance)', () => {
  const r = ResultValidator.validateProgress(TEXT, START, 5, 0, 5, false, START + 500);
  assert.equal(r.isValid, true);
  assert.equal(r.validatedCorrectChars, 5);
});

test('race: 120 WPM finish is accepted', () => {
  const r = ResultValidator.validateProgress(TEXT, START, 300, 0, 300, true, START + 30_000);
  assert.equal(r.isCompleted, true);
});

test('race: negative or non-numeric counts are clamped', () => {
  const r = ResultValidator.validateProgress(TEXT, START, -50, Number.NaN, -1, false, START + 10_000);
  assert.equal(r.validatedCorrectChars, 0);
  assert.equal(r.validatedIncorrectChars, 0);
});

test('typing guard: one character at a time is allowed, bulk inserts are not', () => {
  assert.equal(isBulkInsert('The', 'Th'), false); // backspace
  assert.equal(isBulkInsert('The', 'The '), false); // one keystroke
  assert.equal(isBulkInsert('The', 'The morning'), true); // paste
  assert.equal(isBulkInsert('', 'ab'), true);
});
