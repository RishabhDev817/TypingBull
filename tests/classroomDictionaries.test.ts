import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLASSROOM_SESSION, LESSON_TYPE_KEYS } from '../src/i18n/classroomSessionI18n.ts';
import { CLASSROOM_TEACHER } from '../src/i18n/classroomTeacherI18n.ts';
import { CLASSROOM_PICKER } from '../src/i18n/classroomPickerI18n.ts';

const LOCALES = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'hi'];
const placeholders = (t: string) => (t.match(/\{\w+\}/g) ?? []).sort().join(',');

const dictionaries: Record<string, Record<string, Record<string, string>>> = {
  session: CLASSROOM_SESSION as never,
  teacher: CLASSROOM_TEACHER as never,
  picker: CLASSROOM_PICKER as never,
};

for (const [name, dict] of Object.entries(dictionaries)) {
  test(`${name}: every language is present with the same keys as English, none empty`, () => {
    assert.deepEqual(Object.keys(dict).sort(), [...LOCALES].sort());
    const en = dict.en;
    for (const l of LOCALES) {
      assert.deepEqual(Object.keys(dict[l]).sort(), Object.keys(en).sort(), `${name}.${l}`);
      for (const [k, v] of Object.entries(dict[l])) assert.ok(v.trim().length > 0, `${name}.${l}.${k} is empty`);
    }
  });

  test(`${name}: placeholders are kept in every language`, () => {
    const en = dict.en;
    for (const l of LOCALES) for (const k of Object.keys(en)) assert.equal(placeholders(dict[l][k]), placeholders(en[k]), `${name}.${l}.${k}`);
  });

  test(`${name}: other languages are really translated`, () => {
    const en = dict.en;
    for (const l of LOCALES.filter((x) => x !== 'en')) {
      const same = Object.keys(en).filter((k) => dict[l][k] === en[k]);
      // Units and loanwords (WPM, QR Code, ...) can match; a whole copied dictionary cannot.
      assert.ok(same.length <= 6, `${name}.${l} still English: ${same.join(', ')}`);
    }
  });
}

test('lesson types map to real strings', () => {
  for (const key of Object.values(LESSON_TYPE_KEYS)) assert.ok(key in CLASSROOM_SESSION.en, key);
  assert.equal(Object.keys(LESSON_TYPE_KEYS).length, 8);
});
