import { useState } from "react";
import { Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Notifications() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Stay updated with the latest opportunities and important updates.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-sun-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Bell className="w-8 h-8 text-sun-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-notifications-title">Stay Updated</h3>
        <p className="text-ink-500" data-testid="text-notifications-description">Manage your notifications and stay informed about opportunities.</p>
        
        <div className="mt-6">
          <Button 
            className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold"
            onClick={() => setShowSettingsModal(true)}
          >
            Manage Notifications
          </Button>
        </div>
      </div>

      {/* Notification Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch 
                id="emailNotifications" 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <Switch 
                id="pushNotifications" 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications} 
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button onClick={() => setShowSettingsModal(false)} variant="outline">Cancel</Button>
              <Button onClick={() => {
                // Save settings logic here
                setShowSettingsModal(false);
              }}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
