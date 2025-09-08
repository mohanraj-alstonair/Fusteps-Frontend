import { TrendingUp } from 'lucide-react';

export default function Impact() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Track your impact on the student community.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-sun-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-sun-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-impact-title">Your Impact</h3>
        <p className="text-ink-500" data-testid="text-impact-description">See how you're making a difference in students' lives.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-view-impact">
            View Impact
          </button>
        </div>
      </div>
    </div>
  );
}
