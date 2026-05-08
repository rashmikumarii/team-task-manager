import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const NAV = [
  { to: '/', end: true, label: 'Dashboard',
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>) },
  { to: '/projects', label: 'Projects',
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>) },
  { to: '/tasks', label: 'Tasks',
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>) },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const itemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
      isActive
        ? 'bg-brand-500 text-white font-medium shadow-xs'
        : 'text-ink-700 hover:text-brand-700 hover:bg-white'
    }`;

  const sidebarInner = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-brand-500 grid place-items-center text-white text-sm font-semibold shadow-xs group-hover:bg-brand-600 transition">T</div>
          <div className="leading-tight">
            <div className="font-semibold text-ink-900">Taskspace</div>
            <div className="text-[10px] uppercase tracking-wider text-brand-700/70">Workspace</div>
          </div>
        </Link>
      </div>

      <div className="px-3">
        <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">Menu</div>
        <nav className="space-y-0.5">
          {NAV.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={itemClass} onClick={() => setMobileOpen(false)}>
              <span className="opacity-90">{it.icon}</span>
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-3">
        {user && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-white border border-brand-100 shadow-xs">
            <div className="h-8 w-8 rounded-full bg-brand-500 text-white grid place-items-center text-xs font-semibold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-sm font-medium text-ink-900 truncate">{user.name}</div>
              <div className="text-[11px] text-ink-500 truncate">{user.role}</div>
            </div>
            <button onClick={handleLogout} title="Log out"
              className="h-8 w-8 grid place-items-center rounded-md text-ink-500 hover:text-brand-700 hover:bg-brand-50 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-brand-100 flex items-center justify-between px-4 h-12">
        <Link to="/" className="flex items-center gap-2 font-semibold text-ink-900">
          <div className="h-6 w-6 rounded-md bg-brand-500 grid place-items-center text-white text-xs font-semibold">T</div>
          Taskspace
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-ghost !p-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <aside className="hidden md:flex w-60 shrink-0 sticky top-0 h-screen z-20 bg-brand-50/60 border-r border-brand-100 flex-col">
        {sidebarInner}
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-brand-50 border-r border-brand-100" onClick={(e) => e.stopPropagation()}>
            {sidebarInner}
          </aside>
        </div>
      )}
    </>
  );
}
