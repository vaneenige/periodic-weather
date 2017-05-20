const locationController = require('./controllers/locationController');
const notificationController = require('./controllers/notificationController');

const periodicSyncData = {};

/**
 * Get all location ids from the collection.
 *
 * @param {object} db
 * @param {function} callback
 */
const getPeriodicSyncLocations = (db, callback) => {
  const collection = db.collection('locations');
  const locationsIds = [];
  collection.find({}, (err, result) => {
    result.toArray().then((response) => {
      response.forEach(({ id }) => {
        locationsIds.push(id);
      });
      callback(locationsIds);
    });
  });
};

/**
 * Push a notification to all subscribed users.
 *
 * @param {object} db
 * @param {object} location
 * @param {object} err
 * @param {object} result
 */
const notifySubscriptions = (db, location, err, result) => {
  result.toArray().then((response) => {
    response.forEach(({ subscriptionId }) => {
      // Send a notification with the location payload to the subscribed user
      notificationController.send(db, subscriptionId, location, () => { });
    });
  });
};

/**
 * Handle periodic sync and provide user specifc notifications
 *
 * @param {object} db
 */
const onPeriodicInterval = (db) => {
  // Get all locations that should be updated
  getPeriodicSyncLocations(db, (locationIds) => {
    // Divide the locations in chunks for specific API rules
    for (let i = 0; i < locationIds.length; i += 20) {
      const locationChunk = locationIds.slice(i, i + 20);
      // Request the locations in the chunks, update them in mongo and continue
      locationController.requestMultiple(db, locationChunk, (locations) => {
        // Report and return if the data doesn't match what we expect
        if (typeof locations.list === 'undefined') return;

        // Use subscriptions collection to find specific users that want a notification
        const collection = db.collection('subscriptions');

        // Loop over the added locations
        for (let j = 0; j < locations.list.length; j += 1) {
          const location = locations.list[j];
          const last = periodicSyncData[location.id];
          const { temp } = location.main;
          // Check if the location data has changed
          if (last !== temp) {
            // Find users that are subscribed to the location
            collection.find({
              locationId: location.id,
              state: true,
            }, (err, result) => (notifySubscriptions(db, location, err, result)));
          }

          // Set the current temperature for difference next update
          periodicSyncData[location.id] = temp;
        }
      });
    }
  });
};

/**
 * Call periodic sync every interval (5 minutes)
 *
 * @param {object} db
 */
const periodic = (db) => {
  onPeriodicInterval(db);
  setInterval(() => {
    onPeriodicInterval(db);
  }, 300000);
};

module.exports = periodic;
