import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { FileText, Users, Calendar, MessageSquare, BarChart3, Building, CreditCard, Settings, ChevronRight, Search } from "lucide-react";

type MenuItem = {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: JSX.Element;
  badge?: string;
};

export default function EmployerMenu() {
  const [query, setQuery] = useState("");

  const items: MenuItem[] = useMemo(() => ([
    { id: 'postings', label: 'Postings', description: 'Create and manage job postings', icon: <FileText className="w-5 h-5" />, path: '/dashboard/employer' },
    { id: 'applicants', label: 'Applicants', description: 'Track and review applicants', icon: <Users className="w-5 h-5" />, path: '/dashboard/employer/applicants' },
    { id: 'interviews', label: 'Interviews', description: 'Schedule and run interviews', icon: <Calendar className="w-5 h-5" />, path: '/dashboard/employer/interviews' },
    { id: 'messages', label: 'Messages', description: 'Chat with candidates and teams', icon: <MessageSquare className="w-5 h-5" />, path: '/dashboard/employer/messages' },
    { id: 'analytics', label: 'Analytics', description: 'Hiring funnel and conversion metrics', icon: <BarChart3 className="w-5 h-5" />, path: '/dashboard/employer/analytics' },
    { id: 'company-profile', label: 'Company Profile', description: 'Brand profile and team details', icon: <Building className="w-5 h-5" />, path: '/dashboard/employer/company-profile' },
    { id: 'billing', label: 'Billing', description: 'Plan, invoices and payments', icon: <CreditCard className="w-5 h-5" />, path: '/dashboard/employer/billing' },
    { id: 'settings', label: 'Settings', description: 'Notifications, privacy and account', icon: <Settings className="w-5 h-5" />, path: '/dashboard/employer/settings' },
  ]), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Employer Menu</h2>
          <p className="text-gray-600">Navigate employer features quickly</p>
        </div>
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search menu..." className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(item => (
          <Link key={item.id} href={item.path}>
            <Card className="group cursor-pointer hover:shadow-md transition-shadow border border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gray-100 text-gray-700 p-3 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-900 font-medium truncate">{item.label}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-fusteps-red" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                    <div className="mt-3">
                      <Button size="sm" className="bg-fusteps-red text-white hover:bg-red-600">Open</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


