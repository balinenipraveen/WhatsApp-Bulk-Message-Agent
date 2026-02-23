# WhatsApp Bulk Message Agent

A web application for sending bulk WhatsApp messages and images to customers with personalized name replacement.

## Features

- 📊 Upload customer data via Excel file (Name, Phone Number)
- ✉️ Create message templates with dynamic `{name}` placeholder
- 🖼️ Send images along with text messages
- 👀 Preview personalized messages before sending
- 📈 Track message delivery status
- 🔄 Queue-based sending with rate limiting
- 📝 Campaign history and analytics

## Tech Stack

- **Frontend**: React.js + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **WhatsApp API**: Meta Cloud API
- **File Processing**: ExcelJS

## Prerequisites

1. Node.js (v18 or higher)
2. MongoDB (local or Atlas)
3. WhatsApp Business Account with Cloud API access

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-bulk
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Get WhatsApp Cloud API Credentials

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add WhatsApp product
4. Get your:
   - Phone Number ID
   - Access Token
   - Business Account ID

## Usage

1. **Upload Excel File**: Use template with columns: Name (A), Phone Number (B)
2. **Draft Message**: Use `{name}` placeholder for personalization
   - Example: "Hi {name}, welcome to our service!"
3. **Upload Images** (optional): Add images to send with messages
4. **Preview**: Review personalized messages
5. **Send**: Click send to start bulk messaging
6. **Monitor**: Track delivery status in dashboard

## Excel File Format

| Name    | Phone Number  |
|---------|---------------|
| John    | +1234567890   |
| Sarah   | +1234567891   |
| Michael | +1234567892   |

**Note**: Phone numbers must include country code (e.g., +1 for US, +91 for India)

## Rate Limits

Meta WhatsApp Cloud API limits:
- **Free Tier**: Up to 1,000 conversations/month
- **Text Messages**: Relatively unlimited within conversation windows
- **Media Messages**: Same as text messages

The app implements queue management to respect rate limits.

## Project Structure

```
WhatsApp-Bulk-Message-Agent/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Custom middleware
│   └── uploads/            # Temporary file storage
├── frontend/               # React application
│   └── src/
│       ├── components/     # React components
│       ├── services/       # API service layer
│       └── styles/         # CSS styles
└── README.md
```

## API Endpoints

- `POST /api/upload/excel` - Upload and parse Excel file
- `POST /api/upload/image` - Upload image file
- `POST /api/campaigns` - Create new campaign
- `POST /api/campaigns/:id/send` - Send messages
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `GET /api/campaigns/:id/logs` - Get message logs

## Security Notes

- Never commit `.env` files
- Validate all file uploads
- Sanitize user inputs
- Use HTTPS in production
- Implement rate limiting
- Add authentication for production use

## Development

```bash
# Run backend in dev mode
cd backend && npm run dev

# Run frontend in dev mode
cd frontend && npm run dev

# Run both concurrently (from root)
npm run dev
```

## Deployment & Hosting

Ready to go live? Check out our comprehensive hosting guides:

- 🚀 **[HOSTING_COMPLETE_GUIDE.md](HOSTING_COMPLETE_GUIDE.md)** - Complete guide with 2 hosting methods
- 📋 **[HOSTING_STEP_BY_STEP.md](HOSTING_STEP_BY_STEP.md)** - Detailed step-by-step instructions
- ✅ **[QUICK_HOSTING_CHECKLIST.md](QUICK_HOSTING_CHECKLIST.md)** - Quick reference checklist
- 💡 **[HOSTING_TIPS_AND_TRICKS.md](HOSTING_TIPS_AND_TRICKS.md)** - Common mistakes & best practices

**Recommended hosting**: Vercel (frontend) + Railway (backend) - Takes ~25 minutes!

Legacy deployment guides:
- [AWS Deployment](docs/aws-deployment.md) (if available)
- [Docker Deployment](docs/docker-deployment.md) (if available)
- [Heroku Deployment](docs/heroku-deployment.md) (if available)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

