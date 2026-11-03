/* ==========================================================
   docs.js
   highlights the gantry junction for the section you're reading.
   ========================================================== */

(() => {
  'use strict';

  const docSections = document.querySelectorAll('.section[id]');
  const docLinks = document.querySelectorAll('.sidebar a[href^="#"]');

  function updateActiveLink() {
    let currentId = '';
    docSections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 140) currentId = section.id;
    });
    docLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();
