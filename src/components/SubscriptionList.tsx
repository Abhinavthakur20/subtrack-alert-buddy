
import React, { useState } from 'react';
import { Subscription } from '@/lib/types';
import SubscriptionCard from './SubscriptionCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, FilterIcon } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onAddSubscription: () => void;
  onEditSubscription: (subscription: Subscription) => void;
  onDeleteSubscription: (id: string) => void;
  searchQuery: string;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  onAddSubscription,
  onEditSubscription,
  onDeleteSubscription,
  searchQuery,
}) => {
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [filterBy, setFilterBy] = useState<string>('all');

  // Filter subscriptions based on search query and filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (sub.description && sub.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'active') return matchesSearch && sub.active;
    if (filterBy === 'inactive') return matchesSearch && !sub.active;
    if (filterBy === 'upcoming') {
      const daysTillPayment = Math.ceil(
        (sub.nextPaymentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return matchesSearch && daysTillPayment <= 7 && daysTillPayment >= 0;
    }
    if (filterBy === 'monthly') return matchesSearch && sub.billingCycle === 'monthly';
    if (filterBy === 'yearly') return matchesSearch && sub.billingCycle === 'yearly';
    
    return matchesSearch;
  });

  // Sort subscriptions
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime();
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Your Subscriptions</h2>
          <span className="ml-3 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
            {filteredSubscriptions.length}
          </span>
        </div>
        
        <Button onClick={onAddSubscription} className="bg-primary">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Subscription
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center">
          <FilterIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm mr-2">Filter:</span>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-32 sm:w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="upcoming">Due Soon</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm mr-2">Sort:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Payment Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedSubscriptions.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No subscriptions found.</p>
          {searchQuery && <p className="text-sm mt-2">Try a different search term.</p>}
          {!searchQuery && (
            <Button 
              onClick={onAddSubscription} 
              variant="outline" 
              className="mt-4"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Subscription
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 animate-fade-in">
          {sortedSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={onEditSubscription}
              onDelete={onDeleteSubscription}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;
