export default function StatusBadge({status}){const v=String(status||'UNKNOWN').toUpperCase();return <span className={`status-badge status-${v.toLowerCase()}`}>{v}</span>}
