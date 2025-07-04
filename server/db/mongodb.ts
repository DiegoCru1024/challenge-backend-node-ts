import mongoose from 'mongoose';

import config from '../config/app';

const {
  dbnorel: { accounts, products },
} = config;

const makeNewConnection = (name: string, uri: string) => {
  const db = mongoose.createConnection(uri);

  db.on('error', error => {
    console.error(
      `:: MongoDB :: Error connect to db-no-rel: ${name} :: ${JSON.stringify(
        error
      )}`
    );
    db.close().catch(() =>
      console.info(`MongoDB :: Failed to close connection ${name}`)
    );
  });

  db.on('connected', () =>
    console.info(`:: MongoDB :: Established connection to db-no-rel: ${name}`)
  );

  db.on('disconnected', () =>
    console.info(`:: MongoDB :: Disconnected from db-no-rel: ${name}`)
  );

  return db;
};

const cnxAccounts = makeNewConnection('eiAccounts', accounts.uri);
const cnxProducts = makeNewConnection('eiProducts', products.uri);

export { cnxAccounts, cnxProducts };
