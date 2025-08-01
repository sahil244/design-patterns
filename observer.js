class PlayerEmitter {
  constructor() {
    this.events = {};  // Stores event names and their subscriber callbacks
  }

  on(evt, fn) {
    (this.events[evt] ||= []).push(fn);  
    // Register a subscriber (observer) for the event
  }

  emit(evt, data) {
    (this.events[evt] || []).forEach(fn => fn(data));  
    // Notify all subscribers of the event, passing data to them
  }
}


const playerBus = new PlayerEmitter();

// Subscriptions
playerBus.on('timeUpdate', time => progressBar.update(time));
playerBus.on('buffering', status => bufferIndicator.show(status));
playerBus.on('subtitle', text => subtitleRenderer.render(text));

// Emitting from video playback logic
videoElement.addEventListener('timeupdate', () => playerBus.emit('timeUpdate', videoElement.currentTime));
