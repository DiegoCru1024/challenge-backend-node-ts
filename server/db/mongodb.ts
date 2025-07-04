import mongoose from 'mongoose';

import config from '../config/app';
import { createModuleLogger } from '../utils/logger.utils';

const {
  dbnorel: { accounts, products },
} = config;

const logger = createModuleLogger('MongoDB');

const makeNewConnection = (name: string, uri: string) => {
  const db = mongoose.createConnection(uri);

  db.on('error', error => {
    logger.error('Error connecting to MongoDB', {
      database: name,
      error: error.message,
      stack: error.stack,
    });
    db.close().catch(() =>
      logger.warn('Failed to close MongoDB connection', { database: name })
    );
  });

  db.on('connected', () =>
    logger.info('Established connection to MongoDB', { database: name })
  );

  db.on('disconnected', () =>
    logger.info('Disconnected from MongoDB', { database: name })
  );

  return db;
};

const cnxAccounts = makeNewConnection('eiAccounts', accounts.uri);
const cnxProducts = makeNewConnection('eiProducts', products.uri);

export { cnxAccounts, cnxProducts };
