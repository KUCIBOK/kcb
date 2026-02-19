const Category = require('../models/Category')
const { createError } = require("../middleware/errorHandler");

exports.createCategory = async (req, res, next) => {
    try {
        const category = new Category({
            ...req.body,
        })
        await category.save()
        return res.status(201).json(category)
    } catch (error) {
        return next(createError.internal('Erreur Serveur'));
    }
}

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find()
        if(categories?.length >= 1){
            return res.json(categories)
        }
        return next(createError.notFound('Aucune catégorie trouvée'));
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findOne({
            _id : req.params.id
        })
        if(category){
            return res.json(category)
        }
        return next(createError.notFound('Aucune catégorie trouvée'));
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findOneAndDelete({
            _id : req.params.id
        })
        if(category){
            return res.json(category)
        }
        return next(createError.notFound('Aucune catégorie trouvée'));
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.deleteAllCategories = async (req, res, next) => {
    try {
        await Category.deleteMany({})
        return res.json({
            message : 'Toutes les catégories ont été supprimées'
        })
    } catch (error) {
        return next(createError.internal(error.message));
    }
}