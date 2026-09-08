import bcrypt from 'bcryptjs';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import path from 'path';

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, settings } = req.body;
  if (name !== undefined) req.user.name = name;
  if (settings) req.user.settings = { ...req.user.settings.toObject?.() ?? req.user.settings, ...settings };
  await req.user.save();
  res.json({ success: true, data: { user: req.user.toSafeObject() } });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const ok = await user.comparePassword(currentPassword);
  if (!ok) throw new ApiError(400, 'Current password is incorrect');
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file provided');
  const relativePath = path.posix.join('images', req.file.filename);
  req.user.profileImage = `/uploads/${relativePath}`;
  await req.user.save();
  res.json({ success: true, data: { profileImage: req.user.profileImage } });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await Resume.deleteMany({ userId: req.user._id });
  await User.findByIdAndDelete(req.user._id);
  res.json({ success: true, message: 'Account and all associated resumes deleted' });
});

export default { updateProfile, changePassword, uploadProfileImage, deleteAccount };
