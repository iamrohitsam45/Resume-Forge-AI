import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import validateBody from '../validators/validate.js';
import {
  summarySchema,
  experienceSchema,
  projectSchema,
  achievementSchema,
  improveBulletSchema,
  atsAnalysisSchema,
  jobAnalysisSchema,
  keywordOptimizationSchema,
  askAssistantSchema,
} from '../validators/aiValidators.js';
import {
  generateSummary,
  generateExperienceDescription,
  generateProjectDescription,
  generateAchievementDescription,
  improveBullet,
  atsAnalysis,
  jobDescriptionAnalysis,
  keywordOptimization,
  tailorResume,
  askAssistant,
} from '../controllers/aiController.js';

const router = Router();

router.use(protect, aiLimiter);

router.post('/summary', validateBody(summarySchema), generateSummary);
router.post('/experience-description', validateBody(experienceSchema), generateExperienceDescription);
router.post('/project-description', validateBody(projectSchema), generateProjectDescription);
router.post('/achievement-description', validateBody(achievementSchema), generateAchievementDescription);
router.post('/improve-bullet', validateBody(improveBulletSchema), improveBullet);
router.post('/ats-analysis', validateBody(atsAnalysisSchema), atsAnalysis);
router.post('/job-description-analysis', validateBody(jobAnalysisSchema), jobDescriptionAnalysis);
router.post('/job-analysis', validateBody(jobAnalysisSchema), jobDescriptionAnalysis);
router.post('/keyword-optimization', validateBody(keywordOptimizationSchema), keywordOptimization);
router.post('/tailor-resume', validateBody(keywordOptimizationSchema), tailorResume);
router.post('/assistant', validateBody(askAssistantSchema), askAssistant);

export default router;
