import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCanonicalUrl } from '../src/seo/canonical.ts';
import { ROUTE_META } from '../src/seo/routeMeta.ts';

test('English home canonical is the bare origin', () => {
  assert.equal(buildCanonicalUrl('/', 'en'), 'https://typingbull.com/');
});

test('localized home pages canonicalise to themselves, not to the English home', () => {
  assert.equal(buildCanonicalUrl('/es/', 'es'), 'https://typingbull.com/es/');
  assert.equal(buildCanonicalUrl('/ja', 'ja'), 'https://typingbull.com/ja/');
  assert.equal(buildCanonicalUrl('/', 'hi'), 'https://typingbull.com/hi/');
});

test('sub-pages keep a trailing slash and a single locale prefix', () => {
  assert.equal(buildCanonicalUrl('/learn', 'en'), 'https://typingbull.com/learn/');
  assert.equal(buildCanonicalUrl('/es/learn/', 'es'), 'https://typingbull.com/es/learn/');
  assert.equal(buildCanonicalUrl('/es/learn/', 'en'), 'https://typingbull.com/learn/');
});

test('query strings and hashes never leak into canonicals', () => {
  assert.equal(buildCanonicalUrl('/practice-ground/?room=12345#x', 'en'), 'https://typingbull.com/practice-ground/');
});

test('route titles and descriptions fit search result snippets', () => {
  for (const [key, meta] of Object.entries(ROUTE_META)) {
    assert.ok(meta.title.length <= 62, `${key} title is ${meta.title.length} chars`);
    assert.ok(meta.description.length >= 70 && meta.description.length <= 160, `${key} description is ${meta.description.length} chars`);
    assert.ok(meta.path.startsWith('/') && meta.path.endsWith('/'), `${key} path needs surrounding slashes`);
  }
});

test('route titles are unique', () => {
  const titles = Object.values(ROUTE_META).map((m) => m.title);
  assert.equal(new Set(titles).size, titles.length);
});

test('landing page FAQs are complete and non-trivial', async () => {
  const { TYPING_TEST_FAQ, AVERAGE_SPEED_FAQ } = await import('../src/seo/pageFaqs.ts');
  for (const list of [TYPING_TEST_FAQ, AVERAGE_SPEED_FAQ]) {
    assert.ok(list.length >= 5);
    for (const f of list) {
      assert.ok(f.question.endsWith('?'), f.question);
      assert.ok(f.answer.length > 60, f.question);
    }
  }
});
