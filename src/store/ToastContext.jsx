import { createContext, useContext, memo } from "react";
import { toast as sonnerToast } from "sonner";

const ToastContext = createContext({
  makeToast: () => {},
});

/**
 * Maps legacy toast levels to sonner method names.
 * "danger" is a legacy alias for "error".
 */
const LEVEL_MAP = {
  success: "success",
  error: "error",
  danger: "error",
  warning: "warning",
  info: "info",
};

/**
 * Bridge provider that delegates makeToast() calls to sonner.
 *
 * Signature: makeToast(title, level = "info", text = "")
 * - If `text` is provided, sonner renders title + description.
 * - If only `title` is provided, sonner renders it as the main message.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export const ToastContextProvider = memo(({ children }) => {
  const makeToast = (title, level = "info", text = "") => {
    const method = LEVEL_MAP[level] || "info";
    const options = text ? { description: text } : {};

    sonnerToast[method](title, options);
  };

  return (
    <ToastContext.Provider value={{ makeToast }}>
      {children}
    </ToastContext.Provider>
  );
});

/**
 * Hook to access the toast context.
 *
 * @returns {{ makeToast: (title: string, level?: string, text?: string) => void }}
 */
export function useToast() {
  return useContext(ToastContext);
}
