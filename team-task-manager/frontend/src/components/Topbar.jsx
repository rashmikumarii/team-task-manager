import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TITLES = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = TITLES[pathname] || 'Workspace';

  return (
    <div className="sticky top-0 z-10 bg-brand-50/40 backdrop-blur-md border-b border-brand-100">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-ink-500 hover:text-brand-700">Taskspace</Link>
          <span className="text-ink-300">/</span>
          <span className="font-medium text-ink-900">{title}</span>
        </div>
        {user && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-ink-500">
            <span>Signed in as</span>
            <span className="font-medium text-ink-900">{user.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
