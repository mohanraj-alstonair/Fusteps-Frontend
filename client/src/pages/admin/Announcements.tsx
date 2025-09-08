import { Megaphone } from 'lucide-react';

export default function Announcements() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Create and manage platform-wide announcements and notifications.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Megaphone className="w-8 h-8 text-slate-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-announcements-title">Platform Announcements</h3>
        <p className="text-ink-500" data-testid="text-announcements-description">Send important updates and announcements to all platform users.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-create-announcement">
            Create Announcement
          </button>
        </div>
      </div>
    </div>
  );
}
