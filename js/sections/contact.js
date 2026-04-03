/**
 * Contact section: form and contact info.
 */

import { config } from '../config.js';
import { t } from '../i18n/strings.js';
import { loadContent } from '../utils/contentLoader.js';
import { parseKeyValue } from '../utils/parse.js';

/**
 * Validates phone number with support for US and Netherlands formats
 * Accepts common formats with spaces, dashes, parentheses, and country codes
 */
function validatePhoneNumber(phone) {
  if (!phone || phone.trim().length === 0) return false;
  
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Check if it contains at least 7 digits (minimum for most countries)
  const digitCount = cleaned.replace(/\D/g, '').length;
  
  if (digitCount < 7) return false;
  
  // Regex patterns for specific countries (optional check)
  const patterns = {
    // US/Canada: (123) 456-7890, 123-456-7890, +1 123 456 7890, etc.
    us: /^[\+]?1?[\s\-]?[(]?[\d]{3}[)]?[\s\-]?[\d]{3}[\s\-]?[\d]{4}$/,
    // Netherlands: +31 6 12345678, 06 12345678, 0612345678, etc.
    nl: /^[\+]?31[\s\-]?[(]?[\d]{1,3}[)]?[\s\-]?[\d]{0,8}$|^0[\s\-]?[(]?[\d]{1,3}[)]?[\s\-]?[\d]{0,8}$/,
  };
  
  // Try to match specific patterns first
  if (patterns.us.test(phone) || patterns.nl.test(phone)) {
    return true;
  }
  
  // Fallback: any format with 7+ digits is acceptable
  return digitCount >= 7;
}

function bindContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const phoneInput = document.getElementById('phoneNumber');
  console.log('Phone input element:', phoneInput);
  console.log('Contact form found:', contactForm);
  if (!contactForm) return;

  // Real-time validation feedback on phone input
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value && !validatePhoneNumber(phoneInput.value)) {
        phoneInput.classList.add('invalid');
      } else {
        phoneInput.classList.remove('invalid');
      }
    });

    phoneInput.addEventListener('input', () => {
      phoneInput.classList.remove('invalid');
    });
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phoneNumber = phoneInput?.value || '';
    const isNL = document.documentElement.lang === 'nl' || document.querySelector('.nav-link.active')?.textContent?.includes('Nederlands');

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      formStatus.textContent = isNL
        ? 'Voer een geldig telefoonnummer in'
        : 'Please enter a valid phone number';
      formStatus.className = 'form-status error';
      phoneInput?.classList.add('invalid');
      return;
    }

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phoneNumber: phoneNumber,
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
          phoneInput?.classList.remove('invalid');
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
      phoneInput?.classList.remove('invalid');
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
          <input type="tel" id="phoneNumber" name="phoneNumber" required placeholder="${t('form.phoneNumberPlaceholder')}" pattern="[0-9\s\-\+\(\)]+">
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