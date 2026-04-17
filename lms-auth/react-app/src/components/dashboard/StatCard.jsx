export default function StatCard({ label, value, icon, gradient }) {
  return (
    <div className="stat-card" style={{ '--card-gradient': gradient }}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className="stat-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {icon}
        </span>
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
