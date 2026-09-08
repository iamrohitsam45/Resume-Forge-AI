import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import validateBody from '../validators/validate.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/authValidators.js';
import {
  updateProfile,
  changePassword,
  uploadProfileImage,
  deleteAccount,
} from '../controllers/userController.js';

const router = Router();

router.use(protect);
router.put('/profile', validateBody(updateProfileSchema), updateProfile);
router.put('/password', validateBody(changePasswordSchema), changePassword);
router.post('/profile-image', uploadImage.single('image'), uploadProfileImage);
router.delete('/account', deleteAccount);

export default router;
