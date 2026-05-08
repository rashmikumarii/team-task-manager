export default function Spinner({ size = 'md' }) {
  const dim = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
  return (
    <div className={`${dim} rounded-full border-2 border-brand-100 border-t-brand-500 animate-spin`} />
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}
