const STATUS_MAP = {
  CREATED:     { label: 'Created',     cls: 'badge-created' },
  AVAILABLE:   { label: 'Available',   cls: 'badge-available' },
  MATCHED:     { label: 'Matched',     cls: 'badge-matched' },
  ACCEPTED:    { label: 'Accepted',    cls: 'badge-accepted' },
  REJECTED:    { label: 'Rejected',    cls: 'badge-rejected' },
  PICKED_UP:   { label: 'Picked Up',  cls: 'badge-picked_up' },
  DISTRIBUTED: { label: 'Distributed',cls: 'badge-distributed' },
  CANCELLED:   { label: 'Cancelled',  cls: 'badge-cancelled' },
}

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: '' }
  return <span className={`badge ${s.cls}`}>{s.label}</span>
}
