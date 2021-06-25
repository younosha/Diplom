const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'mydjbees',
  host: 'dumbo.db.elephantsql.com',
  database: 'mydjbees',
  password: 'kpDT6lELnMMnA1qSkrRDHnzz7Hb1sdMO',
  port: 5432,
});

module.exports = pool;
