/**
 * Reviews section: athlete testimonials.
 */

import { loadContent } from '../utils/contentLoader.js';
import { parseKeyValue, parseSections } from '../utils/parse.js';

export default async function loadReviews() {
  const raw = await loadContent('athlete-reviews.txt');
  const sections = parseSections(raw);
  const header = parseKeyValue(sections[0]);
  const reviews = sections.slice(1).map((s) => parseKeyValue(s));

  const el = document.getElementById('reviews-content');
  if (!el) return;

  el.innerHTML = `
    <h2 class="section-title">What Our <span class="accent">Athletes</span> Say</h2>
    <p class="section-subtitle">${header.subtitle || ''}</p>
    <div class="reviews-grid">
      ${reviews
        .map((r) => {
          const stars = '★'.repeat(parseInt(r.stars) || 5);
          return `
            <div class="review-card">
              <div class="review-stars">${stars}</div>
              <p class="review-text">"${r.text || ''}"</p>
              <div class="review-author"><span class="author-name">— ${r.author || ''}</span></div>
            </div>
          `;
        })
        .join('\n')}
    </div>
    <div class="reviews-cta">
      <p>See all our reviews on</p>
      <a href="${header.google_maps_url || '#'}" class="btn btn-outline" target="_blank" rel="noopener">Google Maps</a>
    </div>
  `;
}
