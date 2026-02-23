/**
 * Loads content files from content/{lang}/{filename}.
 * Falls back to content/en/ when the requested language or file is missing.
 */

import { getCurrentLang } from '../state.js';

export async function loadContent(file) {
  const lang = getCurrentLang();
  let response = await fetch(`content/${lang}/${file}`);

  if (!response.ok && lang !== 'en') {
    response = await fetch(`content/en/${file}`);
  }

  if (!response.ok) {
    throw new Error(`Content not found: ${lang}/${file}`);
  }

  return response.text();
}
