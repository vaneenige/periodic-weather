const request = require('request');
const config = require('./../config');

const locationController = {
  /**
   * Check if a location already exists
   *
   * @param {object} db
   * @param {string} location
   * @param {function} foundCallback
   * @param {function} notFoundCallback
   */
  checkDouble: (db, location, foundCallback, notFoundCallback) => {
    const collection = db.collection('status');
    const filter = { name: location };
    const callback = (err, result) => {
      if (result !== null) {
        foundCallback(result);
      } else {
        notFoundCallback(result);
      }
    };
    collection.findOne(filter, callback);
  },

  /**
   * Get the status of a single location.
   *
   * @param {object} db
   * @param {object} body
   * @param {function} returnCallback
   */
  getSingle: (db, { location }, returnCallback) => {
    // Check if the location already exists
    locationController.checkDouble(db, location, returnCallback, () => {
      // Request the location if it doesn't exist
      locationController.requestSingle(db, location, returnCallback);
    });
  },

  /**
   * Request the status of a single location from the API.
   *
   * @param {object} db
   * @param {string} location
   * @param {function} callback
   */
  requestSingle: (db, location, callback) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    const options = {
      url: `${config.owm.url}/weather?q=${location}&appid=${config.owm.KEY}&units=metric`,
      method: 'GET',
      headers,
    };
    request(options, (error, response, body) => {
      const parsedBody = JSON.parse(body);
      locationController.checkDouble(db, parsedBody.name, callback, () => {
        locationController.addLocation(db, parsedBody);
        locationController.addStatus(db, parsedBody);
        callback(JSON.stringify(locationController.getStatus(parsedBody)));
      });
    });
  },

  /**
   * Get the status of multiple locations.
   *
   * @param {object} db
   * @param {object} body
   * @param {function} returnCallback
   */
  getMultiple: (db, { locations }, returnCallback) => {
    const collection = db.collection('status');
    const filter = { id: { $in: locations } };
    const callback = (err, result) => {
      result.toArray().then((response) => {
        const returnValue = [];
        response.forEach(({ id, name, description, temp, icon }) => {
          returnValue.push({ id, name, description, temp, icon });
        });
        returnCallback(JSON.stringify(returnValue));
      });
    };
    collection.find(filter, callback);
  },

  /**
   * Request the status of multiple locations from the API.
   *
   * @param {object} db
   * @param {array} locations
   * @param {function} callback
   */
  requestMultiple: (db, locations, callback) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    const options = {
      url: `${config.owm.url}/group?id=${locations.join(',')}&appid=${config.owm.KEY}&units=metric`,
      method: 'GET',
      headers,
    };
    request(options, (error, response, body) => {
      const parsedBody = JSON.parse(body);
      if (typeof parsedBody.list !== 'undefined') {
        for (let i = 0; i < parsedBody.list.length; i += 1) {
          locationController.addStatus(db, parsedBody.list[i]);
        }
      }
      callback(parsedBody);
    });
  },

  /**
   * Add a new location to the collection.
   *
   * @param {object} db
   * @param {object} location
   */
  addLocation: (db, { id, name, coord }) => {
    const collection = db.collection('locations');
    const { lat, lon } = coord;
    collection.insert({ id, name, lat, lon });
  },

  /**
   * Add a new status to the collection.
   *
   * @param {object} db
   * @param {object} status
   */
  addStatus: (db, { id, name, weather, main }) => {
    const collection = db.collection('status');
    const { description, icon } = weather[0];
    const { temp } = main;
    const filter = { id };
    const update = { $set: { temp, description, icon } };
    const callback = (err, result) => {
      if (result.value === null) collection.insert({ id, name, temp, description, icon });
    };
    collection.findOneAndUpdate(filter, update, callback);
  },

  /**
   * Get the status of a single location.
   *
   * @param {object} status
   */
  getStatus: ({ id, name, weather, main }) => {
    const { description, icon } = weather[0];
    const { temp } = main;
    return { id, name, temp, description, icon };
  },
};

module.exports = locationController;
