export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">This module is currently under development.</p>
      </div>
    </div>
  )
}
