import { eventBus } from '../utils/EventBus.js';

let audioCtx = null;
let masterGain = null;
let ambientHumNode = null;
let staticNode = null;
let climateOscNode = null;
let climateRainNode = null;
let soundEnabled = false;

// Initialize Web Audio API Synthesizer
function initAudio() {
  if (audioCtx) return;
  
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0, audioCtx.currentTime); // Start muted, fade in
    masterGain.connect(audioCtx.destination);
    
    startAmbientHum();
    
    if (soundEnabled && masterGain) {
      masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 2.5);
    }
  } catch (e) {
    console.warn("Web Audio API not supported or blocked by browser policies.", e);
  }
}

// Low frequency breathing space hum generator
function startAmbientHum() {
  if (!audioCtx) return;

  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(55.0, audioCtx.currentTime);
  
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(55.4, audioCtx.currentTime);
  
  const osc3 = audioCtx.createOscillator();
  osc3.type = 'triangle';
  osc3.frequency.setValueAtTime(82.4, audioCtx.currentTime);
  
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(120, audioCtx.currentTime);
  lowpass.Q.setValueAtTime(1.0, audioCtx.currentTime);

  const osc1Gain = audioCtx.createGain();
  osc1Gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  
  const osc2Gain = audioCtx.createGain();
  osc2Gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  
  const osc3Gain = audioCtx.createGain();
  osc3Gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

  const lfo = audioCtx.createOscillator();
  lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // 12 seconds per cycle
  
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(15, audioCtx.currentTime); // Modulate filter cutoff by 15Hz
  
  osc1.connect(osc1Gain);
  osc2.connect(osc2Gain);
  osc3.connect(lowpass);
  osc3Gain.connect(lowpass);
  
  const synthMix = audioCtx.createGain();
  osc1Gain.connect(synthMix);
  osc2Gain.connect(synthMix);
  lowpass.connect(synthMix);

  lfo.connect(lfoGain);
  lfoGain.connect(lowpass.frequency);

  const lfoVol = audioCtx.createOscillator();
  lfoVol.frequency.setValueAtTime(0.08, audioCtx.currentTime);
  const lfoVolGain = audioCtx.createGain();
  lfoVolGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  
  const humVolumeGain = audioCtx.createGain();
  humVolumeGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  
  lfoVol.connect(lfoVolGain);
  lfoVolGain.connect(humVolumeGain.gain);
  
  synthMix.connect(humVolumeGain);
  humVolumeGain.connect(masterGain);

  osc1.start(0);
  osc2.start(0);
  osc3.start(0);
  lfo.start(0);
  lfoVol.start(0);

  ambientHumNode = { osc1, osc2, osc3, lfo, lfoVol, osc1Gain, osc2Gain, osc3Gain, synthMix, lowpass, humVolumeGain };
}

// Procedural mechanical UI ticks
function playClick() {
  if (!audioCtx || !soundEnabled || audioCtx.state === 'suspended') return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.04);
  
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
  
  const bufferSize = audioCtx.sampleRate * 0.02; // 20ms of noise
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(5000, audioCtx.currentTime);
  
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.015, audioCtx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.01);
  
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  
  osc.connect(gain);
  gain.connect(masterGain);
  
  osc.start(0);
  osc.stop(audioCtx.currentTime + 0.05);
  
  noise.start(0);
  noise.stop(audioCtx.currentTime + 0.02);

  // GC: disconnect nodes on completion to prevent memory leaks
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
  noise.onended = () => {
    noise.disconnect();
    noiseFilter.disconnect();
    noiseGain.disconnect();
  };
}

// Dynamic atmospheric transit noise swoosh
function playSwoosh() {
  if (!audioCtx || !soundEnabled || audioCtx.state === 'suspended') return;
  
  const bufferSize = audioCtx.sampleRate * 0.55; // 550ms swoosh
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(4.0, audioCtx.currentTime);
  
  filter.frequency.setValueAtTime(150, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.22);
  filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.55);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.55);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  
  noise.start(0);
  noise.stop(audioCtx.currentTime + 0.56);

  noise.onended = () => {
    noise.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

// Looping analog CRT noise hiss for idle screen
function startStaticNoise() {
  if (!audioCtx || staticNode) return;
  
  const bufferSize = audioCtx.sampleRate * 2.0; // 2 seconds loop
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, audioCtx.currentTime);
  filter.Q.setValueAtTime(0.4, audioCtx.currentTime);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 1.0); // gradual hiss fade in
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  
  noise.start(0);
  staticNode = { noise, filter, gain };
}

function stopStaticNoise() {
  if (!audioCtx || !staticNode) return;
  
  const activeGain = staticNode.gain;
  const activeNoise = staticNode.noise;
  const activeFilter = staticNode.filter;
  
  activeGain.gain.setValueAtTime(activeGain.gain.value, audioCtx.currentTime);
  activeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
  
  setTimeout(() => {
    try {
      activeNoise.stop();
      activeNoise.disconnect();
      activeFilter.disconnect();
      activeGain.disconnect();
    } catch(e) {}
    staticNode = null;
  }, 160);
}

// Procedural Cricket/Tropical Synthesizer for Kochi Climate hover
function startKochiClimate() {
  if (!audioCtx || !soundEnabled || climateOscNode) return;
  
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, audioCtx.currentTime); // High pitch crickets
    
    // Chirp rhythm LFO (amplitude modulation)
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(8, audioCtx.currentTime); // 8 chirps per second
    
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(0.012, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.3); // very soft/subtle
    
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    
    osc.connect(gain);
    gain.connect(masterGain);
    
    osc.start(0);
    lfo.start(0);
    
    climateOscNode = { osc, lfo, lfoGain, gain };
  } catch(e) {}
}

// Procedural Crackling Rain Synthesizer for London Climate hover
function startLondonClimate() {
  if (!audioCtx || !soundEnabled || climateRainNode) return;
  
  try {
    const bufferSize = audioCtx.sampleRate * 2.0; // 2s loop
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, audioCtx.currentTime);
    filter.Q.setValueAtTime(0.35, audioCtx.currentTime);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.012, audioCtx.currentTime + 0.5); // faint crackling slate rain
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    noise.start(0);
    climateRainNode = { noise, filter, gain };
  } catch(e) {}
}

// Fade out and terminate environmental synthesizers
function stopClimateAudio() {
  if (climateOscNode) {
    const activeOsc = climateOscNode.osc;
    const activeLfo = climateOscNode.lfo;
    const activeLfoGain = climateOscNode.lfoGain;
    const activeGain = climateOscNode.gain;
    
    try {
      activeGain.gain.setValueAtTime(activeGain.gain.value, audioCtx.currentTime);
      activeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      
      setTimeout(() => {
        try {
          activeOsc.stop();
          activeLfo.stop();
          activeOsc.disconnect();
          activeLfo.disconnect();
          activeLfoGain.disconnect();
          activeGain.disconnect();
        } catch(e) {}
      }, 400);
    } catch(e) {}
    climateOscNode = null;
  }
  
  if (climateRainNode) {
    const activeNoise = climateRainNode.noise;
    const activeFilter = climateRainNode.filter;
    const activeGain = climateRainNode.gain;
    
    try {
      activeGain.gain.setValueAtTime(activeGain.gain.value, audioCtx.currentTime);
      activeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      
      setTimeout(() => {
        try {
          activeNoise.stop();
          activeNoise.disconnect();
          activeFilter.disconnect();
          activeGain.disconnect();
        } catch(e) {}
      }, 400);
    } catch(e) {}
    climateRainNode = null;
  }
}

// Master Mute/Unmute Control
export function toggleMasterSound(btn) {
  soundEnabled = !soundEnabled;
  
  if (soundEnabled) {
    btn.classList.add('sound-active');
    
    // Unlock Audio Context
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    initAudio();
    
    if (masterGain) {
      masterGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.8);
    }
    
    // Broadcast active status
    eventBus.emit('sound:state', { enabled: true });
  } else {
    btn.classList.remove('sound-active');
    
    if (masterGain) {
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 0.6);
    }
    
    eventBus.emit('sound:state', { enabled: false });
  }
  playClick();
}

// Subscribe modular actions to global EventBus
export function initAudioEngine() {
  eventBus.on('audio:init', () => {
    soundEnabled = true;
    initAudio();
    if (masterGain) {
      masterGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.8);
    }
    
    // Synchronize the header lever switch element visually
    const toggle = document.getElementById('sound-toggle');
    if (toggle) toggle.classList.add('sound-active');
  });
  
  eventBus.on('audio:play-click', () => playClick());
  eventBus.on('audio:play-swoosh', () => playSwoosh());
  
  eventBus.on('audio:start-static', () => startStaticNoise());
  eventBus.on('audio:stop-static', () => stopStaticNoise());
  
  eventBus.on('audio:start-kochi', () => startKochiClimate());
  eventBus.on('audio:start-london', () => startLondonClimate());
  eventBus.on('audio:stop-climate', () => stopClimateAudio());
}
