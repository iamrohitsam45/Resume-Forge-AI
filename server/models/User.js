import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
    profileImage: { type: String, default: '' },
    settings: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      defaultTemplate: { type: String, default: 'modern-professional' },
      defaultPageSize: { type: String, enum: ['A4', 'Letter'], default: 'A4' },
      aiTone: { type: String, enum: ['professional', 'concise', 'impactful'], default: 'professional' },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profileImage: this.profileImage,
    settings: this.settings,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model('User', userSchema);
export default User;
