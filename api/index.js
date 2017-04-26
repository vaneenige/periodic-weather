const express = require('express');
const mongodb = require('mongodb');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const config = require('./app/config');
const router = require('./app/router');
const periodic = require('./app/periodic');

const MongoClient = mongodb.MongoClient;
const MongoUrl = `mongodb://${config.mongo.host}:${config.mongo.port}`;

const initialize = (db) => {
  const app = express();
  app.use(helmet());
  app.use(bodyParser.json());
  app.listen(config.server.port, () => {
    console.log(`Application started on port ${config.server.port}`);
  });
  router(app, db);
  periodic(db);
};

// Only start if mongo is succesfully connected
MongoClient.connect(MongoUrl, (err, db) => {
  if (err === null) initialize(db);
});
