import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Play,
  File,
  Code,
  TrendingUp,
  List,
  Grid3X3
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function StudentLibraryPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([1, 102, 201, 301]); // Updated IDs
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Mock library data with unique IDs
  const libraryContent = {
    pdfs: [
      {
        id: 1,
        title: "Complete React Developer Guide 2024",
        description: "Comprehensive guide to React development with modern practices",
        author: "Tech University Press",
        category: "Web Development",
        fileSize: "15.2 MB",
        pages: 245,
        rating: 4.8,
        downloads: 1250,
        tags: ["React", "JavaScript", "Frontend", "Web Development"],
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
        tags: ["System Design", "Architecture", "Interview Prep"],
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
      }
    ],
    videos: [
      {
        id: 101,
        title: "Advanced JavaScript Concepts",
        description: "Deep dive into closures, prototypes, and async programming",
        author: "CodeMaster Academy",
        category: "JavaScript",
        duration: "2h 15m",
        rating: 4.8,
        views: 3400,
        tags: ["JavaScript", "Advanced", "Web Development"],
      },
      {
        id: 102,
        title: "Docker for Beginners",
        description: "Learn containerization with Docker from scratch",
        author: "DevOps University",
        category: "DevOps",
        duration: "1h 45m",
        rating: 4.6,
        views: 2100,
        tags: ["Docker", "DevOps", "Containers"],
      },
      {
        id: 103,
        title: "UI/UX Design Principles",
        description: "Master fundamentals of user interface and experience design",
        author: "Design Studio",
        category: "Design",
        duration: "3h 20m",
        rating: 4.9,
        views: 1800,
        tags: ["UI/UX", "Design", "Figma"],
      }
    ],
    templates: [
      {
        id: 201,
        title: "React Portfolio Template",
        description: "Professional portfolio with React and Tailwind CSS",
        author: "TemplateHub",
        category: "Web Development",
        fileSize: "2.3 MB",
        rating: 4.7,
        downloads: 890,
        tags: ["React", "Portfolio", "Tailwind"],
      },
      {
        id: 202,
        title: "Resume Template Pack",
        description: "10 professional resume templates in different styles",
        author: "CareerBuilder",
        category: "Career",
        fileSize: "5.1 MB",
        rating: 4.8,
        downloads: 1200,
        tags: ["Resume", "Career", "Professional"],
      },
      {
        id: 203,
        title: "Project Proposal Template",
        description: "Comprehensive project proposal and documentation template",
        author: "ProjectHub",
        category: "Project Management",
        fileSize: "1.8 MB",
        rating: 4.6,
        downloads: 450,
        tags: ["Proposal", "Documentation", "Management"],
      }
    ],
    books: [
      {
        id: 301,
        title: "Clean Code",
        description: "A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        category: "Software Engineering",
        pages: 464,
        rating: 4.9,
        reads: 2100,
        tags: ["Clean Code", "Best之旅", "Programming"],
      },
      {
        id: 302,
        title: "Design Patterns",
        description: "Elements of Reusable Object-Oriented Software",
        author: "Gang of Four",
        category: "Software Design",
        pages: 416,
        rating: 4.8,
        reads: 1800,
        tags: ["Design Patterns", "OOP", "Architecture"],
      },
      {
        id: 303,
        title: "The Pragmatic Programmer",
        description: "Your journey to mastery in software development",
        author: "Andrew Hunt, David Thomas",
        category: "Software Development",
        pages: 352,
        rating: 4.9,
        reads: 2400,
        tags: ["Programming", "Career", "Best Practices"],
      }
    ]
  };

  // Unified filtering
  const filterItems = (items: any[], type: string) => {
    return items
      .map(item => ({ ...item, type, isBookmarked: bookmarkedItems.includes(item.id) }))
      .filter(item => {
        const matchesSearch = !searchQuery || [
          item.title,
          item.description,
          item.author,
          ...item.tags
        ].some(field => field.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesBookmark = !showBookmarksOnly || item.isBookmarked;

        return matchesSearch && matchesBookmark;
      });
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "pdfs": return filterItems(libraryContent.pdfs, "pdf");
      case "videos": return filterItems(libraryContent.videos, "video");
      case "templates": return filterItems(libraryContent.templates, "template");
      case "books": return filterItems(libraryContent.books, "book");
      default: return [
        ...filterItems(libraryContent.pdfs, "pdf"),
        ...filterItems(libraryContent.videos, "video"),
        ...filterItems(libraryContent.templates, "template"),
        ...filterItems(libraryContent.books, "book")
      ];
    }
  };

  const handleDownload = (item: any) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${item.title}.${item.type === 'video' ? 'mp4' : 'zip'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: `${item.title}` });
  };

  const handleBookmark = (item: any) => {
    setBookmarkedItems(prev =>
      prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
    toast({
      title: bookmarkedItems.includes(item.id) ? "Removed" : "Bookmarked",
      description: bookmarkedItems.includes(item.id) ? "Removed from bookmarks" : "Added to bookmarks"
    });
  };

  const handleShare = async (item: any) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, text: item.description });
      } else {
        await navigator.clipboard.writeText(`${item.title}\n${item.description}\n${window.location.href}`);
        toast({ title: "Copied", description: "Link copied to clipboard" });
      }
    } catch {
      toast({ title: "Failed", description: "Could not share", variant: "destructive" });
    }
  };

  const handleView = (item: any) => {
    window.open(`/library/view/${item.type}/${item.id}`, '_blank');
    toast({ title: "Opening", description: item.title });
  };

  const handleUploadResource = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.mp4,.zip';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({ title: "Uploading...", description: file.name });
        setTimeout(() => toast({ title: "Success", description: `${file.name} uploaded!` }), 2000);
      }
    };
    input.click();
  };

  const handleShowBookmarks = () => {
    setShowBookmarksOnly(!showBookmarksOnly);
    toast({
      title: showBookmarksOnly ? "All Resources" : "Bookmarks Only",
      description: showBookmarksOnly ? "Showing all" : "Showing bookmarks"
    });
  };

  const handleAdvancedFilters = () => {
    toast({ title: "Filters", description: "Category, Rating, Date, Size" });
  };

  const renderContentCard = (item: any) => {
    const getIcon = () => {
      switch (item.type) {
        case "pdf": return <FileText className="w-5 h-5" />;
        case "video": return <Video className="w-5 h-5" />;
        case "template": return <Code className="w-5 h-5" />;
        case "book": return <BookOpen className="w-5 h-5" />;
        default: return <File className="w-5 h-5" />;
      }
    };

    const getMetaInfo = () => {
      switch (item.type) {
        case "pdf":
          return (
            <div className="flex justify-between text-xs text-gray-500">
              <span>{item.fileSize}</span>
              <span>{item.pages} pages</span>
              <span>{item.downloads} dl</span>
            </div>
          );
        case "video":
          return (
            <div className="flex justify-between text-xs text-gray-500">
              <span>{item.duration}</span>
              <span>{item.views} views</span>
              <div className="flex items-center gap-1"><Play className="w-3 h-3" /><span>Video</span></div>
            </div>
          );
        case "template":
          return (
            <div className="flex justify-between text-xs text-gray-500">
              <span>{item.fileSize}</span>
              <span>{item.downloads} dl</span>
              <div className="flex items-center gap-1"><Download className="w-3 h-3" /><span>Template</span></div>
            </div>
          );
        case "book":
          return (
            <div className="flex justify-between text-xs text-gray-500">
              <span>{item.pages} pages</span>
              <span>{item.reads} reads</span>
              <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" /><span>Book</span></div>
            </div>
          );
        default: return null;
      }
    };

    if (viewMode === "list") {
      return (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                {getIcon()}
                <p className="text-xs text-gray-500 mt-1">{item.type.toUpperCase()}</p>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleBookmark(item)}>
                    <Bookmark className={`w-4 h-4 ${item.isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{item.author}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{item.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                </div>

                {getMetaInfo()}

                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 4).map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                  {item.tags.length > 4 && <Badge variant="outline" className="text-xs">+{item.tags.length - 4}</Badge>}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleView(item)}><Eye className="w-4 h-4 mr-2" />View</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownload(item)}><Download className="w-4 h-4 mr-2" />Download</Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare(item)}><Share2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Grid View
    return (
      <Card key={item.id} className="hover:shadow-lg transition-shadow">
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-100 rounded-t-lg flex flex-col items-center justify-center p-4">
            {getIcon()}
            <p className="text-xs text-gray-500 mt-1">{item.type.toUpperCase()}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => handleBookmark(item)}
          >
            <Bookmark className={`w-4 h-4 ${item.isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
          </Button>
          <Badge className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs">
            {item.category}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="truncate">{item.author}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{item.rating}</span>
            </div>
          </div>
          {getMetaInfo()}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
            ))}
            {item.tags.length > 3 && <Badge variant="outline" className="text-xs">+{item.tags.length - 3}</Badge>}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => handleView(item)}><Eye className="w-3 h-3 mr-1" />View</Button>
            <Button size="sm" variant="outline" onClick={() => handleDownload(item)}><Download className="w-3 h-3" /></Button>
            <Button size="sm" variant="outline" onClick={() => handleShare(item)}><Share2 className="w-3 h-3" /></Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const content = getTabContent();
  const total = Object.values(libraryContent).flat().length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library</h1>
          <p className="text-gray-600 mt-1">Curated learning resources and templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUploadResource}>
            <Plus className="w-4 h-4 mr-2" /> Upload
          </Button>
          <Button variant={showBookmarksOnly ? "default" : "outline"} onClick={handleShowBookmarks}>
            <Bookmark className="w-4 h-4 mr-2" />
            {showBookmarksOnly ? "All" : "Bookmarks"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><div className="p-2 bg-blue-100 rounded-lg"><FileText className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-gray-500">PDFs</p><p className="text-xl font-bold">{libraryContent.pdfs.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><div className="p-2 bg-green-100 rounded-lg"><Video className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-gray-500">Videos</p><p className="text-xl font-bold">{libraryContent.videos.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><div className="p-2 bg-purple-100 rounded-lg"><Code className="w-5 h-5 text-purple-600" /></div><div><p className="text-sm text-gray-500">Templates</p><p className="text-xl font-bold">{libraryContent.templates.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><div className="p-2 bg-orange-100 rounded-lg"><BookOpen className="w-5 h-5 text-orange-600" /></div><div><p className="text-sm text-gray-500">Books</p><p className="text-xl font-bold">{libraryContent.books.length}</p></div></div></CardContent></Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, author, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleAdvancedFilters}>
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            {searchQuery && <Button variant="ghost" onClick={() => setSearchQuery("")}>Clear</Button>}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All ({total})</TabsTrigger>
            <TabsTrigger value="pdfs">PDFs ({libraryContent.pdfs.length})</TabsTrigger>
            <TabsTrigger value="videos">Videos ({libraryContent.videos.length})</TabsTrigger>
            <TabsTrigger value="templates">Templates ({libraryContent.templates.length})</TabsTrigger>
            <TabsTrigger value="books">Books ({libraryContent.books.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4 mr-2" /> List
            </Button>
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4 mr-2" /> Grid
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {content.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results</h3>
              <p className="text-gray-600">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
              {content.map(renderContentCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Featured */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>Featured Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {libraryContent.pdfs.slice(0, 3).map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-20 bg-blue-100 rounded flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{item.rating}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{item.downloads} dl</span>
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