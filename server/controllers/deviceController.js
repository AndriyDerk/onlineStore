const {Device, DeviceInfo} = require('../models/models')
const ApiError = require(`../error/apiError`)
const uuid = require(`uuid`)
const path = require(`path`)

class deviceController{
    async create(req, res, next){
         try{
             const{role} = req.body
             if(role === "USER"){
                 return next(ApiError.forbidden('FORBIDDEN'))
             }
            let{name, price, brandId, typeId, info, amount} = req.body
            let{img} = req.files
            let fileName = uuid.v4() + '.jpg'

            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const device = await Device.create({name, price, brand_id: brandId, type_id: typeId, img: fileName, amount})
            if(info){
                info = JSON.parse(info)
                info.forEach(i =>
                DeviceInfo.create({
                    title: i.title,
                    description: i.description,
                    device_id: i.id
                }))
            }
            return res.json(device)
         }catch (e){
             next(ApiError.internal(e.message))
         }

    }

    async getAll(req, res){
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page*limit - limit
        let devices;
        if(brandId && typeId){
            devices = await Device.findAll({where: {brand_id: brandId,type_id: typeId}, limit, offset})
        }
        if(brandId && !typeId){
            devices = await Device.findAll({where: {brand_id: brandId}, limit, offset})
        }
        if(!brandId && typeId){
            devices = await Device.findAll({where: {type_id: typeId}, limit, offset})
        }
        if(!brandId && !typeId){
            devices = await Device.findAll({ limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req, res, next){
        const {id} = req.params

        const device = await Device.findOne(
            {
                where: {id}
            }
        )
        if(!device){
            return next(ApiError.badRequest('Продукт не знайдено!'))
        }
        return res.json(device)
    }

    async update(req, res, next){
        const{id, count} = req.body
        const device = Device.findOne({where: {id}})
        if(!device){
            return next(ApiError.badRequest('Продукту з даним id не знайдено!'))
        }
        device.count = count
        return  res.json(device)
    }
}

module.exports = new deviceController()