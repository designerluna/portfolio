// app.js - Portfolio Global JS

// 1. Password Verification & Gatekeeping
const SITE_PASSWORD = 'cats';

function checkAuthentication() {
  const isUnlocked = sessionStorage.getItem('portfolio_unlocked') === 'true';
  const currentPage = window.location.pathname.split('/').pop();
  
  // If not unlocked and not on index.html, redirect
  if (!isUnlocked && currentPage !== 'index.html' && currentPage !== '') {
    window.location.href = 'index.html';
  }
  
  // If unlocked and on index.html, redirect to home.html
  if (isUnlocked && (currentPage === 'index.html' || currentPage === '')) {
    window.location.href = 'home.html';
  }
}

// Immediately execute auth check
checkAuthentication();

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Scroll Header Effect
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Password Verification Logic on Landing Page
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('site-password');
  const passwordError = document.getElementById('password-error');
  const loginCard = document.querySelector('.login-card');

  if (passwordForm && passwordInput) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredVal = passwordInput.value.trim().toLowerCase();

      if (enteredVal === SITE_PASSWORD) {
        // Success animations and redirect
        passwordError.style.display = 'none';
        passwordInput.style.borderColor = 'var(--color-teal-glow)';
        loginCard.style.boxShadow = '0 0 40px rgba(8, 246, 232, 0.4)';
        
        // Starburst splash effect before redirecting
        createStarburstEffect();
        
        setTimeout(() => {
          sessionStorage.setItem('portfolio_unlocked', 'true');
          window.location.href = 'home.html';
        }, 800);
      } else {
        // Fail animation
        passwordInput.value = '';
        passwordError.textContent = 'Incorrect password. Hint: Meow?';
        passwordError.style.display = 'block';
        passwordInput.style.borderColor = 'var(--color-coral-accent)';
        
        // Shake animation
        loginCard.classList.add('shake-anim');
        setTimeout(() => {
          loginCard.classList.remove('shake-anim');
        }, 500);
      }
    });
  }

  // Scroll Spy for Home Sticky Sidebar
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const projectSections = document.querySelectorAll('.card-section-home');

  if (sidebarLinks.length > 0 && projectSections.length > 0) {
    const updateScrollSpy = () => {
      let currentSectionId = '';
      const scrollPosition = window.scrollY || window.pageYOffset;
      
      projectSections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top + scrollPosition;
        // Scroll spy trigger offset
        if (scrollPosition >= (sectionTop - 250)) {
          currentSectionId = section.getAttribute('id');
        }
      });

      sidebarLinks.forEach(link => {
        link.classList.remove('active');
        const hrefAttr = link.getAttribute('href');
        if (hrefAttr === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', updateScrollSpy);
    updateScrollSpy(); // Run initially
  }

  // Clients Carousel Scroll Logic
  const clientsGrid = document.getElementById('clients-scroll-grid');
  const btnPrev = document.getElementById('clients-scroll-prev');
  const btnNext = document.getElementById('clients-scroll-next');

  if (clientsGrid && btnPrev && btnNext) {
    const getScrollAmount = () => {
      const firstCard = clientsGrid.querySelector('.client-logo-card');
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const style = window.getComputedStyle(clientsGrid);
        const gap = parseFloat(style.gap) || parseFloat(style.columnGap) || 16;
        return cardWidth + gap;
      }
      return 151; // fallback
    };
    
    btnPrev.addEventListener('click', () => {
      clientsGrid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
      clientsGrid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
    
    // Toggle button states based on scroll position
    const toggleButtons = () => {
      const scrollLeft = clientsGrid.scrollLeft;
      const maxScrollLeft = clientsGrid.scrollWidth - clientsGrid.clientWidth;
      
      btnPrev.style.opacity = scrollLeft <= 5 ? '0.4' : '1';
      btnPrev.style.pointerEvents = scrollLeft <= 5 ? 'none' : 'auto';
      
      btnNext.style.opacity = scrollLeft >= maxScrollLeft - 5 ? '0.4' : '1';
      btnNext.style.pointerEvents = scrollLeft >= maxScrollLeft - 5 ? 'none' : 'auto';
    };

    clientsGrid.addEventListener('scroll', toggleButtons);
    window.addEventListener('resize', toggleButtons);

    // Auto-scroll on page load for 5 seconds
    clientsGrid.classList.add('autoplay');
    let autoScrollActive = true;
    const scrollSpeed = 0.8; // pixels per frame (about 50px/sec at 60fps)
    const startTime = performance.now();

    function autoScrollStep(timestamp) {
      if (!autoScrollActive) return;
      
      const elapsed = timestamp - startTime;
      if (elapsed >= 5000) {
        // Stop autoplay, show controls, and enable snapping
        autoScrollActive = false;
        clientsGrid.classList.remove('autoplay');
        const container = clientsGrid.closest('.clients-carousel-container');
        if (container) {
          container.classList.add('show-controls');
        }
        toggleButtons();
        return;
      }
      
      clientsGrid.scrollLeft += scrollSpeed;
      
      // Loop if it somehow hits the end
      const maxScrollLeft = clientsGrid.scrollWidth - clientsGrid.clientWidth;
      if (clientsGrid.scrollLeft >= maxScrollLeft - 1) {
        clientsGrid.scrollLeft = 0;
      }
      
      requestAnimationFrame(autoScrollStep);
    }
    
    requestAnimationFrame(autoScrollStep);
  }

  // Canvas-based Starry Space Background Renderer
  initStarryBackground();

  // Image Lightbox for Project Detail Pages
  const caseBody = document.querySelector('.case-body');
  if (caseBody) {
    // Create lightbox HTML structures
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.setAttribute('role', 'dialog');
    lightboxOverlay.setAttribute('aria-label', 'Image lightbox');

    lightboxOverlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;

    document.body.appendChild(lightboxOverlay);

    const lightboxImg = lightboxOverlay.querySelector('.lightbox-image');
    const lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
    const closeBtn = lightboxOverlay.querySelector('.lightbox-close');
    const lightboxContent = lightboxOverlay.querySelector('.lightbox-content');

    const openLightbox = (imgSrc, imgAlt) => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      lightboxCaption.textContent = imgAlt || '';
      lightboxOverlay.classList.add('active');
      document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
      lightboxOverlay.classList.remove('active');
      document.body.classList.remove('lightbox-open');
      lightboxImg.classList.remove('zoomed');
      lightboxContent.classList.remove('zoomed');
      setTimeout(() => {
        lightboxImg.src = '';
        lightboxImg.alt = '';
        lightboxCaption.textContent = '';
      }, 400); // clear content after transition ends
    };

    // Add click listener to all case body images
    const images = caseBody.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(img.src, img.alt);
      });
    });

    // Toggle zoom on image click
    lightboxImg.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing overlay
      lightboxImg.classList.toggle('zoomed');
      lightboxContent.classList.toggle('zoomed');
    });

    // Close on button click
    closeBtn.addEventListener('click', closeLightbox);

    // Close on clicking overlay background
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});

// Canvas-based Space render
function initStarryBackground() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });

  // Decide theme based on context page (landing is dark space, home/about/projects is light space unless user prefers dark)
  const currentPage = window.location.pathname.split('/').pop();
  const isLandingPage = (currentPage === 'index.html' || currentPage === '');
  
  const stars = [];
  const starCount = isLandingPage ? 150 : 60; // fewer stars on home to avoid clutter

  class Star {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // initial position random
    }

    reset() {
      this.x = Math.random() * width;
      this.y = 0;
      this.size = Math.random() * (isLandingPage ? 2 : 1.5) + 0.5;
      this.speed = Math.random() * 0.2 + 0.05;
      this.alpha = Math.random() * 0.8 + 0.2;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.color = Math.random() > 0.6 ? 'rgba(8, 246, 232, ' : (Math.random() > 0.8 ? 'rgba(224, 122, 95, ' : 'rgba(255, 255, 255, ');
    }

    update() {
      this.y += this.speed;
      if (this.y > height) {
        this.reset();
      }
      
      // Twinkle alpha
      this.alpha += this.twinkleSpeed;
      if (this.alpha > 1 || this.alpha < 0.1) {
        this.twinkleSpeed = -this.twinkleSpeed;
      }
    }

    draw() {
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Nebula spots (glowing gradients)
  const nebulae = [
    {
      x: width * 0.25,
      y: height * 0.3,
      r: Math.min(width, height) * 0.4,
      color: isLandingPage ? 'rgba(0, 128, 128, 0.06)' : 'rgba(0, 128, 128, 0.03)'
    },
    {
      x: width * 0.75,
      y: height * 0.7,
      r: Math.min(width, height) * 0.5,
      color: isLandingPage ? 'rgba(220, 120, 95, 0.04)' : 'rgba(220, 120, 95, 0.02)'
    }
  ];

  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw nebulae
    nebulae.forEach(neb => {
      const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Update and draw stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// Success transition effect
function createStarburstEffect() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Speed up stars or draw expansion lines
  let radius = 10;
  function expand() {
    ctx.strokeStyle = 'rgba(8, 246, 232, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(224, 122, 95, 0.2)';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    radius += 40;
    if (radius < width) {
      requestAnimationFrame(expand);
    }
  }
  expand();
}
