/**
 * EventBus - A lightweight, decoupled pub-sub event orchestrator.
 */
class EventBus {
  constructor() {
    this.listeners = {};
  }

  /**
   * Subscribe to an event topic.
   * @param {string} topic 
   * @param {Function} callback 
   * @returns {Function} unsubscribe function
   */
  on(topic, callback) {
    if (!this.listeners[topic]) {
      this.listeners[topic] = [];
    }
    this.listeners[topic].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[topic] = this.listeners[topic].filter(cb => cb !== callback);
    };
  }

  /**
   * Publish an event to all subscribed listeners.
   * @param {string} topic 
   * @param {any} data 
   */
  emit(topic, data) {
    if (!this.listeners[topic]) return;
    this.listeners[topic].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in EventBus listener for topic "${topic}":`, err);
      }
    });
  }
}

// Global EventBus instance for modular integration
export const eventBus = new EventBus();
