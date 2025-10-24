import { useState, useEffect } from 'react';
import { Megaphone, Plus, Edit, Trash2, Eye, Send, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { api, withRole } from '@/lib/api';

interface Announcement {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  target_audience: string[];
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  views: number;
  engagement: number;
}

const audienceOptions = [
  { id: 'all', name: 'All Users' },
  { id: 'students', name: 'Students' },
  { id: 'employers', name: 'Employers' },
  { id: 'mentors', name: 'Mentors' },
  { id: 'alumni', name: 'Alumni' }
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [scheduledFor, setScheduledFor] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get("/admin/announcements", withRole("admin"));
      setAnnouncements(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const announcementData = {
        title: title.trim(),
        content: content.trim(),
        status,
        target_audience: targetAudience,
        scheduled_for: status === 'scheduled' ? scheduledFor : null
      };

      await api.post("/admin/announcements", announcementData, withRole("admin"));

      setShowCreateDialog(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Error creating announcement. Please try again.');
    }
  };

  const updateAnnouncement = async () => {
    if (!editingAnnouncement || !title.trim() || !content.trim()) return;

    try {
      const announcementData = {
        title: title.trim(),
        content: content.trim(),
        status,
        target_audience: targetAudience,
        scheduled_for: status === 'scheduled' ? scheduledFor : null
      };

      await api.put(`/admin/announcements/${editingAnnouncement.id}`, announcementData, withRole("admin"));

      setEditingAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Error updating announcement. Please try again.');
    }
  };

  const deleteAnnouncement = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) return;

    try {
      await api.delete(`/admin/announcements/${id}`, withRole("admin"));
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error deleting announcement. Please try again.');
    }
  };

  const publishAnnouncement = async (id: number) => {
    try {
      await api.post(`/admin/announcements/${id}/publish`, {}, withRole("admin"));
      fetchAnnouncements();
    } catch (error) {
      console.error('Error publishing announcement:', error);
      alert('Error publishing announcement. Please try again.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setStatus('draft');
    setTargetAudience([]);
    setScheduledFor('');
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setStatus(announcement.status);
    setTargetAudience(announcement.target_audience);
    setScheduledFor(announcement.scheduled_for || '');
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filterStatus === 'all') return true;
    return announcement.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-600" />;
      default:
        return <Megaphone className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Create and manage platform announcements for different user groups</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-ink-900 hover:bg-ink-800">
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter announcement content"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Publish Now</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {status === 'scheduled' && (
                <div>
                  <Label htmlFor="scheduled-for">Schedule For</Label>
                  <Input
                    id="scheduled-for"
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                  />
                </div>
              )}
              <div>
                <Label>Target Audience</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {audienceOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={targetAudience.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetAudience([...targetAudience, option.id]);
                          } else {
                            setTargetAudience(targetAudience.filter(a => a !== option.id));
                          }
                        }}
                      />
                      <Label htmlFor={option.id} className="text-sm">{option.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={createAnnouncement}
                  disabled={!title.trim() || !content.trim()}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Announcements</p>
                <p className="text-2xl font-bold text-blue-900">{announcements.length}</p>
              </div>
              <Megaphone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Published</p>
                <p className="text-2xl font-bold text-green-900">
                  {announcements.filter(a => a.status === 'published').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Scheduled</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {announcements.filter(a => a.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-900">
                  {announcements.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Announcements</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Announcement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(announcement.status)}
                      <div>
                        <div className="font-medium text-gray-900">{announcement.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{announcement.content}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {announcement.target_audience.map(audience => (
                        <Badge key={audience} variant="outline" className="text-xs">
                          {audienceOptions.find(o => o.id === audience)?.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {announcement.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {announcement.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => publishAnnouncement(announcement.id)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(announcement)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAnnouncement(announcement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No announcements found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingAnnouncement} onOpenChange={() => setEditingAnnouncement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter announcement content"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === 'scheduled' && (
              <div>
                <Label htmlFor="edit-scheduled-for">Schedule For</Label>
                <Input
                  id="edit-scheduled-for"
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                />
              </div>
            )}
            <div>
              <Label>Target Audience</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {audienceOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${option.id}`}
                      checked={targetAudience.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTargetAudience([...targetAudience, option.id]);
                        } else {
                          setTargetAudience(targetAudience.filter(a => a !== option.id));
                        }
                      }}
                    />
                    <Label htmlFor={`edit-${option.id}`} className="text-sm">{option.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={updateAnnouncement}
                disabled={!title.trim() || !content.trim()}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Update Announcement
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingAnnouncement(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
