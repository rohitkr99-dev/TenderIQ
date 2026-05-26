"use client"

import { useState } from "react"
import { FileUpload } from "@/components/features/tender-analyzer/file-upload"
import { AnalysisResult } from "@/components/features/tender-analyzer/analysis-result"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

export default function TenderAnalyzerPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)
    setAnalysisData(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post("/api/tender/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setAnalysisData(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred during analysis")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tender Analyzer</h1>
        <p className="text-muted-foreground">
          Upload your tender documents for AI-powered extraction and risk analysis.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        {!analysisData && (
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <AnimatePresence>
          {analysisData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-end">
                <button 
                  onClick={() => setAnalysisData(null)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Upload another document
                </button>
              </div>
              <AnalysisResult data={analysisData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
