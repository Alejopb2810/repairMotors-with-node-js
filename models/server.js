const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const xss = require('xss-clean');

const { db } = require('../database/db');
const { repairRouter } = require('../routes/repair.routes');
const { userRouter } = require('../routes/user.routes');
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/error.controller');
const initModel = require('./init.model');
const { authRouter } = require('../routes/auth.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.paths = {
      auth: '/api/v1/auth',
      user: '/api/v1/user',
      repair: '/api/v1/repair',
    };

    this.database();

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(helmet());

    this.app.use(xss());

    this.app.use(hpp());

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use(cors());

    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.repair, repairRouter);
    this.app.use(this.paths.user, userRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }

  database() {
    db.authenticate()
      .then(() => console.log('database authenticated'))
      .catch(error => console.log(error));

    //relations
    initModel();

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('server is running on port', this.port);
    });
  }
}

module.exports = Server;
