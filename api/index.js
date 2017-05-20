const express = require('express');
const mongodb = require('mongodb');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const config = require('./app/config');
const router = require('./app/router');
const periodic = require('./app/periodic');

const MongoClient = mongodb.MongoClient;
const MongoUrl = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;

const initialize = (db) => {
  const app = express();
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(express.static('./../web/'));
  app.listen(config.server.port);
  router(app, db);
  periodic(db);
};

MongoClient.connect(MongoUrl, (err, db) => {
  if (err === null) initialize(db);
});
