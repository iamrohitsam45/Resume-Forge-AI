import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import path from 'path';

const router = Router();

router.post(
  '/image',
  protect,
  uploadImage.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No image file provided');
    const url = `/uploads/${path.posix.join('images', req.file.filename)}`;
    res.status(201).json({ success: true, data: { url } });
  })
);

export default router;
