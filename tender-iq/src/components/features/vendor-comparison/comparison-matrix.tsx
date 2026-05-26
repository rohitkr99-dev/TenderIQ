"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Quotation {
  id: string;
  totalAmount: number;
  currency: string;
  timeline: string | null;
  warranty: string | null;
  exclusions: string | null;
  commercialTerms: string | null;
  vendor: {
    name: string;
  };
}

export default function ComparisonMatrix({ quotations }: { quotations: Quotation[] }) {
  if (quotations.length === 0) return null;

  const lowestPrice = Math.min(...quotations.map(q => q.totalAmount));

  return (
    <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Comparison Matrix</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-muted">
              <TableHead className="pl-6">Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead>Exclusions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((q) => (
              <TableRow key={q.id} className="border-muted/50 group">
                <TableCell className="pl-6 font-semibold">{q.vendor.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">{formatCurrency(q.totalAmount, q.currency)}</span>
                    {q.totalAmount === lowestPrice && (
                      <Badge variant="default" className="text-[10px] py-0 h-4 w-fit bg-green-500 hover:bg-green-600">Lowest</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{q.timeline || "N/A"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{q.warranty || "Standard"}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                  {q.exclusions || "None mentioned"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
