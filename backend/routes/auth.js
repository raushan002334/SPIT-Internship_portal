const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const normalizeAllowedEmails = () => {
  const allowed = process.env.ALLOWED_SIGNUP_EMAILS || '';
  return allowed
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

const createToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'JWT secret is not configured' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const allowedEmails = normalizeAllowedEmails();
    const requiredInviteCode = process.env.SIGNUP_INVITE_CODE || '';

    if (allowedEmails.length === 0) {
      return res.status(403).json({ success: false, message: 'Signup is disabled by admin' });
    }

    if (!allowedEmails.includes(normalizedEmail)) {
      return res.status(403).json({ success: false, message: 'Signup is restricted for this email' });
    }

    if (requiredInviteCode && inviteCode !== requiredInviteCode) {
      return res.status(403).json({ success: false, message: 'Invalid invite code' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: normalizedEmail === adminEmail ? 'admin' : 'teacher',
      isActive: true,
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'JWT secret is not configured' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch user', error: error.message });
  }
});

module.exports = router;
