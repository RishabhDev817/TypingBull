import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLASSROOM_STUDENT, ERROR_CODE_KEYS } from '../src/i18n/classroomStudentI18n.ts';
import { fill } from '../src/i18n/classroomEntryI18n.ts';

const LOCALES = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'hi'] as const;
const dict = (l: string) => CLASSROOM_STUDENT[l as keyof typeof CLASSROOM_STUDENT] as unknown as Record<string, string>;
const en = dict('en');
const placeholders = (t: string) => (t.match(/\{\w+\}/g) ?? []).sort().join(',');

test('every supported language has the student classroom text', () => {
  assert.deepEqual(Object.keys(CLASSROOM_STUDENT).sort(), [...LOCALES].sort());
});

test('same keys as English in every language, none empty', () => {
  for (const l of LOCALES) {
    assert.deepEqual(Object.keys(dict(l)).sort(), Object.keys(en).sort(), l);
    for (const [k, v] of Object.entries(dict(l))) assert.ok(v.trim().length > 0, `${l}.${k} is empty`);
  }
});

test('placeholders are kept in every language', () => {
  for (const l of LOCALES) for (const k of Object.keys(en)) assert.equal(placeholders(dict(l)[k]), placeholders(en[k]), `${l}.${k}`);
});

test('other languages are really translated', () => {
  // A few words are legitimately the same (for example "Speed" style loanwords or "TypingBull").
  for (const l of LOCALES.filter((x) => x !== 'en')) {
    const same = Object.keys(en).filter((k) => dict(l)[k] === en[k]);
    assert.ok(same.length <= 3, `${l} still English: ${same.join(', ')}`);
  }
});

test('server error codes point at real strings', () => {
  for (const key of Object.values(ERROR_CODE_KEYS)) assert.ok(key in en, key);
  assert.equal(ERROR_CODE_KEYS.ROOM_NOT_FOUND, 'errRoomNotFound');
  assert.equal(ERROR_CODE_KEYS.UNAUTHORIZED, undefined); // keeps the server's own message
});

test('messages fill in correctly', () => {
  assert.equal(fill(dict('es').toastFinished, { name: 'Ana', wpm: 40, rank: 2 }), '🏁 ¡Ana terminó! (40 PPM • Puesto 2)');
  assert.equal(fill(dict('hi').tasksTitle, { done: 1, total: 3 }), 'क्लासरूम कार्य (3 में से 1 पूरे)');
});
