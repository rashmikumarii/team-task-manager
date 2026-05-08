import Navbar from './Navbar';
import Topbar from './Topbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-brand-50/40 text-ink-900">
      <Navbar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 animate-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
