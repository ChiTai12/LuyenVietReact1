/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useMemo, useState } from "react";

export const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, options = {}) => {
    const id = nextId++;
    const toast = {
      id,
      message,
      type: options.type || "info",
      duration: options.duration || 2200,
    };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration);
  }, []);

  const value = useMemo(() => ({ toasts, notify }), [toasts, notify]);

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

// NOTE: useToast hook moved to `src/context/useToast.js` to satisfy fast-refresh
