import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { BarChart3, Users, PlusCircle, Calendar, MessageSquare, TrendingUp, User, Settings, ChevronRight, Search } from "lucide-react";

type MenuItem = {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: JSX.Element;
  badge?: string;
};

export default function AlumniMenu() {
  const [query, setQuery] = useState("");

  const items: MenuItem[] = useMemo(() => ([
    { id: 'overview', label: 'Overview', description: 'Your dashboard snapshot and quick metrics', icon: <BarChart3 className="w-5 h-5" />, path: '/dashboard/alumni' },
    { id: 'mentor', label: 'Mentor', description: 'Offer guidance and manage mentee requests', icon: <Users className="w-5 h-5" />, path: '/dashboard/alumni/mentor' },
    { id: 'post-opportunity', label: 'Post Opportunity', description: 'Share jobs, internships or projects', icon: <PlusCircle className="w-5 h-5" />, path: '/dashboard/alumni/post-opportunity' },
    { id: 'events', label: 'Events', description: 'Create and manage alumni events', icon: <Calendar className="w-5 h-5" />, path: '/dashboard/alumni/events' },
    { id: 'community', label: 'Community', description: 'Engage with the alumni community', icon: <MessageSquare className="w-5 h-5" />, path: '/dashboard/alumni/community' },
    { id: 'impact', label: 'Impact', description: 'Track and showcase your contributions', icon: <TrendingUp className="w-5 h-5" />, path: '/dashboard/alumni/impact' },
    { id: 'profile', label: 'Profile', description: 'Update your details and preferences', icon: <User className="w-5 h-5" />, path: '/dashboard/alumni/profile' },
    { id: 'settings', label: 'Settings', description: 'Notifications, privacy and account', icon: <Settings className="w-5 h-5" />, path: '/dashboard/alumni/settings' },
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
          <h2 className="text-2xl font-semibold text-gray-900">Alumni Menu</h2>
          <p className="text-gray-600">Quickly navigate to any alumni feature</p>
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


