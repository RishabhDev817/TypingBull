import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emitKeystroke, resetKeystrokeStreak, KEYSTROKE_EVENT, type KeystrokeDetail } from '../src/utils/typingEvents.ts';

// Minimal window for Node: addEventListener/dispatchEvent with CustomEvent.
const target = new EventTarget();
(globalThis as unknown as { window: unknown }).window = Object.assign(target, {
  dispatchEvent: target.dispatchEvent.bind(target),
  addEventListener: target.addEventListener.bind(target),
});

function collect(run: () => void): KeystrokeDetail[] {
  const seen: KeystrokeDetail[] = [];
  const onEvent = (e: Event) => seen.push((e as CustomEvent<KeystrokeDetail>).detail);
  target.addEventListener(KEYSTROKE_EVENT, onEvent);
  run();
  target.removeEventListener(KEYSTROKE_EVENT, onEvent);
  return seen;
}

test('streak counts consecutive correct keys and resets on a mistake', () => {
  resetKeystrokeStreak();
  const events = collect(() => {
    emitKeystroke(true);
    emitKeystroke(true);
    emitKeystroke(true);
    emitKeystroke(false);
    emitKeystroke(true);
  });
  assert.deepEqual(events.map((e) => e.streak), [1, 2, 3, 0, 1]);
  assert.deepEqual(events.map((e) => e.correct), [true, true, true, false, true]);
});

test('resetKeystrokeStreak starts a new run from zero', () => {
  emitKeystroke(true);
  resetKeystrokeStreak();
  const events = collect(() => emitKeystroke(true));
  assert.equal(events[0].streak, 1);
});
