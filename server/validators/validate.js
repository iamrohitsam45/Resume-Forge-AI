import ApiError from '../utils/ApiError.js';

// Generic middleware factory: validates req.body against a zod schema,
// replacing req.body with the parsed (and defaulted/coerced) result.
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      return next(new ApiError(400, 'Validation failed', details));
    }
    req.body = result.data;
    next();
  };
}

export default validateBody;
