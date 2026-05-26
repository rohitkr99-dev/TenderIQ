"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, Loader2, FileText, Briefcase, Users, Hash, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"
import { useRouter } from "next/navigation"

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleSearch = useCallback(async (q: string) => {
    if (!q) {
      setResults(null)
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(q)}`)
      setResults(response.data.results)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    handleSearch(debouncedQuery)
  }, [debouncedQuery, handleSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const hasResults = results && (
    results.tenders.length > 0 || 
    results.projects.length > 0 || 
    results.vendors.length > 0 || 
    results.boqItems.length > 0
  )

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tenders, projects, or vendors..."
          className="pl-9 pr-9"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults(null)
            }}
            className="absolute right-2.5 top-2.5"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 w-full overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg z-50 max-h-[80vh] overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !hasResults ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="p-2">
                {results.tenders.length > 0 && (
                  <div className="mb-4">
                    <h3 className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Tenders
                    </h3>
                    {results.tenders.map((tender: any) => (
                      <Link
                        key={tender.id}
                        href={`/dashboard/analyzer?id=${tender.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="flex-1 truncate">{tender.title}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {results.projects.length > 0 && (
                  <div className="mb-4">
                    <h3 className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Projects
                    </h3>
                    {results.projects.map((project: any) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors cursor-pointer"
                      >
                        <Briefcase className="h-4 w-4 text-green-500" />
                        <span className="flex-1 truncate">{project.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {results.vendors.length > 0 && (
                  <div className="mb-4">
                    <h3 className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Vendors
                    </h3>
                    {results.vendors.map((vendor: any) => (
                      <Link
                        key={vendor.id}
                        href={`/dashboard/vendors?id=${vendor.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="flex-1 truncate">{vendor.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {results.boqItems.length > 0 && (
                  <div className="mb-2">
                    <h3 className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      BOQ Items
                    </h3>
                    {results.boqItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors cursor-pointer"
                      >
                        <Hash className="h-4 w-4 text-orange-500" />
                        <span className="flex-1 truncate">{item.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
