import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MatchmakingManager } from '../server/multiplayer/MatchmakingManager.ts';
import { RoomManager } from '../server/multiplayer/RoomManager.ts';

test('quick-match bot races close to the player speed', () => {
  const mm = new MatchmakingManager(new RoomManager());
  for (let i = 0; i < 50; i++) {
    const bot = mm.createChallengerBot(undefined, 25);
    assert.ok(bot.wpm >= 23 && bot.wpm <= 29, `bot speed ${bot.wpm} should be near 25`);
    assert.equal(bot.isBot, true);
    assert.match(bot.name, /\[Bot\]$/);
  }
});

test('bot speed stays within sensible bounds', () => {
  const mm = new MatchmakingManager(new RoomManager());
  assert.ok(mm.createChallengerBot(undefined, 6).wpm >= 12);
  assert.ok(mm.createChallengerBot(undefined, 240).wpm <= 120);
});

test('without a known speed the bot uses its default range', () => {
  const mm = new MatchmakingManager(new RoomManager());
  const bot = mm.createChallengerBot();
  assert.ok(bot.wpm >= 56 && bot.wpm <= 86);
});
