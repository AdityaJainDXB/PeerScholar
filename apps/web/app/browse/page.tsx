"use client";

import { useMemo, useState } from "react";
import CourseCard from "@/components/CourseCard";
import SessionCard from "@/components/SessionCard";
import { SearchIcon } from "@/components/icons";
import { mockCourses, mockLiveSessions } from "@/lib/mockData";
import { SUBJECTS, SUBJECT_CATEGORIES } from "@shared/constants";

const ALL = "All subjects";
const FILTERS = [ALL, ...SUBJECT_CATEGORIES];

/**
 * Maps a course/session subject ("AP Calculus BC") to a browse category
 * ("Math"). Falls back to keyword matching so subjects that aren't in the
 * taxonomy yet still land in a sensible bucket instead of disappearing
 * from every filtered view.
 */
function categoryOf(subject: string): string {
  const known = SUBJECTS.find((s) => s.name === subject);
  if (known) return known.category;

  const s = subject.toLowerCase();
  if (/calc|algebra|geometry|math|statistic/.test(s)) return "Math";
  if (/chem|bio|physic|science/.test(s)) return "Science";
  if (/python|java|code|coding|comput|data/.test(s)) return "Computer Science";
  if (/spanish|french|german|mandarin|language/.test(s)) return "World Language";
  if (/histor/.test(s)) return "History";
  if (/english|essay|writing|literat/.test(s)) return "English";
  if (/sat|act|prep|exam/.test(s)) return "Test Prep";
  return "Other";
}

export default function BrowsePage() {
  const [filter, setFilter] = useState<string>(ALL);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const courses = useMemo(
    () =>
      mockCourses
        .filter((c) => c.status === "published")
        .filter((c) => filter === ALL || categoryOf(c.subject) === filter)
        .filter(
          (c) =>
            !q ||
            c.title.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q) ||
            c.tutorName.toLowerCase().includes(q)
        ),
    [filter, q]
  );

  const sessions = useMemo(
    () =>
      mockLiveSessions
        .filter((s) => s.status === "scheduled")
        .filter((s) => filter === ALL || categoryOf(s.subject) === filter)
        .filter(
          (s) =>
            !q ||
            s.title.toLowerCase().includes(q) ||
            s.subject.toLowerCase().includes(q) ||
            s.tutorName.toLowerCase().includes(q)
        ),
    [filter, q]
  );

  const total = courses.length + sessions.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Browse</h1>
      <p className="mt-1 text-slate-600">Find a live session or a recorded course by subject.</p>

      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, sessions, or tutors…"
          aria-label="Search courses, sessions, or tutors"
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((tag) => {
          const active = filter === tag;
          return (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-slate-500" role="status" aria-live="polite">
        {total === 0
          ? "No results"
          : `${total} result${total === 1 ? "" : "s"}`}
        {filter !== ALL && ` in ${filter}`}
        {q && ` for “${query.trim()}”`}
      </p>

      {total === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-4xl" aria-hidden="true">
            🔍
          </p>
          <p className="mt-3 font-semibold text-slate-900">Nothing matches that yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Try a different subject, or clear your filters to see everything.
          </p>
          <button
            onClick={() => {
              setFilter(ALL);
              setQuery("");
            }}
            className="mt-5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Clear filters
          </button>
        </div>
      )}

      {sessions.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Upcoming live sessions</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </section>
      )}

      {courses.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900">On-demand courses</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
