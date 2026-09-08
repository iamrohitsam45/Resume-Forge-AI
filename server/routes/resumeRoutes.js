import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import validateBody from '../validators/validate.js';
import { createResumeSchema, updateResumeSchema } from '../validators/resumeValidators.js';
import {
  createResume,
  listResumes,
  getResume,
  updateResume,
  deleteResume,
  duplicateResume,
  runAtsAnalysis,
  exportResume,
  saveVersion,
  listVersions,
  restoreVersion,
} from '../controllers/resumeController.js';

const router = Router();

router.use(protect);

router.route('/').post(validateBody(createResumeSchema), createResume).get(listResumes);
router
  .route('/:id')
  .get(getResume)
  .put(validateBody(updateResumeSchema), updateResume)
  .delete(deleteResume);

router.post('/:id/duplicate', duplicateResume);
router.post('/:id/ats', runAtsAnalysis);
router.get('/:id/export', exportResume);

router.post('/:id/versions', saveVersion);
router.get('/:id/versions', listVersions);
router.post('/:id/versions/:versionId/restore', restoreVersion);

export default router;
