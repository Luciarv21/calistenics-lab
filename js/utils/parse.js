/**
 * Text parsing utilities for key:value and section-based content files.
 */

export function parseKeyValue(text) {
  const result = {};
  const lines = text.split('\n').filter((l) => l.trim());
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    if (result[key]) {
      if (!Array.isArray(result[key])) result[key] = [result[key]];
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function parseSections(text) {
  return text.split('\n---\n').filter((s) => s.trim());
}
