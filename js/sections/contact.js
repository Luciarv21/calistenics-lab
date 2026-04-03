/**
 * Contact section: form and contact info.
 */

import { config } from '../config.js';
import { t } from '../i18n/strings.js';
import { loadContent } from '../utils/contentLoader.js';
import { parseKeyValue } from '../utils/parse.js';

function bindContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phoneNumber: document.getElementById('phoneNumber').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    if (config.formEndpoint) {
      try {
        const res = await fetch(config.formEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          formStatus.textContent = t('form.success');
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          formStatus.textContent = 'Something went wrong. Please try again.';
          formStatus.className = 'form-status error';
        }
      } catch {
        formStatus.textContent = 'Network error. Please try again.';
        formStatus.className = 'form-status error';
      }
    } else {
      formStatus.textContent = t('form.success');
      formStatus.className = 'form-status success';
      contactForm.reset();
      console.log('Form data (no endpoint configured):', formData);
    }

    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  });
}

export default async function loadContact() {
  const raw = await loadContent('contact-info.txt');
  const data = parseKeyValue(raw);
  const options = (data.form_options || '').split('|').map((o) => o.trim());
  const locations = Array.isArray(data.location) ? data.location : [data.location];
  const [instaHandle, instaUrl] = (data.instagram || '').split('|').map((s) => s.trim());

  const el = document.getElementById('contact-content');
  if (!el) return;

  el.innerHTML = `
    <h2 class="section-title">Get in <span class="accent">Touch</span></h2>
    <p class="section-subtitle">${data.subtitle || ''}</p>
    <div class="contact-grid">
      <form id="contact-form" class="contact-form">
        <div class="form-group">
          <label for="name">${t('form.name')}</label>
          <input type="text" id="name" name="name" required placeholder="${t('form.namePlaceholder')}">
        </div>
        <div class="form-group">
          <label for="email">${t('form.email')}</label>
          <input type="email" id="email" name="email" required placeholder="${t('form.emailPlaceholder')}">
        </div>
        <div class="form-group">
          <label for="phoneNumber">${t('form.phoneNumber')}</label>
          <input type="tel" id="phone" name="phoneNumber" required placeholder="${t('form.phoneNumberPlaceholder')}">
        </div>
        <div class="form-group">
          <label for="subject">${t('form.subject')}</label>
          <select id="subject" name="subject" required>
            <option value="" disabled selected>${t('form.subjectPlaceholder')}</option>
            ${options.map((o) => `<option value="${o.toLowerCase()}">${o}</option>`).join('\n')}
          </select>
        </div>
        <div class="form-group">
          <label for="message">${t('form.message')}</label>
          <textarea id="message" name="message" rows="5" required placeholder="${t('form.messagePlaceholder')}"></textarea>
        </div>
        <button type="submit" class="btn btn-submit">${t('form.submit')}</button>
        <div id="form-status" class="form-status" aria-live="polite"></div>
      </form>
      <div class="contact-info">
        <div class="info-item">
          <h4>${data.location_label || t('contact.locationLabel')}</h4>
          ${locations.map((l) => `<p>${l}</p>`).join('\n')}
        </div>
        <div class="info-item">
          <h4>Email</h4>
          <p>${data.email || ''}</p>
        </div>
        <div class="info-item">
          <h4>${data.social_label || t('contact.socialLabel')}</h4>
          <div class="social-links">
            ${instaHandle ? `<a href="${instaUrl}" class="social-link" target="_blank" rel="noopener">${instaHandle}</a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  bindContactForm();
}
