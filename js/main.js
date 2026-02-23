/**
 * Calisthenics Skill Lab — main entry point.
 * Loads UI strings, lazy-loads sections on first view, and wires navigation + i18n.
 */

import '../css/main.css';
import { setOnTabSwitch, bindTabTriggers, initMobileNav, syncAria } from './navigation/tabs.js';
import { initLanguageToggle } from './navigation/lang.js';
import { initScrollReveal } from './ui/scrollReveal.js';
import { loadUiStrings, applyToDOM } from './i18n/strings.js';
import { getLoader, sectionOrder } from './sections/registry.js';

const loadedSections = new Set();

function getActiveTabId() {
  const active = document.querySelector('.tab-content.active');
  return active ? active.id : sectionOrder[0];
}

async function ensureSectionLoaded(sectionId) {
  if (loadedSections.has(sectionId)) return;
  const load = getLoader(sectionId);
  if (load) {
    await load();
    loadedSections.add(sectionId);
  }
}

async function onTabSwitch(sectionId) {
  await ensureSectionLoaded(sectionId);
  bindTabTriggers();
  initScrollReveal();
}

async function init() {
  await loadUiStrings();
  applyToDOM();

  const activeId = getActiveTabId();
  await ensureSectionLoaded(activeId);

  setOnTabSwitch(onTabSwitch);
  bindTabTriggers();
  syncAria();
  initScrollReveal();
}

async function onLanguageChange() {
  await loadUiStrings();
  applyToDOM();

  for (const sectionId of loadedSections) {
    const load = getLoader(sectionId);
    if (load) await load();
  }

  bindTabTriggers();
  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', () => {
  initLanguageToggle(onLanguageChange);
  initMobileNav();
  setOnTabSwitch(onTabSwitch);
  init();
});
