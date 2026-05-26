import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t bg-background py-12 sm:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary" />
              <span className="text-xl font-bold tracking-tight">TenderIQ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering construction firms with AI-driven tender analysis and procurement intelligence.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-sm hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Tender Analyzer</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">BOQ Intelligence</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TenderIQ Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social Icons Placeholder */}
            <div className="h-5 w-5 rounded-full bg-muted" />
            <div className="h-5 w-5 rounded-full bg-muted" />
            <div className="h-5 w-5 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </footer>
  )
}
