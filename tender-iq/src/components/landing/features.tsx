import { 
  FileSearch, 
  TableProperties, 
  ClipboardCheck, 
  CalendarDays, 
  BarChart3, 
  ShieldAlert 
} from "lucide-react"

const features = [
  {
    title: "Tender Analyzer",
    description: "Upload PDF contract documents and technical specifications. Our AI extracts key terms, deadlines, and requirements automatically.",
    icon: FileSearch,
  },
  {
    title: "BOQ Intelligence",
    description: "Extract items from Excel or PDF BOQs. Detect missing scope, duplicate items, and compare rates with AI-driven insights.",
    icon: TableProperties,
  },
  {
    title: "Vendor Comparison",
    description: "Automated price comparison across multiple vendor quotes. Identify abnormal pricing and rank vendors based on cost and compliance.",
    icon: ClipboardCheck,
  },
  {
    title: "Procurement Planner",
    description: "Generate material procurement schedules and lead-time alerts to ensure your project stays on track and within budget.",
    icon: CalendarDays,
  },
  {
    title: "AI Risk Scoring",
    description: "Our proprietary AI detects high-risk clauses, liquidated damages, and unfavorable payment terms before you bid.",
    icon: ShieldAlert,
  },
  {
    title: "Executive Reports",
    description: "Generate professional technical and commercial proposal drafts and bid/no-bid recommendations in seconds.",
    icon: BarChart3,
  },
]

export function LandingFeatures() {
  return (
    <section className="bg-muted/50 py-24 sm:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need to <span className="text-primary">win more tenders</span>
          </h2>
          <p className="mt-4 max-w-[700px] text-muted-foreground sm:text-lg">
            A comprehensive suite of AI-powered tools designed for construction professionals and procurement teams.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative flex flex-col items-start p-8 premium-card"
            >
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
