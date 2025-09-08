import { Settings } from 'lucide-react';

export default function JobTools() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Access tools to help you in your job search and career development.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-leaf-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Settings className="w-8 h-8 text-leaf-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-job-tools-title">Job Search Tools</h3>
        <p className="text-ink-500" data-testid="text-job-tools-description">Resume builder, interview preparation, and salary calculator.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-access-tools">
            Access Tools
          </button>
        </div>
      </div>
    </div>
  );
}
