import { Calendar } from 'lucide-react';

export default function Events() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Organize and attend alumni events and networking sessions.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-ember-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-ember-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-events-title">Events</h3>
        <p className="text-ink-500" data-testid="text-events-description">Join alumni events and networking opportunities.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-browse-events">
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );
}
