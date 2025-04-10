
import { Subscription, BillingCycle } from './types';

// Helper function to calculate next payment date based on billing cycle
export const calculateNextPaymentDate = (startDate: Date, billingCycle: BillingCycle): Date => {
  const nextDate = new Date(startDate);
  
  switch(billingCycle) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
};

// Sample data for initial subscriptions
export const sampleSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    description: 'Standard subscription',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    startDate: new Date('2023-01-15'),
    nextPaymentDate: new Date('2025-05-15'),
    category: 'Entertainment',
    logo: 'N',
    website: 'https://netflix.com',
    reminderDays: 3,
    color: '#E50914',
    active: true
  },
  {
    id: '2',
    name: 'Spotify',
    description: 'Premium subscription',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    startDate: new Date('2023-02-20'),
    nextPaymentDate: new Date('2025-05-20'),
    category: 'Music',
    logo: 'S',
    website: 'https://spotify.com',
    reminderDays: 3,
    color: '#1DB954',
    active: true
  },
  {
    id: '3',
    name: 'Amazon Prime',
    description: 'Annual membership',
    amount: 119,
    currency: 'USD',
    billingCycle: 'yearly',
    startDate: new Date('2023-05-10'),
    nextPaymentDate: new Date('2026-05-10'),
    category: 'Shopping',
    logo: 'A',
    website: 'https://amazon.com',
    reminderDays: 7,
    color: '#FF9900',
    active: true
  },
  {
    id: '4',
    name: 'Adobe Creative Cloud',
    description: 'Complete plan',
    amount: 52.99,
    currency: 'USD',
    billingCycle: 'monthly',
    startDate: new Date('2023-03-05'),
    nextPaymentDate: new Date('2025-05-05'),
    category: 'Software',
    logo: 'A',
    website: 'https://adobe.com',
    reminderDays: 5,
    color: '#FF0000',
    active: true
  },
  {
    id: '5',
    name: 'Microsoft 365',
    description: 'Family plan',
    amount: 99.99,
    currency: 'USD',
    billingCycle: 'yearly',
    startDate: new Date('2023-07-15'),
    nextPaymentDate: new Date('2025-07-15'),
    category: 'Software',
    logo: 'M',
    website: 'https://microsoft.com',
    reminderDays: 7,
    color: '#00A4EF',
    active: true
  }
];

// Calculate total monthly spending
export const calculateMonthlySpending = (subscriptions: Subscription[]): number => {
  return subscriptions.reduce((total, sub) => {
    if (!sub.active) return total;
    
    let monthlyAmount: number;
    
    switch(sub.billingCycle) {
      case 'weekly':
        monthlyAmount = (sub.amount * 52) / 12;
        break;
      case 'biweekly':
        monthlyAmount = (sub.amount * 26) / 12;
        break;
      case 'monthly':
        monthlyAmount = sub.amount;
        break;
      case 'quarterly':
        monthlyAmount = sub.amount / 3;
        break;
      case 'yearly':
        monthlyAmount = sub.amount / 12;
        break;
      default:
        monthlyAmount = sub.amount;
    }
    
    return total + monthlyAmount;
  }, 0);
};

// Get subscriptions with upcoming payments
export const getUpcomingPayments = (subscriptions: Subscription[], daysAhead: number = 7): Subscription[] => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  return subscriptions.filter(sub => {
    if (!sub.active) return false;
    
    const paymentDate = new Date(sub.nextPaymentDate);
    return paymentDate >= today && paymentDate <= futureDate;
  });
};

// Get subscriptions by category
export const getSubscriptionsByCategory = (subscriptions: Subscription[]): Record<string, number> => {
  const categories: Record<string, number> = {};
  
  subscriptions.forEach(sub => {
    if (!sub.active) return;
    
    if (categories[sub.category]) {
      categories[sub.category]++;
    } else {
      categories[sub.category] = 1;
    }
  });
  
  return categories;
};
