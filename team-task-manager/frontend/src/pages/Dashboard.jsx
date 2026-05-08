import { useEffect, useMemo, useState } from 'react';
import { dashboardApi, taskApi } from '../services/api';
import Spinner, { Skeleton } from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

const isOverdue = (task) =>
  task?.dueDate && task.status !== 'Done' && new Date(task.dueDate) < new Date();

const ICONS = {
  total: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>),
  todo:  (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/></svg>),
  prog:  (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v9l6 3"/><circle cx="12" cy="12" r="9"/></svg>),
  done:  (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>),
  late:  (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 8v5M12 16.5h.01"/><circle cx="12" cy="12" r="9"/></svg>),
};

function StatCard({ label, value, icon, accent = false }) {
  return (
    <div className={`${accent ? 'card-accent' : 'card'} p-5 transition hover:shadow-soft`}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-brand-700 uppercase tracking-wider">{label}</div>
        <div className="text-brand-500/70">{icon}</div>
      </div>
      <div className="mt-2 text-3xl font-semibold text-ink-900 tabular-nums">{value ?? 0}</div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="card p-5">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-8 w-12 mt-3" />
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [d, t] = await Promise.all([
          dashboardApi.get().catch(() => ({ data: null })),
          taskApi.list().catch(() => ({ data: [] })),
        ]);
        const taskList = Array.isArray(t.data) ? t.data : t.data?.tasks || [];
        setTasks(taskList);
        setStats(d.data || computeFromTasks(taskList));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const computeFromTasks = (list) => ({
    total: list.length,
    todo: list.filter((x) => x.status === 'Todo').length,
    inProgress: list.filter((x) => x.status === 'In Progress').length,
    done: list.filter((x) => x.status === 'Done').length,
    overdue: list.filter(isOverdue).length,
  });

  const computed = useMemo(() => ({
    total: stats?.total ?? stats?.totalTasks ?? tasks.length,
    todo: stats?.todo ?? tasks.filter((t) => t.status === 'Todo').length,
    inProgress: stats?.inProgress ?? stats?.['In Progress'] ?? tasks.filter((t) => t.status === 'In Progress').length,
    done: stats?.done ?? tasks.filter((t) => t.status === 'Done').length,
    overdue: stats?.overdue ?? tasks.filter(isOverdue).length,
  }), [stats, tasks]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="h1">Dashboard</h1>
        <p className="text-ink-500 mt-1 text-sm">An overview of your team's work.</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {loading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard label="Total" value={computed.total} icon={ICONS.total} accent />
            <StatCard label="Todo" value={computed.todo} icon={ICONS.todo} />
            <StatCard label="In Progress" value={computed.inProgress} icon={ICONS.prog} accent />
            <StatCard label="Done" value={computed.done} icon={ICONS.done} />
            <StatCard label="Overdue" value={computed.overdue} icon={ICONS.late} />
          </>
        )}
      </section>

      <section className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100 bg-brand-50/50 rounded-t-xl">
          <div>
            <h2 className="h2">Recent tasks</h2>
            <p className="text-xs text-ink-500 mt-0.5">Latest activity across your workspace</p>
          </div>
          <Link to="/tasks" className="btn-secondary !py-1.5 !text-xs">View all</Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-2.5">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to start tracking work."
            action={<Link to="/tasks" className="btn-primary">Create task</Link>}
          />
        ) : (
          <ul className="divide-y divide-brand-100">
            {tasks.slice(0, 8).map((t) => {
              const overdue = isOverdue(t);
              return (
                <li key={t._id || t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-brand-50/40 transition">
                  <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-700 grid place-items-center text-xs font-semibold border border-brand-100 shrink-0">
                    {(t.title || '?')[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink-900 truncate">{t.title}</div>
                    <div className="text-xs text-ink-500 mt-0.5">
                      {t.dueDate && (
                        <span className={overdue ? 'text-rose-600 font-medium' : ''}>
                          Due {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {t.assignedTo?.name && <span> · {t.assignedTo.name}</span>}
                    </div>
                  </div>
                  <StatusBadge status={t.status} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
