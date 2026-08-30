"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { useAppStore } from "@/lib/AppStore";
import { CURRENT_USER_ID } from "@/lib/mockData";
import { SUBJECTS } from "@shared/constants";
import type { LiveSession } from "@shared/types";

/** Default the date picker to tomorrow at 16:00 — the most common tutoring slot. */
function defaultWhen(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(16, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ScheduleSessionModal({
  open,
  onClose,
  tutorName,
}: {
  open: boolean;
  onClose: () => void;
  tutorName: string;
}) {
  const { addSession } = useAppStore();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0].name);
  const [when, setWhen] = useState(defaultWhen());
  const [duration, setDuration] = useState("45");
  const [seats, setSeats] = useState("4");
  const [price, setPrice] = useState("15");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const titleError = touched && title.trim().length < 6 ? "Give the session a title (6+ characters)." : null;
  const whenDate = new Date(when);
  const whenError =
    touched && (!when || Number.isNaN(whenDate.getTime()) || whenDate.getTime() <= Date.now())
      ? "Pick a date and time in the future."
      : null;
  const durationNum = Number(duration);
  const durationError =
    touched && (!Number.isInteger(durationNum) || durationNum < 15) ? "At least 15 minutes." : null;
  const seatsNum = Number(seats);
  const seatsError = touched && (!Number.isInteger(seatsNum) || seatsNum < 1) ? "At least 1 seat." : null;
  const priceNum = Number(price);
  const priceError = touched && (!Number.isFinite(priceNum) || priceNum < 0) ? "Enter a valid price." : null;

  async function submit() {
    setTouched(true);
    if (
      title.trim().length < 6 ||
      !when ||
      Number.isNaN(whenDate.getTime()) ||
      whenDate.getTime() <= Date.now() ||
      !Number.isInteger(durationNum) ||
      durationNum < 15 ||
      !Number.isInteger(seatsNum) ||
      seatsNum < 1 ||
      !Number.isFinite(priceNum) ||
      priceNum < 0
    ) {
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const id = `s-${Date.now()}`;
    const session: LiveSession = {
      id,
      tutorId: CURRENT_USER_ID,
      tutorName,
      subject,
      title: title.trim(),
      description: "",
      priceCents: Math.round(priceNum * 100),
      scheduledAt: whenDate.toISOString(),
      durationMinutes: durationNum,
      maxParticipants: seatsNum,
      bookedCount: 0,
      status: "scheduled",
      joinUrl: `https://meet.peerscholar.app/${id}`,
    };

    addSession(session);
    setSubmitting(false);
    setTitle("");
    setTouched(false);
    onClose();
    toast("Session scheduled — join link created");
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule a live session"
      description="Learners can book this slot as soon as you save it."
    >
      <div className="space-y-4">
        <Field label="Session title" error={titleError}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 1:1 Help — Related Rates"
            className={inputCls(titleError)}
          />
        </Field>

        <Field label="Subject">
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls(null)}>
            {SUBJECTS.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date and time" error={whenError}>
          <input
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className={inputCls(whenError)}
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Minutes" error={durationError}>
            <input
              type="number"
              min="15"
              step="5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={inputCls(durationError)}
            />
          </Field>
          <Field label="Seats" error={seatsError}>
            <input
              type="number"
              min="1"
              step="1"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className={inputCls(seatsError)}
            />
          </Field>
          <Field label="Price ($)" error={priceError}>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputCls(priceError)}
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={submitting}
          className="flex-1 rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Scheduling…" : "Schedule session"}
        </button>
      </div>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}

function inputCls(error?: string | null) {
  return `w-full rounded-lg border p-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
      : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
  }`;
}
