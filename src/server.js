

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config');
const roomRouter = require('./routes/room');


function getApp() {
  const app = express();

  const allCors = cors({
    origin: /(.*localhost.*)/,
    optionsSuccessStatus: 200,
    credentials: true,
  });
  app.use(allCors);
  app.options('*', allCors);

  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
    parameterLimit: 5000,
  }));

  app.use('/', roomRouter);

  return app;
}

exports.start = () => {
  const app = getApp();

  const server = app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}, PID ${process.pid}`);
  });

  server.keepAliveTimeout = 60 * 1000;
}