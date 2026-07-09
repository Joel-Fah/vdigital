/** Calm end-of-list / retry messaging (Section 5.1) — never an endless spinner. */
export function EndOfList({
  hasMore,
  error,
  onRetry,
}: {
  hasMore: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="mb-2 text-[0.83rem] text-ink-muted">Le chargement a échoué.</p>
        <button
          onClick={onRetry}
          className="text-[0.8rem] font-medium text-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          Réessayer
        </button>
      </div>
    );
  }
  if (!hasMore) {
    return (
      <p className="py-10 text-center text-[0.83rem] text-ink-muted">
        Vous avez tout vu pour le moment — revenez bientôt.
      </p>
    );
  }
  return null;
}
