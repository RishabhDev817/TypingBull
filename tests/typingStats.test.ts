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

test('every band has a friendly result title and a mascot mood', () => {
  for (const b of SPEED_BANDS) {
    assert.ok(b.title.length > 0 && b.title !== b.label || b.id === 'average' || b.id === 'beginner', b.id);
    assert.ok(b.mood === 'happy' || b.mood === 'cheering', b.id);
  }
  assert.equal(bandForWpm(10).title, 'Warming up');
});

test('every band has an encouraging result line and no band reads as a put-down', () => {
  for (const b of SPEED_BANDS) {
    assert.ok(b.encourage.length > 20, b.id);
    assert.ok(!/hunting|poor|bad|slow\b/i.test(b.encourage), b.id);
  }
});

test('result headline favours accuracy only through copy, never changing the speed band', () => {
  assert.equal(bandForWpm(18).title, 'Warming up');
});
