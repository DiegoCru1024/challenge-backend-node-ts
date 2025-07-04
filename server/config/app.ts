import 'dotenv/config';

const config = {
  server: {
    port: process.env.PORT || process.env.APP_PORT!,
  },
  dbnorel: {
    accounts: {
      uri: process.env.MONGODB_URL_ACCOUNTS!,
    },
    products: {
      uri: process.env.MONGODB_URL_PRODUCTS!,
    },
  },
  odoo: {
    url: process.env.ODOO_URL || '',
    db: process.env.ODOO_DB || '',
    uid: process.env.ODOO_UID || '',
    password: process.env.ODOO_PASSWORD || '',
  },
  pagination: {
    page: Number(process.env.PAGE) || 1,
    perPage: Number(process.env.PAGE) || 20,
  },
};

export default config;
