import express from 'express';
import { updateProfileSchema, updateThemeSchema } from '../validators/user.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.get('/theme', userController.getTheme);
router.patch('/theme', validate(updateThemeSchema), userController.updateTheme);

router.post('/profile/image', upload.single('profileImage'), userController.uploadProfileImage);

export default router;
