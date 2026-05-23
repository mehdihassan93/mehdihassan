import { eventBus } from '../utils/EventBus.js';
import { getElement } from '../utils/Helpers.js';

/**
 * FormHandler - Securely handles satellite transmissions via EmailJS
 * Features robust validation, dual template trigger, redundant inputs clearing,
 * and high-fidelity accessibility attributes tracking.
 */

// EmailJS Account Credentials
const EMAILJS_PUBLIC_KEY = 'cBUYzSuUIDA0ohefi';
const EMAILJS_SERVICE_ID = 'service_audjz9d';
const EMAILJS_TEMPLATE_ID = 'template_5w8i4di';
const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_es8u70g';

export function initFormHandler() {
  const form = getElement('#transmission-form');
  const nameInput = getElement('#form-name');
  const emailInput = getElement('#form-email');
  const messageInput = getElement('#form-message');
  const submitBtn = getElement('#transmission-form button[type="submit"]');
  const light = getElement('#transmit-light');
  const statusText = getElement('#transmit-status');

  if (!form || !submitBtn || !light || !statusText) {
    console.warn('FormHandler: One or more transmission core components could not be found.');
    return;
  }

  // Remove potential inline handler left in HTML to prevent duplicate submissions
  form.removeAttribute('onsubmit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform inputs validation
    if (!validateForm(nameInput, emailInput, messageInput)) {
      statusText.textContent = 'VALIDATION ERROR';
      statusText.classList.add('text-error');
      eventBus.emit('audio:play-click');
      return;
    }

    statusText.classList.remove('text-error');
    transmitSignal(form, submitBtn, light, statusText);
  });
}

/**
 * Validate form inputs and apply WCAG 2.2 accessibility invalid flags.
 */
function validateForm(name, email, message) {
  let isValid = true;

  // Simple checks
  if (!name.value.trim()) {
    name.setAttribute('aria-invalid', 'true');
    isValid = false;
  } else {
    name.removeAttribute('aria-invalid');
  }

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.setAttribute('aria-invalid', 'true');
    isValid = false;
  } else {
    email.removeAttribute('aria-invalid');
  }

  if (!message.value.trim()) {
    message.setAttribute('aria-invalid', 'true');
    isValid = false;
  } else {
    message.removeAttribute('aria-invalid');
  }

  return isValid;
}

/**
 * Perform satellite transmission via EmailJS Browser SDK
 */
function transmitSignal(form, submitBtn, light, statusText) {
  // Check if SDK loaded
  if (typeof emailjs === 'undefined') {
    console.error('FormHandler: EmailJS SDK is not available.');
    statusText.textContent = 'SDK ERROR';
    statusText.classList.add('text-error');
    light.style.backgroundColor = '#ffb4ab';
    light.style.boxShadow = '0 0 8px #ffb4ab';
    return;
  }

  // Disable interaction during transmission
  submitBtn.disabled = true;
  eventBus.emit('audio:play-swoosh');

  // Pulsing transmission light state
  light.classList.remove('bg-[#514532]');
  light.classList.add('bg-primary-fixed-dim', 'animate-pulse');
  statusText.textContent = 'TRANSMITTING...';

  // Initialize SDK
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });

  // Dispatch main notification mail
  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(() => {
      // Trigger background auto-reply to the visitor
      if (EMAILJS_AUTOREPLY_TEMPLATE_ID) {
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, form)
          .catch(err => console.warn('FormHandler: Visitor auto-reply transmission failed:', err));
      }

      // Success filament glowing light state
      light.classList.remove('animate-pulse');
      light.style.backgroundColor = '#ffba20'; // Solid amber glow
      light.style.boxShadow = '0 0 8px #ffba20, 0 0 2px #ffdca1';
      
      statusText.textContent = 'SIGNAL SENT // 200 OK';
      eventBus.emit('audio:play-click');

      // Clear the form fields robustly and double-redundantly
      console.log('FormHandler: Signal successfully transmitted. Clearing form inputs...');
      form.reset();

      const nameInput = getElement('#form-name');
      const emailInput = getElement('#form-email');
      const messageInput = getElement('#form-message');

      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (messageInput) messageInput.value = '';

      // Reset invalid visual states
      [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
          input.removeAttribute('aria-invalid');
        }
      });

      // Restore idle status after a professional cooling interval
      setTimeout(() => {
        submitBtn.disabled = false;
        light.classList.remove('bg-primary-fixed-dim');
        light.style.backgroundColor = '';
        light.style.boxShadow = '';
        light.classList.add('bg-[#514532]');
        statusText.textContent = 'CONSOLE IDLE';
      }, 4000);
    })
    .catch((error) => {
      console.error('FormHandler: EmailJS Sat-Transmission failed:', error);
      light.classList.remove('animate-pulse');
      light.style.backgroundColor = '#ffb4ab'; // Red alert filament
      light.style.boxShadow = '0 0 8px #ffb4ab';
      statusText.textContent = 'TRANSMIT ERROR';
      
      setTimeout(() => {
        submitBtn.disabled = false;
        light.style.backgroundColor = '';
        light.style.boxShadow = '';
        light.classList.add('bg-[#514532]');
        statusText.textContent = 'CONSOLE IDLE';
      }, 4000);
    });
}
