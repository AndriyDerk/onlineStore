const {Brand} = require('../models/models')
const ApiError = require(`../error/apiError`)

class brandController{
    async create(req, res, next){
        const{name, role} = req.body
        if(role === 'USER'){
            return next(ApiError.forbidden('FORBIDDEN'))
        }
        const brand = await Brand.create({name})
        return res.json(brand)
    }

    async getAll(req, res){
        const brand = await Brand.findAll()
        return res.json(brand)
    }
}

module.exports = new brandController()