
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BillingCycle, Subscription } from '@/lib/types';
import { format } from 'date-fns';

interface EditSubscriptionModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updatedData: Partial<Subscription>) => void;
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  subscription,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Partial<Subscription>>({});

  useEffect(() => {
    if (subscription) {
      setFormData({
        ...subscription,
      });
    }
  }, [subscription]);

  if (!subscription) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startDate' | 'nextPaymentDate') => {
    const date = new Date(e.target.value);
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'amount' | 'reminderDays'
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscription) {
      onUpdate(subscription.id, formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount || 0}
                  onChange={(e) => handleNumberChange(e, 'amount')}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency || 'USD'}
                  onValueChange={(value) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select
                  value={formData.billingCycle || 'monthly'}
                  onValueChange={(value) => handleSelectChange('billingCycle', value as BillingCycle)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Biweekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
                <Input
                  id="nextPaymentDate"
                  name="nextPaymentDate"
                  type="date"
                  value={formData.nextPaymentDate 
                    ? format(new Date(formData.nextPaymentDate), 'yyyy-MM-dd')
                    : ''}
                  onChange={(e) => handleDateChange(e, 'nextPaymentDate')}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || 'Other'}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Food">Food & Drink</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website || ''}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="reminderDays">Remind me (days before payment)</Label>
              <Input
                id="reminderDays"
                name="reminderDays"
                type="number"
                min="0"
                max="30"
                value={formData.reminderDays || 3}
                onChange={(e) => handleNumberChange(e, 'reminderDays')}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={handleActiveChange}
              />
              <Label htmlFor="active">Active Subscription</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Subscription</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriptionModal;
