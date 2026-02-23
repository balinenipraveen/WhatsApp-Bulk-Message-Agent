import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  messageTemplate: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  imagePath: {
    type: String,
    default: null
  },
  customers: [{
    name: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'sending', 'completed', 'failed', 'paused'],
    default: 'draft'
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  sentMessages: {
    type: Number,
    default: 0
  },
  failedMessages: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Campaign', campaignSchema);

