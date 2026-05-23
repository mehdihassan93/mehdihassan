import { eventBus } from '../utils/EventBus.js';
import { getElement, throttleRAF } from '../utils/Helpers.js';

// Custom cursor trail parameters
let cursorX = 0;
let cursorY = 0;
let trailX = 0;
let trailY = 0;

function updateCursorTrail() {
  const cursor = getElement('#cursor');
  const cursorTrail = getElement('#cursor-trail');
  
  if (!cursor || !cursorTrail) return;
  
  // Easing trail movement
  trailX += (cursorX - trailX) * 0.15;
  trailY += (cursorY - trailY) * 0.15;
  
  cursorTrail.style.left = `${trailX}px`;
  cursorTrail.style.top = `${trailY}px`;
  
  requestAnimationFrame(updateCursorTrail);
}

export function initCustomCursor() {
  const cursor = getElement('#cursor');
  const cursorTrail = getElement('#cursor-trail');
  const parallaxBg = getElement('.parallax-bg');
  
  if (!cursor || !cursorTrail) return;
  
  // Disable custom cursor on touch devices
  if (window.matchMedia('(max-width: 768px)').matches) {
    cursor.style.display = 'none';
    cursorTrail.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }
  
  // High-performance pointer movement with rAF throttler
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    // Subtle background lens shift (GPU composited)
    if (parallaxBg) {
      const moveX = (cursorX - window.innerWidth / 2) / 75;
      const moveY = (cursorY - window.innerHeight / 2) / 75;
      parallaxBg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`;
    }
  });
  
  // Start eased loop
  requestAnimationFrame(updateCursorTrail);

  // Modular Hover Scaling
  setupInteractivesListeners();
}

function setupInteractivesListeners() {
  const cursor = getElement('#cursor');
  const cursorTrail = getElement('#cursor-trail');
  if (!cursor || !cursorTrail) return;

  const handleMouseEnter = () => {
    cursor.style.transform = 'translate3d(-50%, -50%, 0) scale(2.2)';
    cursor.style.backgroundColor = 'transparent';
    cursor.style.border = '1px solid var(--color-surface-tint)';
    cursorTrail.style.opacity = '0';
    eventBus.emit('audio:play-click');
  };
  
  const handleMouseLeave = () => {
    cursor.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
    cursor.style.backgroundColor = 'var(--color-surface-tint)';
    cursor.style.border = 'none';
    cursorTrail.style.opacity = '1';
  };
  
  const handleClick = () => {
    eventBus.emit('audio:play-click');
  };

  const attachListeners = () => {
    const interactives = document.querySelectorAll('a, button, .lever-btn, .hover-trigger, .credit-row');
    interactives.forEach(el => {
      // Prevent duplicate event handlers
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('click', handleClick);
      
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('click', handleClick);
    });
  };

  // Run on startup
  attachListeners();
  
  // Re-run listener attachment if modular panels load asynchronously
  eventBus.on('ui:rebind-hover', attachListeners);
}

// Fallback for older browsers lacking native Scroll-Driven animations
export function initScrollObserverFallback() {
  if (CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    // Native CSS Scroll-Driven Animations support works flawlessly!
    return;
  }
  
  const sections = document.querySelectorAll('.scene-container');
  const observerOptions = {
    root: null,
    threshold: Array.from({ length: 51 }, (_, i) => i / 50)
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const panel = entry.target.querySelector('.lens-focused-panel');
      if (!panel) return;
      
      const ratio = entry.intersectionRatio;
      
      // Calculate dynamic high-legibility lens parameters (no blur, floor 85% opacity)
      const opacityVal = 0.85 + (ratio * 0.15);
      const scaleVal = 0.98 + (ratio * 0.02);
      const translateVal = (1 - ratio) * 12;
      
      // GPU Accelerated compositing
      panel.style.filter = 'none';
      panel.style.opacity = `${opacityVal}`;
      panel.style.transform = `scale(${scaleVal}) translate3d(0, ${translateVal}px, 0)`;
      panel.style.transition = 'filter 0.1s ease-out, transform 0.1s ease-out, opacity 0.1s ease-out';
    });
  }, observerOptions);
  
  sections.forEach(sec => {
    observer.observe(sec);
  });
}

// Matrix decryption visual effects
export function decryptText(element) {
  const original = element.getAttribute('data-text') || element.textContent;
  const chars = '01ABCDEF$%&#?/[]{}X+-_*';
  let iterations = 0;
  
  if (!element.getAttribute('data-text')) {
    element.setAttribute('data-text', original);
  }
  
  const interval = setInterval(() => {
    element.textContent = original
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (index < iterations) {
          return original[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
      
    if (iterations >= original.length) {
      clearInterval(interval);
      element.classList.remove('glitch-active');
    }
    
    iterations += 1/2;
  }, 30);
  
  element.classList.add('glitch-active');
}

export function initTextDecrypter() {
  const triggerCard = getElement('#glitch-card');
  const decrypterTitle = getElement('#glitch-title');
  
  if (!triggerCard || !decrypterTitle) return;
  
  triggerCard.addEventListener('mouseenter', () => {
    decryptText(decrypterTitle);
    eventBus.emit('audio:play-click');
  });

  triggerCard.addEventListener('touchstart', () => {
    decryptText(decrypterTitle);
    eventBus.emit('audio:play-click');
  }, { passive: true });
  
  let lastX = 0, lastY = 0;
  let shakeCount = 0;
  
  triggerCard.addEventListener('mousemove', throttleRAF((e) => {
    const deltaX = Math.abs(e.clientX - lastX);
    const deltaY = Math.abs(e.clientY - lastY);
    
    if (deltaX > 80 || deltaY > 80) {
      shakeCount++;
      if (shakeCount > 4) {
        decryptText(decrypterTitle);
        shakeCount = 0;
      }
    }
    lastX = e.clientX;
    lastY = e.clientY;
  }));
}

// Horizontal Selected Works Reel controller
export function initWorksReel() {
  const scroller = getElement('#works-scroller');
  const prevBtn = getElement('#reel-prev');
  const nextBtn = getElement('#reel-next');
  
  if (!scroller || !prevBtn || !nextBtn) return;
  
  nextBtn.addEventListener('click', () => {
    const width = scroller.clientWidth;
    scroller.scrollBy({ left: width, behavior: 'smooth' });
    eventBus.emit('audio:play-swoosh');
  });
  
  prevBtn.addEventListener('click', () => {
    const width = scroller.clientWidth;
    scroller.scrollBy({ left: -width, behavior: 'smooth' });
    eventBus.emit('audio:play-swoosh');
  });
  
  scroller.addEventListener('scroll', throttleRAF(() => {
    const scrollPos = scroller.scrollLeft;
    const itemWidth = scroller.clientWidth;
    const currentScene = Math.round(scrollPos / itemWidth);
    
    const colors = ['#0d1418', '#0b161f', '#091811', '#140c14'];
    document.body.style.backgroundColor = colors[currentScene] || '#0d1418';
  }));
}
