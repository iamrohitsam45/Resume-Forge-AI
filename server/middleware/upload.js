import multer from 'multer';
import path from 'path';
import fs from 'fs';
import env from '../config/env.js';
import safeFilename from '../utils/safeFilename.js';
import ApiError from '../utils/ApiError.js';

const uploadRoot = path.resolve(process.cwd(), env.uploadDir);
const imageDir = path.join(uploadRoot, 'images');

for (const dir of [uploadRoot, imageDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(new ApiError(400, 'Only JPG, JPEG, PNG, and WEBP images are allowed'));
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024, files: 1 },
});

export const uploadsRoot = uploadRoot;
export default uploadImage;
