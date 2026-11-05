import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corsHeaders, escapeHtml, isAllowedOrigin, readJsonBody, takeRateLimit } from '../server/apiSecurity.ts';

test('origin allowlist accepts the site, its previews and localhost only', () => {
  assert.equal(isAllowedOrigin('https://typingbull.com'), true);
  assert.equal(isAllowedOrigin('https://www.typingbull.com'), true);
  assert.equal(isAllowedOrigin('https://abc123.typingbull-bxe.pages.dev'), true);
  assert.equal(isAllowedOrigin('http://localhost:5173'), true);
  assert.equal(isAllowedOrigin('https://typingbull.com.evil.io'), false);
  assert.equal(isAllowedOrigin('http://typingbull-bxe.pages.dev'), false);
  assert.equal(isAllowedOrigin(null), false);
});

test('CORS headers echo allowed origins only', () => {
  assert.equal(corsHeaders('https://typingbull.com')['Access-Control-Allow-Origin'], 'https://typingbull.com');
  assert.equal(corsHeaders('https://evil.example')['Access-Control-Allow-Origin'], undefined);
});

test('escapeHtml neutralises tags, quotes and ampersands', () => {
  assert.equal(escapeHtml('<img src=x onerror="a()"> & \'b\''), '&lt;img src=x onerror=&quot;a()&quot;&gt; &amp; &#39;b&#39;');
  assert.equal(escapeHtml(undefined), '');
});

test('rate limit allows the limit, then blocks until the window resets', () => {
  const key = `test:${Math.random()}`;
  for (let i = 0; i < 3; i++) assert.equal(takeRateLimit(key, 3, 1000, 0), true);
  assert.equal(takeRateLimit(key, 3, 1000, 10), false);
  assert.equal(takeRateLimit(key, 3, 1000, 1001), true);
});

test('readJsonBody refuses oversized and invalid bodies', async () => {
  const small = new Request('https://x/', { method: 'POST', body: '{"a":1}' });
  assert.deepEqual(await readJsonBody(small, 100), { a: 1 });
  const big = new Request('https://x/', { method: 'POST', body: '{"a":"' + 'z'.repeat(200) + '"}' });
  assert.equal(await readJsonBody(big, 100), null);
  const bad = new Request('https://x/', { method: 'POST', body: 'not json' });
  assert.equal(await readJsonBody(bad, 100), null);
});
