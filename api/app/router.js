const locationController = require('./controllers/locationController');
const subscriptionController = require('./controllers/subscriptionController');
const notificationController = require('./controllers/notificationController');

const router = (app, db) => {
  app.get('/', (req, res) => {
    res.send('Weather API!');
  });

  app.post('/locations', (req, res) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'location')) {
      locationController.getSingle(db, req.body, (result) => { res.send(result); });
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'locations')) {
      locationController.getMultiple(db, req.body, (result) => { res.send(result); });
    }
  });

  app.post('/subscriptions', (req, res) => {
    subscriptionController.addSubscription(db, req.body, (result) => { res.send(result); });
  });

  app.post('/notifications', (req, res) => {
    notificationController.obtain(db, req.body, (result) => { res.send(result); });
  });
};

module.exports = router;
