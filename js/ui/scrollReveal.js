/**
 * Scroll reveal: animate elements when they enter the viewport.
 */

export function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.about-section, .service-card, .review-card, .welcome-intro, ' +
      '.about-stats, .about-heading, .intro-heading, .intro-bullets li, ' +
      '.intro-highlight, .location-card, .schedule-table, .pricing-cards'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

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
