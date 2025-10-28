


import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { getMentorFeedback } from '@/lib/api';
import { Star, MessageSquare, Filter, Download, BarChart3, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeedbackItem {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  sessionTopic: string;
  sessionDate: string;
  rating: number;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  categories: string[];
  helpful: boolean;
}

export default function Feedback() {
  const [activeTab, setActiveTab] = useState('overview');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Get current mentor ID from localStorage
  const getCurrentMentorId = () => {
    const storedMentorId = localStorage.getItem('mentorId');
    const storedUser = localStorage.getItem('user');
    if (storedMentorId) {
      const mentorId = parseInt(storedMentorId);
      if (isNaN(mentorId)) {
        throw new Error('Invalid mentor ID in localStorage. Please log in again.');
      }
      return mentorId;
    }
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === 'mentor' && user.id) {
          localStorage.setItem('mentorId', user.id.toString());
          return parseInt(user.id);
        }
        throw new Error('User is not logged in as a mentor. Please log in as a mentor.');
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        throw new Error('Invalid user data in localStorage. Please log in again.');
      }
    }
    throw new Error('No mentor ID or user data found. Please log in as a mentor.');
  };

  // Fetch feedback data from the API
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const mentorId = getCurrentMentorId();
        const response = await getMentorFeedback(mentorId);
        const mappedData: FeedbackItem[] = response.data.map((item: any) => ({
          id: item.id,
          menteeId: item.menteeId,
          menteeName: item.menteeName,
          menteeAvatar: item.menteeAvatar || '/api/placeholder/40/40',
          sessionTopic: item.sessionTopic,
          sessionDate: item.sessionDate,
          rating: item.rating,
          feedback: item.feedback,
          sentiment: item.sentiment,
          categories: item.categories || [],
          helpful: item.helpful || false,
        }));
        setFeedbackItems(mappedData);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-300';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'negative': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors duration-200 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Filter feedback items based on search term
  const filteredFeedback = feedbackItems.filter(item =>
    item.menteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sessionTopic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare data for rating distribution chart
  const ratingData = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbackItems.filter(item => item.rating === rating).length
  }));

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Feedback Dashboard
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Explore feedback from your mentees and track your performance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
          <TabsTrigger 
            value="overview" 
            className="rounded-lg py-3 font-semibold text-gray-700 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-300"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="rounded-lg py-3 font-semibold text-gray-700 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-300"
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="rounded-lg py-3 font-semibold text-gray-700 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-300"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <MessageSquare className="w-6 h-6 mr-3 text-blue-500" />
                Ratings & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {feedbackItems.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                        <AvatarImage src={feedback.menteeAvatar} />
                        <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                          {feedback.menteeName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{feedback.menteeName}</h4>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getSentimentColor(feedback.sentiment)} font-medium px-3 py-1 rounded-full`}
                      >
                        {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feedback.feedback}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(feedback.sessionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">All Reviews</h2>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowSearch(!showSearch)}
                className="border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showSearch ? 'Hide Filter' : 'Filter'}
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          {showSearch && (
            <div className="mb-6 transform transition-all duration-300 ease-in-out">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by mentee name, feedback, or session topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}
          <div className="space-y-4">
            {filteredFeedback.map((feedback) => (
              <div 
                key={feedback.id} 
                className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{feedback.menteeName}</h3>
                  <div className="flex items-center space-x-2">
                    {renderStars(feedback.rating)}
                    <span className="text-sm font-medium text-gray-600">{feedback.rating}/5</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{feedback.feedback}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-800">
                  <BarChart3 className="w-6 h-6 mr-3 text-purple-500" />
                  Rating Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = feedbackItems.filter(item => item.rating === rating).length;
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 w-16">
                        <span className="text-sm font-semibold text-gray-700">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <span className="text-sm text-gray-500">{count} reviews</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <BarChart3 className="w-6 h-6 mr-3 text-blue-500" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="rating" 
                      label={{ value: 'Rating', position: 'bottom', offset: 0, fill: '#4b5563' }} 
                      stroke="#4b5563"
                    />
                    <YAxis 
                      label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft', fill: '#4b5563' }} 
                      stroke="#4b5563"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => [value, 'Reviews']}
                      labelFormatter={(label) => `Rating: ${label}`}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#colorGradient)" 
                      radius={[4, 4, 0, 0]}
                    >
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}