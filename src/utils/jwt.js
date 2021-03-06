const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'development';

const sign = payload =>
  new Promise((resolve, reject) => {
    const options = {
      expiresIn: '1d'
    }

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject('Failed to sign token');
      } else {
        resolve(token)
      }
    });
  })

const verify = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        reject('Failed to verify token');
      } else {
        resolve(decodedToken)
      }
    })
  })

module.exports = {
  sign,
  verify
}