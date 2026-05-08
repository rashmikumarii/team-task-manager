import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-50/40 grid place-items-center p-6">
      <div className="text-center max-w-sm animate-in">
        <div className="mx-auto h-14 w-14 rounded-xl bg-white border border-brand-100 grid place-items-center text-brand-500 mb-5 shadow-xs">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        </div>
        <div className="text-4xl font-semibold text-ink-900">404</div>
        <p className="mt-2 text-ink-500">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to home
        </Link>
      </div>
    </div>
  );
}
