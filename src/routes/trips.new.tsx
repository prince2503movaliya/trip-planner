import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trips, buildDays, uid } from "@/lib/trips";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/trips/new")({
  component: NewTrip,
  head: () => ({ meta: [{ title: "New trip — Loop" }] }),
});

function NewTrip() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = uid();
    Trips.save({
      id,
      title: form.title || "Untitled trip",
      destination: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      notes: form.notes,
      days: buildDays(form.startDate, form.endDate),
    });
    nav({ to: "/trips/$tripId", params: { tripId: id } });
  }

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ocean focus:ring-2 focus:ring-ocean/20";

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <Link
        to="/trips"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Trips
      </Link>
      <h1 className="mt-4 font-display text-5xl">New trip</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A few details to get the bones in place. You can shape the days next.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Trip name">
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Summer in Lisbon"
            className={inputCls}
          />
        </Field>
        <Field label="Destination">
          <input
            required
            value={form.destination}
            onChange={(e) => set("destination", e.target.value)}
            placeholder="Lisbon, Portugal"
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start">
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="End">
            <input
              type="date"
              required
              value={form.endDate}
              min={form.startDate}
              onChange={(e) => set("endDate", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Notes (optional)">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="A few lines about the vibe…"
            className={inputCls + " resize-none"}
          />
        </Field>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-full bg-foreground px-5 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Create trip
          </button>
        </div>
      </form>
    </div>
  );
}
