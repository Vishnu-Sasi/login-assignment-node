const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/auth');

// User Registration
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Failed to register user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Failed to log in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports={
  register,
  login
}
