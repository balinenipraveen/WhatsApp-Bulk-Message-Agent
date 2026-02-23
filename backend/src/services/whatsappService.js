import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { whatsappConfig } from '../config/whatsappConfig.js';

class WhatsAppService {
  constructor() {
    this.apiUrl = whatsappConfig.apiUrl;
    this.phoneNumberId = whatsappConfig.phoneNumberId;
    this.accessToken = whatsappConfig.accessToken;
  }

  /**
   * Send text message via WhatsApp Cloud API
   */
  async sendTextMessage(phoneNumber, message) {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;

      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phoneNumber,
          type: 'text',
          text: {
            preview_url: true,
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  /**
   * Upload media to WhatsApp Cloud API
   */
  async uploadMedia(filePath, mimeType) {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/media`;

      const formData = new FormData();
      formData.append('messaging_product', 'whatsapp');
      formData.append('file', fs.createReadStream(filePath));
      formData.append('type', mimeType);

      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          ...formData.getHeaders()
        }
      });

      return {
        success: true,
        mediaId: response.data.id
      };
    } catch (error) {
      console.error('Media Upload Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  /**
   * Send image with caption via WhatsApp Cloud API
   */
  async sendImageMessage(phoneNumber, imageId, caption) {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;

      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'image',
        image: {
          id: imageId
        }
      };

      // Add caption if provided
      if (caption) {
        payload.image.caption = caption;
      }

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  /**
   * Send message with optional image
   */
  async sendMessage(phoneNumber, message, imagePath = null) {
    try {
      // If image is provided, upload it first
      if (imagePath && fs.existsSync(imagePath)) {
        const uploadResult = await this.uploadMedia(imagePath, 'image/jpeg');

        if (!uploadResult.success) {
          throw new Error(`Failed to upload image: ${uploadResult.error}`);
        }

        // Send image with message as caption
        return await this.sendImageMessage(phoneNumber, uploadResult.mediaId, message);
      } else {
        // Send text only
        return await this.sendTextMessage(phoneNumber, message);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify if WhatsApp credentials are valid
   */
  async verifyCredentials() {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
}

export default new WhatsAppService();

