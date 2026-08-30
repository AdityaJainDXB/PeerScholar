"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import LocalTime from "@/components/LocalTime";
import { useToast } from "@/components/Toast";
import { useAppStore } from "@/lib/AppStore";
import { centsToDisplay, type LiveSession } from "@shared/types";

export default function SessionCard({ session }: { session: LiveSession }) {
  const { isBooked, book, cancelBooking, hydrated } = useAppStore();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [booking, setBooking] = useState(false);

  const booked = hydrated && isBooked(session.id);
  const spotsLeft = session.maxParticipants - session.bookedCount - (booked ? 1 : 0);
  const isFull = spotsLeft <= 0 && !booked;
  const isFree = session.priceCents === 0;

  async function confirmBooking() {
    setBooking(true);
    await new Promise((r) => setTimeout(r, 600));
    book(session.id);
    setBooking(false);
    setConfirmOpen(false);
    toast(`Booked — ${session.title}`);
  }

  function handleCancel() {
    cancelBooking(session.id);
    toast("Booking cancelled.", "info");
  }

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
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
          {booked && (
            <span className="absolute right-3 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Booked
            </span>
          )}
          <span className="absolute bottom-2 left-3 text-xs font-bold uppercase tracking-wide text-white drop-shadow">
            {session.subject}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold text-slate-900">{session.title}</h3>
          <p className="mt-1 text-sm text-slate-500">with {session.tutorName}</p>
          <p className="mt-2 text-sm text-slate-600">
            <LocalTime
              iso={session.scheduledAt}
              options={{
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }}
            />
            {" · "}
            {session.durationMinutes} min
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className={`text-xs ${isFull ? "font-medium text-rose-600" : "text-slate-500"}`}>
              {isFull
                ? "Fully booked"
                : `${spotsLeft} of ${session.maxParticipants} spot${session.maxParticipants > 1 ? "s" : ""} left`}
            </span>
            <span className="font-semibold text-slate-900">
              {isFree ? "Free" : centsToDisplay(session.priceCents)}
            </span>
          </div>

          <div className="mt-3 flex-1" />

          {booked ? (
            <div className="flex gap-2">
              {session.joinUrl && (
                <a
                  href={session.joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-lg bg-brand-600 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Join
                </a>
              )}
              <button
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={isFull}
              className="w-full rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isFull ? "Fully booked" : "Book session"}
            </button>
          )}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm your booking"
        description="You'll get the join link as soon as it's confirmed."
      >
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-slate-900">{session.title}</p>
          <p className="text-sm text-slate-500">with {session.tutorName}</p>
          <dl className="mt-4 space-y-1.5 border-t border-slate-200 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">When</dt>
              <dd className="text-right font-medium text-slate-900">
                <LocalTime
                  iso={session.scheduledAt}
                  options={{
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }}
                />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Length</dt>
              <dd className="font-medium text-slate-900">{session.durationMinutes} minutes</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 text-base">
              <dt className="font-semibold text-slate-900">Total</dt>
              <dd className="font-bold text-slate-900">
                {isFree ? "$0.00" : centsToDisplay(session.priceCents)}
              </dd>
            </div>
          </dl>
        </div>

        {!isFree && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            This prototype doesn't process real payments — booking is free while Stripe Connect
            is still being wired up.
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setConfirmOpen(false)}
            className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmBooking}
            disabled={booking}
            className="flex-1 rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {booking ? "Booking…" : "Confirm booking"}
          </button>
        </div>
      </Modal>
    </>
  );
}
