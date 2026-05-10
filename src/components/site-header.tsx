import { Link, useRouterState } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function SiteHeader() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm transition-colors ${
        path === to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean text-ocean-foreground">
            <Compass className="h-4 w-4" />
          </span>
          <span className="font-display text-xl">Loop</span>
        </Link>
        <nav className="flex items-center gap-5">
          {link("/", "Home")}
          {link("/trips", "Trips")}
          <Link
            to="/trips/new"
            className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            New trip
          </Link>
        </nav>
      </div>
    </header>
  );
}
