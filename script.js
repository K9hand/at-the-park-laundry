const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const callBtn = document.getElementById('call-btn');
const contactForm = document.querySelector('.cta-form');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

if (callBtn) {
  callBtn.addEventListener('click', () => {
    const number = '+19175551212';
    window.location.href = `sms:${number}?body=Hi%20Park%20Laundry%2C%20I%27d%20like%20to%20book%20a%20wash.%20`;
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    if (button) {
      button.textContent = 'Request sent!';
      button.disabled = true;
    }
    const existingNote = contactForm.querySelector('.submission-note');
    if (!existingNote) {
      const note = document.createElement('p');
      note.className = 'small-print submission-note';
      note.textContent = 'Thanks! We will confirm by text within a few minutes.';
      const callout = contactForm.querySelector('.small-print:last-of-type');
      if (callout) {
        contactForm.insertBefore(note, callout);
      } else {
        contactForm.appendChild(note);
      }
    }
  });
}

const heroCarousel = document.querySelector('.hero-carousel');
const slides = document.querySelectorAll('.hero-carousel .slide');
const dots = document.querySelectorAll('.hero-carousel .dot');
const prevControl = document.querySelector('.carousel-control.prev');
const nextControl = document.querySelector('.carousel-control.next');
const carouselToggle = document.querySelector('.carousel-toggle');
const carouselLive = document.querySelector('.carousel-live');
let carouselIndex = 0;
let carouselTimer;
let userPaused = false;
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setSlide = (index) => {
  if (!slides.length) return;
  const nextIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === nextIndex);
    slide.setAttribute('aria-hidden', i === nextIndex ? 'false' : 'true');
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === nextIndex);
    dot.setAttribute('aria-selected', i === nextIndex ? 'true' : 'false');
  });
  carouselIndex = nextIndex;
  // update live region with slide info
  if (carouselLive) {
    const current = slides[nextIndex];
    let text = `Slide ${nextIndex + 1} of ${slides.length}`;
    const cap = current.querySelector('figcaption');
    if (cap && cap.textContent.trim()) text += `: ${cap.textContent.trim()}`;
    else {
      const img = current.querySelector('img');
      if (img && img.alt) text += `: ${img.alt}`;
    }
    carouselLive.textContent = text;
  }
};

const nextSlide = (step = 1) => setSlide(carouselIndex + step);

const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = undefined;
  }
};

const startCarousel = () => {
  if (prefersReduced || userPaused) return;
  stopCarousel();
  carouselTimer = setInterval(() => nextSlide(1), 5200);
};

if (slides.length) {
  // Start carousel unless user prefers reduced motion
  if (!prefersReduced) startCarousel();

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.index || 0);
      setSlide(index);
      // user interaction pauses auto-rotation until explicitly resumed
      userPaused = true;
      if (carouselToggle) {
        carouselToggle.setAttribute('aria-pressed', 'true');
        carouselToggle.textContent = 'Play';
      }
      stopCarousel();
    });
  });

  if (prevControl) {
    prevControl.addEventListener('click', () => {
      nextSlide(-1);
      userPaused = true;
      if (carouselToggle) {
        carouselToggle.setAttribute('aria-pressed', 'true');
        carouselToggle.textContent = 'Play';
      }
      stopCarousel();
    });
  }

  if (nextControl) {
    nextControl.addEventListener('click', () => {
      nextSlide(1);
      userPaused = true;
      if (carouselToggle) {
        carouselToggle.setAttribute('aria-pressed', 'true');
        carouselToggle.textContent = 'Play';
      }
      stopCarousel();
    });
  }

  if (heroCarousel) {
    heroCarousel.addEventListener('mouseenter', () => { stopCarousel(); });
    heroCarousel.addEventListener('mouseleave', () => { if (!userPaused) startCarousel(); });
    // Pause on focus within carousel and resume on blur (if not user paused)
    heroCarousel.addEventListener('focusin', () => { stopCarousel(); });
    heroCarousel.addEventListener('focusout', () => { if (!userPaused) startCarousel(); });

    // Keyboard support when the carousel (or its children) is focused
    heroCarousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); nextSlide(-1); userPaused = true; stopCarousel(); if (carouselToggle) { carouselToggle.setAttribute('aria-pressed','true'); carouselToggle.textContent='Play'; } }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(1); userPaused = true; stopCarousel(); if (carouselToggle) { carouselToggle.setAttribute('aria-pressed','true'); carouselToggle.textContent='Play'; } }
      if (e.key === ' ' || e.key === 'Spacebar') { // toggle pause/play
        e.preventDefault();
        if (carouselToggle) carouselToggle.click();
      }
    });
  }
}

// Pause / Play toggle button
if (carouselToggle) {
  // initialize according to reduced-motion
  if (prefersReduced) {
    userPaused = true;
    carouselToggle.setAttribute('aria-pressed', 'true');
    carouselToggle.textContent = 'Play';
  }
  carouselToggle.addEventListener('click', () => {
    const pressed = carouselToggle.getAttribute('aria-pressed') === 'true';
    if (pressed) {
      // currently paused -> play
      userPaused = false;
      carouselToggle.setAttribute('aria-pressed', 'false');
      carouselToggle.textContent = 'Pause';
      startCarousel();
    } else {
      userPaused = true;
      carouselToggle.setAttribute('aria-pressed', 'true');
      carouselToggle.textContent = 'Play';
      stopCarousel();
    }
  });
}

// Stop rotation when page is hidden to save resources
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopCarousel(); else if (!userPaused && !prefersReduced) startCarousel();
});
