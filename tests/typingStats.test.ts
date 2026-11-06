import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcWpm, calcAccuracy, bandForWpm, SPEED_BANDS } from '../src/seo/typingStats.ts';

test('WPM uses five characters per word', () => {
  assert.equal(calcWpm(300, 60000), 60);
  assert.equal(calcWpm(150, 30000), 60);
  assert.equal(calcWpm(0, 60000), 0);
  assert.equal(calcWpm(100, 0), 0);
});

test('accuracy is a one-decimal percentage and 100 for no input', () => {
  assert.equal(calcAccuracy(0, 0), 100);
  assert.equal(calcAccuracy(95, 100), 95);
  assert.equal(calcAccuracy(2, 3), 66.7);
});

test('bands are contiguous and every WPM maps to one band', () => {
  for (let i = 1; i < SPEED_BANDS.length; i++) assert.equal(SPEED_BANDS[i].min, SPEED_BANDS[i - 1].max);
  assert.equal(bandForWpm(0).id, 'beginner');
  assert.equal(bandForWpm(40).id, 'average');
  assert.equal(bandForWpm(55).id, 'good');
  assert.equal(bandForWpm(300).id, 'expert');
});
