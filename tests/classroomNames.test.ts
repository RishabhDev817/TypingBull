import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ClassroomManager } from '../server/classroom/ClassroomManager.ts';

const m = new ClassroomManager();

test('names in scripts that use combining marks are kept intact', () => {
  assert.equal(m.sanitizeName('शिक्षक'), 'शिक्षक'); // Hindi
  assert.equal(m.sanitizeName('आरव'), 'आरव');
  assert.equal(m.sanitizeName('สวัสดี'), 'สวัสดี'); // Thai
  assert.equal(m.sanitizeName('Zoë'), 'Zoë');
});

test('markup and symbols are still stripped', () => {
  assert.equal(m.sanitizeName('<b>Alex</b>'), 'Alex');
  assert.equal(m.sanitizeName('Max!!!'), 'Max');
  assert.match(m.sanitizeName('<script>'), /^Student/);
});
