
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import SubscriptionList from '@/components/SubscriptionList';
import SubscriptionStats from '@/components/SubscriptionStats';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import EditSubscriptionModal from '@/components/EditSubscriptionModal';
import RemindersSettings from '@/components/RemindersSettings';
import { sampleSubscriptions, calculateNextPaymentDate } from '@/lib/subscriptionData';
import { Subscription, SubscriptionFormData, ReminderSettings } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(sampleSubscriptions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: true,
    daysBeforeDue: 3,
  });
  const { toast } = useToast();

  // Check for subscriptions due soon on load
  useEffect(() => {
    const checkUpcomingPayments = () => {
      const today = new Date();
      const dueSubscriptions = subscriptions.filter(sub => {
        if (!sub.active) return false;
        
        const paymentDate = new Date(sub.nextPaymentDate);
        const daysUntilPayment = Math.ceil(
          (paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return daysUntilPayment <= reminderSettings.daysBeforeDue && daysUntilPayment >= 0;
      });
      
      if (dueSubscriptions.length > 0) {
        toast({
          title: `${dueSubscriptions.length} upcoming ${dueSubscriptions.length === 1 ? 'payment' : 'payments'}`,
          description: `You have ${dueSubscriptions.length} subscription ${dueSubscriptions.length === 1 ? 'payment' : 'payments'} due soon.`,
        });
      }
    };
    
    checkUpcomingPayments();
  }, [subscriptions, reminderSettings.daysBeforeDue, toast]);

  const handleAddSubscription = (formData: SubscriptionFormData) => {
    const nextPaymentDate = calculateNextPaymentDate(formData.startDate, formData.billingCycle);
    
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      ...formData,
      nextPaymentDate,
    };
    
    setSubscriptions((prev) => [...prev, newSubscription]);
    setIsAddModalOpen(false);
    
    toast({
      title: "Subscription added",
      description: `${formData.name} has been added to your subscriptions.`,
    });
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubscription = (id: string, updatedData: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updatedData } : sub))
    );
    
    toast({
      title: "Subscription updated",
      description: "Your subscription has been updated successfully.",
    });
  };

  const handleDeletePrompt = (id: string) => {
    setSubscriptionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subscriptionToDelete) {
      const subToDelete = subscriptions.find(sub => sub.id === subscriptionToDelete);
      
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.id !== subscriptionToDelete)
      );
      
      toast({
        title: "Subscription deleted",
        description: subToDelete ? `${subToDelete.name} has been removed.` : "Subscription has been removed.",
      });
      
      setIsDeleteDialogOpen(false);
      setSubscriptionToDelete(null);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleUpdateReminderSettings = (settings: ReminderSettings) => {
    setReminderSettings(settings);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearchChange={handleSearchChange} />
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-8">
            <SubscriptionStats subscriptions={subscriptions} />
            
            <SubscriptionList
              subscriptions={subscriptions}
              onAddSubscription={() => setIsAddModalOpen(true)}
              onEditSubscription={handleEditSubscription}
              onDeleteSubscription={handleDeletePrompt}
              searchQuery={searchQuery}
            />
          </TabsContent>
          
          <TabsContent value="reminders">
            <div className="max-w-md mx-auto">
              <RemindersSettings
                settings={reminderSettings}
                onUpdateSettings={handleUpdateReminderSettings}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Modals */}
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubscription}
      />
      
      <EditSubscriptionModal
        subscription={selectedSubscription}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateSubscription}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this subscription. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
