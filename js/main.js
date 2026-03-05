/* ============================================
   UPR PARA EL PUEBLO — v2 JS
   ============================================ */

(function () {
  'use strict';

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  reveals.forEach((el) => revealObs.observe(el));

  // ---- NAV SCROLL ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ---- MOBILE MENU ----
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- DRAG-TO-SCROLL for horizontal sections ----
  function enableDragScroll(el) {
    let isDown = false;
    let startX, scrollLeft;

    el.addEventListener('mousedown', (e) => {
      isDown = true;
      el.classList.add('grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });
    el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('grabbing'); });
    el.addEventListener('mouseup', () => { isDown = false; el.classList.remove('grabbing'); });
    el.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX);
    });
  }

  const galeriaScroll = document.getElementById('galeriaScroll');
  const cronoScroll = document.getElementById('cronoScroll');
  if (galeriaScroll) enableDragScroll(galeriaScroll);
  if (cronoScroll) enableDragScroll(cronoScroll);

  // ---- LIGHTBOX ----
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const items = document.querySelectorAll('.galeria-item');
  let cur = 0;
  let dragMoved = false;

  // Track if mouse moved during drag (to avoid opening lightbox on drag)
  if (galeriaScroll) {
    galeriaScroll.addEventListener('mousedown', () => { dragMoved = false; });
    galeriaScroll.addEventListener('mousemove', () => { dragMoved = true; });
  }

  function openLB(i) {
    cur = i;
    const item = items[i];
    lbImg.src = item.dataset.full;
    lbImg.alt = item.querySelector('img').alt;
    lbCaption.textContent = item.querySelector('figcaption').textContent;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  function nextLB() { cur = (cur + 1) % items.length; openLB(cur); }
  function prevLB() { cur = (cur - 1 + items.length) % items.length; openLB(cur); }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (!dragMoved) openLB(i);
    });
  });

  lightbox.querySelector('.lb-close').addEventListener('click', closeLB);
  lightbox.querySelector('.lb-next').addEventListener('click', nextLB);
  lightbox.querySelector('.lb-prev').addEventListener('click', prevLB);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowRight') nextLB();
    if (e.key === 'ArrowLeft') prevLB();
  });

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

})();
