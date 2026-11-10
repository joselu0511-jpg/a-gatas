'use strict';

(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#menu');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const setMenu = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? 'Cerrar menú' : 'Abrir menú';
    header.classList.toggle('menu-open', open);
    if (restoreFocus) toggle.focus();
  };
  if (toggle && nav && header) {
    toggle.hidden = false;
    header.classList.add('menu-enhanced');
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) setMenu(false);
    });
    header.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (!header.contains(document.activeElement)) setMenu(false);
      });
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
  }
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => {
      item.classList.add('will-reveal');
      observer.observe(item);
    });
    motion.addEventListener('change', event => {
      if (event.matches) {
        observer.disconnect();
        revealItems.forEach(item => item.classList.add('is-visible'));
      }
    });
  }

  if ('IntersectionObserver' in window && nav) {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => activeObserver.observe(section));
  }
})();
