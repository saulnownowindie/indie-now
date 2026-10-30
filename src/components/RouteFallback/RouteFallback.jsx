import "./RouteFallback.css";

export default function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__spinner" aria-hidden="true" />
      <span>Cargando…</span>
    </div>
  );
}
