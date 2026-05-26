"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Save, Trash2, Plus, Download, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BoqItem {
  id: string | number
  description: string
  quantity: number | string
  unit: string
  rate: number | string
  amount: number | string
}

interface BoqTableProps {
  initialData: BoqItem[]
  onSave: (data: BoqItem[]) => void
  aiAnalysis?: {
    missingScope?: string[]
    duplicates?: string[]
    insights?: string
  }
}

export function BoqTable({ initialData, onSave, aiAnalysis }: BoqTableProps) {
  const [data, setData] = useState<BoqItem[]>(initialData)

  const handleInputChange = (id: string | number, field: keyof BoqItem, value: string) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        // Auto-calculate amount if quantity and rate are present
        if (field === "quantity" || field === "rate") {
          const q = parseFloat(String(updatedItem.quantity))
          const r = parseFloat(String(updatedItem.rate))
          if (!isNaN(q) && !isNaN(r)) {
            updatedItem.amount = (q * r).toFixed(2)
          }
        }
        return updatedItem
      }
      return item
    })
    setData(newData)
  }

  const addItem = () => {
    const newItem: BoqItem = {
      id: Date.now(),
      description: "",
      quantity: "",
      unit: "",
      rate: "",
      amount: "",
    }
    setData([...data, newItem])
  }

  const removeItem = (id: string | number) => {
    setData(data.filter((item) => item.id !== id))
  }

  const totalAmount = data.reduce((sum, item) => sum + parseFloat(String(item.amount) || "0"), 0)

  return (
    <div className="space-y-6">
      {aiAnalysis && (
        <div className="grid gap-4 md:grid-cols-2">
          {aiAnalysis.missingScope && aiAnalysis.missingScope.length > 0 && (
            <Card className="border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-900">Potential Missing Scope</h4>
                  <ul className="mt-2 list-inside list-disc text-sm text-amber-800">
                    {aiAnalysis.missingScope.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
          {aiAnalysis.duplicates && aiAnalysis.duplicates.length > 0 && (
            <Card className="border-rose-200 bg-rose-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
                <div>
                  <h4 className="font-semibold text-rose-900">Duplicate Items Detected</h4>
                  <ul className="mt-2 list-inside list-disc text-sm text-rose-800">
                    {aiAnalysis.duplicates.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b bg-muted/50 px-6 py-4">
          <h3 className="font-semibold">Extracted BOQ Items</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => onSave(data)}>
              <Save className="mr-2 h-4 w-4" />
              Save BOQ
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Unit</TableHead>
                <TableHead className="w-[120px]">Quantity</TableHead>
                <TableHead className="w-[120px]">Rate</TableHead>
                <TableHead className="w-[150px]">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => handleInputChange(item.id, "description", e.target.value)}
                      className="h-8 border-transparent bg-transparent focus:border-input focus:bg-background"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.unit}
                      onChange={(e) => handleInputChange(item.id, "unit", e.target.value)}
                      className="h-8 border-transparent bg-transparent focus:border-input focus:bg-background"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(item.id, "quantity", e.target.value)}
                      className="h-8 border-transparent bg-transparent focus:border-input focus:bg-background"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleInputChange(item.id, "rate", e.target.value)}
                      className="h-8 border-transparent bg-transparent focus:border-input focus:bg-background"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleInputChange(item.id, "amount", e.target.value)}
                      className="h-8 border-transparent bg-transparent focus:border-input focus:bg-background font-semibold"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No items extracted. Click "Add Item" to start manually or upload a document.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end border-t bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Total BOQ Value:</span>
            <span className="text-xl font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAmount)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
