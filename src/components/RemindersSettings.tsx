
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Mail } from 'lucide-react';
import { ReminderSettings as ReminderSettingsType } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface RemindersSettingsProps {
  settings: ReminderSettingsType;
  onUpdateSettings: (settings: ReminderSettingsType) => void;
}

const RemindersSettings: React.FC<RemindersSettingsProps> = ({ 
  settings, 
  onUpdateSettings 
}) => {
  const [reminders, setReminders] = useState(settings);
  const [emailInput, setEmailInput] = useState('');
  const { toast } = useToast();

  const handleToggleReminders = (checked: boolean) => {
    setReminders(prev => ({ ...prev, enabled: checked }));
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value);
    if (!isNaN(days) && days >= 0) {
      setReminders(prev => ({ ...prev, daysBeforeDue: days }));
    }
  };

  const handleSaveSettings = () => {
    onUpdateSettings(reminders);
    toast({
      title: "Settings saved",
      description: "Your reminder settings have been updated.",
    });
  };

  const handleAddEmail = () => {
    // In a real application, this would validate and save the email
    if (emailInput && emailInput.includes('@')) {
      toast({
        title: "Email added",
        description: `Notifications will be sent to ${emailInput}`,
      });
      setEmailInput('');
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" /> Subscription Reminders
        </CardTitle>
        <CardDescription>Configure when and how you want to be reminded about upcoming payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="enable-reminders"
            checked={reminders.enabled}
            onCheckedChange={handleToggleReminders}
          />
          <Label htmlFor="enable-reminders">Enable payment reminders</Label>
        </div>
        
        {reminders.enabled && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="days-before">Remind me days before due date</Label>
              <Input
                id="days-before"
                type="number"
                min="1"
                max="30"
                value={reminders.daysBeforeDue}
                onChange={handleDaysChange}
                className="w-full"
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email Notifications
              </Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <Button onClick={handleAddEmail}>Add</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                We'll send you email reminders when a subscription payment is coming up.
              </p>
            </div>
          </>
        )}
        
        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default RemindersSettings;
