import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { projectApi, authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner, { Skeleton } from '../components/Spinner';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

function ProjectCardSkeleton() {
  return (
    <div className="card p-5">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full mt-3" />
      <Skeleton className="h-3 w-3/4 mt-1.5" />
      <Skeleton className="h-6 w-24 mt-5" />
    </div>
  );
}

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [memberUserId, setMemberUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await projectApi.list();
      setProjects(Array.isArray(data) ? data : data?.projects || []);
    } catch (e) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!isAdmin) return;
    authApi.listUsers()
      .then(({ data }) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [isAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projectApi.create(form);
      toast.success('Project created');
      setCreateOpen(false);
      setForm({ name: '', description: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberUserId) return;
    setSubmitting(true);
    try {
      await projectApi.addMember(memberOpen._id || memberOpen.id, { userId: memberUserId });
      toast.success('Member added');
      setMemberOpen(null);
      setMemberUserId('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const availableUsers = (project) => {
    const memberIds = new Set((project?.members || []).map((m) => String(m._id || m.id)));
    return users.filter((u) => !memberIds.has(String(u._id || u.id)));
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="h1">Projects</h1>
          <p className="text-ink-500 mt-1 text-sm">Organize work into projects.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setCreateOpen(true)} className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            New project
          </button>
        )}
      </header>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProjectCardSkeleton /><ProjectCardSkeleton /><ProjectCardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No projects yet"
            description={isAdmin ? 'Create your first project to get started.' : 'Ask an admin to create a project.'}
            action={isAdmin && <button onClick={() => setCreateOpen(true)} className="btn-primary">Create project</button>}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p._id || p.id} className="card p-5 hover:border-brand-300 hover:shadow-soft hover:-translate-y-0.5 transition-all">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-brand-500 text-white grid place-items-center font-semibold text-sm shadow-xs">
                  {p.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink-900 truncate">{p.name}</h3>
                  <p className="text-sm text-ink-500 mt-0.5 line-clamp-2">{p.description || 'No description'}</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-[11px] font-medium text-ink-500 uppercase tracking-wider mb-2">Members</div>
                <div className="flex items-center -space-x-2">
                  {(p.members || []).slice(0, 5).map((m) => (
                    <div key={m._id || m.email}
                      className="h-7 w-7 rounded-full bg-brand-500 text-white grid place-items-center text-[11px] font-semibold border-2 border-white"
                      title={m.name || m.email}>
                      {(m.name || m.email || '?')[0]?.toUpperCase()}
                    </div>
                  ))}
                  {(p.members?.length || 0) > 5 && (
                    <div className="h-7 px-2 rounded-full bg-brand-50 text-brand-700 grid place-items-center text-[11px] font-semibold border-2 border-white">
                      +{p.members.length - 5}
                    </div>
                  )}
                  {(!p.members || p.members.length === 0) && (
                    <span className="text-xs text-ink-400">No members yet</span>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div className="mt-5 pt-4 border-t border-brand-100 flex justify-end">
                  <button onClick={() => setMemberOpen(p)} className="btn-secondary !py-1.5 !text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                    Add member
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New project"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="btn-ghost">Cancel</button>
            <button form="create-project" type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <Spinner size="sm" /> : 'Create project'}
            </button>
          </>
        }
      >
        <form id="create-project" onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input required className="input" value={form.name} autoFocus
              onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website redesign" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows="3" className="input" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" />
          </div>
        </form>
      </Modal>

      <Modal
        open={!!memberOpen}
        onClose={() => setMemberOpen(null)}
        title={`Add member to ${memberOpen?.name || ''}`}
        footer={
          <>
            <button onClick={() => setMemberOpen(null)} className="btn-ghost">Cancel</button>
            <button form="add-member" type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <Spinner size="sm" /> : 'Add member'}
            </button>
          </>
        }
      >
        <form id="add-member" onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="label">Select user</label>
            <select required className="input" value={memberUserId}
              onChange={(e) => setMemberUserId(e.target.value)}>
              <option value="">Choose a user…</option>
              {memberOpen && availableUsers(memberOpen).map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.name} ({u.email}){u.role ? ` — ${u.role}` : ''}
                </option>
              ))}
            </select>
            {memberOpen && availableUsers(memberOpen).length === 0 && (
              <p className="text-xs text-ink-500 mt-2">All registered users are already in this project.</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
