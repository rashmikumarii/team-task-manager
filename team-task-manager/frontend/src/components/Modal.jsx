import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-ink-900/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md border border-brand-100 shadow-pop animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3.5 border-b border-brand-100 flex items-center justify-between">
          <h3 className="font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} aria-label="Close"
            className="h-8 w-8 grid place-items-center rounded-md text-ink-500 hover:text-ink-900 hover:bg-brand-50 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="px-5 py-3.5 border-t border-brand-100 flex justify-end gap-2 bg-brand-50/30 rounded-b-xl">{footer}</div>}
      </div>
    </div>
  );
}
