import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Clock, CheckCircle, AlertCircle, Play, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, withRole } from '@/lib/api';

interface Report {
  id: number;
  name: string;
  type: 'user_activity' | 'platform_usage' | 'financial' | 'engagement';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  download_url?: string;
  file_size?: string;
  period: string;
}

const reportTypes = [
  { id: 'user_activity', name: 'User Activity Report', description: 'Detailed user engagement and activity metrics' },
  { id: 'platform_usage', name: 'Platform Usage Report', description: 'System performance and usage statistics' },
  { id: 'financial', name: 'Financial Report', description: 'Revenue, transactions, and financial metrics' },
  { id: 'engagement', name: 'Engagement Report', description: 'User interaction and engagement analytics' }
];

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/admin/reports", withRole("admin"));
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedType || !selectedPeriod) return;

    setGenerating(true);
    try {
      await api.post("/admin/reports/generate", {
        type: selectedType,
        period: selectedPeriod
      }, withRole("admin"));

      setShowGenerateDialog(false);
      setSelectedType('');
      setSelectedPeriod('30d');
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = async (reportId: number) => {
    try {
      const response = await api.get(`/admin/reports/${reportId}/download`, withRole("admin"));
      // Handle download logic here
      window.open(response.data.download_url, '_blank');
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report. Please try again.');
    }
  };

  const filteredReports = reports.filter(report => {
    if (filterStatus === 'all') return true;
    return report.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage detailed reports on platform usage and performance</p>
        </div>
        <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-ink-900 hover:bg-ink-800">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period">Time Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedType && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    {reportTypes.find(t => t.id === selectedType)?.description}
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={generateReport}
                  disabled={!selectedType || generating}
                  className="flex-1"
                >
                  {generating ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowGenerateDialog(false)}
                  disabled={generating}
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
                <p className="text-sm font-medium text-blue-600">Total Reports</p>
                <p className="text-2xl font-bold text-blue-900">{reports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">
                  {reports.filter(r => r.status === 'completed').length}
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
                <p className="text-sm font-medium text-yellow-600">Processing</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {reports.filter(r => r.status === 'processing').length}
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
                <p className="text-sm font-medium text-purple-600">This Month</p>
                <p className="text-2xl font-bold text-purple-900">
                  {reports.filter(r => {
                    const reportDate = new Date(r.created_at);
                    const now = new Date();
                    return reportDate.getMonth() === now.getMonth() &&
                           reportDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map(type => (
              <div key={type.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{type.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Reports</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(report.status)}
                      <div>
                        <div className="font-medium text-gray-900">{report.name}</div>
                        {report.file_size && (
                          <div className="text-sm text-gray-500">{report.file_size}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {report.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{report.period}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {report.status === 'completed' && report.download_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No reports found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
