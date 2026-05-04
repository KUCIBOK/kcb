import { utils } from "./useAPI";
const {api} = utils

export async function createCategory(payload){
    try {
        const response = await fetch(`${api}/category`, {
            ...utils.options,
            method : 'POST',
            body : JSON.stringify(payload)
        })
        const body = await response.json()
        const category = body?.data ?? body
        if(category?.id){
            return category
        }
        return {
            error : body?.error || body?.message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getAllCategories(){
    try {
        const response = await fetch(`${api}/category`, {...utils.options})
        const body = await response.json()
        const categories = body?.data ?? body
        if(Array.isArray(categories) && categories.length > 0){
            return categories
        }
        return {
            error : body?.error || "No categories found"
        }
    } catch (error) {
        return {
            error : error.message
        }

    }
}

export async function deleteCategory(id){
    try {
        const response = await fetch(`${api}/category/${id}`, {
            ...utils.options,
            method : 'DELETE'
        })
        const body = await response.json()
        const category = body?.data ?? body
        if(category?.id){
            return category
        }
        return {
            error : body?.error || body?.message || "Category not found"
        }
    } catch (error) {
        return {
            error : error.message
        }

    }
}