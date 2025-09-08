import { Shield } from 'lucide-react';

export default function AuditLogs() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Monitor system security and track user activities.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-ember-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Shield className="w-8 h-8 text-ember-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-audit-logs-title">Security Audit Logs</h3>
        <p className="text-ink-500" data-testid="text-audit-logs-description">View detailed logs of user actions and system events for security monitoring.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-view-audit-logs">
            View Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}
