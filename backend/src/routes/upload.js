import express from 'express';
import { uploadExcel, uploadImage } from '../middleware/fileUpload.js';
import { uploadExcelFile, uploadImageFile } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/excel', uploadExcel.single('file'), uploadExcelFile);
router.post('/image', uploadImage.single('file'), uploadImageFile);

export default router;

