/**
 * Programs / Services section: training cards with expandable details, locations, schedule, pricing.
 */

import { switchTab } from '../navigation/tabs.js';
import { loadContent } from '../utils/contentLoader.js';
import { parseKeyValue, parseSections } from '../utils/parse.js';

async function buildLocationHtml() {
  const raw = await loadContent('location-info.txt');
  const data = parseKeyValue(raw);
  return `
    <div class="expanded-section">
      <h3 class="expanded-section-title">${data.heading || 'Location'}</h3>
      <div class="location-card">
        <h4>${data.location_name || ''}</h4>
        <a href="${data.maps_url || '#'}" class="btn" target="_blank" rel="noopener">📍 Open in Google Maps</a>
      </div>
    </div>
  `;
}

async function buildLocationsListHtml(file) {
  const raw = await loadContent(file);
  const data = parseKeyValue(raw);
  const outdoors = data.outdoor
    ? Array.isArray(data.outdoor)
      ? data.outdoor
      : [data.outdoor]
    : [];
  const indoors = data.indoor ? (Array.isArray(data.indoor) ? data.indoor : [data.indoor]) : [];
  return `
    <div class="expanded-section">
      <h3 class="expanded-section-title">${data.heading || 'Locations'}</h3>
      ${
        outdoors.length
          ? `
        <h4 class="locations-subheading">${data.outdoor_heading || 'Outdoor'}</h4>
        <div class="locations-list">
          ${outdoors
            .map((loc) => {
              const [name, url] = loc.split('|').map((s) => s.trim());
              return `<a href="${url}" class="location-item" target="_blank" rel="noopener">📍 ${name}</a>`;
            })
            .join('\n')}
        </div>
      `
          : ''
      }
      ${
        indoors.length
          ? `
        <h4 class="locations-subheading">${data.indoor_heading || 'Indoor'}</h4>
        <div class="locations-list">
          ${indoors
            .map((loc) => {
              const [name, url] = loc.split('|').map((s) => s.trim());
              return `<a href="${url}" class="location-item" target="_blank" rel="noopener">🏠 ${name}</a>`;
            })
            .join('\n')}
        </div>
      `
          : ''
      }
    </div>
  `;
}

async function buildPricingHtml(file) {
  const raw = await loadContent(file);
  const data = parseKeyValue(raw);
  const plans = data.plan ? (Array.isArray(data.plan) ? data.plan : [data.plan]) : [];
  return `
    <div class="expanded-section">
      <h3 class="expanded-section-title">${data.heading || 'Pricing'}</h3>
      <div class="pricing-cards">
        ${plans
          .map((p) => {
            const parts = p.split('|').map((s) => s.trim());
            return `
              <div class="pricing-card">
                <span class="pricing-frequency">${parts[0]}</span>
                <span class="pricing-per-class">${parts[1]}</span>
              </div>
            `;
          })
          .join('\n')}
      </div>
    </div>
  `;
}

async function buildScheduleHtml(file) {
  const raw = await loadContent(file);
  const data = parseKeyValue(raw);
  const days = data.day ? (Array.isArray(data.day) ? data.day : [data.day]) : [];
  const plans = data.plan ? (Array.isArray(data.plan) ? data.plan : [data.plan]) : [];
  return `
    <div class="expanded-section">
      <h3 class="expanded-section-title">${data.heading || 'Schedule'}</h3>
      <p class="expanded-section-subtitle">${data.subtitle || ''}</p>
      <div class="schedule-table">
        <table>
          <thead>
            <tr><th>Day</th><th>Time</th></tr>
          </thead>
          <tbody>
            ${days
              .map((d) => {
                const [day, time] = d.split('|').map((s) => s.trim());
                return `<tr><td>${day}</td><td>${time}</td></tr>`;
              })
              .join('\n')}
          </tbody>
        </table>
      </div>
      ${
        plans.length
          ? `
        <h4 class="schedule-pricing-heading">${data.pricing_heading || 'Pricing'}</h4>
        <div class="pricing-cards">
          ${plans
            .map((p) => {
              const parts = p.split('|').map((s) => s.trim());
              return `
                <div class="pricing-card">
                  <span class="pricing-frequency">${parts[0]}</span>
                  <span class="pricing-per-class">${parts[1]}</span>
                  <span class="pricing-total">${parts[2]}</span>
                </div>
              `;
            })
            .join('\n')}
        </div>
      `
          : ''
      }
      ${data.note ? `<p class="schedule-note">${data.note}</p>` : ''}
    </div>
  `;
}

export default async function loadServices() {
  const raw = await loadContent('training-menu.txt');
  const sections = parseSections(raw);
  const header = parseKeyValue(sections[0]);
  const cards = sections.slice(1).map((s) => parseKeyValue(s));

  const headingParts = (header.heading || 'Programs').split(' ');
  const lastWord = headingParts.slice(-1)[0];
  const firstWords = headingParts.slice(0, -1).join(' ');

  const el = document.getElementById('services-content');
  if (!el) return;

  el.innerHTML = `
    <h2 class="section-title">${firstWords ? firstWords + ' ' : ''}<span class="accent">${lastWord}</span></h2>
    <p class="section-subtitle">${header.subtitle || ''}</p>
    <div class="services-grid">
      ${cards
        .map((card, i) => {
          const details = Array.isArray(card.detail) ? card.detail : [card.detail];
          return `
            <div class="service-card" data-card-index="${i}">
              <h3>${card.name || ''}</h3>
              <p>${card.description || ''}</p>
              <ul class="service-details">
                ${details.map((d) => `<li>${d}</li>`).join('\n')}
              </ul>
              <span class="service-price">${card.price || ''}</span>
            </div>
          `;
        })
        .join('\n')}
    </div>
    <div class="service-expanded" id="service-expanded"></div>
  `;

  const cardEls = el.querySelectorAll('.service-card');
  let activeIndex = -1;
  const expandedEl = document.getElementById('service-expanded');

  cardEls.forEach((cardEl, i) => {
    cardEl.addEventListener('click', async () => {
      if (activeIndex === i) {
        expandedEl.innerHTML = '';
        expandedEl.classList.remove('open');
        cardEl.classList.remove('selected');
        activeIndex = -1;
        return;
      }

      cardEls.forEach((c) => c.classList.remove('selected'));
      cardEl.classList.add('selected');
      activeIndex = i;

      const card = cards[i];
      const expandedDetails = card.expanded_detail
        ? Array.isArray(card.expanded_detail)
          ? card.expanded_detail
          : [card.expanded_detail]
        : [];
      const imageSrc = card.image || '';

      let locationHtml = '';
      let scheduleHtml = '';
      let locationsListHtml = '';
      let pricingHtml = '';

      try { if (card.include_location === 'true') locationHtml = await buildLocationHtml(); } catch (e) { console.warn('Location load failed:', e); }
      try { if (card.schedule_file) scheduleHtml = await buildScheduleHtml(card.schedule_file); } catch (e) { console.warn('Schedule load failed:', e); }
      try { if (card.location_file) locationsListHtml = await buildLocationsListHtml(card.location_file); } catch (e) { console.warn('Locations list load failed:', e); }
      try { if (card.pricing_file) pricingHtml = await buildPricingHtml(card.pricing_file); } catch (e) { console.warn('Pricing load failed:', e); }

      expandedEl.innerHTML = `
        <div class="expanded-inner">
          <div class="expanded-image">
            ${
              imageSrc
                ? `<img src="${imageSrc}" alt="${card.name}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>Photo: ${card.name}</span></div>'">`
                : `<div class="image-placeholder"><span>Photo: ${card.name}</span></div>`
            }
          </div>
          <div class="expanded-details">
            <h3>${card.name || ''}</h3>
            <p class="expanded-text">${card.expanded || card.description || ''}</p>
            ${
              expandedDetails.length
                ? `
              <ul class="service-details">
                ${expandedDetails.map((d) => `<li>${d}</li>`).join('\n')}
              </ul>
            `
                : ''
            }
            <span class="service-price">${card.price || ''}</span>
            <a href="#contact" class="btn expanded-cta" data-tab="contact">Get Started</a>
          </div>
        </div>
        ${scheduleHtml}
        ${locationHtml}
        ${pricingHtml}
        ${locationsListHtml}
      `;
      expandedEl.classList.add('open');

      expandedEl.querySelectorAll('[data-tab]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          switchTab(btn.getAttribute('data-tab'));
        });
      });

      expandedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}
