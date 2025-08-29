import { useToast } from "../context/ToastContext";

export default function ToastHost() {
  const { toasts } = useToast();
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        display: "grid",
        gap: 10,
        zIndex: 50,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background:
              t.type === "error"
                ? "rgba(255,107,129,.15)"
                : "rgba(99,179,237,.15)",
            color: "#000",
            border: `1px solid ${t.type === "error" ? "#ff6b81" : "#63b3ed"}`,
            borderRadius: 12,
            padding: "10px 12px",
            minWidth: 220,
            backdropFilter: "blur(6px)",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
