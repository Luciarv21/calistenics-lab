/**
 * Section registry: single source of truth for section ids and their loaders.
 * Adding a new section = add a loader module + one entry here.
 */

import loadHero from './hero.js';
import loadAbout from './about.js';
import loadServices from './services.js';
import loadContact from './contact.js';
import loadReviews from './reviews.js';

/** Section id → async load function. */
export const sectionLoaders = {
  welcome: loadHero,
  about: loadAbout,
  services: loadServices,
  contact: loadContact,
  reviews: loadReviews,
};

/** Order of sections (for nav and initial active tab). */
export const sectionOrder = ['welcome', 'about', 'services', 'contact', 'reviews'];

export function getLoader(sectionId) {
  return sectionLoaders[sectionId] ?? null;
}
