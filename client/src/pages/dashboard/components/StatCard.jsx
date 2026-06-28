export default function StatCard({ label, value, icon: Icon, color, delay = 0 }) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-panel/85 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-pink-500/25"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-3 ${color}`}>
        <Icon size={20} aria-hidden="true" />
      </div>
      <p className="font-data text-2xl text-text">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  )
}
