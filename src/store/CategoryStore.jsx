import { createContext, useContext, useState, useEffect } from "react"
import { createCategory, deleteCategory, getAllCategories } from "../api/useCategory"
import { useAuth } from "./AuthContext"
import { createLog } from "../api/useLog";
import { useToast } from "./ToastContext";

const initialState = {
    categories: [],
}

const CategoryContext = createContext(initialState)


export const CategoryProvider = ({ children }) => {
    const {user} = useAuth()
    const [state, setState] = useState(initialState)
    const { makeToast } = useToast()

    useEffect(() => {
        // Fetch categories from API or local storage
        const fetchCategories = async () => {
            try {
                const categories = await getAllCategories()
                if(categories?.length > 0) {
                    setState(prev => ({ categories : categories }))
                    return
                }
            } catch (error) {
            }
        }
        fetchCategories()
    }, [])

    return (
        <CategoryContext.Provider value={{
            categories : state.categories,
            addCategory : async (payload) => {
                try {
                    const category = await createCategory(payload)
                    if (category?._id) {
                        setState(prev => ({
                            categories: [category, ...prev.categories, ]
                        }))
                        makeToast('Succès', 'success', 'La catégorie a été ajoutée avec succès')
                        await createLog({description : `La catégorie ${category?.title} a été ajoutée`, userId : user?._id})
                    } 
                    return category
                } catch (error) {
                    return {
                        error: error.message || "Erreur lors de l'ajout de la catégorie."
                    }
                }
            },
            deleteCategory: async (id) => {
                try {
                    const category = await deleteCategory(id)
                    if (category?._id) {
                        setState(prev => ({
                            categories: prev.categories.filter(cat => cat._id !== id)
                        }))
                        makeToast('Succès', 'success', 'La catégorie a été supprimée avec succès')
                        await createLog({description : `La catégorie ${category?.title} a été supprimé`, userId : user?._id})
                    } 
                    return category
                } catch (error) {
                    return {
                        error: error.message || "Erreur lors de la suppression de la catégorie."
                    }
                }
            }
        }}>
            {children}
        </CategoryContext.Provider>
    )
}

export function useCategoryStore(){
    return useContext(CategoryContext)
}