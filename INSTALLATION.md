# ⚠️ Installation Instructions

## Current Status

The project structure is complete, but backend dependencies need to be installed manually due to custom npm registry configuration.

---

## 🔧 Manual Installation Steps

### 1. Backend Setup

```bash
cd /Users/praveen-4435/repos/WhatsApp-Bulk-Message-Agent/backend
```

#### Option A: Install from public npm registry (Recommended)

If your organization blocks certain packages, temporarily use public npm:

```bash
# Backup current npm config
npm config get registry

# Use public npm registry
npm config set registry https://registry.npmjs.org/

# Install dependencies
npm install

# If needed, restore your registry
npm config set registry YOUR_ORIGINAL_REGISTRY
```

#### Option B: Install packages individually

```bash
npm install express@4.18.2
npm install mongoose@8.0.0
npm install dotenv@16.3.1
npm install cors@2.8.5
npm install multer@1.4.5-lts.1
npm install axios@1.6.0
npm install joi@17.11.0
npm install form-data@4.0.0
npm install node-schedule@2.1.1
npm install nodemon@3.0.1 --save-dev
```

#### For xlsx package (Excel parsing):

```bash
# Direct download from CDN
npm install https://cdn.sheetjs.com/xlsx-0.20.1/xlsx-0.20.1.tgz
```

Or alternatively:

```bash
# If the CDN link doesn't work, try npm registry
npm install xlsx@0.18.5
```

### 2. Frontend Setup

```bash
cd /Users/praveen-4435/repos/WhatsApp-Bulk-Message-Agent/frontend

# Frontend dependencies should already be installed
# If not, run:
npm install
```

---

## 🚀 Starting the Application

### Terminal 1 - Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# OR check if already running
mongosh
```

### Terminal 2 - Start Backend

```bash
cd /Users/praveen-4435/repos/WhatsApp-Bulk-Message-Agent/backend

# Make sure .env is configured with your WhatsApp credentials
npm run dev
```

Expected output:
```
🚀 Server is running on port 5000
MongoDB Connected: localhost
✅ WhatsApp API credentials configured
```

### Terminal 3 - Start Frontend

```bash
cd /Users/praveen-4435/repos/WhatsApp-Bulk-Message-Agent/frontend

npm run dev
```

Expected output:
```
VITE v3.x.x ready in xxx ms
Local:   http://localhost:5173/
```

---

## 📋 Pre-Flight Checklist

Before using the app, ensure:

- [ ] MongoDB is running
- [ ] Backend `.env` file is configured with WhatsApp credentials
- [ ] Backend server started successfully (port 5000)
- [ ] Frontend server started successfully (port 5173)
- [ ] You have WhatsApp Business Account with Cloud API access
- [ ] You have prepared an Excel file with Name and Phone Number columns

---

## 🧪 Testing the Installation

### 1. Test Backend Health

Open browser or use curl:

```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-23T..."
}
```

### 2. Test WhatsApp Connection

```bash
curl http://localhost:5000/api/campaigns/verify-whatsapp
```

Should return success or error message about credentials.

### 3. Test Frontend

Open browser: `http://localhost:5173`

You should see the WhatsApp Bulk Message Agent dashboard.

---

## 📱 WhatsApp Cloud API Setup

If you haven't set up WhatsApp Cloud API yet:

1. **Go to Meta for Developers**: https://developers.facebook.com/
2. **Create App** (or use existing)
3. **Add WhatsApp Product**
4. **Get Credentials**:
   - Phone Number ID
   - Access Token (Generate permanent token)
   - Business Account ID

5. **Update backend/.env**:
```env
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
```

### Getting Permanent Token:

1. In your app, go to **Business Settings > System Users**
2. Create system user with admin role
3. Generate token with permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
4. Token never expires (until manually revoked)

---

## 📝 Create Sample Excel File

Create a file named `customers.xlsx` with this data:

| Name    | Phone Number  |
|---------|---------------|
| Test User | +1YOUR_NUMBER |
| John    | +1234567890   |
| Sarah   | +1234567891   |

**Important**: Replace `+1YOUR_NUMBER` with your actual WhatsApp number for testing!

---

## 🔍 Troubleshooting

### Backend Dependencies Won't Install

**Issue**: Custom npm registry blocking packages

**Solution**:
```bash
# Temporarily use public npm
npm config set registry https://registry.npmjs.org/
npm install
# Restore original registry after
```

### XLSX Package Fails

**Solution 1** - Use direct CDN link (already in package.json):
```bash
npm install https://cdn.sheetjs.com/xlsx-0.20.1/xlsx-0.20.1.tgz
```

**Solution 2** - Use older version from npm:
```bash
npm install xlsx@0.18.5
```

**Solution 3** - Update import in code:
If you install a different Excel library, update:
- `backend/src/services/excelParserXlsx.js`

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh

# If not installed:
# macOS
brew install mongodb-community

# Start service
brew services start mongodb-community
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## ✅ Verification Steps

Once everything is running:

1. **Create Test Campaign**:
   - Upload Excel with your phone number
   - Draft message: "Hi {name}, this is a test!"
   - Preview and send to yourself

2. **Check WhatsApp**:
   - You should receive message on WhatsApp
   - Name should be personalized

3. **View Logs**:
   - Check campaign history in dashboard
   - View detailed logs
   - Verify status is "sent" or "delivered"

---

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - Complete project documentation
- `INSTALLATION.md` - This file

---

## 🎉 Ready to Use!

Once all steps are complete:

1. Open `http://localhost:5173` in browser
2. Upload your customer Excel file
3. Draft your personalized message
4. Send bulk WhatsApp messages!

---

## 💡 Tips

- Start with small test batch (5-10 customers)
- Verify messages are delivered correctly
- Check WhatsApp rate limits (1000 free conversations/month)
- Monitor campaign logs for any failures
- Keep backup of customer Excel files

---

**Need help?** Check the troubleshooting section or review the setup guide.

Good luck with your bulk messaging! 📱✨

