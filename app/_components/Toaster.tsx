import clsx from "clsx";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

const ToastContext = createContext<
  (message: string, type?: "success" | "error") => void
>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "error" }[]
  >([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
        5000,
      );
    },
    [],
  );

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed left-1/2 top-6 w-fit max-w-full -translate-x-1/2 space-y-2">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={clsx(
              "rounded px-4 py-2 text-body-small text-white shadow-lg",
              {
                "bg-prospectory-primary": type === "success",
                "bg-prospectory-error": type === "error",
              },
            )}
            role="alert"
          >
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
