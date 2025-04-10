
export type BillingCycle = 'monthly' | 'yearly' | 'quarterly' | 'weekly' | 'biweekly';

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: Date;
  nextPaymentDate: Date;
  category: string;
  logo?: string;
  website?: string;
  reminderDays: number;
  color?: string;
  active: boolean;
}

export interface SubscriptionFormData {
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: Date;
  category: string;
  website?: string;
  reminderDays: number;
  color?: string;
  active: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  daysBeforeDue: number;
}
