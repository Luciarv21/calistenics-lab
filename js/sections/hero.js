/**
 * Welcome / Hero section: hero block + intro text below.
 */

import { loadContent } from '../utils/contentLoader.js';
import { parseKeyValue } from '../utils/parse.js';

export default async function loadHero() {
  const [heroRaw, introRaw] = await Promise.all([
    loadContent('welcome-hero.txt'),
    loadContent('welcome-intro.txt'),
  ]);
  const data = parseKeyValue(heroRaw);
  const introData = parseKeyValue(introRaw);

  const heroEl = document.getElementById('hero-content');
  if (heroEl) {
    heroEl.innerHTML = `
      <h1>${data.title || ''}</h1>
      <p class="hero-subtitle">${data.subtitle || ''}</p>
      <p class="hero-text">${data.tagline || ''}</p>
      <a href="#${data.button1_tab}" class="btn" data-tab="${data.button1_tab}">${data.button1_text}</a>
      ${data.button2_text ? `<a href="#${data.button2_tab}" class="btn btn-outline" data-tab="${data.button2_tab}" style="margin-left: 12px;">${data.button2_text}</a>` : ''}
    `;
  }

  const introEl = document.getElementById('welcome-intro');
  if (!introEl) return;

  let introHtml = '';
  if (introData.heading) {
    const headings = Array.isArray(introData.heading) ? introData.heading : [introData.heading];
    introHtml += `<h2 class="intro-heading">${headings[0]}</h2>`;
  }
  if (introData.subheading) {
    introHtml += `<p class="intro-subheading">${introData.subheading}</p>`;
  }
  if (introData.paragraph) {
    const paragraphs = Array.isArray(introData.paragraph)
      ? introData.paragraph
      : [introData.paragraph];
    paragraphs.forEach((p, i) => {
      introHtml += `<p class="intro-paragraph">${p}</p>`;
      if (i === 1 && introData.highlight) {
        introHtml += `<div class="intro-highlight"><p>${introData.highlight}</p></div>`;
      }
    });
  }
  if (introData.heading2) {
    introHtml += `<h3 class="intro-heading2">${introData.heading2}</h3>`;
  }
  if (introData.bullet) {
    const bullets = Array.isArray(introData.bullet) ? introData.bullet : [introData.bullet];
    introHtml += '<ul class="intro-bullets">';
    bullets.forEach((b) => {
      const [title, desc] = b.split('|').map((s) => s.trim());
      introHtml += `<li><strong>${title}</strong><span>${desc}</span></li>`;
    });
    introHtml += '</ul>';
  }

  introEl.innerHTML = introHtml;
}
