import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { createContext, useContext, useState, memo, Fragment } from "react";

const ToastContext = createContext({
  makeToast: () => {},
});

const ICONS = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const COLORS = {
  info: "border-blue-400 bg-blue-900/90 text-blue-100",
  success: "border-green-400 bg-green-900/90 text-green-100",
  warning: "border-yellow-400 bg-yellow-900/90 text-yellow-100",
  error: "border-red-400 bg-red-900/90 text-red-100",
};

export const ToastContextProvider = memo(({ children }) => {
  const [toastsList, setToastsList] = useState([]);

  // Remove toast by id
  const removeToast = (id) =>
    setToastsList((list) => list.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider
      value={{
        makeToast: (title, level = "info", text = "") => {
          const id = Date.now() + Math.random();
          setToastsList((prev) => [...prev, { id, title, level, text }]);
          setTimeout(() => removeToast(id), 10000);
        },
      }}
    >
      {children}
      {toastsList.length > 0 && (
        <div className="fixed top-5 right-5 z-999 flex flex-col items-end gap-2">
          {toastsList.map((item) => {
            const Icon = ICONS[item.level] || Info;
            const color = COLORS[item.level] || COLORS.info;
            return (
              <div
                key={item.id}
                className={`min-w-[220px] max-w-xs shadow-lg ${color} border rounded-lg px-4 py-2 flex items-center gap-3 animate-fade-in`}
                style={{ animation: "fadeIn 0.3s" }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">{item.title}</span> <br />
                  {item.text && (
                    <span className="ml-1 text-xs font-normal">
                      {item.text}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeToast(item.id)}
                  className="ml-2 p-1 rounded hover:bg-white/10 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
});

export function useToast() {
  return useContext(ToastContext);
}
