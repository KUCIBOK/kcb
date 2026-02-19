const Log = require('../models/Log')
const { createError } = require("../middleware/errorHandler");


exports.createLog = async (req, res, next) => {
    try {
        const log = new Log({
            ...req.body
        })
        await log.save()
        return res.status(201).json(log)
    } catch (error) {
        return next(createError.internal(error.message));
    }
}

exports.geAllLogs = async (req, res, next) => {
    try {
        const logs = await Log.find()
        if(logs.length > 0){
            return res.json(logs)
        }
        return next(createError.notFound('Aucun log trouvé'));
    } catch (error) {
        return next(createError.internal(error.message));
    }
}