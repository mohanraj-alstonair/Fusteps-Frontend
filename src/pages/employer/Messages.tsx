import { MessageSquare } from 'lucide-react';

export default function Messages() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Communicate with candidates and manage recruitment conversations.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-slate-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-messages-title">Candidate Communication</h3>
        <p className="text-ink-500" data-testid="text-messages-description">Send messages, provide feedback, and maintain professional communication.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-view-messages">
            View Messages
          </button>
        </div>
      </div>
    </div>
  );
}
