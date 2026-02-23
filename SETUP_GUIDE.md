# 🚀 Quick Start Guide

## Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Either:
   - Local installation - [Download](https://www.mongodb.com/try/download/community)
   - MongoDB Atlas (Cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
3. **WhatsApp Business Account** with Cloud API access

---

## Step 1: Get WhatsApp Cloud API Credentials

### Option 1: Meta (Facebook) WhatsApp Cloud API (Recommended - FREE)

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an App or use existing one
3. Add "WhatsApp" product to your app
4. Navigate to **WhatsApp > API Setup**
5. Copy the following credentials:
   - **Phone Number ID** - Found under "Phone Number ID"
   - **Access Token** - Temporary token (24 hours) or generate permanent token
   - **Business Account ID** - Found in app settings

### Getting a Permanent Access Token:

1. In Meta for Developers, go to your app
2. Navigate to **Settings > Basic**
3. Note your **App ID** and **App Secret**
4. Go to **WhatsApp > API Setup**
5. Click "Generate Access Token" for System User
6. Assign permissions: `whatsapp_business_messaging`, `whatsapp_business_management`

### Rate Limits (Meta Free Tier):
- **1,000 free conversations per month**
- Text messages: Relatively unlimited within conversation windows  
- Media messages: Same as text
- Rate: ~80 messages per second (but better to send 1-2 per second)

---

## Step 2: Setup MongoDB

### Option A: Local MongoDB

```bash
# Start MongoDB service
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# MongoDB service should start automatically
```

Your connection string will be: `mongodb://localhost:27017/whatsapp-bulk`

### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/whatsapp-bulk
   ```

---

## Step 3: Configure Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file with your credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/whatsapp-bulk
   WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   WHATSAPP_PHONE_NUMBER_ID=your_actual_phone_number_id
   WHATSAPP_ACCESS_TOKEN=your_actual_access_token
   WHATSAPP_BUSINESS_ACCOUNT_ID=your_actual_business_account_id
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. Install dependencies (if not already done):
   ```bash
   npm install
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Server is running on port 5000
   MongoDB Connected: ...
   ✅ WhatsApp API credentials configured
   ```

---

## Step 4: Configure Frontend

1. Open a new terminal and navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Local:   http://localhost:5173/
   ```

---

## Step 5: Prepare Excel File

Create an Excel file (.xlsx or .xls) with the following format:

| Name    | Phone Number  |
|---------|---------------|
| John    | +1234567890   |
| Sarah   | +1234567891   |
| Michael | +91234567892  |

**Important:**
- **Column A**: Customer Name
- **Column B**: Phone Number with country code (e.g., +1 for US, +91 for India, +44 for UK)
- First row can be headers (optional) - the app will detect it automatically
- Phone numbers MUST include country code with + prefix

### Sample Data:

Download sample Excel: [Create one manually or use this format]

---

## Step 6: Use the Application

1. Open browser and go to: `http://localhost:5173`

2. **Upload Excel File**:
   - Click or drag-and-drop your Excel file
   - System will validate and show customer count

3. **Draft Message**:
   - Enter campaign name
   - Type your message
   - Use `{name}` placeholder for personalization
   - Example: `Hi {name}, we have a special offer for you!`

4. **Upload Image** (Optional):
   - Add an image to send with messages
   - Supported formats: JPG, PNG, GIF, WebP
   - Max size: 5MB

5. **Preview & Send**:
   - Click "Preview & Send"
   - Review personalized messages
   - Confirm to start sending

6. **Monitor Progress**:
   - View real-time sending status
   - Check campaign history
   - View detailed logs for each message

---

## Testing with Test Numbers

Before sending to real customers, test with your own WhatsApp number:

1. Create Excel with your number:
   ```
   Your Name, +your_country_code_your_number
   ```

2. Send a test campaign to verify everything works

---

## Troubleshooting

### Backend won't start:
- Check MongoDB is running: `mongosh` (should connect)
- Verify `.env` file has correct credentials
- Check port 5000 is not in use

### WhatsApp messages not sending:
- Verify WhatsApp credentials in `.env`
- Check access token hasn't expired
- Test credentials by visiting: `http://localhost:5000/api/campaigns/verify-whatsapp`
- Ensure phone numbers have correct country code format

### Excel file not parsing:
- Ensure phone numbers are in Column B
- Verify phone format: +1234567890 (with + and country code)
- Check file is .xlsx or .xls format

### Frontend can't connect to backend:
- Ensure backend is running on port 5000
- Check CORS settings in backend `.env`
- Verify `VITE_API_URL` in frontend `.env`

---

## Rate Limiting & Best Practices

1. **Respect WhatsApp Limits**:
   - Free tier: 1,000 conversations/month
   - Don't send too fast (2 seconds between messages is safe)

2. **Message Quality**:
   - Keep messages personal and relevant
   - Avoid spam-like content
   - Include opt-out option

3. **Phone Number Format**:
   - Always include country code
   - Remove spaces, dashes, parentheses
   - Format: +[country code][number]

4. **Testing**:
   - Test with small batches first
   - Verify messages are delivered correctly
   - Check formatting and personalization

---

## Production Deployment

When ready for production:

1. Use permanent WhatsApp access token
2. Deploy MongoDB to Atlas or managed service
3. Use environment variables for all secrets
4. Deploy backend to: Heroku, AWS, Digital Ocean
5. Deploy frontend to: Vercel, Netlify
6. Setup HTTPS for security
7. Implement authentication
8. Add rate limiting
9. Setup monitoring and logging

---

## Support & Documentation

- **WhatsApp Cloud API Docs**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **MongoDB Docs**: https://docs.mongodb.com/
- **React Docs**: https://react.dev/

---

## Next Steps

✅ Setup complete? Try these:
1. Send test campaign to yourself
2. Monitor delivery status
3. Check campaign history
4. Explore message logs
5. Scale up for production use

Happy messaging! 📱✨

