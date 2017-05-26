const request = require('request');
const config = require('./../config');

const notificationController = {
  /**
   * Send message with payload to subscribed user.
   *
   * @param {object} db
   * @param {string} subscriptionId
   * @param {object} status
   */
  send: (db, subscriptionId, { id, name, weather, main }) => {
    const { description, icon } = weather[0];
    const { temp } = main;
    const headers = {
      Authorization: `key=${config.gcm.KEY}`,
      'Content-Type': 'application/json',
    };
    const options = {
      url: 'https://android.googleapis.com/gcm/send',
      method: 'POST',
      headers,
      body: `{"registration_ids":["${subscriptionId}"]}`,
    };
    const payload = {
      title: `${name}`,
      body: `${temp} ℃, ${description}`,
      icon,
      tag: id,
    };
    const collection = db.collection('messages');
    const filter = { subscriptionId, tag: id, state: true };
    const update = { $set: { body: payload.body, icon: payload.icon } };
    const callback = (err, result) => {
      if (result.value === null) {
        notificationController.createMessage(db, subscriptionId, payload, () => {
          request(options);
        });
      } else {
        request(options);
      }
    };
    collection.findOneAndUpdate(filter, update, callback);
  },

  /**
   * Create a new message to be requested on push.
   *
   * @param {object} db
   * @param {string} subscriptionId
   * @param {object} payload
   * @param {function} callback
   */
  createMessage: (db, subscriptionId, payload, callback) => {
    const collection = db.collection('messages');
    collection.insert({
      subscriptionId,
      title: payload.title,
      body: payload.body,
      icon: payload.icon,
      tag: payload.tag,
      state: true,
    }, callback);
  },

  /**
   * Return last message found with subscription id.
   *
   * @param {object} db
   * @param {object} data
   * @param {function} returnCallback
   */
  obtain: (db, data, returnCallback) => {
    const collection = db.collection('messages');
    const filter = {
      subscriptionId: data.subscriptionId,
      state: true,
    };
    const update = {
      $set: { state: false },
    };
    const callback = (err, result) => {
      returnCallback(result);
    };
    collection.findOneAndUpdate(filter, update, callback);
  },
};

module.exports = notificationController;
