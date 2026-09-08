import asyncHandler from '../utils/asyncHandler.js';
import { TEMPLATE_STYLES } from '../constants/templateStyles.js';

export const listTemplates = asyncHandler(async (req, res) => {
  const templates = Object.entries(TEMPLATE_STYLES).map(([key, t]) => ({
    key,
    name: t.name,
    atsScore: t.atsScore,
    bestFor: t.bestFor,
    accent: t.accent,
    fontFamily: t.fontFamily,
  }));
  res.json({ success: true, data: templates });
});

export default { listTemplates };
