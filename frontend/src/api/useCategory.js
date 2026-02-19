import { utils } from "./useAPI";
const {api, options} = utils

export async function createCategory(payload){
    try {
        const response = await fetch(`${api}/category`, {
            ...options,
            method : 'POST',
            body : JSON.stringify(payload)
        }) 
        const category = await response.json()
        if(category?._id){
            return category
        }
        return {
            error : category?.message || category?.error
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getAllCategories(){
    try {
        const response = await fetch(`${api}/category`, {...options})
        const categories = await response.json()
        if(categories?.length > 0){
            return categories
        }
        return {
            error : categories?.message || categories?.error || "No categories found"
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
            ...options,
            method : 'DELETE'
        })
        const category = await response.json()
        if(category?._id){
            return category
        }
        return {
            error : category?.message || category?.error || "Category not found"
        }
    } catch (error) {
        return {
            error : error.message
        }
        
    }
}