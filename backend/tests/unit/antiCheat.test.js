const antiCheat = require('../../services/antiCheatService');

test('validateProgress rejects empty heartbeats', () => {
  const res = antiCheat.validateProgress([], 100);
  expect(res.valid).toBe(false);
  expect(res.reason).toBe('no_heartbeats');
});

test('validateProgress accepts >70% watched', () => {
  const heartbeats = [];
  for (let i = 0; i < 80; i++) heartbeats.push({ ts: i * 1000, event: 'heartbeat', positionSec: i });
  const res = antiCheat.validateProgress(heartbeats, 100);
  expect(res.valid).toBe(true);
  expect(res.watchedPct).toBeGreaterThanOrEqual(70);
});
