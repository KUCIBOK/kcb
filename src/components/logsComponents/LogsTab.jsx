import { useEffect, useState } from "react"
import { getAllLog } from "../../api/useLog"
import { getUserById } from "../../api/useAuth"
import { DataLoader } from "../loaders/PageLoader"

export function LogsTab() {
  const [state, setState] = useState({
    logs: [],
    set: [],
    loading: true,
  });
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let logs = await getAllLog();
        if (logs?.length > 0) {
          logs = logs?.reverse()
          setState((prev) => ({
            ...prev,
            logs: logs,
            set: logs?.slice(0, 5),
            loading: false,
          }));
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchLogs();
  }, []);

  return (
    <section className="bg-gray-900 rounded-2xl shadow-md border border-gray-800 px-0 py-0 md:px-6 md:py-6 w-full mx-auto">
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <h2 className="text-lg font-semibold text-white tracking-tight">Logs</h2>
      </header>
      <div className="overflow-x-auto px-2 md:px-6 pb-2">
        {state.loading ? (
          <div className="flex justify-center items-center h-32">
            <DataLoader />
          </div>
        ) : state?.set?.length >= 1 ? (
          <table className="w-full text-sm text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-2 font-medium text-gray-400">Description</th>
                <th className="py-2 font-medium text-gray-400">Fait le</th>
                <th className="py-2 font-medium text-gray-400">Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              {state.set.map((log, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors"
                >
                  <td className="py-2 px-1 md:px-2 align-top max-w-xs truncate">{log.description}</td>
                  <td className="py-2 px-1 md:px-2 align-top whitespace-nowrap text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-1 md:px-2 align-top">
                    <UserInfo id={log.userId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-8 text-sm">Aucun log à afficher.</div>
        )}
      </div>
      <footer className="flex justify-end gap-2 px-6 pb-6 pt-2">
        <button
          className="rounded-full px-4 py-1 bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => {
            if (state.set[0] !== state.logs[0]) {
              const startIndex = state.logs.indexOf(state.set[0]) - 5;
              setState({
                ...state,
                set: state.logs.slice(startIndex, startIndex + 5),
              });
            }
          }}
          disabled={state.set[0] === state.logs[0] || state.loading}
        >
          Précédent
        </button>
        <button
          className="rounded-full px-4 py-1 bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => {
            const lastIndex = state.logs.indexOf(state.set[state.set.length - 1]);
            if (lastIndex < state.logs.length - 1) {
              setState({
                ...state,
                set: state.logs.slice(lastIndex + 1, lastIndex + 6),
              });
            }
          }}
          disabled={state.set[state.set.length - 1] === state.logs[state.logs.length - 1] || state.loading}
        >
          Suivant
        </button>
      </footer>
    </section>
  );
}

function UserInfo({ id }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const user = await getUserById(id);
        if (mounted) {
          if (user?._id) {
            setUser(user);
          } else {
            setUser({ name: "Utilisateur inconnu", username: "Utilisateur inconnu" });
          }
        }
      } catch (error) {
        if (mounted) setUser({ name: "Utilisateur inconnu", username: "Utilisateur inconnu" });
      }
    };
    fetchUser();
    return () => { mounted = false; };
  }, [id]);
  return (
    <span className="inline-block rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300 max-w-[120px] truncate">
      {user?.name || <span className="text-gray-500">...</span>}
    </span>
  );
}