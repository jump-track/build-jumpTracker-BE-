const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('./users.models.js');
const jwt = require('../../utils/jwt.js');

router.post('/register',
  validateInputs,
  validateDataType,
  usernameLowerCase,
  hashPassword,
  async (req, res) => {
    const { username, password, height, jumpHeight: jump_height } = req.body;
    try {
      const [id] = await db.insert({ username, password, height, jump_height });
      if (id) {
        const token = await jwt.sign({ id, username: req.body.username });
        res.status(201).json(token);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);


async function hashPassword(req, res, next) {
  try {
    req.body.password = await bcrypt.hashSync(req.body.password, 4);
    next();
  } catch {
    res.status(500).json({ message: 'Error hashing password' });
  }
}

function usernameLowerCase(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  next();
}

function validateDataType(req, res, next) {
  const { username, password, height, jumpHeight } = req.body;
  if (typeof username !== 'string') {
    res.status(400).json({ message: 'Username must be a string' });
  } else if (typeof password !== 'string') {
    res.status(400).json({ message: 'Password must be a string' });
  } else if (typeof height !== 'number') {
    res.status(400).json({ message: 'Height must be a number' });
  } else if (typeof jumpHeight !== 'number') {
    res.status(400).json({ message: 'Jump Height must be a number' });
  } else {
    next();
  }
}

function validateInputs(req, res, next) {
  const { username, password, height, jumpHeight } = req.body;
  if (username && password && height && jumpHeight) {
    next()
  } else {
    res.status(400).json({ message: 'All fields required' });
  }
}



module.exports = router;