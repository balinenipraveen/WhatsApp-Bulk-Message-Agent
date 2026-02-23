import Campaign from '../models/Campaign.js';
import MessageLog from '../models/MessageLog.js';
import whatsappService from './whatsappService.js';
import { personalizeMessage } from './messageTemplate.js';

class QueueManager {
  constructor() {
    this.isProcessing = false;
    this.currentCampaign = null;
    this.delayBetweenMessages = 2000; // 2 seconds between messages
  }

  /**
   * Add campaign to queue and start processing
   */
  async processCampaign(campaignId) {
    try {
      const campaign = await Campaign.findById(campaignId);

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      if (campaign.status === 'sending') {
        throw new Error('Campaign is already being processed');
      }

      // Update campaign status
      campaign.status = 'sending';
      campaign.startedAt = new Date();
      await campaign.save();

      // Create message logs for all customers
      const messageLogs = campaign.customers.map(customer => ({
        campaignId: campaign._id,
        customerName: customer.name,
        phoneNumber: customer.phoneNumber,
        personalizedMessage: personalizeMessage(campaign.messageTemplate, customer.name),
        status: 'pending'
      }));

      await MessageLog.insertMany(messageLogs);

      // Start processing in background
      this.startProcessing(campaign);

      return {
        success: true,
        message: 'Campaign started',
        campaignId: campaign._id
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process messages in background
   */
  async startProcessing(campaign) {
    if (this.isProcessing) {
      console.log('Queue is already processing');
      return;
    }

    this.isProcessing = true;
    this.currentCampaign = campaign;

    try {
      // Get all pending messages for this campaign
      const pendingMessages = await MessageLog.find({
        campaignId: campaign._id,
        status: 'pending'
      });

      console.log(`Processing ${pendingMessages.length} messages for campaign ${campaign._id}`);

      for (const messageLog of pendingMessages) {
        try {
          // Send message via WhatsApp
          const result = await whatsappService.sendMessage(
            messageLog.phoneNumber,
            messageLog.personalizedMessage,
            campaign.imagePath
          );

          if (result.success) {
            // Update message log
            messageLog.status = 'sent';
            messageLog.whatsappMessageId = result.messageId;
            messageLog.sentAt = new Date();
            await messageLog.save();

            // Update campaign stats
            campaign.sentMessages += 1;
          } else {
            // Mark as failed
            messageLog.status = 'failed';
            messageLog.errorMessage = result.error;
            await messageLog.save();

            campaign.failedMessages += 1;
          }

          await campaign.save();

          // Delay between messages to respect rate limits
          await this.delay(this.delayBetweenMessages);

        } catch (error) {
          console.error(`Error sending message to ${messageLog.phoneNumber}:`, error);

          messageLog.status = 'failed';
          messageLog.errorMessage = error.message;
          await messageLog.save();

          campaign.failedMessages += 1;
          await campaign.save();
        }
      }

      // Mark campaign as completed
      campaign.status = 'completed';
      campaign.completedAt = new Date();
      await campaign.save();

      console.log(`Campaign ${campaign._id} completed`);

    } catch (error) {
      console.error('Error processing campaign:', error);

      campaign.status = 'failed';
      await campaign.save();
    } finally {
      this.isProcessing = false;
      this.currentCampaign = null;
    }
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      isProcessing: this.isProcessing,
      currentCampaign: this.currentCampaign ? {
        id: this.currentCampaign._id,
        name: this.currentCampaign.name,
        sentMessages: this.currentCampaign.sentMessages,
        totalMessages: this.currentCampaign.totalMessages
      } : null
    };
  }
}

export default new QueueManager();

