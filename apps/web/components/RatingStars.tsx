export default function RatingStars({ rating, count }: { rating: number; count?: number }) {
  if (!rating) return <span className="text-xs text-slate-400">No ratings yet</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm text-slate-600">
      <span className="text-amber-500">★</span>
      <span className="font-medium">{rating.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-slate-400">({count})</span>}
    </span>
  );
}
