import Campaign from '../models/Campaign.js';
import MessageLog from '../models/MessageLog.js';
import queueManager from '../services/queueManager.js';
import whatsappService from '../services/whatsappService.js';

export const createCampaign = async (req, res, next) => {
  try {
    const { name, messageTemplate, customers, imageUrl, imagePath } = req.body;

    if (!name || !messageTemplate || !customers || !Array.isArray(customers)) {
      return res.status(400).json({
        success: false,
        message: 'Name, messageTemplate, and customers array are required'
      });
    }

    if (customers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customers array cannot be empty'
      });
    }

    const campaign = await Campaign.create({
      name,
      messageTemplate,
      customers,
      imageUrl,
      imagePath,
      totalMessages: customers.length,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });

  } catch (error) {
    next(error);
  }
};

export const getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: campaigns
    });

  } catch (error) {
    next(error);
  }
};

export const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: campaign
    });

  } catch (error) {
    next(error);
  }
};

export const sendCampaign = async (req, res, next) => {
  try {
    const campaignId = req.params.id;

    const result = await queueManager.processCampaign(campaignId);

    res.json({
      success: true,
      message: 'Campaign sending started',
      data: result
    });

  } catch (error) {
    next(error);
  }
};

export const getCampaignLogs = async (req, res, next) => {
  try {
    const logs = await MessageLog.find({ campaignId: req.params.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    next(error);
  }
};

export const getQueueStatus = async (req, res, next) => {
  try {
    const status = queueManager.getStatus();

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    next(error);
  }
};

export const verifyWhatsAppConnection = async (req, res, next) => {
  try {
    const result = await whatsappService.verifyCredentials();

    if (result.success) {
      res.json({
        success: true,
        message: 'WhatsApp connection verified successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'WhatsApp connection failed',
        error: result.error
      });
    }

  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Don't allow deletion of campaigns that are currently sending
    if (campaign.status === 'sending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete campaign that is currently sending'
      });
    }

    // Delete associated message logs
    await MessageLog.deleteMany({ campaignId: campaign._id });

    // Delete campaign
    await Campaign.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

