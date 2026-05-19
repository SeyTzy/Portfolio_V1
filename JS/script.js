/* ========================================
   Loading Screen
   ======================================== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.classList.add('hidden');
  setTimeout(() => { loader.style.display = 'none'; }, 800);
});

/* ========================================
   Custom Cursor
   ======================================== */
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorOutline.style.left = e.clientX + 'px';
    cursorOutline.style.top = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.2)';
  });

  document.addEventListener('mouseup', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.querySelectorAll('a, button, .service-card, .project-card, .skill-category, .filter-btn, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovered');
      cursorOutline.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovered');
      cursorOutline.classList.remove('hovered');
    });
  });
}

/* ========================================
   Particle Background
   ======================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let particleCount;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
}

resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 92, 231, ${0.1 * (1 - distance / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  connectParticles();
  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
});

/* ========================================
   Typing Effect
   ======================================== */
const texts = [
  'Frontend Developer',
  'UI/UX Designer',
  'Graphic Designer',
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeEffect() {
  const currentText = texts[textIndex];

  if (!isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
    setTimeout(typeEffect, 80);
  } else {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeEffect, 500);
      return;
    }
    setTimeout(typeEffect, 40);
  }
}

typeEffect();

/* ========================================
   Navigation
   ======================================== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

function updateActiveLink() {
  const sections = document.querySelectorAll('.section, .hero');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

/* ========================================
   Theme Toggle
   ======================================== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

/* ========================================
   Scroll to Top
   ======================================== */
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTop.classList.toggle('visible', window.scrollY > 500);
});

scrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========================================
   Animate on Scroll (Reveal)
   ======================================== */
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
  const windowHeight = window.innerHeight;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

/* ========================================
   Skill Progress Bar Animation
   ======================================== */
function animateSkillBars() {
  const skillProgress = document.querySelectorAll('.skill-progress');

  skillProgress.forEach(bar => {
    const width = bar.getAttribute('data-width');
    const rect = bar.getBoundingClientRect();

    if (rect.top < window.innerHeight - 50 && !bar.classList.contains('animated')) {
      bar.style.width = width + '%';
      bar.classList.add('animated');
    }
  });
}

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

/* ========================================
   Stat Counter Animation
   ======================================== */
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const rect = stat.getBoundingClientRect();

    if (rect.top < window.innerHeight - 50 && !stat.classList.contains('counted')) {
      stat.classList.add('counted');
      let current = 0;
      const increment = target / 60;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(interval);
        } else {
          stat.textContent = Math.floor(current);
        }
      }, 30);
    }
  });
}

window.addEventListener('scroll', animateStats);
window.addEventListener('load', animateStats);

/* ========================================
   Project Filter
   ======================================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ========================================
   Testimonial Carousel
   ======================================== */
const track = document.getElementById('testimonialTrack');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
let currentSlide = 0;
const totalSlides = dots.length;

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach(d => d.classList.remove('active'));
  dots[currentSlide].classList.add('active');
}

nextBtn.addEventListener('click', () => {
  goToSlide((currentSlide + 1) % totalSlides);
});

prevBtn.addEventListener('click', () => {
  goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => goToSlide(index));
});

let autoSlide = setInterval(() => {
  goToSlide((currentSlide + 1) % totalSlides);
}, 5000);

track.addEventListener('mouseenter', () => clearInterval(autoSlide));
track.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);
});

/* ========================================
   Contact Form Validation
   ======================================== */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  const fields = [
    { id: 'formName', regex: /^.{2,}$/, error: 'Please enter your name (min 2 characters)' },
    { id: 'formEmail', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: 'Please enter a valid email address' },
    { id: 'formSubject', regex: /^.{3,}$/, error: 'Please enter a subject (min 3 characters)' },
    { id: 'formMessage', regex: /^.{10,}$/, error: 'Please enter a message (min 10 characters)' }
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const errorEl = input.nextElementSibling;

    if (!field.regex.test(input.value.trim())) {
      input.classList.add('error');
      errorEl.textContent = field.error;
      errorEl.style.display = 'block';
      isValid = false;
    } else {
      input.classList.remove('error');
      errorEl.style.display = 'none';
    }
  });

  if (isValid) {
    const btn = contactForm.querySelector('.btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1500);
  }
});

/* ========================================
   Smooth Scroll for Anchor Links
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========================================
   Keyboard Navigation Support
   ======================================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  }
});

/* ========================================
   Footer Newsletter Form
   ======================================== */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (input.value.trim()) {
      const btn = newsletterForm.querySelector('button');
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
        input.value = '';
      }, 2000);
    }
  });
}

/* ========================================
   Add fadeIn keyframes dynamically
   ======================================== */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(styleSheet);

/* ========================================
   Console Greeting
   ======================================== */
console.log('%c Phanna Portfolio ', 'background: #6c5ce7; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%c Built with  using HTML, CSS & JavaScript ', 'font-size: 14px; color: #b0b0c8;');
