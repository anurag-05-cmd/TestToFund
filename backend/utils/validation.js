function requireFields(obj, fields) {
  const missing = [];
  for (const f of fields) if (!Object.prototype.hasOwnProperty.call(obj, f) || obj[f] === undefined || obj[f] === null) missing.push(f);
  if (missing.length) throw new Error(`missing_fields:${missing.join(',')}`);
}

module.exports = { requireFields };
