import { config } from './config.js';

let currentLang = 'en'; // Default language
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const tabContents = document.querySelectorAll('.tab-content');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');

  // ========== TAB NAVIGATION ==========

  function switchTab(tabId) {
    tabContents.forEach((tab) => tab.classList.remove('active'));
    navLinks.forEach((link) => link.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const matchingLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    if (matchingLink) matchingLink.classList.add('active');

    navMenu.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Map between tab IDs and clean URL paths
  const tabToPath = {
    welcome: '/',
    about: '/about',
    services: '/programs',
    contact: '/contact',
    reviews: '/reviews',
  };

  function getTabFromPath(pathname) {
    const path = pathname.replace(/\/+$/, '') || '/';
    switch (path) {
      case '/':
      case '/index.html':
        return 'welcome';
      case '/about':
        return 'about';
      case '/programs':
        return 'services';
      case '/contact':
        return 'contact';
      case '/reviews':
        return 'reviews';
      default:
        return 'welcome';
    }
  }

  function updateUrlForTab(tabId, replace = false) {
    if (!window.history || !window.history.pushState) return;
    const path = tabToPath[tabId] || '/';
    if (window.location.pathname === path) return;
    const state = { tabId };
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method](state, '', path);
  }

  window.addEventListener('popstate', () => {
    const tabId = getTabFromPath(window.location.pathname);
    switchTab(tabId);
  });

  // Attach click handlers to all [data-tab] elements (nav links + CTA buttons)
  function bindTabTriggers() {
    document.querySelectorAll('[data-tab]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = trigger.getAttribute('data-tab');
        switchTab(tabId);
        updateUrlForTab(tabId);
      });
    });
  }

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // ========== CONTENT LOADING ==========

  function initLanguageToggle() {
    const enBtn = document.getElementById('lang-en');
    const nlBtn = document.getElementById('lang-nl');

    const switchLanguage = async (lang) => {
      if (currentLang === lang) return;

      currentLang = lang;

      // Update UI button states
      enBtn.classList.toggle('active', lang === 'en');
      nlBtn.classList.toggle('active', lang === 'nl');

      // Re-initialize the content with the new language
      await init();
    };

    enBtn.addEventListener('click', () => switchLanguage('en'));
    nlBtn.addEventListener('click', () => switchLanguage('nl'));
  }

  async function loadContent(file) {
    const response = await fetch(`content/${currentLang}/${file}`);
    return response.text();
  }

  function parseKeyValue(text) {
    const result = {};
    const lines = text.split('\n').filter((l) => l.trim());
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (result[key]) {
        if (!Array.isArray(result[key])) result[key] = [result[key]];
        result[key].push(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  function parseSections(text) {
    return text.split('\n---\n').filter((s) => s.trim());
  }

  // ---- Hero ----
  async function loadHero() {
    const [heroRaw, introRaw] = await Promise.all([
      loadContent('welcome-hero.txt'),
      loadContent('welcome-intro.txt'),
    ]);
    const data = parseKeyValue(heroRaw);
    const introText = introRaw.trim();

    const el = document.getElementById('hero-content');
    el.innerHTML = `
      <h1>${data.title || ''}</h1>
      <p class="hero-subtitle">${data.subtitle || ''}</p>
      <p class="hero-text">${data.tagline || ''}</p>
      <a href="#${data.button1_tab}" class="btn" data-tab="${data.button1_tab}">${data.button1_text}</a>
      ${data.button2_text ? `<a href="#${data.button2_tab}" class="btn btn-outline" data-tab="${data.button2_tab}" style="margin-left: 12px;">${data.button2_text}</a>` : ''}
    `;

    const introEl = document.getElementById('welcome-intro');
    const introData = parseKeyValue(introRaw);

    let introHtml = '';

    // Heading
    if (introData.heading) {
      const headings = Array.isArray(introData.heading) ? introData.heading : [introData.heading];
      introHtml += `<h2 class="intro-heading">${headings[0]}</h2>`;
    }
    // Subheading
    if (introData.subheading) {
      introHtml += `<p class="intro-subheading">${introData.subheading}</p>`;
    }
    // Paragraphs before highlight
    if (introData.paragraph) {
      const paragraphs = Array.isArray(introData.paragraph)
        ? introData.paragraph
        : [introData.paragraph];
      paragraphs.forEach((p, i) => {
        introHtml += `<p class="intro-paragraph">${p}</p>`;
        // Insert highlight after second paragraph
        if (i === 1 && introData.highlight) {
          introHtml += `<div class="intro-highlight"><p>${introData.highlight}</p></div>`;
        }
      });
    }
    // Secondary heading
    if (introData.heading2) {
      introHtml += `<h3 class="intro-heading2">${introData.heading2}</h3>`;
    }
    // Bullets
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

  // ---- About ----
  // Renders lines in order so headings, paragraphs, bullets appear sequentially
  function renderOrderedContent(raw) {
    const lines = raw.split('\n').filter((l) => l.trim());
    let html = '';
    let bulletBuffer = [];

    function flushBullets() {
      if (bulletBuffer.length === 0) return;
      html += '<ul class="intro-bullets">';
      bulletBuffer.forEach((b) => {
        const [title, desc] = b.split('|').map((s) => s.trim());
        html += `<li><strong>${title}</strong><span>${desc || ''}</span></li>`;
      });
      html += '</ul>';
      bulletBuffer = [];
    }

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();

      if (key !== 'bullet') flushBullets();

      switch (key) {
        case 'heading':
          const parts = value.split(' ');
          const accent = parts.slice(-2).join(' ');
          const rest = parts.slice(0, -2).join(' ');
          html += `<h2 class="section-title">${rest} <span class="accent">${accent}</span></h2>`;
          break;
        case 'coach_name':
          html += `<h3 class="about-coach-name">${value}</h3>`;
          break;
        case 'coach_title':
          html += `<p class="about-coach-title">${value}</p>`;
          break;
        case 'coach_quote':
          html += `<blockquote class="about-coach-quote">"${value}"</blockquote>`;
          break;
        case 'heading2':
          html += `<h3 class="intro-heading2">${value}</h3>`;
          break;
        case 'paragraph':
          html += `<p class="about-paragraph">${value}</p>`;
          break;
        case 'bullet':
          bulletBuffer.push(value);
          break;
        case 'cta_text':
          // Find the matching cta_button and cta_tab from all lines
          const ctaBtnLine = lines.find((l) => l.toLowerCase().startsWith('cta_button:'));
          const ctaTabLine = lines.find((l) => l.toLowerCase().startsWith('cta_tab:'));
          const ctaLabel = ctaBtnLine
            ? ctaBtnLine.substring(ctaBtnLine.indexOf(':') + 1).trim()
            : 'Get Started';
          const ctaTab = ctaTabLine
            ? ctaTabLine.substring(ctaTabLine.indexOf(':') + 1).trim()
            : 'contact';
          html += `<div class="about-cta"><p class="about-cta-text">${value}</p><a href="#${ctaTab}" class="btn" data-tab="${ctaTab}">${ctaLabel}</a></div>`;
          break;
        case 'cta_button':
        case 'cta_tab':
          break;
        case 'stat':
          // Collect — will handle after loop
          break;
      }
    }
    flushBullets();
    return html;
  }

  async function loadAbout() {
    const raw = await loadContent('about-calisthenics-skill-lab.txt');
    const allSections = parseSections(raw);
    const header = parseKeyValue(allSections[0]);
    const sectionRaws = allSections.slice(1);
    const sections = sectionRaws.map((s) => parseKeyValue(s));
    const stats = header.stat ? (Array.isArray(header.stat) ? header.stat : [header.stat]) : [];

    const headingParts = (header.heading || '').split(' ');
    const accent = headingParts.slice(-2).join(' ');
    const rest = headingParts.slice(0, -2).join(' ');

    // Build text content for a section (shared by all layouts)
    // Renders keys in document order to support interleaved headings/paragraphs/bullets
    function buildSectionText(section, rawBlock) {
      let html = '';

      if (section.section_title)
        html += `<h3 class="about-section-title">${section.section_title}</h3>`;
      if (section.section_subtitle)
        html += `<p class="about-coach-title">${section.section_subtitle}</p>`;
      if (section.section_quote)
        html += `<blockquote class="about-coach-quote">"${section.section_quote}"</blockquote>`;

      // If we have the raw block, render in order
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
        // Fallback: old behavior
        const paragraphs = section.paragraph
          ? Array.isArray(section.paragraph)
            ? section.paragraph
            : [section.paragraph]
          : [];
        const bullets = section.bullet
          ? Array.isArray(section.bullet)
            ? section.bullet
            : [section.bullet]
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

    let sectionsHtml = '';
    let imageIndex = 0; // track alternation only for image sections
    let textOnlyBuffer = []; // collect consecutive text-only sections

    function flushTextOnly() {
      if (textOnlyBuffer.length === 0) return '';
      const html = `
        <div class="about-columns">
          ${textOnlyBuffer.map((s) => `<div class="about-column">${buildSectionText(s)}</div>`).join('\n')}
        </div>
      `;
      textOnlyBuffer = [];
      return html;
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
    el.innerHTML = `
      <h2 class="about-heading">${rest} <span class="accent">${accent}</span></h2>
      ${
        stats.length
          ? `
        <div class="about-stats">
          ${stats
            .map((s) => {
              const [num, label] = s.split('|').map((x) => x.trim());
              return `<div class="stat"><span class="stat-number">${num}</span><span class="stat-label">${label}</span></div>`;
            })
            .join('\n')}
        </div>
      `
          : ''
      }
      ${sectionsHtml}
    `;
  }

  // ---- Services ----
  async function loadServices() {
    const raw = await loadContent('training-menu.txt');
    const sections = parseSections(raw);
    const header = parseKeyValue(sections[0]);
    const cards = sections.slice(1).map((s) => parseKeyValue(s));

    const headingParts = (header.heading || 'Programs').split(' ');
    const lastWord = headingParts.slice(-1)[0];
    const firstWords = headingParts.slice(0, -1).join(' ');

    const el = document.getElementById('services-content');
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

    // Bind card click handlers
    const cardEls = el.querySelectorAll('.service-card');
    let activeIndex = -1;
    const expandedEl = document.getElementById('service-expanded');

    cardEls.forEach((cardEl, i) => {
      cardEl.addEventListener('click', async () => {
        // Toggle: clicking the same card closes it
        if (activeIndex === i) {
          expandedEl.innerHTML = '';
          expandedEl.classList.remove('open');
          cardEl.classList.remove('selected');
          activeIndex = -1;
          return;
        }

        // Remove previous selection
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

        // Load extra sections if configured
        let locationHtml = '';
        let scheduleHtml = '';
        let locationsListHtml = '';
        let pricingHtml = '';

        if (card.include_location === 'true') {
          locationHtml = await buildLocationHtml();
        }
        if (card.schedule_file) {
          scheduleHtml = await buildScheduleHtml(card.schedule_file);
        }
        if (card.location_file) {
          locationsListHtml = await buildLocationsListHtml(card.location_file);
        }
        if (card.pricing_file) {
          pricingHtml = await buildPricingHtml(card.pricing_file);
        }

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

        // Bind CTA buttons inside expanded panel
        expandedEl.querySelectorAll('[data-tab]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(btn.getAttribute('data-tab'));
          });
        });

        // Smooth scroll to expanded section
        expandedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  // ---- Location HTML builder ----
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

  // ---- Locations list HTML builder (multiple locations) ----
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

  // ---- Pricing HTML builder ----
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
                ${parts[2] ? `<span class="pricing-total">${parts[2]}</span>` : ''}
              </div>
            `;
            })
            .join('\n')}
        </div>
        ${data.note ? `<p class="schedule-note">${data.note}</p>` : ''}
      </div>
    `;
  }

  // ---- Schedule HTML builder ----
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

  // ---- Contact ----
  async function loadContact() {
    const raw = await loadContent('contact-info.txt');
    const data = parseKeyValue(raw);
    const options = (data.form_options || '').split('|').map((o) => o.trim());
    const locations = Array.isArray(data.location) ? data.location : [data.location];
    const [instaHandle, instaUrl] = (data.instagram || '').split('|').map((s) => s.trim());

    const isNL = currentLang === 'nl';
    const heading = data.heading || (isNL ? 'Neem contact op' : 'Get in Touch');

    let headingHtml;
    if (isNL) {
      headingHtml = heading;
    } else {
      const parts = heading.split(' ');
      const accent = parts.pop();
      const rest = parts.join(' ');
      headingHtml = `${rest} <span class="accent">${accent}</span>`;
    }

    const labels = {
      name: isNL ? 'Naam' : 'Name',
      email: isNL ? 'E-mail' : 'Email',
      subject: isNL ? 'Onderwerp' : 'Subject',
      message: isNL ? 'Bericht' : 'Message',
      phoneNumber: isNL ? 'Telefoonnummer' : 'Phone Number',
      namePlaceholder: isNL ? 'Uw naam' : 'Your name',
      emailPlaceholder: isNL ? 'uw@email.nl' : 'your@email.com',
      phoneNumberPlaceholder: isNL ? 'Uw telefoonnummer ' : 'Your phone number ',
      subjectPlaceholder: isNL ? 'Waar bent u in geïnteresseerd?' : 'What are you interested in?',
      messagePlaceholder: isNL ? 'Vertel ons over uw doelen...' : 'Tell us about your goals...',
      submit: isNL ? 'Verstuur' : 'Send Message',
    };

    const el = document.getElementById('contact-content');
    el.innerHTML = `
      <h2 class="section-title">${headingHtml}</h2>
      <p class="section-subtitle">${data.subtitle || ''}</p>
      <div class="contact-grid">
        <form id="contact-form" class="contact-form">
          <div class="form-group">
            <label for="name">${labels.name}</label>
            <input type="text" id="name" name="name" required placeholder="${labels.namePlaceholder}">
          </div>
          <div class="form-group">
            <label for="email">${labels.email}</label>
            <input type="email" id="email" name="email" required placeholder="${labels.emailPlaceholder}">
          </div>
          <div class="form-group">
            <label for="phoneNumber">${labels.phoneNumber}</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" required placeholder="${labels.phoneNumberPlaceholder}">
          </div>
          <div class="form-group">
            <label for="subject">${labels.subject}</label>
            <select id="subject" name="subject" required>
              <option value="" disabled selected>${labels.subjectPlaceholder}</option>
              ${options.map((o) => `<option value="${o.toLowerCase()}">${o}</option>`).join('\n')}
            </select>
          </div>
          <div class="form-group">
            <label for="message">${labels.message}</label>
            <textarea id="message" name="message" rows="5" required placeholder="${labels.messagePlaceholder}"></textarea>
          </div>
          <button type="submit" class="btn btn-submit">${labels.submit}</button>
          <div id="form-status" class="form-status"></div>
        </form>
        <div class="contact-info">
          <div class="info-item">
            <h4>${data.location_label || (isNL ? 'Trainingslocaties' : 'Location')}</h4>
            ${locations.map((l) => `<p>${l}</p>`).join('\n')}
          </div>
          <div class="info-item">
            <h4>Email</h4>
            <p>${data.email || ''}</p>
          </div>
          <div class="info-item">
            <h4>${data.social_label || (isNL ? 'Volg ons' : 'Follow Us')}</h4>
            <div class="social-links">
              ${
                instaHandle
                  ? `<a href="${instaUrl}" class="social-link" target="_blank" rel="noopener">${instaHandle}</a>`
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    `;

    // Re-bind form handler after DOM injection
    bindContactForm();
  }

  // ---- Reviews ----
  async function loadReviews() {
    const raw = await loadContent('athlete-reviews.txt');
    const sections = parseSections(raw);
    const header = parseKeyValue(sections[0]);
    const reviews = sections.slice(1).map((s) => parseKeyValue(s));

    const isNL = currentLang === 'nl';
    const fallbackHeading = isNL ? 'Wat onze atleten zeggen' : 'What Our Athletes Say';
    const headingText = header.heading || fallbackHeading;

    let headingHtml;
    if (isNL) {
      headingHtml = headingText;
    } else {
      const parts = headingText.split(' ');
      const accent = parts.pop();
      const rest = parts.join(' ');
      headingHtml = `${rest} <span class="accent">${accent}</span>`;
    }

    const el = document.getElementById('reviews-content');
    el.innerHTML = `
      <h2 class="section-title">${headingHtml}</h2>
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
        <p>${isNL ? 'Bekijk al onze reviews op' : 'See all our reviews on'}</p>
        <a href="${header.google_maps_url || '#'}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">Google Maps</a>
      </div>
    `;
  }

  // ========== CONTACT FORM ==========

function bindContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const phoneInput = document.getElementById('phoneNumber');

  if (!contactForm) return;

  // Phone validation function
  function validatePhoneNumber(phone) {
    if (!phone || phone.trim().length === 0) return false;

    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    const digitCount = cleaned.replace(/\D/g, '').length;

    if (digitCount < 7) return false;

    const patterns = {
      us: /^[\+]?1?[\s\-]?[(]?[\d]{3}[)]?[\s\-]?[\d]{3}[\s\-]?[\d]{4}$/,
      nl: /^[\+]?31[\s\-]?[(]?[\d]{1,3}[)]?[\s\-]?[\d]{0,8}$|^0[\s\-]?[(]?[\d]{1,3}[)]?[\s\-]?[\d]{0,8}$/,
    };

    if (patterns.us.test(phone) || patterns.nl.test(phone)) {
      return true;
    }

    return digitCount >= 7;
  }

  // Real-time validation on blur
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value && !validatePhoneNumber(phoneInput.value)) {
        phoneInput.classList.add('invalid');
      } else {
        phoneInput.classList.remove('invalid');
      }
    });

    // Clear invalid class on input
    phoneInput.addEventListener('input', () => {
      phoneInput.classList.remove('invalid');
    });
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNL = currentLang === 'nl';
    const phoneNumber = phoneInput?.value || '';

    // Validate phone number on submit
    if (!validatePhoneNumber(phoneNumber)) {
      formStatus.textContent = isNL
        ? 'Voer een geldig telefoonnummer in'
        : 'Please enter a valid phone number';
      formStatus.className = 'form-status error';
      phoneInput?.classList.add('invalid');
      return;
    }

    const successMessage = isNL
      ? 'Bericht verzonden! We nemen snel contact op.'
      : "Message sent successfully! We'll get back to you soon.";
    const errorMessage = isNL
      ? 'Er ging iets mis. Probeer het opnieuw.'
      : 'Something went wrong. Please try again.';
    const networkErrorMessage = isNL
      ? 'Netwerkfout. Probeer het opnieuw.'
      : 'Network error. Please try again.';

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phoneNumber: phoneNumber,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    if (!config.formEndpoint) {
      formStatus.textContent = successMessage;
      formStatus.className = 'form-status success';
      phoneInput?.classList.remove('invalid');
      contactForm.reset();
      console.log('Form data (no endpoint configured):', formData);

      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
      return;
    }

    formStatus.textContent = isNL ? 'Bezig met verzenden…' : 'Sending…';
    formStatus.className = 'form-status';

    try {
      const res = await fetch(config.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        formStatus.textContent = errorMessage;
        formStatus.className = 'form-status error';
        return;
      }

      formStatus.textContent = successMessage;
      formStatus.className = 'form-status success';
      phoneInput?.classList.remove('invalid');
      contactForm.reset();
    } catch {
      formStatus.textContent = networkErrorMessage;
      formStatus.className = 'form-status error';
    }

    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  });
}
  // ========== LOAD EVERYTHING ==========

  async function init() {
    await Promise.all([loadHero(), loadAbout(), loadServices(), loadContact(), loadReviews()]);
    // Re-bind tab triggers after dynamic content is injected
    bindTabTriggers();

    // Set up scroll reveal for elements
    initScrollReveal();

    // Activate the correct tab based on the current path (clean URLs)
    const initialTab = getTabFromPath(window.location.pathname);
    switchTab(initialTab);
    updateUrlForTab(initialTab, true);
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.about-section, .service-card, .review-card, .welcome-intro, ' +
        '.about-stats, .about-heading, .intro-heading, .intro-bullets li, ' +
        '.intro-highlight, .location-card, .schedule-table, .pricing-cards'
    );

    revealElements.forEach((el) => el.classList.add('reveal'));

    // Set stagger index on bullet items
    document.querySelectorAll('.intro-bullets').forEach((list) => {
      list.querySelectorAll('li.reveal').forEach((li, i) => {
        li.style.setProperty('--i', i);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  initLanguageToggle();
  bindTabTriggers(); // bind initial nav links
  init();
});
