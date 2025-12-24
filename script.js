document.documentElement.classList.add('js');

const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const whatsappBtn = document.getElementById('whatsapp-btn');
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

if (whatsappBtn && whatsappBtn.tagName === 'A') {
  whatsappBtn.setAttribute('target', '_blank');
  whatsappBtn.setAttribute('rel', 'noopener');
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

const locationStatus = document.querySelector('.location-status');
const openStatus = document.getElementById('open-status');
const openDot = document.getElementById('open-dot');

const weeklyHours = [
  { open: 8 * 60, close: 14 * 60 },   // Sunday
  { open: 7 * 60, close: 17 * 60 + 30 }, // Monday
  { open: 7 * 60, close: 17 * 60 + 30 }, // Tuesday
  { open: 7 * 60, close: 17 * 60 + 30 }, // Wednesday
  { open: 7 * 60, close: 17 * 60 + 30 }, // Thursday
  { open: 7 * 60, close: 17 * 60 + 30 }, // Friday
  { open: 7 * 60, close: 15 * 60 }    // Saturday
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime = (mins) => {
  const hours = Math.floor(mins / 60);
  const minutes = String(mins % 60).padStart(2, '0');
  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

const updateOpenStatus = () => {
  if (!openStatus || !locationStatus || !openDot) return;
  const now = new Date();
  const day = now.getDay();
  const today = weeklyHours[day];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isOpen = nowMinutes >= today.open && nowMinutes < today.close;
  locationStatus.classList.toggle('is-closed', !isOpen);

  if (isOpen) {
    openStatus.textContent = `Open now - closes ${formatTime(today.close)}`;
  } else {
    let nextDay = day;
    let nextOpen = today.open;
    if (nowMinutes >= today.close) {
      for (let i = 1; i <= 7; i += 1) {
        const candidate = (day + i) % 7;
        if (weeklyHours[candidate]) {
          nextDay = candidate;
          nextOpen = weeklyHours[candidate].open;
          break;
        }
      }
    }
    const dayLabel = nextDay === day ? 'today' : dayNames[nextDay];
    openStatus.textContent = `Closed - opens ${dayLabel} ${formatTime(nextOpen)}`;
  }

  const statusSub = locationStatus.querySelector('.status-sub');
  if (statusSub) {
    statusSub.textContent = 'Mon-Fri 07:00-17:30 | Sat 07:00-15:00 | Sun 08:00-14:00';
  }
};

updateOpenStatus();

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
    carouselToggle.setAttribute('aria-label', 'Play carousel');
  }
  carouselToggle.addEventListener('click', () => {
    const pressed = carouselToggle.getAttribute('aria-pressed') === 'true';
    if (pressed) {
      // currently paused -> play
      userPaused = false;
      carouselToggle.setAttribute('aria-pressed', 'false');
      carouselToggle.textContent = 'Pause';
      carouselToggle.setAttribute('aria-label', 'Pause carousel');
      startCarousel();
    } else {
      userPaused = true;
      carouselToggle.setAttribute('aria-pressed', 'true');
      carouselToggle.textContent = 'Play';
      carouselToggle.setAttribute('aria-label', 'Play carousel');
      stopCarousel();
    }
  });
}

// Stop rotation when page is hidden to save resources
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopCarousel(); else if (!userPaused && !prefersReduced) startCarousel();
});

/* ===== Simple FAQ Chatbot Logic ===== */
const chatToggle = document.querySelector('.chatbot-toggle');
const chatPanel = document.querySelector('.chatbot-panel');
const chatClose = document.querySelector('.chatbot-close');
const chatBody = document.querySelector('.chatbot-body');
const chatForm = document.querySelector('.chatbot-form');
const chatInput = document.querySelector('.chatbot-input');
const chatSuggests = document.querySelectorAll('.chatbot-suggestions button');
const chatNavToggle = document.querySelector('.chatbot-nav-toggle');

const rates = { wash_dry_iron: 37, wash_dry: 35, wash_only: 30, iron_only: 33 };

const estimateRange = document.getElementById('estimate-range');
const estimateKg = document.getElementById('estimate-kg');
const estimateTotal = document.getElementById('estimate-total');
const estimateOptions = document.querySelectorAll('input[name="estimate-service"]');

const updateEstimate = () => {
  if (!estimateRange || !estimateKg || !estimateTotal) return;
  const kg = Number(estimateRange.value);
  const selected = document.querySelector('input[name="estimate-service"]:checked');
  const rateKey = selected ? selected.value : 'wash_dry_iron';
  const rate = rates[rateKey] || rates.wash_dry_iron;
  const total = (kg * rate).toFixed(2);
  estimateKg.textContent = String(kg);
  estimateTotal.textContent = `R${total}`;
};

if (estimateRange) {
  estimateRange.addEventListener('input', updateEstimate);
}

estimateOptions.forEach((option) => {
  option.addEventListener('change', updateEstimate);
});

updateEstimate();

function appendMessage(text, who = 'bot'){
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.textContent = text;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function openChat(){
  chatPanel.setAttribute('aria-hidden','false');
  chatToggle.setAttribute('aria-expanded','true');
  if (chatInput) {
    chatInput.focus();
  } else {
    chatPanel.focus();
  }
  // greet
  setTimeout(() => appendMessage('Hi! I can help with hours, quick pricing estimates, or booking. Try: "Hours" or "Pricing estimate".'), 250);
}

function closeChat(){
  chatPanel.setAttribute('aria-hidden','true');
  chatToggle.setAttribute('aria-expanded','false');
}

if(chatToggle && chatPanel){
  chatToggle.addEventListener('click', ()=>{ if(chatPanel.getAttribute('aria-hidden')==='false') closeChat(); else openChat(); });
}
if(chatNavToggle && chatPanel){
  chatNavToggle.addEventListener('click', ()=>{ if(chatPanel.getAttribute('aria-hidden')==='false') closeChat(); else openChat(); });
}
if(chatClose){ chatClose.addEventListener('click', closeChat); }

// Suggestion buttons
chatSuggests.forEach(btn => {
  btn.addEventListener('click', (e)=> handleUserMessage(btn.dataset.suggest));
});

function handleUserMessage(raw){
  if(!raw) return;
  // show user
  appendMessage(raw, 'user');

  const lower = String(raw).toLowerCase().trim();

  if (lower === 'hours' || lower.includes('hour')) {
    appendMessage('Hours: Mon-Fri 07:00-17:30, Sat 07:00-15:00, Sun 08:00-14:00. Drop-offs accepted during opening hours.');
    return;
  }

  if(lower === 'contact' || lower.includes('contact')){
    appendMessage('You can call us at +27 63 302 8521 or WhatsApp via the site.');
    return;
  }

  if (lower.includes('book') || lower.includes('booking') || lower === 'book') {
    appendMessage('Great - click Book a load or I can open the booking section for you.');
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  if(lower.includes('price') || lower.includes('estimate') || lower === 'pricing'){
    appendMessage('How many kilograms would you like estimated for? (e.g., 5kg)');
    // expect numeric response next
    chatForm.dataset.expect = 'kg';
    return;
  }

  // If expecting kg
  if(chatForm.dataset.expect === 'kg'){
    const num = Number(raw.replace(/[a-zA-Z\s]/g,''));
    if(!isFinite(num) || num <=0){ appendMessage('Sorry, I did not understand the weight. Please reply with kilograms only (e.g., 7).'); return; }
    const total = (num * rates.wash_dry_iron).toFixed(2);
    appendMessage(`Estimated price for ${num} kg (Wash, dry & iron) is approx R${total} (incl. VAT depends on service). Want to book this?`);
    chatForm.dataset.expect = '';
    return;
  }

  // fallback answers
  if(lower.length < 4) { appendMessage('Could you please add a few more words? (e.g., "Hours" or "5kg estimate")'); return; }
  appendMessage('I can help with hours, quick pricing estimates (e.g., "5kg"), or booking - try one of those or click a suggestion.');
}

// form submit
if(chatForm){
  chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;
    handleUserMessage(text);
    chatInput.value = '';
    chatInput.focus();
  });
}

// Simple keyboard to close chat with Escape
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && chatPanel && chatPanel.getAttribute('aria-hidden') === 'false') { closeChat(); chatToggle && chatToggle.focus(); } });

const revealItems = document.querySelectorAll('.reveal');
if (revealItems.length) {
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
}

/* Ensure chatbot isn't hidden by the footer: move it up when footer is visible */
const chatWidget = document.querySelector('.chatbot');
const pageFooter = document.querySelector('.footer');
if (chatWidget && pageFooter && 'IntersectionObserver' in window) {
  const isTopAnchored = () => window.getComputedStyle(chatWidget).top !== 'auto';
  const footerObserver = new IntersectionObserver((entries) => {
    if (isTopAnchored()) {
      chatWidget.style.bottom = '';
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const visible = Math.max(0, window.innerHeight - entry.boundingClientRect.top);
        const gap = 18;
        chatWidget.style.bottom = `${visible + gap}px`;
      } else {
        chatWidget.style.bottom = '';
      }
    });
  }, { threshold: [0, 0.01, 0.1, 0.5, 1] });

  footerObserver.observe(pageFooter);

  // also reset on resize to be safe
  window.addEventListener('resize', () => {
    if (isTopAnchored()) {
      chatWidget.style.bottom = '';
      return;
    }
    const rect = pageFooter.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const visible = Math.max(0, window.innerHeight - rect.top);
      chatWidget.style.bottom = `${visible + 18}px`;
    } else {
      chatWidget.style.bottom = '';
    }
  });
}
