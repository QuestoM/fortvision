import mongoose from 'mongoose';

// Define the schema for AdAccount
const AdAccountSchema = new mongoose.Schema({
  // Connected to a specific user
  userId: {
    type: String,
    required: true,
    index: true
  },
  // Platform type: 'google' or 'facebook'
  platform: {
    type: String,
    enum: ['google', 'facebook'],
    required: true
  },
  // Account ID from the platform
  accountId: {
    type: String,
    required: true
  },
  // Account name for display
  accountName: {
    type: String,
    required: true
  },
  // Access token (for Facebook)
  accessToken: {
    type: String
  },
  // Refresh token (for Google)
  refreshToken: {
    type: String
  },
  // Token expiry date
  tokenExpiry: {
    type: Date
  },
  // Indicates if this account is selected by default
  isDefault: {
    type: Boolean,
    default: false
  },
  // Last sync date
  lastSyncDate: {
    type: Date
  },
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Create a compound index on userId, platform, and accountId to ensure uniqueness
AdAccountSchema.index({ userId: 1, platform: 1, accountId: 1 }, { unique: true });

// Create the model if it doesn't exist already
const AdAccount = mongoose.models.AdAccount || mongoose.model('AdAccount', AdAccountSchema);

export default AdAccount; 