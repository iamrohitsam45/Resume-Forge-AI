import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({ success: true, data: { user: user.toSafeObject(), token } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);
  res.json({ success: true, data: { user: user.toSafeObject(), token } });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toSafeObject() } });
});

export const logout = asyncHandler(async (req, res) => {
  // Stateless JWT - logout is handled client-side by discarding the token.
  res.json({ success: true, message: 'Logged out' });
});

export default { register, login, me, logout };
