import { useState } from "react"
import { useUsersContext } from "../../store/UsersStore"
import { LockOpen, Lock, Key, X, AlertCircle, Trash2 } from "lucide-react"
import { DataLoader } from "../loaders/PageLoader"

export function UserTableItemActions({user}){
    const {setStatus, deleteUser} = useUsersContext()
    const [state, setState] = useState({
        loading : false,
        updatePassword : false
    })
    const handleDeleteUser = async () => {
        try {
            setState(prev => ({
                ...prev,
                loading : true
            }))
            const updated = await deleteUser(user?._id)
            if(updated?._id || updated?.id){
                setState(prev => ({
                    ...prev,
                    loading : false
                }))
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading : false
            }))
        }
    }
    const handleSetStatus = async () => {
        try {
            setState(prev => ({
                ...prev,
                loading : true
            }))
            const updated = await setStatus(user?._id)
            if(updated?._id || updated?.id){
                setState(prev => ({
                    ...prev,
                    loading : false
                }))
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading : false
            }))
        }
    }
    return (
        <>
           <div className="flex items-center gap-1">
                {user?.isActive ?
                    <button
                        onClick={handleSetStatus}
                        className="rounded-full bg-gray-900 p-2 hover:bg-gray-800 transition flex items-center justify-center shadow-none border-none"
                        title="Suspendre"
                    >
                        {state?.loading ? <DataLoader/> : <Lock className="w-4 h-4 text-purple-kcb" />}
                    </button>
                :
                    <button
                        onClick={handleSetStatus}
                        className="rounded-full bg-gray-900 p-2 hover:bg-gray-800 transition flex items-center justify-center shadow-none border-none"
                        title="Réactiver"
                    >
                        {state?.loading ? <DataLoader/> : <LockOpen className="w-4 h-4 text-green-500" />}
                    </button>
                }
                <button
                    onClick={handleDeleteUser}
                    className="rounded-full bg-gray-900 p-2 hover:bg-gray-800 transition flex items-center justify-center shadow-none border-none"
                    title="Supprimer"
                >
                    {state?.loading ? <DataLoader/> : <Trash2 className="w-4 h-4 text-red-500" />}
                </button>
           </div>
            {/* {state?.updatePassword && <UpdatePasswordModal user={user} closeModal={() => setState({...state, updatePassword : false})} />} */}
        </>
    )
}

// function UpdatePasswordModal({user, closeModal}){
//     const {updateUser} = useUsersContext()
//     const [state, setState] = useState({
//         password : "",
//         loading : false 
//     })
//     const handleUpdateUser = async (e) => {
//         e.preventDefault()
//         try {
//             setState(({...state, error : "", loading : true}))
//             const charge = {...state}
//             delete charge.loading
//             delete charge.error
//             const updated = await updateUser(user?._id, charge)
//             if(updated?._id){
//                 closeModal()
//             }
//             setState(({...state, error : updated?.error, loading : false}))
//         } catch (error) {
//             setState(({
//                 ...state,
//                 loading : false,
//                 error : error.message
//             }))
//         }
//     }
//     return (
//         <>
//         <div className="w-screen h-screen flex z-999 justify-center items-center bg-stone-950/80 fixed top-0 left-0">
//             <div className="rounded-xl border border-border bg-background p-6 w-13/15 xl:w-4/9 animate-scale-up overflow-auto">
//                 <div className="flex justify-between items-start mb-4">
//                     <p className="text-lg font-serif font-bold">Modifier le mot de passe</p>
//                     <button onClick={() => closeModal()}>
//                         <X className="w-4 w-4" />
//                     </button>
//                 </div>
//                 {state?.error && (
//                     <div className="rounded-md flex gap-3 p-4 bg-red-700/60 border border-red-500 text-white-900">
//                         <AlertCircle className="w-5 h-5" /> {state?.error}
//                     </div>
//                 )}
//                 <form onSubmit={handleUpdateUser} method="post" className="flex flex-col gap-4 overflow-auto">
//                     <div className="flex flex-col gap-1">
//                         <label htmlFor="password" className="text-white font-semibold text-[16px] ">Mot de passe</label>
//                         <input required onChange={(e) => setState({...state, password : e.target.value})} value={state?.password} minLength={5} id="password" name="password" type="password" className="border border-border rounded-md bg-stone-700/90 px-4 py-2 font-normal text-[16px]" placeholder="Mot de passe de l'admin" />
//                     </div>
//                     <div className="flex items-center justify-end gap-4">
//                         <button onClick={() => closeModal()} className="border border-border rounded-md px-4 py-2">
//                             Annuler
//                         </button>
//                         <button type="submit" className="rounded-md px-4 py-2.5 bg-indigo-kcb">
//                             {state?.loading ? <DataLoader/> : 'Modifier'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//         </>
//     )
// }