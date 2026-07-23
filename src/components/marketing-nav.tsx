import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

export function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/"><Logo /></Link>
        <div className="hidden gap-8 text-[13px] font-medium text-muted-foreground md:flex">
          <a href="#assessment" className="hover:text-foreground transition-colors">Assessment</a>
          <a href="#discovery" className="hover:text-foreground transition-colors">Discovery</a>
          <a href="#experience" className="hover:text-foreground transition-colors">Experience</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-[13px] font-medium text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="rounded-full bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-colors hover:bg-foreground/90"
          >Get started</Link>
        </div>
      </div>
    </nav>
  );
}
