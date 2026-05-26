"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Upload } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
}

export default function QuotationForm({ tenderId, onQuotationAdded }: { tenderId: string, onQuotationAdded: () => void }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [newVendorName, setNewVendorName] = useState("");
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [totalAmount, setTotalAmount] = useState("");
  const [timeline, setTimeline] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingVendors, setFetchingVendors] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await fetch("/api/vendors");
        if (res.ok) {
          const data = await res.json();
          setVendors(data);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setFetchingVendors(false);
      }
    }
    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let vendorId = selectedVendor;

      if (isAddingVendor && newVendorName) {
        const vRes = await fetch("/api/vendors", {
          method: "POST",
          body: JSON.stringify({ name: newVendorName }),
          headers: { "Content-Type": "application/json" },
        });
        if (vRes.ok) {
          const newVendor = await vRes.json();
          vendorId = newVendor.id;
        }
      }

      if (!vendorId) {
        alert("Please select or add a vendor");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/tenders/${tenderId}/quotations`, {
        method: "POST",
        body: JSON.stringify({
          vendorId,
          totalAmount: parseFloat(totalAmount),
          timeline,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        onQuotationAdded();
        setTotalAmount("");
        setTimeline("");
        setSelectedVendor("");
        setNewVendorName("");
        setIsAddingVendor(false);
      }
    } catch (error) {
      console.error("Failed to add quotation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Add Quotation</CardTitle>
        <CardDescription>Upload or enter vendor quotation details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Vendor</label>
            {!isAddingVendor ? (
              <div className="flex gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-muted bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  disabled={fetchingVendors}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <Button type="button" variant="outline" size="icon" onClick={() => setIsAddingVendor(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="New vendor name"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  className="bg-background/50 border-muted"
                />
                <Button type="button" variant="ghost" onClick={() => setIsAddingVendor(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Total Amount</label>
              <Input
                type="number"
                placeholder="e.g. 50000"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="bg-background/50 border-muted"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Delivery Timeline</label>
              <Input
                placeholder="e.g. 4 weeks"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="bg-background/50 border-muted"
              />
            </div>
          </div>

          <div className="p-4 border border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Upload quotation PDF (Optional)</p>
          </div>

          <Button type="submit" className="w-full font-semibold" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Quotation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
