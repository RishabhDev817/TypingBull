import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLASSROOM_ENTRY, fill } from '../src/i18n/classroomEntryI18n.ts';

const LOCALES = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'hi'];
const en = CLASSROOM_ENTRY.en as unknown as Record<string, string>;
const placeholders = (t: string) => (t.match(/\{\w+\}/g) ?? []).sort().join(',');

test('every supported language has the classroom entry text', () => {
  assert.deepEqual(Object.keys(CLASSROOM_ENTRY).sort(), [...LOCALES].sort());
});

test('each language has exactly the same keys as English, none empty', () => {
  for (const lang of LOCALES) {
    const t = CLASSROOM_ENTRY[lang as keyof typeof CLASSROOM_ENTRY] as unknown as Record<string, string>;
    assert.deepEqual(Object.keys(t).sort(), Object.keys(en).sort(), lang);
    for (const [k, v] of Object.entries(t)) assert.ok(v.trim().length > 0, `${lang}.${k} is empty`);
  }
});

test('placeholders such as {n} and {id} are kept in every language', () => {
  for (const lang of LOCALES) {
    const t = CLASSROOM_ENTRY[lang as keyof typeof CLASSROOM_ENTRY] as unknown as Record<string, string>;
    for (const k of Object.keys(en)) assert.equal(placeholders(t[k]), placeholders(en[k]), `${lang}.${k}`);
  }
});

test('other languages are really translated, not copies of English', () => {
  for (const lang of LOCALES.filter((l) => l !== 'en')) {
    const t = CLASSROOM_ENTRY[lang as keyof typeof CLASSROOM_ENTRY] as unknown as Record<string, string>;
    const same = Object.keys(en).filter((k) => t[k] === en[k]);
    assert.ok(same.length <= 1, `${lang} still English: ${same.join(', ')}`);
  }
});

test('fill replaces placeholders and leaves unknown ones alone', () => {
  assert.equal(fill('{n} lessons', { n: 3 }), '3 lessons');
  assert.equal(fill('Avatar {id}', { id: 'fox' }), 'Avatar fox');
  assert.equal(fill('{n} of {m}', { n: 1 }), '1 of {m}');
});
