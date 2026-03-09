import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { UsersTableItem } from "./UsersTableItem";


export function UsersTable({ users }) {
    const [state, setState] = useState({
        set : users.slice(0, 40),
        users : users
    })
    useEffect(() => {
        const updateState = () => {
            setState(prev => ({
                ...prev,
                set : users.slice(0, 40),
                users : users
            }))
        }
        updateState()
    }, [users])

    const [search, setSearch] = useState("");

    useEffect(() => {
        const query = search.trim().toLowerCase();
        let filtered = users;
        if (query != "") {
            filtered = users.filter(user => {
                const nameMatch = user.name?.toLowerCase().includes(query);
                const emailMatch = user.email?.toLowerCase().includes(query);
                const phoneMatch = user.telephone?.toLowerCase().includes(query);
                return nameMatch || emailMatch || phoneMatch;
            });
        }
        else if(query == ""){
            filtered = users
        }
        setState(prev => ({
            ...prev,
            set: filtered.slice(0, 40),
            users: filtered
        }));
    }, [search, users]);


    return (
        <>
            <div className="mb-4 flex items-center">
                <div className="relative w-full">
                    <input
                        type="text"
                        className="w-full rounded-md bg-gray-900 border-none px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-kcb/30 transition pr-9"
                        placeholder={`Rechercher un nom, un email, un numéro...`}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                        <Search className="w-4 h-4" />
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto rounded-xl bg-gray-900 my-4">
                <table className="w-full text-sm text-gray-200 min-w-[600px]">
                    <thead>
                        <tr className="border-b border-gray-900">
                            <th className="font-medium py-2 px-2 text-left whitespace-nowrap text-white/70">Nom</th>
                            <th className="font-medium py-2 px-2 text-left whitespace-nowrap text-white/70">Email</th>
                            <th className="font-medium py-2 px-2 text-left whitespace-nowrap text-white/70">Rôle</th>
                            <th className="font-medium py-2 px-2 text-left whitespace-nowrap text-white/70">Statut</th>
                            <th className="font-medium py-2 px-2 text-left whitespace-nowrap text-white/70">Numéro</th>
                            <th className="font-medium py-2 px-2 text-left whitespace-nowrap text-white/70">Inscrit le</th>
                            <th className="font-medium py-2 px-2 text-right whitespace-nowrap text-white/70">Actions</th>
                        </tr>
                    </thead>
                    {users?.length >= 1 ? (
                        <tbody>
                            {state.set.map((item, index) => (
                                <Fragment key={item._id || index}>
                                    <UsersTableItem user={item} />
                                </Fragment>
                            ))}
                        </tbody>
                    ) : (
                        <tfoot>
                            <tr>
                                <td colSpan={7} className="text-center text-gray-400 text-sm py-8">Aucun utilisateur trouvé.</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            {/* Modern minimal pagination */}
            {state.users.length > 5 && (
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="rounded-lg px-3 py-1 text-xs text-white/60 bg-gray-900 hover:bg-gray-800 transition disabled:opacity-30 shadow-none border-none"
                        onClick={() => {
                            if (state.set[0] !== state.users[0]) {
                                const startIndex = state.users.indexOf(state.set[0]) - 40;
                                setState({
                                    ...state,
                                    set: state.users.slice(startIndex, startIndex + 40),
                                });
                            }
                        }}
                        disabled={state.set[0] === state.users[0]}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 inline-block" /> Précédent
                    </button>
                    <span className="text-xs text-gray-400 flex items-center px-2">
                        Page {Math.floor(state.users.indexOf(state.set[0]) / 40) + 1} / {Math.ceil(state.users.length / 40)}
                    </span>
                    <button
                        className="rounded-lg px-3 py-1 text-xs text-white/60 bg-gray-900 hover:bg-gray-800 transition disabled:opacity-30 shadow-none border-none"
                        onClick={() => {
                            const lastIndex = state.users.indexOf(state.set[state.set.length - 1]);
                            if (lastIndex < state.users.length - 1) {
                                setState({
                                    ...state,
                                    set: state.users.slice(lastIndex + 1, lastIndex + 41),
                                });
                            }
                        }}
                        disabled={state.set[state.set.length - 1] === state.users[state.users.length - 1]}
                    >
                        Suivant <ChevronRight className="w-4 h-4 ml-1 inline-block" />
                    </button>
                </div>
            )}
        </>
    );
}