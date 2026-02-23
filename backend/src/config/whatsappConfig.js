export const whatsappConfig = {
  apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
};

export const validateWhatsAppConfig = () => {
  const requiredFields = ['phoneNumberId', 'accessToken'];
  const missing = requiredFields.filter(field => !whatsappConfig[field] || whatsappConfig[field] === 'your_phone_number_id' || whatsappConfig[field] === 'your_access_token');

  if (missing.length > 0) {
    console.warn(`⚠️  Warning: WhatsApp API credentials not configured properly. Missing: ${missing.join(', ')}`);
    console.warn('   Please update your .env file with valid WhatsApp Cloud API credentials.');
    return false;
  }

  return true;
};

