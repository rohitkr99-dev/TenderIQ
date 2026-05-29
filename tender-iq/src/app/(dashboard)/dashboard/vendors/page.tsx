"use client";

import { useState, useEffect } from "react";
import QuotationForm from "@/components/features/vendor-comparison/quotation-form";
import ComparisonMatrix from "@/components/features/vendor-comparison/comparison-matrix";
import AIInsights from "@/components/features/vendor-comparison/ai-insights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ClipboardCheck, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Tender {
  id: string;
  title: string;
}

export default function VendorComparisonPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const [quotations, setQuotations] = useState([]);
  const [loadingTenders, setLoadingTenders] = useState(true);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [searchTerm, setSearcherTerm] = useState("");

  useEffect(() => {
    async function fetchTenders() {
      try {
        const res = await fetch("/api/tenders");
        if (res.ok) {
          const data = await res.json();
          setTenders(data);
        }
      } catch (error) {
        console.error("Failed to fetch tenders:", error);
      } finally {
        setLoadingTenders(false);
      }
    }
    fetchTenders();
  }, []);

  useEffect(() => {
    if (selectedTenderId) {
      fetchQuotations(selectedTenderId);
    }
  }, [selectedTenderId]);

  async function fetchQuotations(tenderId: string) {
    setLoadingQuotations(true);
    try {
      const res = await fetch(`/api/tenders/${tenderId}/quotations`);
      if (res.ok) {
        const data = await res.json();
        setQuotations(data);
      }
    } catch (error) {
      console.error("Failed to fetch quotations:", error);
    } finally {
      setLoadingQuotations(false);
    }
  }

  const filteredTenders = tenders.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!selectedTenderId) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Vendor Comparison</h1>
          <p className="text-muted-foreground">Select a tender to compare vendor quotations and get AI insights.</p>
        </div>

        <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Tenders</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tenders..." 
                  className="pl-9 bg-background/50 border-muted"
                  value={searchTerm}
                  onChange={(e) => setSearcherTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingTenders ? (
              <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredTenders.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">No tenders found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTenders.map((tender) => (
                  <button
                    key={tender.id}
                    onClick={() => setSelectedTenderId(tender.id)}
                    className="text-left p-4 rounded-xl border border-muted bg-background/40 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ClipboardCheck className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{tender.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">Click to view comparison matrix</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedTender = tenders.find(t => t.id === selectedTenderId);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setSelectedTenderId(null)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{selectedTender?.title}</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <ClipboardCheck className="h-3 w-3" /> Vendor Comparison Matrix
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {loadingQuotations ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <>
              <ComparisonMatrix quotations={quotations} />
              <QuotationForm tenderId={selectedTenderId} onQuotationAdded={() => fetchQuotations(selectedTenderId)} />
            </>
          )}
        </div>
        <div className="space-y-8">
          <AIInsights tenderId={selectedTenderId} />
        </div>
      </div>
    </div>
  );
}
