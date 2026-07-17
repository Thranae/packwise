import ApiError from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const messages = error.errors.map((e) => e.message);
    next(new ApiError(400, 'Validation Error', messages));
  }
};
