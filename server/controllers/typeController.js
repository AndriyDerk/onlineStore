const {Type} = require('../models/models')
const ApiError = require(`../error/apiError`)

class typeController{
    async create(req, res, next){
        const{name, role} = req.body
        if(role === 'USER'){
            return next(ApiError.forbidden('FORBIDDEN'))
        }
        const type = await Type.create({name})
        return res.json(type)
    }

    async getAll(req, res){
        const type = await Type.findAll()
        return res.json(type)
    }
}

module.exports = new typeController()