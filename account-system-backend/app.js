const express = require('express');
const config = require('config');
const pg = require('pg');

const app = express();
const cors = require('cors');

var conString =
  'postgres://mydjbees:kpDT6lELnMMnA1qSkrRDHnzz7Hb1sdMO@dumbo.db.elephantsql.com:5432/mydjbees'; //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function (err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
    client.end();
  });
});

app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth.routes'));
app.use('/expenses', require('./routes/expenses.routes'))
app.use('/family', require('./routes/family.routes'))

const PORT = config.get('port') || 5000;

async function start() {
  console.log;
  try {
    app.listen(5000, () => {
      console.log(`App has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
