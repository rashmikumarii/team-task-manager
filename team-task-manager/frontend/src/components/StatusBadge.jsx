const STYLES = {
  Todo:           { cls: 'bg-brand-50 text-brand-700 border-brand-200',           dot: '#9DBDF7' },
  'In Progress':  { cls: 'bg-brand-500 text-white border-brand-500',              dot: '#FFFFFF' },
  Done:           { cls: 'bg-white text-brand-700 border-brand-300',              dot: '#2563EB' },
};

export default function StatusBadge({ status }) {
  const s = STYLES[status] || STYLES.Todo;
  return (
    <span className={`chip ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}
