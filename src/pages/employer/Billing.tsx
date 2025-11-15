import { CreditCard } from 'lucide-react';

export default function Billing() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Manage your subscription and billing information.</p>
      
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-sun-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-sun-700" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-billing-title">Billing & Payments</h3>
        <p className="text-ink-500" data-testid="text-billing-description">View invoices, update payment methods, and manage your subscription.</p>
        
        <div className="mt-6">
          <button className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold" data-testid="button-manage-billing">
            Manage Billing
          </button>
        </div>
      </div>
    </div>
  );
}
