
import React from 'react';
import { CalendarIcon, EditIcon, TrashIcon, ExternalLinkIcon } from 'lucide-react';
import { Subscription } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
}) => {
  const daysTillPayment = Math.ceil(
    (subscription.nextPaymentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Format currency based on locale (simplified version)
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getPaymentStatus = () => {
    if (daysTillPayment <= 0) {
      return { label: 'Due Today', variant: 'destructive' as const };
    } else if (daysTillPayment <= subscription.reminderDays) {
      return { label: 'Due Soon', variant: 'secondary' as const };
    } else {
      return { label: 'Upcoming', variant: 'outline' as const };
    }
  };

  const status = getPaymentStatus();

  // Determine if a subscription needs attention
  const needsAttention = daysTillPayment <= subscription.reminderDays;

  return (
    <Card className={`subscription-card ${needsAttention ? 'border-l-4 border-l-orange-500' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div 
              className="h-12 w-12 rounded-md flex items-center justify-center text-white font-bold text-lg mr-4"
              style={{ backgroundColor: subscription.color || '#6366F1' }}
            >
              {subscription.logo || subscription.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg">{subscription.name}</h3>
              <p className="text-sm text-muted-foreground">{subscription.description}</p>
            </div>
          </div>
          <Badge variant={status.variant} className="ml-2">
            {status.label}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">
              {formatCurrency(subscription.amount, subscription.currency)}
              <span className="text-xs text-muted-foreground ml-1">
                / {subscription.billingCycle}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium">{subscription.category}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Payment</p>
            <div className="flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <p className="font-medium">{format(subscription.nextPaymentDate, 'MMM dd, yyyy')}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">
              {daysTillPayment < 0
                ? 'Overdue'
                : daysTillPayment === 0
                ? 'Due Today'
                : `${daysTillPayment} ${daysTillPayment === 1 ? 'day' : 'days'} left`}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t px-6 py-4 flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(subscription)}>
            <EditIcon className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(subscription.id)}>
            <TrashIcon className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
        {subscription.website && (
          <Button variant="ghost" size="sm" asChild>
            <a href={subscription.website} target="_blank" rel="noopener noreferrer">
              Visit <ExternalLinkIcon className="h-4 w-4 ml-2" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
