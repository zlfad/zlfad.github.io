/* ===========================================
   Zulfadli Portfolio — script.js
   Features: Navbar scroll, mobile menu,
             scroll-reveal, copy-to-clipboard
   =========================================== */

(function () {
  'use strict';

  /* ----------------------------------------
     1. NAVBAR — scroll state + active link
  ---------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Frosted glass on scroll
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active section in nav
    let current = '';
    sections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = sec.getAttribute('id');
    });

    navLinks.forEach((link) => {
      link.classList.remove('nav-link--active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('nav-link--active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ----------------------------------------
     2. MOBILE HAMBURGER MENU
  ---------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu on link click
  navLinksEl.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ----------------------------------------
     3. SCROLL-REVEAL ANIMATION
  ---------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings by their index
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let idx = 0;
          siblings.forEach((el, i) => { if (el === entry.target) idx = i; });

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------
     4. COPY TO CLIPBOARD (Phone number)
  ---------------------------------------- */
  const copyBtn = document.getElementById('contact-phone');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = copyBtn.getAttribute('data-copy');
      const toast = copyBtn.querySelector('.copy-toast');

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      // Show toast
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    });
  }

  /* ----------------------------------------
     5. ACTIVE NAV LINK STYLES
     (injected via JS to avoid CSS specificity issues)
  ---------------------------------------- */
  const style = document.createElement('style');
  style.textContent = `
    .nav-link--active {
      color: #f0f0f0 !important;
    }
  `;
  document.head.appendChild(style);

  /* ----------------------------------------
     6. PREMIUM SMOOTH SCROLL
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (!target) return;
      
      e.preventDefault();
      
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 64; // 64px offset for navbar
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let start = null;
      
      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        // easeInOutCubic easing
        let t = progress / (duration / 2);
        let y = 0;
        if (t < 1) {
          y = (distance / 2) * t * t * t + startPosition;
        } else {
          t -= 2;
          y = (distance / 2) * (t * t * t + 2) + startPosition;
        }
        
        window.scrollTo(0, y);
        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      }
      
      window.requestAnimationFrame(step);
    });
  });

  /* ----------------------------------------
     7. HERO BG TEXT — pause on hover
  ---------------------------------------- */
  const heroBgScroll = document.querySelector('.hero-bg-scroll');
  if (heroBgScroll) {
    heroBgScroll.addEventListener('mouseenter', () => {
      heroBgScroll.style.animationPlayState = 'paused';
    });
    heroBgScroll.addEventListener('mouseleave', () => {
      heroBgScroll.style.animationPlayState = 'running';
    });
  }

  /* ----------------------------------------
     8. SKILL PILLS — subtle entrance stagger
  ---------------------------------------- */
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pills = entry.target.querySelectorAll('.skill-pill');
          pills.forEach((pill, i) => {
            pill.style.transitionDelay = `${i * 40}ms`;
            pill.style.opacity = '0';
            pill.style.transform = 'scale(0.85)';
            // Force reflow
            void pill.offsetHeight;
            pill.style.transition = `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms, background 0.3s, color 0.3s, border-color 0.3s`;
            pill.style.opacity = '1';
            pill.style.transform = 'scale(1)';
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillCards.forEach((card) => skillObserver.observe(card));

  /* ----------------------------------------
     9. CUSTOM CURSOR
  ---------------------------------------- */
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    
    const hoverElements = document.querySelectorAll('a, button, .bento-card, .project-card, .skill-card, .contact-card, .contact-cta-circle');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ----------------------------------------
     10. 3D TILT EFFECT
  ---------------------------------------- */
  const tiltCards = document.querySelectorAll('.project-card, .bento-card, .skill-card, .contact-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      card.style.transition = 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
    });
  });

  /* ----------------------------------------
     11. MAGNETIC BUTTONS
  ---------------------------------------- */
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const position = btn.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });
    btn.addEventListener('mouseleave', function(e) {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    btn.addEventListener('mouseenter', function(e) {
      btn.style.transition = 'none';
    });
  });

  /* ----------------------------------------
     12. TYPEWRITER EFFECT
  ---------------------------------------- */
  const heroNameEl = document.getElementById('hero-name-typewriter');
  if (heroNameEl) {
    const line1Text = heroNameEl.getAttribute('data-line1');
    const line2Text = heroNameEl.getAttribute('data-line2');
    const line1Span = heroNameEl.querySelector('.tw-line1');
    const line2Span = heroNameEl.querySelector('.tw-line2');
    
    // Clear text initially for typing
    line1Span.textContent = '';
    line2Span.textContent = '';
    
    let i = 0;
    const typeLine1 = () => {
      if (i < line1Text.length) {
        line1Span.textContent += line1Text.charAt(i);
        i++;
        setTimeout(typeLine1, 100);
      } else {
        line1Span.classList.remove('typing-cursor');
        line2Span.classList.add('typing-cursor');
        i = 0;
        setTimeout(typeLine2, 200);
      }
    };
    
    const typeLine2 = () => {
      if (i < line2Text.length) {
        line2Span.textContent += line2Text.charAt(i);
        i++;
        setTimeout(typeLine2, 100);
      } else {
        // Keep the blinking cursor at the end for the tech vibe
      }
    };
    
    // Start typing after the initial load animation delay
    setTimeout(() => {
      line1Span.classList.add('typing-cursor');
      typeLine1();
    }, 1200);
  }

})();
