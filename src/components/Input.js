export default function Input({ label, ...props }) {
  return (
    <div className="input-field">
      {label && <label className="input-label">{label}</label>}
      <input className="input-control" {...props} />
    </div>
  );
}
