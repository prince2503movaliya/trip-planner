export type Activity = {
  id: string;
  time: string;
  title: string;
  note?: string;
  category: "explore" | "food" | "stay" | "transit";
};

export type Day = {
  id: string;
  date: string; // ISO
  activities: Activity[];
};

export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  cover?: string;
  notes?: string;
  days: Day[];
};

const KEY = "trips:v1";

function read(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(trips: Trip[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(trips));
  window.dispatchEvent(new Event("trips:changed"));
}

export const Trips = {
  list: read,
  get: (id: string) => read().find((t) => t.id === id),
  save: (trip: Trip) => {
    const all = read();
    const i = all.findIndex((t) => t.id === trip.id);
    if (i >= 0) all[i] = trip;
    else all.unshift(trip);
    write(all);
  },
  remove: (id: string) => write(read().filter((t) => t.id !== id)),
};

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function buildDays(start: string, end: string): Day[] {
  const out: Day[] = [];
  if (!start || !end) return out;
  const s = new Date(start);
  const e = new Date(end);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push({ id: uid(), date: d.toISOString().slice(0, 10), activities: [] });
  }
  return out;
}

export function formatRange(a: string, b: string) {
  if (!a || !b) return "";
  const f = (s: string) =>
    new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${f(a)} – ${f(b)}`;
}

export function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}
