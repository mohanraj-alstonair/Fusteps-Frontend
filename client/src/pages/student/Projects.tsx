import { FolderOpen } from 'lucide-react';

export default function Projects() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Showcase your work and track your progress on various projects.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-sun-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <FolderOpen className="w-8 h-8 text-sun-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-projects-title">Project Portfolio</h3>
        <p className="text-ink-500" data-testid="text-projects-description">Create and manage your project portfolio to showcase your skills.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-create-project">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
