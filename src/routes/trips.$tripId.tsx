import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Trips, uid, formatRange, daysBetween, type Trip, type Activity } from "@/lib/trips";
import { ArrowLeft, Plus, Trash2, Utensils, Compass, BedDouble, Bus, X } from "lucide-react";

export const Route = createFileRoute("/trips/$tripId")({
  component: TripDetail,
  head: () => ({ meta: [{ title: "Itinerary — Loop" }] }),
});

const categories = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "food", label: "Food", icon: Utensils },
  { id: "stay", label: "Stay", icon: BedDouble },
  { id: "transit", label: "Transit", icon: Bus },
] as const;

function CatIcon({ c }: { c: Activity["category"] }) {
  const Icon = categories.find((x) => x.id === c)?.icon ?? Compass;
  return <Icon className="h-3.5 w-3.5" />;
}

function TripDetail() {
  const { tripId } = Route.useParams();
  const nav = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const t = Trips.get(tripId);
    if (!t) {
      nav({ to: "/trips" });
      return;
    }
    setTrip(t);
    setActiveDayId(t.days[0]?.id ?? null);
  }, [tripId, nav]);

  const activeDay = useMemo(
    () => trip?.days.find((d) => d.id === activeDayId) ?? null,
    [trip, activeDayId],
  );

  function update(t: Trip) {
    setTrip(t);
    Trips.save(t);
  }

  function addActivity(a: Omit<Activity, "id">) {
    if (!trip || !activeDay) return;
    const next: Trip = {
      ...trip,
      days: trip.days.map((d) =>
        d.id === activeDay.id
          ? {
              ...d,
              activities: [...d.activities, { ...a, id: uid() }].sort((x, y) =>
                x.time.localeCompare(y.time),
              ),
            }
          : d,
      ),
    };
    update(next);
  }

  function removeActivity(actId: string) {
    if (!trip || !activeDay) return;
    update({
      ...trip,
      days: trip.days.map((d) =>
        d.id === activeDay.id
          ? { ...d, activities: d.activities.filter((a) => a.id !== actId) }
          : d,
      ),
    });
  }

  function deleteTrip() {
    if (!trip) return;
    if (!confirm("Delete this trip? This can't be undone.")) return;
    Trips.remove(trip.id);
    nav({ to: "/trips" });
  }

  if (!trip) return null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <Link
        to="/trips"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Trips
      </Link>

      {/* Trip header */}
      <div className="mt-4 rounded-3xl border border-border bg-gradient-to-br from-card to-sand/30 p-6 sm:p-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          {trip.destination}
        </div>
        <h1 className="mt-2 font-display text-5xl leading-tight sm:text-6xl">
          {trip.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{formatRange(trip.startDate, trip.endDate)}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <span>{daysBetween(trip.startDate, trip.endDate)} days</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <span>
            {trip.days.reduce((n, d) => n + d.activities.length, 0)} activities
          </span>
        </div>
        {trip.notes && (
          <p className="mt-4 max-w-2xl text-sm text-foreground/80">{trip.notes}</p>
        )}
      </div>

      {/* Day selector */}
      <div className="mt-8 -mx-5 overflow-x-auto px-5">
        <div className="flex gap-2">
          {trip.days.map((d, i) => {
            const active = d.id === activeDayId;
            const date = new Date(d.date);
            return (
              <button
                key={d.id}
                onClick={() => setActiveDayId(d.id)}
                className={`flex shrink-0 flex-col items-center rounded-2xl border px-4 py-3 text-center transition-all ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card hover:border-foreground/40"
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-70">
                  Day {i + 1}
                </span>
                <span className="font-display text-2xl leading-none">
                  {date.getDate()}
                </span>
                <span className="text-[10px] uppercase opacity-70">
                  {date.toLocaleDateString(undefined, { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day content */}
      {activeDay && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl">
              {new Date(activeDay.date).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 text-xs font-medium text-background hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          {activeDay.activities.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Nothing planned yet. Add a stop to get this day moving.
              </p>
            </div>
          ) : (
            <ol className="mt-6 space-y-3">
              {activeDay.activities.map((a) => (
                <li
                  key={a.id}
                  className="group flex gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="w-14 shrink-0 text-right font-display text-xl text-ocean">
                    {a.time || "—"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full bg-sand/40 px-2 py-0.5 text-sand-foreground">
                        <CatIcon c={a.category} />
                        {a.category}
                      </span>
                    </div>
                    <div className="mt-1 text-base font-medium leading-tight">
                      {a.title}
                    </div>
                    {a.note && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        {a.note}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeActivity(a.id)}
                    className="self-start rounded-full p-2 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      <div className="mt-12 border-t border-border pt-6 text-center">
        <button
          onClick={deleteTrip}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          Delete trip
        </button>
      </div>

      {adding && (
        <AddActivity
          onClose={() => setAdding(false)}
          onSave={(a) => {
            addActivity(a);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}

function AddActivity({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (a: Omit<Activity, "id">) => void;
}) {
  const [time, setTime] = useState("09:00");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<Activity["category"]>("explore");

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl border border-border bg-background p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-3xl">Add a stop</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputCls}
            />
            <input
              autoFocus
              placeholder="What's the plan?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
            />
          </div>
          <textarea
            rows={2}
            placeholder="A short note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputCls + " resize-none"}
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const Icon = c.icon;
              const active = c.id === category;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card hover:border-foreground/40"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {c.label}
                </button>
              );
            })}
          </div>
        </div>
        <button
          disabled={!title.trim()}
          onClick={() => onSave({ time, title: title.trim(), note: note.trim(), category })}
          className="mt-6 w-full rounded-full bg-foreground px-5 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Add to day
        </button>
      </div>
    </div>
  );
}
