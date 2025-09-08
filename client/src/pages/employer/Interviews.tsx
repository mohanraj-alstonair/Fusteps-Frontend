import { Calendar } from 'lucide-react';

export default function Interviews() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Schedule and manage interviews with potential candidates.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-sun-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-sun-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-interviews-title">Interview Scheduling</h3>
        <p className="text-ink-500" data-testid="text-interviews-description">Coordinate interviews and track candidate progress through your hiring process.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-schedule-interview">
            Schedule Interview
          </button>
        </div>
      </div>
    </div>
  );
}
