"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const tiers = [
  {
    name: "Professional",
    price: "$499",
    description: "Perfect for growing contractors and specialized firms.",
    features: [
      "Up to 10 project uploads/mo",
      "Full AI Tender Analyzer",
      "BOQ Extraction (PDF/Excel)",
      "Vendor Comparison Matrix",
      "Team Collaboration (5 seats)",
      "Email Support"
    ],
    buttonText: "Start Free Trial",
    highlight: false
  },
  {
    name: "Enterprise",
    price: "$1,299",
    description: "Advanced features for large firms and procurement teams.",
    features: [
      "Unlimited project uploads",
      "Priority AI Processing",
      "Custom Compliance Checklists",
      "Advanced Procurement Planning",
      "Unlimited Team Seats",
      "24/7 Priority Support",
      "API Access"
    ],
    buttonText: "Contact Sales",
    highlight: true
  }
]

export function LandingPricing() {
  return (
    <section className="bg-muted/50 py-24 sm:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, <span className="text-primary">transparent pricing</span>
          </h2>
          <p className="mt-4 max-w-[700px] text-muted-foreground sm:text-lg">
            Choose the plan that fits your team's needs. All plans include our core AI engine.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex flex-col p-8 premium-card ${
                tier.highlight ? "border-primary ring-1 ring-primary shadow-xl" : ""
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  <span className="ml-1 text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{tier.description}</p>
              </div>
              <ul className="mb-8 space-y-4 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlight ? "default" : "outline"}
                className="w-full h-11"
              >
                {tier.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
