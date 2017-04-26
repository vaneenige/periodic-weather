const subscriptionController = {
  /**
   * Add a new subscription to the collection.
   *
   * @param {object} db
   * @param {object} body
   * @param {function} returnCallback
   */
  addSubscription: (db, { subscriptionId, locationId, state }, returnCallback) => {
    const collection = db.collection('subscriptions');
    const filter = { subscriptionId, locationId };
    const update = { $set: { subscriptionId, locationId, state } };
    const callback = (err, result) => {
      if (result.value !== null) {
        returnCallback(JSON.stringify(result));
      } else {
        collection.insert({ subscriptionId, locationId, state }, (returnValue) => {
          returnCallback(JSON.stringify(returnValue));
        });
      }
    };
    collection.findOneAndUpdate(filter, update, callback);
  },
};

module.exports = subscriptionController;
