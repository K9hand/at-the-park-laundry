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
let carouselIndex = 0;
let carouselTimer;

const setSlide = (index) => {
  if (!slides.length) return;
  const nextIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === nextIndex);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === nextIndex);
  });
  carouselIndex = nextIndex;
};

const nextSlide = (step = 1) => setSlide(carouselIndex + step);

const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = undefined;
  }
};

const startCarousel = () => {
  stopCarousel();
  carouselTimer = setInterval(() => nextSlide(1), 5200);
};

if (slides.length) {
  startCarousel();

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.index || 0);
      setSlide(index);
      startCarousel();
    });
  });

  if (prevControl) {
    prevControl.addEventListener('click', () => {
      nextSlide(-1);
      startCarousel();
    });
  }

  if (nextControl) {
    nextControl.addEventListener('click', () => {
      nextSlide(1);
      startCarousel();
    });
  }

  if (heroCarousel) {
    heroCarousel.addEventListener('mouseenter', stopCarousel);
    heroCarousel.addEventListener('mouseleave', startCarousel);
  }
}
