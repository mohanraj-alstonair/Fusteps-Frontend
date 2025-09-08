import { Library as LibraryIcon } from 'lucide-react';

export default function Library() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Access study materials, templates, and career resources.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <LibraryIcon className="w-8 h-8 text-slate-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-library-title">Digital Library</h3>
        <p className="text-ink-500" data-testid="text-library-description">Browse our collection of resources, templates, and study materials.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-browse-library">
            Browse Library
          </button>
        </div>
      </div>
    </div>
  );
}
