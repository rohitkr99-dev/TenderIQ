"use client"

import { useState, useRef } from "react"
import { Upload, File, X, Loader2, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface BoqUploadProps {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export function BoqUpload({ onUpload, isUploading }: BoqUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleSubmit = async () => {
    if (file) {
      await onUpload(file)
    }
  }

  const isExcel = file?.name.endsWith('.xlsx') || file?.name.endsWith('.xls')

  return (
    <Card className="p-8">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          file ? "border-primary/50 bg-primary/5" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          accept=".xlsx,.xls,.pdf"
          onChange={handleChange}
          disabled={isUploading}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">Click or drag to upload BOQ</h3>
              <p className="text-sm text-muted-foreground">
                Support for Excel (.xlsx, .xls) and PDF documents
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex w-full max-w-md items-center gap-4 rounded-lg border bg-background p-4 shadow-sm"
            >
              <div className="rounded bg-primary/10 p-2 text-primary">
                {isExcel ? <FileSpreadsheet className="h-6 w-6" /> : <File className="h-6 w-6" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="rounded-full p-1 hover:bg-muted"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {file && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit} disabled={isUploading} className="min-w-[120px]">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Extract BOQ Data"
            )}
          </Button>
        </div>
      )}
    </Card>
  )
}
