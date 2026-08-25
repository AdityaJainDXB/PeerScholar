import type { LiveSession } from "@shared/types";
import { centsToDisplay } from "@shared/types";

export default function SessionCard({ session }: { session: LiveSession }) {
  const date = new Date(session.scheduledAt);
  const spotsLeft = session.maxParticipants - session.bookedCount;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
      <div className="relative h-24 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${session.id}/480/240`}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <span className="absolute left-3 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
          Live
        </span>
        <span className="absolute bottom-2 left-3 text-xs font-bold uppercase tracking-wide text-white drop-shadow">
          {session.subject}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{session.title}</h3>
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
        <button className="mt-3 w-full rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md">
          Book session
        </button>
      </div>
    </div>
  );
}
