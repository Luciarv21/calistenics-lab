/**
 * Global app state (e.g. current language).
 */

let currentLang = 'en';

export function getCurrentLang() {
  return currentLang;
}

export function setCurrentLang(lang) {
  currentLang = lang;
}
