import { Users } from 'lucide-react';

export default function Mentor() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Mentor current students and give back to the community.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-leaf-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Users className="w-8 h-8 text-leaf-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-mentor-title">Become a Mentor</h3>
        <p className="text-ink-500" data-testid="text-mentor-description">Share your experience and guide the next generation.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-start-mentoring">
            Start Mentoring
          </button>
        </div>
      </div>
    </div>
  );
}
