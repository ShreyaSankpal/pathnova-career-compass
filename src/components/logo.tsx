export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex size-6 items-center justify-center rounded-md bg-foreground">
        <span className="size-2 rounded-full bg-primary" />
        <span className="absolute inset-0 rounded-md ring-1 ring-inset ring-black/10" />
      </span>
      <span className="font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-foreground">
        PathNova
      </span>
    </div>
  );
}
