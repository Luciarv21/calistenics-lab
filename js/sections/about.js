/**
 * About section: coach intro, stats, and multiple content blocks (image, stacked, text-only, CTA).
 */

import { loadContent } from '../utils/contentLoader.js';
import { parseKeyValue, parseSections } from '../utils/parse.js';

function buildSectionText(section, rawBlock) {
  let html = '';
  if (section.section_title) html += `<h3 class="about-section-title">${section.section_title}</h3>`;
  if (section.section_subtitle) html += `<p class="about-coach-title">${section.section_subtitle}</p>`;
  if (section.section_quote) html += `<blockquote class="about-coach-quote">"${section.section_quote}"</blockquote>`;

  if (rawBlock) {
    const lines = rawBlock.split('\n').filter((l) => l.trim());
    let bulletBuffer = [];
    function flushBul() {
      if (!bulletBuffer.length) return;
      html += '<ul class="intro-bullets">';
      bulletBuffer.forEach((b) => {
        const [title, desc] = b.split('|').map((s) => s.trim());
        html += `<li><strong>${title}</strong><span>${desc || ''}</span></li>`;
      });
      html += '</ul>';
      bulletBuffer = [];
    }
    for (const line of lines) {
      const ci = line.indexOf(':');
      if (ci === -1) continue;
      const key = line.substring(0, ci).trim().toLowerCase();
      const val = line.substring(ci + 1).trim();
      if (key !== 'bullet') flushBul();
      if (key === 'paragraph') html += `<p class="about-paragraph">${val}</p>`;
      else if (key === 'heading2') html += `<h3 class="intro-heading2">${val}</h3>`;
      else if (key === 'bullet') bulletBuffer.push(val);
    }
    flushBul();
  } else {
    const paragraphs = section.paragraph
      ? Array.isArray(section.paragraph) ? section.paragraph : [section.paragraph]
      : [];
    const bullets = section.bullet
      ? Array.isArray(section.bullet) ? section.bullet : [section.bullet]
      : [];
    paragraphs.forEach((p) => {
      html += `<p class="about-paragraph">${p}</p>`;
    });
    if (bullets.length) {
      html += '<ul class="intro-bullets">';
      bullets.forEach((b) => {
        const [title, desc] = b.split('|').map((s) => s.trim());
        html += `<li><strong>${title}</strong><span>${desc || ''}</span></li>`;
      });
      html += '</ul>';
    }
  }
  return html;
}

export default async function loadAbout() {
  const raw = await loadContent('about-calisthenics-skill-lab.txt');
  const allSections = parseSections(raw);
  const header = parseKeyValue(allSections[0]);
  const sectionRaws = allSections.slice(1);
  const sections = sectionRaws.map((s) => parseKeyValue(s));
  const stats = header.stat ? (Array.isArray(header.stat) ? header.stat : [header.stat]) : [];

  const headingParts = (header.heading || '').split(' ');
  const accent = headingParts.slice(-2).join(' ');
  const rest = headingParts.slice(0, -2).join(' ');

  let sectionsHtml = '';
  let imageIndex = 0;
  let textOnlyBuffer = [];

  function flushTextOnly() {
    if (textOnlyBuffer.length === 0) return '';
    const out = `
      <div class="about-columns">
        ${textOnlyBuffer.map((s) => `<div class="about-column">${buildSectionText(s)}</div>`).join('\n')}
      </div>
    `;
    textOnlyBuffer = [];
    return out;
  }

  for (let si = 0; si < sections.length; si++) {
    const section = sections[si];
    const rawBlock = sectionRaws[si];
    if (section.layout === 'cta') {
      sectionsHtml += flushTextOnly();
      const ctaTab = section.cta_tab || 'contact';
      const ctaButton = section.cta_button || 'Get Started';
      sectionsHtml += `<div class="about-cta"><p class="about-cta-text">${section.cta_text || ''}</p><a href="#${ctaTab}" class="btn" data-tab="${ctaTab}">${ctaButton}</a></div>`;
    } else if (section.layout === 'stacked') {
      sectionsHtml += flushTextOnly();
      const imgSrc = section.section_image || '';
      const imageHtml = imgSrc
        ? `<img src="${imgSrc}" alt="${section.section_title || ''}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>Photo</span></div>'">`
        : `<div class="image-placeholder"><span>Photo</span></div>`;
      sectionsHtml += `
        <div class="about-section-stacked">
          <div class="about-section-text">${buildSectionText(section, rawBlock)}</div>
          <div class="about-section-image-stacked">${imageHtml}</div>
        </div>
      `;
    } else if (section.layout === 'text-only') {
      textOnlyBuffer.push(section);
    } else {
      sectionsHtml += flushTextOnly();
      const imgSrc = section.section_image || '';
      const imageHtml = imgSrc
        ? `<img src="${imgSrc}" alt="${section.section_title || ''}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>Photo</span></div>'">`
        : `<div class="image-placeholder"><span>Photo</span></div>`;
      const imageLeft = imageIndex % 2 === 0;
      imageIndex++;
      sectionsHtml += `
        <div class="about-section ${imageLeft ? 'image-left' : 'image-right'}">
          <div class="about-section-image">${imageHtml}</div>
          <div class="about-section-text">${buildSectionText(section, rawBlock)}</div>
        </div>
      `;
    }
  }
  sectionsHtml += flushTextOnly();

  const el = document.getElementById('about-content');
  if (!el) return;
  el.innerHTML = `
    <h2 class="about-heading">${rest} <span class="accent">${accent}</span></h2>
    ${stats.length ? `
      <div class="about-stats">
        ${stats
          .map((s) => {
            const [num, label] = s.split('|').map((x) => x.trim());
            return `<div class="stat"><span class="stat-number">${num}</span><span class="stat-label">${label}</span></div>`;
          })
          .join('\n')}
      </div>
    ` : ''}
    ${sectionsHtml}
  `;
}
