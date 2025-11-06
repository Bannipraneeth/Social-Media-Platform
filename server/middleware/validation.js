import { body, validationResult } from 'express-validator';
import xss from 'xss';

// Sanitize string to prevent XSS
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return xss(str.trim());
};

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Registration validation
export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one number and one special character'),
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Post creation/update validation
export const validatePost = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ max: 280 })
    .withMessage('Post cannot exceed 280 characters'),
  body('visibility')
    .optional()
    .isIn(['Public', 'Private'])
    .withMessage('Visibility must be either Public or Private'),
  handleValidationErrors
];

// Comment validation
export const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  handleValidationErrors
];

