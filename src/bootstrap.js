import { eventBus } from './utils/EventBus.js';
import { getElement } from './utils/Helpers.js';
import { initAudioEngine, toggleMasterSound } from './components/AudioEngine.js';
import {
  initCustomCursor,
  initScrollObserverFallback,
  decryptText,
  initTextDecrypter,
  initWorksReel,
  initAudioSceneTracker
} from './components/VisualEngine.js';
import {
  startWorldClocks,
  initClimateHovers,
  initKeyboardTransitEgg,
  initIdleDetector,
  toggleTerminalCore,
  runTerminalSimulation,
  checkLunarPhase
} from './components/ConsoleCore.js';
import { initFormHandler } from './components/FormHandler.js';

/**
 * setupColdOpen - Manages the digital introduction console loader
 */
function setupColdOpen() {
  const loader = getElement('#cold-open-loader');
  const enterBtn = getElement('#loader-enter-btn');
  const terminalText = getElement('#loader-terminal');
  
  if (!loader || !enterBtn || !terminalText) return;
  
  const prompts = [
    'CONNECTING TO FEED HOST: 127.0.0.1',
    'LOAD STATUS: COMPILING ATMOSPHERIC NODE...',
    'DECKEY CODES LOADED: KCH (INDIA) -> LDN (UK)',
    'SIGNAL ENCRYPTED. COMPATIBILITY 24FPS SECURE.',
    'READY FOR AUDIOPHONIC TRANSMISSION.'
  ];
  
  let idx = 0;
  function writeLine() {
    if (idx < prompts.length) {
      const p = document.createElement('p');
      p.className = 'text-[11px] font-mono text-primary/80 tracking-wider mb-1';
      p.textContent = `> ${prompts[idx]}`;
      terminalText.appendChild(p);
      idx++;
      setTimeout(writeLine, 450);
    } else {
      enterBtn.classList.remove('opacity-0', 'pointer-events-none');
      enterBtn.classList.add('opacity-100', 'pointer-events-all');
    }
  }
  
  setTimeout(writeLine, 800);
  
  enterBtn.addEventListener('click', () => {
    // Dispatch sound initialization to Audio Engine
    eventBus.emit('audio:init');
    
    // Play power-up swoosh & secondary shutter click
    eventBus.emit('audio:play-swoosh');
    setTimeout(() => eventBus.emit('audio:play-click'), 200);
    
    // Fade out loader screen with smooth transition
    loader.classList.add('transition-all', 'duration-1000', 'opacity-0', 'pointer-events-none');
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1000);
    
    // Initialize standard atmospheric & visual modules
    initCustomCursor();
    startWorldClocks();
    initClimateHovers();
    initWorksReel();
    initTextDecrypter();
    initIdleDetector();
    initKeyboardTransitEgg();
    initFormHandler();
    initAudioSceneTracker();
    outputConsoleSignature();

    // Trigger spectacular cinematic glitch decryption on main hero heading!
    const heroTitle = getElement('#hero-title');
    if (heroTitle) {
      setTimeout(() => {
        decryptText(heroTitle);
      }, 600);
    }
  });
}

/**
 * Wire dynamic element event listeners to bypass window global namespace pollution
 */
function wireUIEventListeners() {
  // specs log modal toggle triggers
  const specsTrigger = getElement('#specs-trigger');
  if (specsTrigger) {
    specsTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTerminalCore(true);
    });
  }

  const terminalClose = getElement('#terminal-close');
  if (terminalClose) {
    terminalClose.addEventListener('click', () => {
      toggleTerminalCore(false);
    });
  }

  // Specs console re-boot simulation trigger
  const terminalReboot = getElement('#terminal-reboot');
  if (terminalReboot) {
    terminalReboot.addEventListener('click', () => {
      runTerminalSimulation();
    });
  }

  // Audio system console lever toggle trigger
  const soundToggleBtn = getElement('#sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      toggleMasterSound(soundToggleBtn);
    });
  }
}

/**
 * Dev Console ASCII welcome signature
 */
function outputConsoleSignature() {
  const signature = `
 ██████   ██████  ████████  ██    ██  ████████  ████████
 ██  ██   ██  ██     ██     ██    ██  ██        ██    ██
 ██████   ██████     ██     ████████  ██████    ████████
 ██       ██  ██     ██     ██    ██  ██        ██  ██  
 ██       ██  ██     ██     ██    ██  ████████  ██   ██ 
 
   // MEHDI HASSAN - ANDROID & AI DEV //
   CODENAME: KCH-LDN // LONDON, UK
   
   -------------------------------------------------
   TRANSMISSION DETECTED. WE WELCOME YOU TO OUR CORE.
   SECRET PROTOCOL DECRYPT CLUE:
   Type "kch2ldn" on your keyboard inside the feed
   to trigger the geographic sunset transit sequence.
   -------------------------------------------------
  `;
  console.log("%c" + signature, "color: #ffdca1; font-family: monospace; font-weight: bold; background: #0d1418; padding: 10px;");
}

// Kickstart atmospheric console safely
const init = () => {
  // Register audio engine EventBus subscribers immediately
  initAudioEngine();
  
  setupColdOpen();
  initScrollObserverFallback();
  wireUIEventListeners();
  checkLunarPhase();
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
