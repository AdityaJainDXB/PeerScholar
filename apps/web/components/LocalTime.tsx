"use client";

import { useEffect, useState } from "react";

/**
 * Renders a date in the viewer's own timezone without breaking hydration.
 *
 * `toLocaleString` is environment-dependent: under `output: "export"` the HTML
 * is generated on a CI runner (UTC), while the browser formats in the viewer's
 * timezone. Rendering it directly makes the server and client markup disagree,
 * which React reports as a hydration failure and recovers from by throwing the
 * whole subtree away and re-rendering on the client.
 *
 * So: format in UTC for the server render *and* the first client render (they
 * match, so hydration succeeds), then switch to local formatting in an effect.
 */
export default function LocalTime({
  iso,
  options,
}: {
  iso: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const format = (timeZone?: string) =>
    new Date(iso).toLocaleString(undefined, timeZone ? { ...options, timeZone } : options);

  const [text, setText] = useState(() => format("UTC"));

  useEffect(() => {
    setText(format());
    // `options` is an inline object at every call site; keying on the date is
    // what actually matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso]);

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}

/**
 * "Is this happening soon?" depends on the current clock, which differs between
 * build time and view time — so it can only be answered after mount. Returns
 * false during SSG and the first client render.
 */
export function useStartsSoon(iso: string, withinMs = 1000 * 60 * 30): boolean {
  const [soon, setSoon] = useState(false);
  useEffect(() => {
    setSoon(new Date(iso).getTime() - Date.now() < withinMs);
  }, [iso, withinMs]);
  return soon;
}
