const Plan = require('../models/Plan')
const { createError } = require("../middleware/errorHandler");


exports.createPlan = async (req, res, next) => { //✅
    try {
        const existingPlan = await Plan.findOne({name : req.body.name, role : req.body.role})
        if(existingPlan) 
            return next(createError.badRequest("Un plan avec ce nom existe déjà"));
            
        const plan = new Plan({
            ...req.body
        })
        await plan.save()
        return res.status(201).json(plan)
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.getAllPlans = async (req, res, next) => { //✅
    try {
        const plans = await Plan.find()
        if(plans.length > 0){
            return res.json(plans)
        }
        return next(createError.notFound('Aucun plan trouvé'));
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.getPlanById = async (req, res, next) => { //✅
    try {
        const plan = await Plan.findOne({_id : req.params.id})
        if(plan){
            return res.json(plan)
        }
        return next(createError.notFound('Aucun plan trouvé'));
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.updatePlan = async (req, res, next) => { //✅
    try {
        const plan = await Plan.findOneAndUpdate({_id : req.params.id}, 
            {
                ...req.body
            }, 
            {new : true, runValidators : true}
        )
        
        await plan.save()
        return res.json(plan)
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.deletePlan = async (req, res, next) => { //✅
    try {
        const plan = await Plan.findOne({_id : req.params.id})
        if(!plan?._id) return next(createError.notFound('Aucun plan trouvé'));
        await Plan.deleteOne({_id : req.params.id})
        return res.json(plan)
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.deleteFeature = async (req, res, next) => { //✅
    try {
        const plan = await Plan.findOne({_id : req.params.id})
        if(!plan) return next(createError.notFound("Aucun plan trouvé"));
        plan.features = plan.features.filter((item, index) => index != req.params.index)
        await plan.save()
        return res.json(plan)
    } catch (error) {
        return next(createError.internal(error.message));
    }
}


exports.deleteAll = async (req, res, next) => { //✅
    try {
        const plans = await Plan.deleteMany()
        if(plans) return res.json(plans)
        return next(createError.notFound('Aucun plan trouvé'));
    } catch (error) {
        return next(createError.internal(error.message));
    }
}