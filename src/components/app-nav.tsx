import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "./logo";

export function AppNav() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/dashboard"><Logo /></Link>
        <div className="hidden gap-6 text-[13px] font-medium text-muted-foreground md:flex">
          <Link to="/dashboard" className="hover:text-foreground [&.active]:text-foreground">Dashboard</Link>
          <Link to="/assessment" className="hover:text-foreground [&.active]:text-foreground">Assessment</Link>
          <Link to="/report" className="hover:text-foreground [&.active]:text-foreground">Report</Link>
          <Link to="/careers" className="hover:text-foreground [&.active]:text-foreground">Careers</Link>
        </div>
        <button
          onClick={signOut}
          className="text-[13px] font-medium text-muted-foreground hover:text-foreground"
        >Sign out</button>
      </div>
    </nav>
  );
}
