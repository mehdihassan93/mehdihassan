import { eventBus } from '../utils/EventBus.js';
import { getElement } from '../utils/Helpers.js';

// High-performance astronomical moon phase approximation (RDR2 Easter Egg)
export function checkLunarPhase() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  const day = now.getDate();
  
  if (month < 3) {
    year--;
    month += 12;
  }
  const julianDate = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day - 1524.5;
  const daysSinceNew = (julianDate - 2451550.1) % 29.530588853;
  const isFullMoon = daysSinceNew >= 13.5 && daysSinceNew <= 16.0;
  
  if (isFullMoon) {
    console.log("%c[LUNAR ALIGNMENT: FULL MOON DETECTED]", "color: #ffdca1; font-weight: bold;");
    const spotlight = document.getElementById('bg-spotlight');
    if (spotlight) {
      spotlight.classList.add('moon-full');
    }
  }
}

// World Clocks Updating with Taylor Swift 13 Clicks Cipher Trigger
export function startWorldClocks() {
  const kochiClock = getElement('#kochi-time');
  const londonClock = getElement('#london-time');
  
  if (!kochiClock || !londonClock) return;
  
  // Taylor Swift 13 ciphers click count trigger
  let clockClicks = 0;
  const triggerCipherSolving = () => {
    clockClicks++;
    eventBus.emit('audio:play-click');
    if (clockClicks >= 13) {
      clockClicks = 0;
      document.documentElement.classList.add('cipher-solved');
      eventBus.emit('audio:play-chime');
      
      const overlay = document.createElement('div');
      overlay.className = 'fixed top-12 left-1/2 -translate-x-1/2 z-[10000] glass-panel px-6 py-4 border border-primary text-primary font-mono text-[10px] tracking-widest uppercase animate-pulse';
      overlay.textContent = '>>> CIPHER SOLVED: "KCH-LDN VAULT PROTOCOL UNLOCKED" <<<';
      document.body.appendChild(overlay);
      
      setTimeout(() => overlay.remove(), 4000);
    }
  };
  
  kochiClock.addEventListener('click', triggerCipherSolving);
  londonClock.addEventListener('click', triggerCipherSolving);

  function tick() {
    const now = new Date();
    const kochiOptions = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const londonOptions = { timeZone: 'Europe/London', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    kochiClock.textContent = new Intl.DateTimeFormat('en-GB', kochiOptions).format(now);
    londonClock.textContent = new Intl.DateTimeFormat('en-GB', londonOptions).format(now);
    
    // Taylor Swift "Midnights" 00:00 vault trigger
    const londonHours = now.getUTCHours() + 1; // London is UTC+1 during BST (May is BST)
    const currentMin = now.getMinutes();
    const currentSec = now.getSeconds();
    
    if (londonHours % 24 === 0 && currentMin === 0 && currentSec === 0) {
      triggerMidnightGlitch();
    }
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

// Global Immersive Keyboard Combo Buffer Keystroke Router
export function initKeyboardTransitEgg() {
  let typedBuffer = '';
  
  document.addEventListener('keydown', (e) => {
    if (!e.key || e.key.length > 1) return; // ignore control keys
    typedBuffer += e.key.toLowerCase();
    
    // Clamp buffer length to prevent memory bloat (max length 12)
    if (typedBuffer.length > 12) {
      typedBuffer = typedBuffer.substring(typedBuffer.length - 12);
    }
    
    // Keystroke combo routing checks
    if (typedBuffer.includes('kch2ldn')) {
      triggerTransitSequence();
      typedBuffer = '';
    } else if (typedBuffer.includes('journal')) {
      toggleArthurJournalMode();
      typedBuffer = '';
    } else if (typedBuffer.includes('reputation')) {
      toggleTaylorSwiftEra('reputation-era');
      typedBuffer = '';
    } else if (typedBuffer.includes('lover')) {
      toggleTaylorSwiftEra('lover-era');
      typedBuffer = '';
    } else if (typedBuffer.includes('midnights')) {
      toggleTaylorSwiftEra('midnights-era');
      typedBuffer = '';
    } else if (typedBuffer.includes('cardigan')) {
      toggleTaylorSwiftEra('cardigan-mode');
      typedBuffer = '';
    } else if (typedBuffer.includes('oracle')) {
      toggleTerminalCore(true);
      runOracleCassidySimulation();
      typedBuffer = '';
    } else if (typedBuffer.includes('spectre')) {
      triggerGhostTrain();
      typedBuffer = '';
    } else if (typedBuffer.includes('sandstorm')) {
      toggleSandstorm();
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

// 1. ArthurMorgan sketchbook mode toggle (RDR2)
function toggleArthurJournalMode() {
  const root = document.documentElement;
  const active = root.classList.toggle('journal-mode');
  eventBus.emit('audio:play-swoosh');
  console.log(`%c[SKETCHBOOK MODE: ${active ? 'ACTIVE' : 'DEACTIVATED'}]`, "color: #8a251b; font-weight: bold;");
}

// 2. Taylor Swift Eras toggle switcher
function toggleTaylorSwiftEra(className) {
  const root = document.documentElement;
  const eras = ['reputation-era', 'lover-era', 'midnights-era', 'cardigan-mode'];
  const wasActive = root.classList.contains(className);
  
  eras.forEach(era => root.classList.remove(era));
  eventBus.emit('audio:stop-vinyl');
  
  if (!wasActive) {
    root.classList.add(className);
    eventBus.emit('audio:play-click');
    
    if (className === 'lover-era') {
      eventBus.emit('audio:play-chime');
    } else if (className === 'midnights-era') {
      eventBus.emit('audio:start-vinyl');
    } else if (className === 'cardigan-mode') {
      eventBus.emit('audio:play-chime');
    } else if (className === 'reputation-era') {
      eventBus.emit('audio:play-glitch');
    }
    console.log(`%c[ERA TRANSFORM: ${className.toUpperCase()} ACTIVE]`, "color: #ffba20; font-weight: bold;");
  }
}

// 3. Volumetric sandstorm particle flow toggle (RDR2)
let sandstormActive = false;
let sandstormTimer = null;

function toggleSandstorm() {
  sandstormActive = !sandstormActive;
  
  if (sandstormActive) {
    eventBus.emit('audio:start-sandstorm');
    eventBus.emit('audio:play-swoosh');
    
    sandstormTimer = setInterval(() => {
      if (!sandstormActive) return;
      const p = document.createElement('div');
      p.className = 'sandstorm-particle';
      p.style.setProperty('--start-y', `${Math.random() * 100}vh`);
      p.style.setProperty('--end-y', `${Math.random() * 100}vh`);
      
      const duration = 2.0 + Math.random() * 2.5;
      p.style.animationDuration = `${duration}s`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }, 45);
    
    console.log("%c[DESERT WARNING: SANDSTORM ACTIVE]", "color: #ffba20; font-weight: bold;");
  } else {
    eventBus.emit('audio:stop-sandstorm');
    clearInterval(sandstormTimer);
    sandstormActive = false;
  }
}

// 4. Lemoyne Ghost Train tracks overlay (RDR2)
function triggerGhostTrain() {
  const scroller = getElement('#works-scroller');
  if (!scroller) return;
  
  eventBus.emit('audio:play-eerie');
  
  const tracks = document.createElement('div');
  tracks.className = 'ghost-tracks';
  scroller.appendChild(tracks);
  
  setTimeout(() => tracks.classList.add('active'), 100);
  
  setTimeout(() => {
    eventBus.emit('audio:play-swoosh');
  }, 1800);
  
  setTimeout(() => {
    tracks.classList.remove('active');
    setTimeout(() => tracks.remove(), 1500);
  }, 10000);
  
  console.log("%c[LEMOPYNE SPECTRE: GHOST TRAIN APPROACHING]", "color: #a18cd1; font-weight: bold;");
}

// 5. Taylor Swift Midnights 00:00 Vault Glitch
function triggerMidnightGlitch() {
  eventBus.emit('audio:play-glitch');
  const staticScreen = getElement('#static-screen');
  if (staticScreen) {
    staticScreen.classList.add('active');
    setTimeout(() => staticScreen.classList.remove('active'), 1200);
  }
  toggleTaylorSwiftEra('midnights-era');
}

// 6. RDR2 Blind Man Cassidy's Oracle Command simulation
function runOracleCassidySimulation() {
  const logLines = getElement('#terminal-lines');
  if (!logLines) return;
  
  logLines.innerHTML = '';
  const prophecies = [
    'BLIND MAN CASSIDY // THE PROPHET ENTERS THE SPEC CORE...',
    '“I have no eyes, traveler, but I see you clearly.”',
    '“A bridge is being built from Kochi to London.”',
    '“Native Android is the rails, Flutter is the carriage.”',
    '“The code you write is a map across oceans.”',
    '“Do not fear the bugs, they are merely guide dogs in the wilderness.”',
    '“I see a sunset transit... yes, KCH to LDN is written in the sky.”',
    '“Your signal is strong. Connect to the vault.”'
  ];
  
  let delay = 0;
  prophecies.forEach((line, index) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.className = index === 0 ? 'text-primary font-bold' : 'text-primary/75 italic';
      p.textContent = `> ${line}`;
      logLines.appendChild(p);
      eventBus.emit('audio:play-click');
    }, delay);
    delay += 550;
  });
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
      
      // Strange Man cabin mirror reflection RDR2 Easter Egg
      const strangeMan = getElement('#strange-man');
      if (strangeMan) {
        strangeMan.style.opacity = '0.35';
        
        const triggerStrangeReflection = () => {
          console.log("%c[STRANGER LOG: WE HAVE MET BEFORE]", "color: #b0b0b0; font-weight: bold; background: #000; padding: 4px;");
          eventBus.emit('audio:play-eerie');
          
          const logLines = getElement('#terminal-lines');
          if (logLines) {
            const p = document.createElement('p');
            p.className = 'text-error font-mono font-bold animate-pulse';
            p.textContent = '> STRANGER ENCOUNTER: "I know you. We’ve met before."';
            logLines.appendChild(p);
          }
          
          strangeMan.removeEventListener('mouseenter', triggerStrangeReflection);
          strangeMan.removeEventListener('touchstart', triggerStrangeReflection);
        };
        
        strangeMan.addEventListener('mouseenter', triggerStrangeReflection);
        strangeMan.addEventListener('touchstart', triggerStrangeReflection, { passive: true });
      }
    }
  }
  
  document.addEventListener('mousemove', resetIdle);
  document.addEventListener('keydown', resetIdle);
  document.addEventListener('mousedown', resetIdle);
  document.addEventListener('scroll', resetIdle);
  document.addEventListener('touchstart', resetIdle, { passive: true });
  
  resetIdle();
}
