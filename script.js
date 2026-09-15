const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-trigger');
const mobileMenu = document.querySelector('.mobile-menu');
const course = document.querySelector('#course');
const submit = document.querySelector('.form-submit');
const formNote = document.querySelector('#form-note');

const brandTextWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (brandTextWalker.nextNode()) {
  brandTextWalker.currentNode.nodeValue = brandTextWalker.currentNode.nodeValue.replace(/\bPrime Admission\b/g, 'Prime Admissions');
}

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 12));

menuButton.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});

document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}));

course.addEventListener('change', () => { submit.disabled = !course.value; });

document.querySelector('#finder-form').addEventListener('submit', (event) => {
  event.preventDefault();
  trackEvent('finder_submit', { variant: 'hero' });
  submit.innerHTML = 'Shortlist request received <span>✓</span>';
  submit.disabled = true;
  formNote.textContent = 'A counsellor will reach out shortly.';
  formNote.style.color = '#5fc7d1';
});

document.querySelectorAll('.save-button').forEach((button) => button.addEventListener('click', () => {
  button.classList.toggle('saved');
  button.textContent = button.classList.contains('saved') ? '♥' : '♡';
}));

const analyticsKey = 'prime-admissions-analytics-consent';
const eventsKey = 'prime-admissions-analytics-events';
const consentBanner = document.querySelector('#privacy-consent');
const analyticsSession = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function analyticsEnabled() {
  return localStorage.getItem(analyticsKey) === 'accepted';
}

function trackEvent(name, details = {}) {
  if (!analyticsEnabled()) return;
  const events = JSON.parse(localStorage.getItem(eventsKey) || '[]');
  events.push({ name, details, session: analyticsSession, timestamp: new Date().toISOString(), path: location.pathname });
  localStorage.setItem(eventsKey, JSON.stringify(events.slice(-500)));
}

function setAnalyticsConsent(value) {
  localStorage.setItem(analyticsKey, value);
  consentBanner.hidden = true;
  if (value === 'accepted') trackEvent('consent_granted');
}

if (!localStorage.getItem(analyticsKey)) consentBanner.hidden = false;
document.querySelector('.privacy-accept').addEventListener('click', () => setAnalyticsConsent('accepted'));
document.querySelector('.privacy-decline').addEventListener('click', () => setAnalyticsConsent('declined'));
document.addEventListener('click', (event) => {
  const target = event.target.closest('a, button');
  if (!target || target.closest('#privacy-consent')) return;
  trackEvent('interaction', { type: target.tagName.toLowerCase(), label: target.innerText.trim().slice(0, 80), id: target.id || null, href: target.href || null });
});
trackEvent('page_view', { referrer: document.referrer || null, viewport: `${window.innerWidth}x${window.innerHeight}` });
window.primeAdmissionsAnalyticsExport = () => {
  const file = new Blob([localStorage.getItem(eventsKey) || '[]'], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = 'prime-admissions-analytics.json';
  link.click();
  URL.revokeObjectURL(link.href);
};

// Header search overlay
const searchTrigger = document.querySelector('.search-trigger');
const searchOverlay = document.querySelector('#search-overlay');
const searchClose = document.querySelector('.search-close');
const searchInput = document.querySelector('#search-input');

function openSearch() {
  searchOverlay.hidden = false;
  searchTrigger.setAttribute('aria-expanded', 'true');
  searchInput.focus();
}
function closeSearch() {
  searchOverlay.hidden = true;
  searchTrigger.setAttribute('aria-expanded', 'false');
}
if (searchTrigger) {
  searchTrigger.addEventListener('click', () => {
    searchOverlay.hidden ? openSearch() : closeSearch();
  });
  searchClose.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !searchOverlay.hidden) closeSearch(); });
  document.querySelector('#search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    // In production, route to /search?q=<value>. For now, jump to Popular Colleges as a placeholder result view.
    if (searchInput.value.trim()) {
      document.querySelector('#options').scrollIntoView({ behavior: 'smooth' });
      closeSearch();
    }
  });
}

// Full College Finder panel: priority chips (max 2) + submit
const chipGroup = document.querySelector('.chip-group');
if (chipGroup) {
  const chips = Array.from(chipGroup.querySelectorAll('.chip'));
  chips.forEach((chip) => chip.setAttribute('aria-pressed', 'false'));
  chipGroup.addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    const pressed = chip.getAttribute('aria-pressed') === 'true';
    const activeCount = chips.filter((c) => c.getAttribute('aria-pressed') === 'true').length;
    if (!pressed && activeCount >= 2) return;
    chip.setAttribute('aria-pressed', String(!pressed));
  });
}

const pfCourse = document.querySelector('#pf-course');
const fullFinderForm = document.querySelector('#full-finder-form');
if (fullFinderForm) {
  const fullSubmit = fullFinderForm.querySelector('.form-submit');
  const fullNote = document.querySelector('#full-form-note');
  pfCourse.addEventListener('change', () => { fullSubmit.disabled = !pfCourse.value; });
  fullFinderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    trackEvent('finder_submit', { variant: 'full_panel' });
    fullSubmit.innerHTML = 'Shortlist request received <span>✓</span>';
    fullSubmit.disabled = true;
    fullNote.textContent = 'A counsellor will reach out shortly.';
    fullNote.style.color = '#5fc7d1';
  });
}