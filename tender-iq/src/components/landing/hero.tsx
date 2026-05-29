"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              The Future of <span className="text-gradient">Tender Management</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Harness the power of AI to analyze tenders, extract BOQ insights, and rank vendors with precision. Build faster, smarter, and win more projects.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8 text-base">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              View Demo
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mt-20 w-full max-w-5xl overflow-hidden rounded-2xl border bg-background shadow-2xl"
          >
            <div className="aspect-[16/9] bg-muted/50 p-2">
              <div className="h-full w-full rounded-lg bg-background shadow-inner">
                {/* Dashboard Image Placeholder */}
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Image
                    src="/images/hero-image.png"
                    alt="TenderIQ Dashboard"
                    fill
                    className="object-cover opacity-90"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
