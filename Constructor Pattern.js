1. Constructor Pattern
Use Case: Subscriber Profiles
Each subscriber object holds profile details, playback preferences, and watch history methods.


function Subscriber(id, name, preferences) {
  this.id = id;
  this.name = name;
  this.preferences = preferences; // e.g., quality, subtitles
}
Subscriber.prototype.getWatchHistory = function() {
  // fetch from service
};
Subscriber.prototype.updatePreferences = function(prefs) {
  this.preferences = prefs;
  // persist changes
};

// Instantiation per signed-in user
const currentSubscriber = new Subscriber(101, 'Jamie', { quality: 'HD', subtitles: 'EN' });
