// Very small anti-cheat heuristics for dev.
// Expect heartbeats: [{ts: <ms>, event: 'play'|'pause'|'seek'|'heartbeat', positionSec: <number>}]

function validateProgress(heartbeats = [], videoDurationSec = 0) {
  if (!Array.isArray(heartbeats) || heartbeats.length === 0) {
    return { valid: false, reason: 'no_heartbeats' };
  }

  // Calculate total watched time approximation by counting heartbeats with position
  let uniquePositions = new Set();
  let seeks = 0;
  let lastPos = null;

  for (const hb of heartbeats) {
    if (typeof hb.positionSec === 'number') {
      uniquePositions.add(Math.floor(hb.positionSec));
      if (lastPos !== null && Math.abs(hb.positionSec - lastPos) > 5) seeks++;
      lastPos = hb.positionSec;
    }
  }

  const watchedSec = uniquePositions.size;
  const watchedPct = videoDurationSec > 0 ? Math.min(100, (watchedSec / videoDurationSec) * 100) : 0;

  // Heuristics: require at least 70% watched and no more than 5 seeks
  if (watchedPct < 70) return { valid: false, reason: 'insufficient_watch', watchedPct };
  if (seeks > 10) return { valid: false, reason: 'excessive_seeks', seeks };

  return { valid: true, watchedSec, watchedPct };
}

module.exports = { validateProgress };
