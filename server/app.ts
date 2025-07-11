import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { startApolloServer } from './graphql';
import { logger, httpLogger } from './config/logger';

import config from './config/app';

const app = express();

app.use(httpLogger);

app.use(cors());

app.use((req, res, next) => {
  if (req.path === '/graphql') {
    return next();
  }
  bodyParser.json()(req, res, next);
});

app.use((req, res, next) => {
  if (req.path === '/graphql') {
    return next();
  }
  bodyParser.urlencoded({ extended: true })(req, res, next);
});

startApolloServer(app);

app.set('port', config.server.port);

app.listen(app.get('port'), () =>
  logger.info(`Server running on port ${app.get('port')}`)
);
