import { eventBus } from '../utils/EventBus.js';
import { getElement } from '../utils/Helpers.js';

// World Clocks Updating
export function startWorldClocks() {
  const kochiClock = getElement('#kochi-time');
  const londonClock = getElement('#london-time');
  
  if (!kochiClock || !londonClock) return;
  
  function tick() {
    const now = new Date();
    const kochiOptions = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const londonOptions = { timeZone: 'Europe/London', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    kochiClock.textContent = new Intl.DateTimeFormat('en-GB', kochiOptions).format(now);
    londonClock.textContent = new Intl.DateTimeFormat('en-GB', londonOptions).format(now);
  }
  
  setInterval(tick, 1000);
  tick();
}

// Kochi/London Text Hover Climate Shifts
export function initClimateHovers() {
  const kochiText = document.querySelectorAll('.city-kochi');
  const londonText = document.querySelectorAll('.city-london');
  const kochiTint = getElement('#kochi-tint');
  const londonTint = getElement('#london-tint');
  
  kochiText.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.style.filter = 'sepia(0.25) contrast(1.02)';
      document.body.style.backgroundColor = '#1a140d';
      if (kochiTint) kochiTint.style.opacity = '1';
      eventBus.emit('audio:play-click');
      eventBus.emit('audio:start-kochi');
    });
    el.addEventListener('mouseleave', resetClimate);
  });
  
  londonText.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.style.filter = 'contrast(1.1) brightness(0.9)';
      document.body.style.backgroundColor = '#151d21';
      if (londonTint) londonTint.style.opacity = '1';
      eventBus.emit('audio:play-click');
      eventBus.emit('audio:start-london');
    });
    el.addEventListener('mouseleave', resetClimate);
  });
  
  function resetClimate() {
    document.body.style.filter = 'none';
    document.body.style.backgroundColor = 'var(--color-surface)';
    if (kochiTint) kochiTint.style.opacity = '0';
    if (londonTint) londonTint.style.opacity = '0';
    eventBus.emit('audio:stop-climate');
  }
}

// Transit kch2ldn keyboard combo & triple-tap easter egg
export function initKeyboardTransitEgg() {
  let typedBuffer = '';
  
  document.addEventListener('keydown', (e) => {
    if (!e.key) return;
    typedBuffer += e.key.toLowerCase();
    if (typedBuffer.length > 7) {
      typedBuffer = typedBuffer.substring(typedBuffer.length - 7);
    }
    
    if (typedBuffer.includes('kch2ldn')) {
      triggerTransitSequence();
      typedBuffer = '';
    }
  });

  // Mobile Triple-Tap gesture to trigger transit scene
  let lastTap = 0;
  let tapCount = 0;
  document.addEventListener('touchend', () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      tapCount++;
      if (tapCount >= 2) {
        triggerTransitSequence();
        tapCount = 0;
      }
    } else {
      tapCount = 0;
    }
    lastTap = currentTime;
  });

  const transitTrigger = getElement('#transit-trigger');
  if (transitTrigger) {
    transitTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      triggerTransitSequence();
    });
  }
}

function triggerTransitSequence() {
  const overlay = getElement('#transit-overlay');
  if (!overlay) return;
  
  eventBus.emit('audio:play-swoosh');
  overlay.classList.remove('hidden');
  
  const kochiPanel = getElement('#transit-kochi');
  const londonPanel = getElement('#transit-london');
  
  kochiPanel.classList.remove('opacity-0');
  kochiPanel.classList.add('opacity-100');
  
  setTimeout(() => {
    kochiPanel.classList.remove('opacity-100');
    kochiPanel.classList.add('opacity-0');
    
    londonPanel.classList.remove('opacity-0');
    londonPanel.classList.add('opacity-100');
    eventBus.emit('audio:play-swoosh');
  }, 3500);
  
  setTimeout(() => {
    overlay.classList.add('hidden');
    londonPanel.classList.remove('opacity-100');
    londonPanel.classList.add('opacity-0');
    eventBus.emit('audio:play-click');
  }, 7500);
}

// 404 Viewport Screen Decrypt System
export function toggleTerminalCore(open = true) {
  const terminal = getElement('#terminal-viewport');
  if (!terminal) return;
  
  if (open) {
    terminal.classList.remove('hidden');
    eventBus.emit('audio:play-swoosh');
    document.body.style.overflow = 'hidden';
    runTerminalSimulation();
  } else {
    terminal.classList.add('hidden');
    eventBus.emit('audio:play-click');
    document.body.style.overflow = 'auto';
  }
}

export function runTerminalSimulation() {
  const logLines = getElement('#terminal-lines');
  if (!logLines) return;
  
  logLines.innerHTML = '';
  const lines = [
    'CONNECTING TO ENCRYPTED SPEC CORE...',
    'IP CONNECTED: 127.0.0.1 // SECURE_SHELL',
    'DECRYPTING ASSETS IN SECTOR 4...',
    'ERROR: SECTOR 404 SIGNAL DAMAGED.',
    'INTEGRITY FAILING: 0x8849F0',
    'WARNING: CORRUPT SECTOR DETECTED.',
    'RE-CALIBRATING TRANSIT SIGNAL DECODE FEED...'
  ];
  
  let delay = 0;
  lines.forEach((line, index) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.className = index === 3 || index === 5 ? 'text-error font-bold' : 'text-primary/75';
      p.textContent = `> ${line}`;
      logLines.appendChild(p);
      eventBus.emit('audio:play-click');
    }, delay);
    delay += 500;
  });
}

// 20s Idle detection
export function initIdleDetector() {
  const staticScreen = getElement('#static-screen');
  let idleTimer = null;
  
  function resetIdle() {
    clearTimeout(idleTimer);
    
    if (staticScreen && staticScreen.classList.contains('active')) {
      staticScreen.classList.remove('active');
      eventBus.emit('audio:stop-static');
      eventBus.emit('audio:play-click');
    }
    
    idleTimer = setTimeout(triggerIdle, 20000);
  }
  
  function triggerIdle() {
    if (staticScreen) {
      staticScreen.classList.add('active');
      eventBus.emit('audio:start-static');
    }
  }
  
  document.addEventListener('mousemove', resetIdle);
  document.addEventListener('keydown', resetIdle);
  document.addEventListener('mousedown', resetIdle);
  document.addEventListener('scroll', resetIdle);
  document.addEventListener('touchstart', resetIdle, { passive: true });
  
  resetIdle();
}
