import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Eye, 
  Star, 
  Search,
  Filter,
  Plus,
  Bookmark,
  Share2,
  Clock,
  Users,
  TrendingUp,
  Award,
  Info,
  ExternalLink,
  Play,
  File,
  Image,
  Code,
  Globe,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Heart,
  MessageCircle,
  CalendarDays,
  Clock3,
  UserCheck,
  Zap,
  Lightbulb,
  Building,
  Target,
  Grid3X3,
  List
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function StudentLibraryPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([1, 3]); // Track bookmarked item IDs
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Mock library data
  const libraryContent = {
    pdfs: [
      {
        id: 1,
        title: "Complete React Developer Guide 2024",
        description: "Comprehensive guide to React development with modern practices and best practices",
        author: "Tech University Press",
        category: "Web Development",
        fileSize: "15.2 MB",
        pages: 245,
        rating: 4.8,
        downloads: 1250,
        tags: ["React", "JavaScript", "Frontend", "Web Development"],
        thumbnail: "/api/placeholder/200/250",
        isBookmarked: true
      },
      {
        id: 2,
        title: "System Design Interview Handbook",
        description: "Essential concepts and patterns for system design interviews",
        author: "Engineering Press",
        category: "System Design",
        fileSize: "8.7 MB",
        pages: 180,
        rating: 4.9,
        downloads: 890,
        tags: ["System Design", "Architecture", "Interview Prep", "Backend"],
        thumbnail: "/api/placeholder/200/250",
        isBookmarked: false
      },
      {
        id: 3,
        title: "Machine Learning Fundamentals",
        description: "Introduction to machine learning concepts and algorithms",
        author: "AI Institute",
        category: "Machine Learning",
        fileSize: "22.1 MB",
        pages: 320,
        rating: 4.7,
        downloads: 650,
        tags: ["Machine Learning", "Python", "AI", "Data Science"],
        thumbnail: "/api/placeholder/200/250",
        isBookmarked: true
      }
    ],
    videos: [
      {
        id: 1,
        title: "Advanced JavaScript Concepts",
        description: "Deep dive into JavaScript closures, prototypes, and async programming",
        author: "CodeMaster Academy",
        category: "JavaScript",
        duration: "2h 15m",
        rating: 4.8,
        views: 3400,
        tags: ["JavaScript", "Programming", "Advanced", "Web Development"],
        thumbnail: "/api/placeholder/300/200",
        isBookmarked: false
      },
      {
        id: 2,
        title: "Docker for Beginners",
        description: "Learn containerization with Docker from scratch",
        author: "DevOps University",
        category: "DevOps",
        duration: "1h 45m",
        rating: 4.6,
        views: 2100,
        tags: ["Docker", "DevOps", "Containers", "Deployment"],
        thumbnail: "/api/placeholder/300/200",
        isBookmarked: true
      },
      {
        id: 3,
        title: "UI/UX Design Principles",
        description: "Master the fundamentals of user interface and user experience design",
        author: "Design Studio",
        category: "Design",
        duration: "3h 20m",
        rating: 4.9,
        views: 1800,
        tags: ["UI/UX", "Design", "User Experience", "Visual Design"],
        thumbnail: "/api/placeholder/300/200",
        isBookmarked: false
      }
    ],
    templates: [
      {
        id: 1,
        title: "React Portfolio Template",
        description: "Professional portfolio template built with React and Tailwind CSS",
        author: "TemplateHub",
        category: "Web Development",
        fileSize: "2.3 MB",
        rating: 4.7,
        downloads: 890,
        tags: ["React", "Portfolio", "Template", "Tailwind CSS"],
        thumbnail: "/api/placeholder/200/200",
        isBookmarked: true
      },
      {
        id: 2,
        title: "Resume Template Pack",
        description: "Collection of 10 professional resume templates in different styles",
        author: "CareerBuilder",
        category: "Career",
        fileSize: "5.1 MB",
        rating: 4.8,
        downloads: 1200,
        tags: ["Resume", "Template", "Career", "Professional"],
        thumbnail: "/api/placeholder/200/200",
        isBookmarked: false
      },
      {
        id: 3,
        title: "Project Proposal Template",
        description: "Comprehensive template for writing project proposals and documentation",
        author: "ProjectHub",
        category: "Project Management",
        fileSize: "1.8 MB",
        rating: 4.6,
        downloads: 450,
        tags: ["Proposal", "Documentation", "Project Management", "Template"],
        thumbnail: "/api/placeholder/200/200",
        isBookmarked: true
      }
    ],
    books: [
      {
        id: 1,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        description: "Learn to write clean, maintainable code with practical examples",
        author: "Robert C. Martin",
        category: "Software Engineering",
        pages: 464,
        rating: 4.9,
        reads: 2100,
        tags: ["Clean Code", "Software Engineering", "Best Practices", "Programming"],
        thumbnail: "/api/placeholder/150/200",
        isBookmarked: true
      },
      {
        id: 2,
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        description: "The classic book on software design patterns",
        author: "Gang of Four",
        category: "Software Design",
        pages: 416,
        rating: 4.8,
        reads: 1800,
        tags: ["Design Patterns", "Object-Oriented", "Software Design", "Architecture"],
        thumbnail: "/api/placeholder/150/200",
        isBookmarked: false
      },
      {
        id: 3,
        title: "The Pragmatic Programmer",
        description: "Your journey to mastery in software development",
        author: "Andrew Hunt, David Thomas",
        category: "Software Development",
        pages: 352,
        rating: 4.9,
        reads: 2400,
        tags: ["Programming", "Software Development", "Career", "Best Practices"],
        thumbnail: "/api/placeholder/150/200",
        isBookmarked: true
      }
    ]
  };

  const categories = [
    "All",
    "Web Development",
    "Machine Learning",
    "System Design",
    "JavaScript",
    "DevOps",
    "Design",
    "Career",
    "Project Management",
    "Software Engineering"
  ];

  const handleDownload = (item: any) => {
    // Simulate download process
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${item.title}.${item.type === 'pdf' ? 'pdf' : item.type === 'video' ? 'mp4' : 'zip'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Downloading ${item.title}...`,
    });
  };

  const handleBookmark = (item: any) => {
    const isCurrentlyBookmarked = bookmarkedItems.includes(item.id);
    
    if (isCurrentlyBookmarked) {
      setBookmarkedItems(prev => prev.filter(id => id !== item.id));
    } else {
      setBookmarkedItems(prev => [...prev, item.id]);
    }
    
    toast({
      title: "Bookmark Updated",
      description: isCurrentlyBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
    });
  };

  const handleShare = async (item: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        const shareText = `${item.title} - ${item.description}\n${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Link Copied",
          description: "Content link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share content",
        variant: "destructive"
      });
    }
  };

  const handleView = (item: any) => {
    // Simulate opening content in new tab/window
    const viewUrl = `/library/view/${item.type}/${item.id}`;
    window.open(viewUrl, '_blank');
    
    toast({
      title: "Opening Content",
      description: `Opening ${item.title}...`,
    });
  };

  const handleUploadResource = () => {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.mp4,.zip,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Upload Started",
          description: `Uploading ${file.name}...`,
        });
        // Simulate upload process
        setTimeout(() => {
          toast({
            title: "Upload Complete",
            description: `${file.name} has been uploaded successfully!`,
          });
        }, 2000);
      }
    };
    input.click();
  };

  const handleShowBookmarks = () => {
    setShowBookmarksOnly(!showBookmarksOnly);
    toast({
      title: showBookmarksOnly ? "Showing All Resources" : "Showing Bookmarks",
      description: showBookmarksOnly ? "Displaying all library content" : "Displaying only bookmarked resources",
    });
  };

  const handleAdvancedFilters = () => {
    // This would open a filter modal/sidebar in a real app
    toast({
      title: "Advanced Filters",
      description: "Filter options: Category, Rating, Date, File Size, Author",
    });
  };

  const getFilteredContent = () => {
    const allContent = [
      ...libraryContent.pdfs.map(item => ({ ...item, type: 'pdf', isBookmarked: bookmarkedItems.includes(item.id) })),
      ...libraryContent.videos.map(item => ({ ...item, type: 'video', isBookmarked: bookmarkedItems.includes(item.id) })),
      ...libraryContent.templates.map(item => ({ ...item, type: 'template', isBookmarked: bookmarkedItems.includes(item.id) })),
      ...libraryContent.books.map(item => ({ ...item, type: 'book', isBookmarked: bookmarkedItems.includes(item.id) }))
    ];

    let filtered = allContent.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (showBookmarksOnly) {
      filtered = filtered.filter(item => item.isBookmarked);
    }

    return filtered;
  };

  const renderContentCard = (item: any, type: string) => {
    const getIcon = () => {
      switch (type) {
        case "pdf":
          return <FileText className="w-5 h-5" />;
        case "video":
          return <Video className="w-5 h-5" />;
        case "template":
          return <Code className="w-5 h-5" />;
        case "book":
          return <BookOpen className="w-5 h-5" />;
        default:
          return <File className="w-5 h-5" />;
      }
    };

    const getMetaInfo = () => {
      switch (type) {
        case "pdf":
          return (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{item.fileSize}</span>
              <span>{item.pages} pages</span>
              <span>{item.downloads} downloads</span>
            </div>
          );
        case "video":
          return (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{item.duration}</span>
              <span>{item.views} views</span>
              <div className="flex items-center space-x-1">
                <Play className="w-3 h-3" />
                <span>Video</span>
              </div>
            </div>
          );
        case "template":
          return (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{item.fileSize}</span>
              <span>{item.downloads} downloads</span>
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span>Template</span>
              </div>
            </div>
          );
        case "book":
          return (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{item.pages} pages</span>
              <span>{item.reads} reads</span>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>Book</span>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    if (viewMode === "list") {
      return (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                <div className="text-center">
                  {getIcon()}
                  <p className="text-xs text-gray-500 mt-1">{type.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleBookmark(item)}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedItems.includes(item.id) ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{item.author}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{item.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {getMetaInfo()}

                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.slice(0, 4).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 4}
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button size="sm" onClick={() => handleView(item)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownload(item)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare(item)}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={item.id} className="hover:shadow-lg transition-shadow">
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-100 rounded-t-lg flex items-center justify-center">
            <div className="text-center">
              {getIcon()}
              <p className="text-xs text-gray-500 mt-1">{type.toUpperCase()}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => handleBookmark(item)}
          >
            <Bookmark className={`w-4 h-4 ${bookmarkedItems.includes(item.id) ? 'fill-current text-yellow-500' : ''}`} />
          </Button>
          <Badge className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs">
            {item.category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="truncate">{item.author}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{item.rating}</span>
              </div>
            </div>

            {getMetaInfo()}

            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{item.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex space-x-2">
              <Button size="sm" className="flex-1" onClick={() => handleView(item)}>
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDownload(item)}>
                <Download className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleShare(item)}>
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library</h1>
          <p className="text-gray-600 mt-1">Access curated learning resources, templates, and educational content</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleUploadResource}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Resource
          </Button>
          <Button 
            variant={showBookmarksOnly ? "default" : "outline"} 
            onClick={handleShowBookmarks}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            {showBookmarksOnly ? "Show All" : "My Bookmarks"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">PDFs</p>
                <p className="text-xl font-bold">{libraryContent.pdfs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Videos</p>
                <p className="text-xl font-bold">{libraryContent.videos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Templates</p>
                <p className="text-xl font-bold">{libraryContent.templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Books</p>
                <p className="text-xl font-bold">{libraryContent.books.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search resources by title, author, description, or tags..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleAdvancedFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            {searchQuery && (
              <Button variant="ghost" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pdfs">PDFs</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>

        {/* All Content Tab */}
        <TabsContent value="all" className="space-y-6">
          {(() => {
            const filteredContent = getFilteredContent();
            if (filteredContent.length === 0) {
              return (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse all content.</p>
                </div>
              );
            }
            return (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {filteredContent.map((item) => renderContentCard(item, item.type))}
              </div>
            );
          })()}
        </TabsContent>

        {/* PDFs Tab */}
        <TabsContent value="pdfs" className="space-y-6">
          {(() => {
            let filteredPdfs = libraryContent.pdfs.map(item => ({ ...item, isBookmarked: bookmarkedItems.includes(item.id) })).filter(item => 
              !searchQuery || 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            if (showBookmarksOnly) {
              filteredPdfs = filteredPdfs.filter(item => item.isBookmarked);
            }
            if (filteredPdfs.length === 0) {
              return (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No PDFs found</h3>
                  <p className="text-gray-600">Try adjusting your search terms.</p>
                </div>
              );
            }
            return (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {filteredPdfs.map((item) => renderContentCard(item, "pdf"))}
              </div>
            );
          })()}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          {(() => {
            let filteredVideos = libraryContent.videos.map(item => ({ ...item, isBookmarked: bookmarkedItems.includes(item.id) })).filter(item => 
              !searchQuery || 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            if (showBookmarksOnly) {
              filteredVideos = filteredVideos.filter(item => item.isBookmarked);
            }
            if (filteredVideos.length === 0) {
              return (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos found</h3>
                  <p className="text-gray-600">Try adjusting your search terms.</p>
                </div>
              );
            }
            return (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {filteredVideos.map((item) => renderContentCard(item, "video"))}
              </div>
            );
          })()}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {(() => {
            let filteredTemplates = libraryContent.templates.map(item => ({ ...item, isBookmarked: bookmarkedItems.includes(item.id) })).filter(item => 
              !searchQuery || 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            if (showBookmarksOnly) {
              filteredTemplates = filteredTemplates.filter(item => item.isBookmarked);
            }
            if (filteredTemplates.length === 0) {
              return (
                <div className="text-center py-12">
                  <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600">Try adjusting your search terms.</p>
                </div>
              );
            }
            return (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {filteredTemplates.map((item) => renderContentCard(item, "template"))}
              </div>
            );
          })()}
        </TabsContent>

        {/* Books Tab */}
        <TabsContent value="books" className="space-y-6">
          {(() => {
            let filteredBooks = libraryContent.books.map(item => ({ ...item, isBookmarked: bookmarkedItems.includes(item.id) })).filter(item => 
              !searchQuery || 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            if (showBookmarksOnly) {
              filteredBooks = filteredBooks.filter(item => item.isBookmarked);
            }
            if (filteredBooks.length === 0) {
              return (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
                  <p className="text-gray-600">Try adjusting your search terms.</p>
                </div>
              );
            }
            return (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {filteredBooks.map((item) => renderContentCard(item, "book"))}
              </div>
            );
          })()}
        </TabsContent>
      </Tabs>

      {/* Featured Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Featured Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {libraryContent.pdfs.slice(0, 3).map((item) => (
              <div key={item.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-20 bg-blue-100 rounded flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs">{item.rating}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{item.downloads} downloads</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 