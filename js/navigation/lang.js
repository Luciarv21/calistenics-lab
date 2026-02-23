/**
 * Language toggle (EN / NL) and UI state.
 */

import { getCurrentLang, setCurrentLang } from '../state.js';

export function initLanguageToggle(onLanguageChange) {
  const enBtn = document.getElementById('lang-en');
  const nlBtn = document.getElementById('lang-nl');
  if (!enBtn || !nlBtn) return;

  const switchLanguage = async (lang) => {
    if (getCurrentLang() === lang) return;
    setCurrentLang(lang);
    enBtn.classList.toggle('active', lang === 'en');
    nlBtn.classList.toggle('active', lang === 'nl');
    enBtn.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    nlBtn.setAttribute('aria-pressed', lang === 'nl' ? 'true' : 'false');
    if (typeof onLanguageChange === 'function') {
      await onLanguageChange();
    }
  };

  enBtn.addEventListener('click', () => switchLanguage('en'));
  nlBtn.addEventListener('click', () => switchLanguage('nl'));
}
