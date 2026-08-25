import type { LiveSession } from "@shared/types";
import { centsToDisplay } from "@shared/types";

export default function SessionCard({ session }: { session: LiveSession }) {
  const date = new Date(session.scheduledAt);
  const spotsLeft = session.maxParticipants - session.bookedCount;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60">
      <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{session.subject}</p>
      <h3 className="mt-1 font-semibold text-slate-900">{session.title}</h3>
      <p className="mt-1 text-sm text-slate-500">with {session.tutorName}</p>
      <p className="mt-2 text-sm text-slate-600">
        {date.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
        {" · "}
        {session.durationMinutes} min
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {spotsLeft} of {session.maxParticipants} spot{session.maxParticipants > 1 ? "s" : ""} left
        </span>
        <span className="font-semibold text-slate-900">{centsToDisplay(session.priceCents)}</span>
      </div>
      <button className="mt-3 w-full rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        Book session
      </button>
    </div>
  );
}
