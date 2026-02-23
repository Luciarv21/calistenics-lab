/**
 * Tab navigation with optional callback and accessibility attributes.
 */

let onTabSwitchCallback = null;

export function setOnTabSwitch(fn) {
  onTabSwitchCallback = fn;
}

export function switchTab(tabId) {
  const navLinks = document.querySelectorAll('.nav-link');
  const tabContents = document.querySelectorAll('.tab-content');
  const navMenu = document.querySelector('.nav-links');

  tabContents.forEach((tab) => {
    tab.classList.remove('active');
    tab.setAttribute('aria-hidden', 'true');
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    link.setAttribute('aria-selected', 'false');
  });

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
    targetTab.setAttribute('aria-hidden', 'false');
  }

  const matchingLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if (matchingLink) {
    matchingLink.classList.add('active');
    matchingLink.setAttribute('aria-selected', 'true');
  }

  if (navMenu) navMenu.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (typeof onTabSwitchCallback === 'function') {
    onTabSwitchCallback(tabId);
  }
}

/** Set aria-hidden / aria-selected from current .active state (e.g. on init). */
export function syncAria() {
  const navLinks = document.querySelectorAll('.nav-link');
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach((tab) => {
    const isActive = tab.classList.contains('active');
    tab.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });
  navLinks.forEach((link) => {
    const isActive = link.classList.contains('active');
    link.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

export function bindTabTriggers() {
  document.querySelectorAll('[data-tab]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(trigger.getAttribute('data-tab'));
    });
  });
}

export function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
  }
}
