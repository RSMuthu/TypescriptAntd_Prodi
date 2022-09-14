const path = require('path');

const cookieParser = require('cookie-parser');
const express = require('express');
const httpContext = require('express-http-context');
const expressLogger = require('express-winston');

const logger = require('./utils/logger');

const app = express();

app.disable('x-powered-by');
app.use(require('compression')());

app.use(httpContext.middleware);

app.use((req, res, next) => {
  // use uuid v4 for req ID
  httpContext.set('reqId', require('uuid').v4());
  next();
});

app.use(expressLogger.logger({ winstonInstance: logger }));
app.use(
  expressLogger.errorLogger({
    winstonInstance: logger,
    dumpExceptions: true,
    showStack: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // used during form encoded request
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

if (process.env.NODE_ENV !== 'prod') {
  // use this only for local development
  // Hot compilation purpose

  // this middleware is to handle the historyApiFallback similar in webpack-dev-server
  // tells express to followup react route in case of any arbitrary routing
  app.use(require('connect-history-api-fallback')());

  // on every change (either on react or express code) the server will restart
  const compiler = require('webpack')(require('./webpack.config'));
  app.use(require('webpack-dev-middleware')(compiler));
  app.use(require('webpack-hot-middleware')(compiler));
}

// app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));

process.on('uncaughtException', (error) => {
  logger.error('app: Global error', error);
});

module.exports = app;
