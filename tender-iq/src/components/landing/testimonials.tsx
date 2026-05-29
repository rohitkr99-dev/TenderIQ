"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    content: "TenderIQ has completely transformed how we approach procurement. The AI-driven BOQ extraction saves us dozens of hours on every project.",
    author: "Sarah Chen",
    role: "Senior Quantity Surveyor",
    company: "BuildGlobal Ltd",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    content: "The risk scoring feature is a game-changer. We can now identify unfavorable contract terms in seconds, allowing us to negotiate better deals.",
    author: "James Miller",
    role: "Procurement Director",
    company: "Apex Construction",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
  },
  {
    content: "Professional, intuitive, and incredibly powerful. The vendor comparison matrix gives us the clarity we need to make high-stakes decisions.",
    author: "Elena Rodriguez",
    role: "Project Manager",
    company: "Urban Infrastructure Partners",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
  }
]

export function LandingTestimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Trusted by <span className="text-primary">industry leaders</span>
          </h2>
          <p className="mt-4 max-w-[700px] text-muted-foreground sm:text-lg">
            See how TenderIQ is helping construction firms and procurement teams streamline their workflow.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col justify-between p-8 premium-card"
            >
              <div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
