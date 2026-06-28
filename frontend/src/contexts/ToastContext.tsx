import { createContext, useCallback, useContext, useRef, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  onUndo?: () => void;
  onExpire?: () => void;
  duration: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, opts?: { onUndo?: () => void; onExpire?: () => void; duration?: number }) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const showToast = useCallback((
    message: string,
    { onUndo, onExpire, duration = 5000 }: { onUndo?: () => void; onExpire?: () => void; duration?: number } = {}
  ): string => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, onUndo, onExpire, duration }]);

    const timer = setTimeout(() => {
      onExpire?.();
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, duration);
    timers.current.set(id, timer);

    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
