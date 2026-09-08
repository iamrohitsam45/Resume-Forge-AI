import mongoose from 'mongoose';

const { Schema } = mongoose;

// Lightweight snapshot store powering "Version History" (section 37).
const resumeVersionSchema = new Schema(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, default: '' },
    snapshot: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

resumeVersionSchema.index({ resumeId: 1, createdAt: -1 });

export const ResumeVersion = mongoose.model('ResumeVersion', resumeVersionSchema);
export default ResumeVersion;
