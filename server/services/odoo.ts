import * as xmlrpc from 'xmlrpc';

import config from '../config/app';

const {
  odoo: { url, db, uid, password },
} = config;

const client = xmlrpc.createClient({ url });

class OdooService {
  getOdooClientInfo = async (email: string) => {
    return new Promise((resolve, reject) => {
      client.methodCall(
        'execute_kw',
        [
          db,
          Number(uid),
          password,
          'res.partner',
          'search_read',
          [[['email', '=', email]]],
          { fields: ['name', 'vat', 'email', 'street'] },
        ],
        (err: any, value: any) => {
          if (err) reject(err);
          else resolve(value);
        }
      );
    });
  };
}

export default new OdooService();
