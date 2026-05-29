"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How accurate is the AI at extracting BOQ items?",
    answer: "Our AI engine is trained specifically on construction documentation and achieves over 98% accuracy in item extraction. It handles various formats and even detects handwritten notes or irregular formatting in older PDF documents."
  },
  {
    question: "Can I integrate TenderIQ with my existing ERP?",
    answer: "Yes, our Enterprise plan includes API access which allows for seamless integration with major ERP systems like Procore, Autodesk Construction Cloud, and Oracle NetSuite."
  },
  {
    question: "What file formats does the Tender Analyzer support?",
    answer: "We support PDF, DOCX, and XLSX for tender documents. For BOQ Intelligence, we specialize in processing Excel files and high-resolution PDF exports."
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. We use industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit. We are SOC2 Type II compliant and offer multi-company data isolation."
  }
]

export function LandingFAQ() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Have questions about how TenderIQ works? We've got answers.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
