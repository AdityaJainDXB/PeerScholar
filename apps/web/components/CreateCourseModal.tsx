"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { useAppStore } from "@/lib/AppStore";
import { CURRENT_USER_ID } from "@/lib/mockData";
import { SUBJECTS } from "@shared/constants";
import type { Course } from "@shared/types";

export default function CreateCourseModal({
  open,
  onClose,
  tutorName,
}: {
  open: boolean;
  onClose: () => void;
  tutorName: string;
}) {
  const { addCourse } = useAppStore();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0].name);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("35");
  const [lessonCount, setLessonCount] = useState("12");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const titleError = touched && title.trim().length < 6 ? "Give your course a title (6+ characters)." : null;
  const descError =
    touched && description.trim().length < 20 ? "Add a description of at least 20 characters." : null;
  const priceNum = Number(price);
  const priceError =
    touched && (!Number.isFinite(priceNum) || priceNum < 0) ? "Enter a valid price (0 or more)." : null;
  const lessonNum = Number(lessonCount);
  const lessonError =
    touched && (!Number.isInteger(lessonNum) || lessonNum < 1) ? "At least 1 lesson." : null;

  const valid = !titleError && !descError && !priceError && !lessonError;

  function reset() {
    setTitle("");
    setDescription("");
    setPrice("35");
    setLessonCount("12");
    setTouched(false);
  }

  async function submit() {
    setTouched(true);
    if (
      title.trim().length < 6 ||
      description.trim().length < 20 ||
      !Number.isFinite(priceNum) ||
      priceNum < 0 ||
      !Number.isInteger(lessonNum) ||
      lessonNum < 1
    ) {
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const course: Course = {
      id: `c-${Date.now()}`,
      tutorId: CURRENT_USER_ID,
      tutorName,
      subject,
      title: title.trim(),
      description: description.trim(),
      priceCents: Math.round(priceNum * 100),
      // New uploads enter the QA queue rather than publishing straight away —
      // that gate is the core of the product's quality promise.
      status: "pending_review",
      lessonCount: lessonNum,
      totalDurationMinutes: lessonNum * 15,
      ratingAvg: 0,
      ratingCount: 0,
      enrollmentCount: 0,
      createdAt: new Date().toISOString(),
    };

    addCourse(course);
    setSubmitting(false);
    reset();
    onClose();
    toast("Course submitted for QA review");
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upload a course"
      description="Your course goes to a student QA reviewer before it publishes."
    >
      <div className="space-y-4">
        <Field label="Course title" error={titleError}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AP Calculus BC: From Limits to Series"
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

        <Field label="Description" error={descError}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What will students be able to do after this course?"
            className={inputCls(descError)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (USD)" error={priceError}>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputCls(priceError)}
            />
          </Field>
          <Field label="Lessons" error={lessonError}>
            <input
              type="number"
              min="1"
              step="1"
              value={lessonCount}
              onChange={(e) => setLessonCount(e.target.value)}
              className={inputCls(lessonError)}
            />
          </Field>
        </div>

        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
          <p className="text-2xl" aria-hidden="true">
            🎬
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">Video upload</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Lesson videos upload to Firebase Storage — coming in the next phase.
          </p>
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
          disabled={submitting || (touched && !valid)}
          className="flex-1 rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit for review"}
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
