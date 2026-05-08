export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="text-center py-14 px-6">
      <div className="mx-auto h-12 w-12 rounded-xl bg-brand-50 border border-brand-100 grid place-items-center text-brand-500 mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 14h4" />
        </svg>
      </div>
      <h3 className="font-semibold text-ink-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-ink-500 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
