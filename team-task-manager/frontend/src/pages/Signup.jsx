import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      toast.success('Account created');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50/40 grid place-items-center p-6">
      <div className="w-full max-w-sm animate-in">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-9 w-9 rounded-lg bg-brand-500 grid place-items-center text-white font-semibold shadow-xs">T</div>
          <span className="font-semibold text-ink-900 text-lg">Taskspace</span>
        </div>

        <div className="card p-7 shadow-soft">
          <h1 className="text-xl font-semibold text-ink-900">Create your account</h1>
          <p className="text-ink-500 mt-1 text-sm">It only takes a minute.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2">{error}</div>
            )}
            <div>
              <label className="label">Full name</label>
              <input required autoFocus className="input" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required minLength={6} className="input" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5">
              {loading ? <Spinner size="sm" /> : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-sm text-ink-500 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
