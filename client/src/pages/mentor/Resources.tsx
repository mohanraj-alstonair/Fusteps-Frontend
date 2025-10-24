import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  ExternalLink,
  FileText,
  Video,
  Users,
  Target,
  Lightbulb,
  Award,
  Calendar,
  MessageSquare,
  Star,
  Clock,
  Eye,
  Heart,
  Share,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'template' | 'video' | 'article' | 'tool';
  category: string;
  tags: string[];
  author: string;
  readTime?: number;
  viewCount: number;
  downloadCount: number;
  rating: number;
  featured: boolean;
  url?: string;
  content?: string;
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Effective Mentoring Techniques',
      description: 'A comprehensive guide to becoming a better mentor with proven techniques and strategies.',
      type: 'guide',
      category: 'Mentoring Skills',
      tags: ['communication', 'leadership', 'coaching'],
      author: 'Dr. Sarah Johnson',
      readTime: 15,
      viewCount: 1247,
      downloadCount: 342,
      rating: 4.8,
      featured: true,
      url: '/guides/effective-mentoring.pdf'
    },
    {
      id: '2',
      title: 'Resume Review Template',
      description: 'Professional template for conducting thorough resume reviews with mentees.',
      type: 'template',
      category: 'Career Development',
      tags: ['resume', 'career', 'review'],
      author: 'Career Services Team',
      readTime: 5,
      viewCount: 892,
      downloadCount: 567,
      rating: 4.6,
      featured: false,
      url: '/templates/resume-review.docx'
    },
    {
      id: '3',
      title: 'Building Confidence in Mentees',
      description: 'Video workshop on helping mentees overcome self-doubt and build professional confidence.',
      type: 'video',
      category: 'Personal Development',
      tags: ['confidence', 'motivation', 'growth'],
      author: 'Dr. Michael Chen',
      readTime: 45,
      viewCount: 2156,
      downloadCount: 0,
      rating: 4.9,
      featured: true,
      url: 'https://youtube.com/watch?v=example'
    },
    {
      id: '4',
      title: 'Interview Preparation Checklist',
      description: 'Comprehensive checklist for preparing mentees for job interviews.',
      type: 'tool',
      category: 'Career Development',
      tags: ['interview', 'preparation', 'job search'],
      author: 'HR Department',
      readTime: 8,
      viewCount: 743,
      downloadCount: 298,
      rating: 4.4,
      featured: false,
      url: '/tools/interview-checklist.pdf'
    },
    {
      id: '5',
      title: 'The Art of Giving Feedback',
      description: 'Learn how to provide constructive feedback that motivates and helps mentees grow.',
      type: 'article',
      category: 'Communication',
      tags: ['feedback', 'communication', 'growth'],
      author: 'Leadership Institute',
      readTime: 12,
      viewCount: 1567,
      downloadCount: 0,
      rating: 4.7,
      featured: false,
      content: 'Effective feedback is crucial for mentee development...'
    },
    {
      id: '6',
      title: 'Goal Setting Framework',
      description: 'Structured approach to helping mentees set and achieve meaningful career goals.',
      type: 'guide',
      category: 'Goal Setting',
      tags: ['goals', 'planning', 'achievement'],
      author: 'Dr. Emily Rodriguez',
      readTime: 20,
      viewCount: 934,
      downloadCount: 445,
      rating: 4.5,
      featured: false,
      url: '/guides/goal-setting-framework.pdf'
    }
  ]);

  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];
  const types = ['all', ...Array.from(new Set(resources.map(r => r.type)))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'featured' && resource.featured) ||
                      (activeTab === 'guides' && resource.type === 'guide') ||
                      (activeTab === 'templates' && resource.type === 'template') ||
                      (activeTab === 'videos' && resource.type === 'video');
    return matchesSearch && matchesCategory && matchesType && matchesTab;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-5 h-5" />;
      case 'template': return <FileText className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'article': return <MessageSquare className="w-5 h-5" />;
      case 'tool': return <Target className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'template': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'article': return 'bg-purple-100 text-purple-800';
      case 'tool': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const toggleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(resourceId)) {
        newBookmarks.delete(resourceId);
      } else {
        newBookmarks.add(resourceId);
      }
      return newBookmarks;
    });
  };

  const viewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowResourceDialog(true);
  };

  const featuredResources = resources.filter(r => r.featured);
  const totalResources = resources.length;
  const totalDownloads = resources.reduce((acc, r) => acc + r.downloadCount, 0);
  const avgRating = resources.reduce((acc, r) => acc + r.rating, 0) / resources.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1">Access materials and guides to enhance your mentoring skills</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalResources}</div>
            <div className="text-sm text-gray-500">Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalDownloads}</div>
            <div className="text-sm text-gray-500">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Featured Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <Card key={resource.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                          {getTypeIcon(resource.type)}
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-xs mb-1">
                            {resource.category}
                          </Badge>
                          <div className="flex items-center">
                            {renderStars(resource.rating)}
                            <span className="ml-2 text-sm text-gray-600">({resource.rating})</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(resource.id)}
                      >
                        {bookmarkedResources.has(resource.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>by {resource.author}</span>
                      {resource.readTime && (
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {resource.readTime} min read
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewResource(resource)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {resource.url && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search resources by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <Badge variant="secondary" className="text-xs mb-1">
                          {resource.category}
                        </Badge>
                        <div className="flex items-center">
                          {renderStars(resource.rating)}
                          <span className="ml-2 text-sm text-gray-600">({resource.rating})</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(resource.id)}
                    >
                      {bookmarkedResources.has(resource.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>by {resource.author}</span>
                    <div className="flex items-center space-x-3">
                      {resource.readTime && (
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {resource.readTime} min
                        </div>
                      )}
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {resource.viewCount}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewResource(resource)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    {resource.url && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Resource Detail Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${selectedResource ? getTypeColor(selectedResource.type) : ''}`}>
                {selectedResource && getTypeIcon(selectedResource.type)}
              </div>
              <span>{selectedResource?.title}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedResource && (
            <div className="space-y-6">
              {/* Resource Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="secondary">{selectedResource.category}</Badge>
                    <Badge className={getTypeColor(selectedResource.type)}>
                      {selectedResource.type.charAt(0).toUpperCase() + selectedResource.type.slice(1)}
                    </Badge>
                    {selectedResource.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{selectedResource.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>by {selectedResource.author}</span>
                    {selectedResource.readTime && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedResource.readTime} min read
                      </div>
                    )}
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedResource.viewCount} views
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {selectedResource.downloadCount} downloads
                    </div>
                    <div className="flex items-center">
                      {renderStars(selectedResource.rating)}
                      <span className="ml-1">({selectedResource.rating})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResource.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Content */}
              {selectedResource.content && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Content</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700">{selectedResource.content}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => toggleBookmark(selectedResource.id)}
                >
                  {bookmarkedResources.has(selectedResource.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Bookmark
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {selectedResource.url && (
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
                {selectedResource.url && selectedResource.type === 'video' && (
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
