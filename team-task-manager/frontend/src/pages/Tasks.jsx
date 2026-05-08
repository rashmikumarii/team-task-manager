import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { projectApi, taskApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner, { Skeleton } from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

const STATUSES = ['Todo', 'In Progress', 'Done'];

const isOverdue = (t) => t?.dueDate && t.status !== 'Done' && new Date(t.dueDate) < new Date();

export default function Tasks() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterProject, setFilterProject] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', assignedTo: '', dueDate: '', projectId: '', status: 'Todo',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([
        taskApi.list(filterProject ? { projectId: filterProject } : {}),
        projectApi.list().catch(() => ({ data: [] })),
      ]);
      setTasks(Array.isArray(t.data) ? t.data : t.data?.tasks || []);
      setProjects(Array.isArray(p.data) ? p.data : p.data?.projects || []);
    } catch (e) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filterProject]);

  const members = useMemo(() => {
    const proj = projects.find((p) => (p._id || p.id) === form.projectId);
    return proj?.members || [];
  }, [projects, form.projectId]);

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    const q = search.toLowerCase();
    return tasks.filter((t) =>
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.assignedTo?.name?.toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.dueDate) delete payload.dueDate;
      if (!payload.assignedTo) delete payload.assignedTo;
      await taskApi.create(payload);
      toast.success('Task created');
      setForm({ title: '', description: '', assignedTo: '', dueDate: '', projectId: form.projectId, status: 'Todo' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (task, status) => {
    try {
      await taskApi.update(task._id || task.id, { status });
      setTasks((prev) => prev.map((t) => ((t._id || t.id) === (task._id || task.id) ? { ...t, status } : t)));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try {
      await taskApi.remove(task._id || task.id);
      toast.success('Task deleted');
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== (task._id || task.id)));
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="h1">Tasks</h1>
          <p className="text-ink-500 mt-1 text-sm">Create, assign, and track work.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            {showForm ? 'Close form' : 'New task'}
          </button>
        )}
      </header>

      {isAdmin && showForm && (
        <div className="card p-6 animate-in">
          <h2 className="h2">Create task</h2>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="md:col-span-2">
              <label className="label">Title</label>
              <input required className="input" value={form.title} autoFocus
                onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea rows="2" className="input" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add a few details (optional)" />
            </div>
            <div>
              <label className="label">Project</label>
              <select required className="input" value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value, assignedTo: '' })}>
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Assign to</label>
              <select className="input" value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m._id || m.id} value={m._id || m.id}>{m.name || m.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Due date</label>
              <input type="date" className="input" value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="flex items-end justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? <Spinner size="sm" /> : 'Create task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <section className="card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-brand-100 bg-brand-50/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="h2">All tasks</h2>
            <span className="chip bg-white text-brand-700 border-brand-200">{filteredTasks.length}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks…"
                className="input-sm !pl-8 !w-48" />
            </div>
            <select className="input-sm !w-auto" value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}>
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-2.5">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title={search || filterProject ? 'No tasks match your filters' : 'No tasks yet'}
            description={search || filterProject ? 'Try adjusting search or project filter.' : 'Create your first task to get started.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Task</th>
                  <th className="hidden md:table-cell">Assignee</th>
                  <th className="hidden md:table-cell">Due</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((t) => {
                  const overdue = isOverdue(t);
                  return (
                    <tr key={t._id || t.id} className="group">
                      <td>
                        <div className="font-medium text-ink-900">{t.title}</div>
                        {t.description && <div className="text-xs text-ink-500 mt-0.5 line-clamp-1">{t.description}</div>}
                      </td>
                      <td className="hidden md:table-cell text-ink-700">
                        {t.assignedTo?.name ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-brand-500 text-white grid place-items-center text-[10px] font-semibold">
                              {t.assignedTo.name[0]?.toUpperCase()}
                            </div>
                            <span>{t.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-ink-400">Unassigned</span>
                        )}
                      </td>
                      <td className={`hidden md:table-cell ${overdue ? 'text-rose-600 font-medium' : 'text-ink-700'}`}>
                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : <span className="text-ink-400">—</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={t.status} />
                          <select
                            value={t.status}
                            onChange={(e) => handleStatus(t, e.target.value)}
                            aria-label="Change status"
                            className="text-xs bg-white border border-brand-100 rounded-md px-1.5 py-0.5 text-ink-700 focus:outline-none focus:border-brand-500 hover:border-brand-300 transition">
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="text-right">
                        <button onClick={() => handleDelete(t)} className="btn-danger !py-1 !text-xs opacity-0 group-hover:opacity-100 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
