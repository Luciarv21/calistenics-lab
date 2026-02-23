/**
 * UI strings per language. Loads content/{lang}/ui.json and exposes t(key).
 */

import { getCurrentLang } from '../state.js';

let strings = {};

function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
}

export function t(key) {
  return getNested(strings, key) ?? key;
}

export async function loadUiStrings() {
  const lang = getCurrentLang();
  try {
    const res = await fetch(`content/${lang}/ui.json`);
    if (res.ok) {
      strings = await res.json();
      return strings;
    }
  } catch (_) {
    // fallback: try English
  }
  if (lang !== 'en') {
    try {
      const res = await fetch('content/en/ui.json');
      if (res.ok) strings = await res.json();
    } catch (_) {}
  }
  return strings;
}

/** Update all elements with data-i18n="key" to t(key). */
export function applyToDOM() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = t(key);
    if (value != null) {
      if (el.getAttribute('aria-label') !== null) el.setAttribute('aria-label', value);
      else el.textContent = value;
    }
  });
}
