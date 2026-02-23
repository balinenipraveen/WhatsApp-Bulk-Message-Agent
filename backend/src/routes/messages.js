import express from 'express';
import { validateMessageTemplate, previewMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post('/validate', validateMessageTemplate);
router.post('/preview', previewMessages);

export default router;

