"use client"

import { useState } from "react"
import { BoqUpload } from "@/components/features/boq/boq-upload"
import { BoqTable } from "@/components/features/boq/boq-table"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

export default function BoqPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [boqData, setBoqData] = useState<any[] | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post("/api/boq/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Assuming the response contains both the extracted data and AI insights
      // The backend ai.service.ts returns only AI insights right now, 
      // but boq.routes.ts calls ExcelService.extractDataFromBuffer(req.file.buffer)
      // and then AIService.analyzeBOQ(data).
      // We need both the raw data and the analysis.
      
      // Let's refine this based on what the backend actually returns.
      // Currently boq.routes.ts returns only the result of AIService.analyzeBOQ(data).
      // I should probably update boq.routes.ts to return both.
      
      setBoqData(response.data.extractedData || [])
      setAiAnalysis(response.data.analysis || response.data)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Failed to analyze BOQ. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (data: any[]) => {
    console.log("Saving BOQ data:", data)
    // Implementation for saving to database would go here
    alert("BOQ data saved successfully!")
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">BOQ Intelligence</h1>
        <p className="text-muted-foreground mt-2">
          Upload your Bill of Quantities (Excel or PDF) for AI-powered item extraction and quantity analysis.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!boqData ? (
          <motion.div
            key="upload-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <BoqUpload onUpload={handleUpload} isUploading={isUploading} />
          </motion.div>
        ) : (
          <motion.div
            key="table-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setBoqData(null)}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                ← Upload another file
              </button>
            </div>
            <BoqTable 
              initialData={boqData} 
              onSave={handleSave} 
              aiAnalysis={aiAnalysis}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
