
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly', 'quarterly', 'weekly', 'biweekly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  nextPaymentDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  logo: String,
  website: String,
  reminderDays: {
    type: Number,
    default: 3
  },
  color: String,
  active: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
