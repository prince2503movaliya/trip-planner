import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trips, formatRange, daysBetween, type Trip } from "@/lib/trips";
import { MapPin, Plus, Calendar } from "lucide-react";

export const Route = createFileRoute("/trips")({
  component: TripsPage,
  head: () => ({ meta: [{ title: "Your trips — Loop" }] }),
});

function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  useEffect(() => {
    const sync = () => setTrips(Trips.list());
    sync();
    window.addEventListener("trips:changed", sync);
    return () => window.removeEventListener("trips:changed", sync);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your library</p>
          <h1 className="mt-1 font-display text-5xl">Trips</h1>
        </div>
        <Link
          to="/trips/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand text-sand-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-3xl">No trips yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Start your first itinerary and it'll show up here.</p>
          <Link
            to="/trips/new"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Plan a trip
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {trips.map((t) => (
            <li key={t.id}>
              <Link
                to="/trips/$tripId"
                params={{ tripId: t.id }}
                className="group block rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {t.destination}
                </div>
                <h3 className="mt-1 font-display text-3xl leading-tight group-hover:text-ocean">
                  {t.title}
                </h3>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatRange(t.startDate, t.endDate)}
                  </span>
                  <span className="rounded-full bg-sand/40 px-2.5 py-1 text-sand-foreground">
                    {daysBetween(t.startDate, t.endDate)} days
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
