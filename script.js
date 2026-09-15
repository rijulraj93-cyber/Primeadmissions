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
  submit.innerHTML = 'Shortlist request received <span>✓</span>';
  submit.disabled = true;
  formNote.textContent = 'A counsellor will reach out shortly.';
  formNote.style.color = '#5fc7d1';
});

document.querySelectorAll('.save-button').forEach((button) => button.addEventListener('click', () => {
  button.classList.toggle('saved');
  button.textContent = button.classList.contains('saved') ? '♥' : '♡';
}));

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
    fullSubmit.innerHTML = 'Shortlist request received <span>✓</span>';
    fullSubmit.disabled = true;
    fullNote.textContent = 'A counsellor will reach out shortly.';
    fullNote.style.color = '#5fc7d1';
  });
}