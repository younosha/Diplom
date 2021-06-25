const jwt = require('jsonwebtoken');
const config = require('config');
require('dotenv').config();

function jwtGenerator(id) {
  const payload = {
    user: {
      id: id,
    },
  };

  return jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1h' });
}

function jwtObjGenerator (obj) {
   const object = {obj}
   return jwt.sign(object, config.get('jwtSecret'), { expiresIn: '1h' })
}
module.exports = jwtGenerator, jwtObjGenerator;
