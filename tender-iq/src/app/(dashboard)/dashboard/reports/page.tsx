'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Plus, 
  Loader2, 
  ChevronRight, 
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Report = {
  id: string;
  tenderId: string;
  type: string;
  content: string;
  createdAt: string;
};

type Tender = {
  id: string;
  title: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTenders();
  }, []);

  useEffect(() => {
    if (selectedTenderId) {
      fetchReports(selectedTenderId);
    }
  }, [selectedTenderId]);

  const fetchTenders = async () => {
    try {
      const res = await fetch('/api/tenders');
      const data = await res.json();
      setTenders(data);
      if (data.length > 0) {
        setSelectedTenderId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching tenders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = async (tenderId: string) => {
    try {
      const res = await fetch(`/api/tenders/${tenderId}/reports`);
      const data = await res.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const generateReport = async (type: string) => {
    if (!selectedTenderId) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/tenders/${selectedTenderId}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const newReport = await res.json();
      setReports([newReport, ...reports]);
      setSelectedReport(newReport);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async (reportId: string) => {
    window.open(`/api/reports/${reportId}/pdf`, '_blank');
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'TECHNICAL_PROPOSAL': return <ClipboardCheck className="h-5 w-5 text-blue-500" />;
      case 'COMMERCIAL_SUMMARY': return <BarChart3 className="h-5 w-5 text-green-500" />;
      case 'RISK_ANALYSIS': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'BID_RECOMMENDATION': return <Lightbulb className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage AI-powered tender proposals and analysis reports.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedTenderId}
            onChange={(e) => setSelectedTenderId(e.target.value)}
          >
            {tenders.map((tender) => (
              <option key={tender.id} value={tender.id}>{tender.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { type: 'TECHNICAL_PROPOSAL', title: 'Technical Proposal', desc: 'Draft a full technical response.', icon: <ClipboardCheck className="h-6 w-6" /> },
          { type: 'COMMERCIAL_SUMMARY', title: 'Commercial Summary', desc: 'Analyze commercial terms & costs.', icon: <BarChart3 className="h-6 w-6" /> },
          { type: 'RISK_ANALYSIS', title: 'Risk Analysis', desc: 'Identify & mitigate project risks.', icon: <AlertTriangle className="h-6 w-6" /> },
          { type: 'BID_RECOMMENDATION', title: 'Bid/No-Bid', desc: 'Strategic recommendation for the bid.', icon: <Lightbulb className="h-6 w-6" /> },
        ].map((item) => (
          <Card 
            key={item.type} 
            className="cursor-pointer hover:border-primary/50 transition-colors group"
            onClick={() => !isGenerating && generateReport(item.type)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {item.icon}
                </div>
                {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>All reports generated for this tender.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-0">
            <div className="space-y-2">
              {reports.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto opacity-20 mb-2" />
                  <p>No reports found.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedReport?.id === report.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center gap-3">
                      {getReportIcon(report.type)}
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {report.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 h-[600px] flex flex-col">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getReportIcon(selectedReport.type)}
                      {selectedReport.type.replace(/_/g, ' ')}
                    </CardTitle>
                    <CardDescription>
                      Generated on {new Date(selectedReport.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => downloadPDF(selectedReport.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {selectedReport.content.split('\n').map((para, i) => (
                      <p key={i} className="mb-4 whitespace-pre-wrap">{para}</p>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto opacity-20 mb-4" />
                  <p>Select a report to view details</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
