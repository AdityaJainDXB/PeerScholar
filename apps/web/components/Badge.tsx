const styles: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  pending_review: "bg-amber-100 text-amber-700",
  flagged: "bg-rose-100 text-rose-700",
  rejected: "bg-rose-100 text-rose-700",
  draft: "bg-slate-100 text-slate-600",
  scheduled: "bg-brand-100 text-brand-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500",
  verified: "bg-brand-100 text-brand-700",
};

export default function Badge({ label, tone }: { label: string; tone?: string }) {
  const cls = styles[tone ?? label] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label.replace(/_/g, " ")}
    </span>
  );
}
