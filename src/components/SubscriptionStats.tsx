
import React from 'react';
import { Subscription } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateMonthlySpending, getUpcomingPayments } from '@/lib/subscriptionData';
import { DollarSign, Calendar, TrendingUp, CreditCard } from 'lucide-react';

interface SubscriptionStatsProps {
  subscriptions: Subscription[];
}

const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({ subscriptions }) => {
  const monthlySpending = calculateMonthlySpending(subscriptions);
  const yearlySpending = monthlySpending * 12;
  const activeSubscriptions = subscriptions.filter(sub => sub.active).length;
  const upcomingPayments = getUpcomingPayments(subscriptions, 7).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(monthlySpending)}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(yearlySpending)}{' '}
            per year
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeSubscriptions}</div>
          <p className="text-xs text-muted-foreground">
            {subscriptions.length} total subscriptions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingPayments}</div>
          <p className="text-xs text-muted-foreground">In the next 7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. per Subscription</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activeSubscriptions > 0
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(monthlySpending / activeSubscriptions)
              : '$0'}
          </div>
          <p className="text-xs text-muted-foreground">Per month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionStats;
