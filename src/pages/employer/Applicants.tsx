import { Users } from 'lucide-react';

export default function Applicants() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Review and manage candidates who have applied to your positions.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-leaf-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Users className="w-8 h-8 text-leaf-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-applicants-title">Applicant Management</h3>
        <p className="text-ink-500" data-testid="text-applicants-description">Review resumes, filter candidates, and manage your hiring pipeline.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-review-applicants">
            Review Applicants
          </button>
        </div>
      </div>
    </div>
  );
}
