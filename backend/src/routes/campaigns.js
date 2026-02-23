import express from 'express';
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  sendCampaign,
  getCampaignLogs,
  getQueueStatus,
  verifyWhatsAppConnection,
  deleteCampaign
} from '../controllers/campaignController.js';

const router = express.Router();

router.post('/', createCampaign);
router.get('/', getAllCampaigns);
router.get('/queue-status', getQueueStatus);
router.get('/verify-whatsapp', verifyWhatsAppConnection);
router.get('/:id', getCampaignById);
router.post('/:id/send', sendCampaign);
router.get('/:id/logs', getCampaignLogs);
router.delete('/:id', deleteCampaign);

export default router;

