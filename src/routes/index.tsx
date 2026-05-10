import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/hero-coast.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Loop — Plan trips you'll actually take" },
      { name: "description", content: "A calm, beautiful trip planner for day-by-day itineraries." },
    ],
  }),
});

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-ember" />
              Built for slow, intentional travel
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              Plan the trip,<br />
              <span className="italic text-ocean">live the loop.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              A quiet space to shape your itinerary — destinations, dates,
              and the little moments in between.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/trips/new"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Start a new trip
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/trips"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
              >
                View my trips
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border shadow-[0_30px_80px_-30px_oklch(0.32_0.07_220/0.4)]">
              <img
                src={hero}
                alt="Aerial view of a coastal road meeting turquoise sea"
                width={1536}
                height={1024}
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-sand-foreground">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-display text-lg leading-none">Amalfi Coast</div>
                  <div className="text-xs text-muted-foreground">7 days · 12 stops</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:grid-cols-3">
          {[
            { icon: Calendar, title: "Day by day", body: "Plan each day at a calm pace, with space to breathe." },
            { icon: MapPin, title: "Place-first", body: "Cafés, viewpoints, transit — keep it all in one place." },
            { icon: Sparkles, title: "Yours, locally", body: "Your trips live on your device. No accounts, no noise." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-background p-6">
              <Icon className="h-5 w-5 text-ocean" />
              <h3 className="mt-4 font-display text-2xl">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
