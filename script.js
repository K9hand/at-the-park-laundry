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
  chatPanel.focus();
  // greet
  setTimeout(()=>appendMessage('Hi — I can help with hours, quick pricing estimates, or booking. Try: "Hours" or "Pricing estimate"'),250);
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

  if(lower === 'hours' || lower.includes('hour')){
    appendMessage('We are open Mon–Fri 08:00–18:00, Sat 08:00–14:00, Sun closed. Drop-offs accepted during opening hours.');
    return;
  }

  if(lower === 'contact' || lower.includes('contact')){
    appendMessage('You can call us at (917) 555-1212 or WhatsApp via the site.');
    return;
  }

  if(lower.includes('book') || lower.includes('booking') || lower === 'book'){
    appendMessage('Great — click Book a load or I can open the booking section for you.');
    document.querySelector('.cta') && document.querySelector('.cta').scrollIntoView({behavior:'smooth'});
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
  appendMessage('I can help with hours, quick pricing estimates (e.g., "5kg"), or booking — try one of those or click a suggestion.');
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
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && chatPanel && chatPanel.getAttribute('aria-hidden') === 'false'){ closeChat(); chatToggle && chatToggle.focus(); } });

/* Ensure chatbot isn't hidden by the footer: move it up when footer is visible */
const chatWidget = document.querySelector('.chatbot');
const pageFooter = document.querySelector('.footer');
if (chatWidget && pageFooter && 'IntersectionObserver' in window) {
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // compute how much of the footer is visible from the bottom
        const visible = Math.max(0, window.innerHeight - entry.boundingClientRect.top);
        // add a small gap
        const gap = 18;
        chatWidget.style.bottom = `${visible + gap}px`;
      } else {
        chatWidget.style.bottom = '';// revert to CSS default (18px)
      }
    });
  }, { threshold: [0, 0.01, 0.1, 0.5, 1] });

  footerObserver.observe(pageFooter);

  // also reset on resize to be safe
  window.addEventListener('resize', () => {
    // if footer currently visible, IntersectionObserver will fire; ensure fallback
    const rect = pageFooter.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const visible = Math.max(0, window.innerHeight - rect.top);
      chatWidget.style.bottom = `${visible + 18}px`;
    } else {
      chatWidget.style.bottom = '';
    }
  });
}

// If the chatbot is positioned at top (nav) we don't need to move it when footer is visible
// Ensure the footer observer only acts when chatbot uses bottom positioning (legacy floating)
if (chatWidget && pageFooter && 'IntersectionObserver' in window) {
  const origObserver = footerObserver;
  footerObserver.disconnect();
  const conditionalObserver = new IntersectionObserver((entries) => {
    // only operate if chatbot has no top style (i.e., it's floating at bottom)
    if (chatWidget.style.top) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const visible = Math.max(0, window.innerHeight - entry.boundingClientRect.top);
        const gap = 18;
        chatWidget.style.bottom = `${visible + gap}px`;
      } else {
        chatWidget.style.bottom = '';
      }
    });
  }, { threshold: [0, 0.01, 0.1, 0.5, 1] });
  conditionalObserver.observe(pageFooter);
}
