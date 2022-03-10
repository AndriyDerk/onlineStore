const {User, Basket, Device} = require('../models/models')
const ApiError = require(`../error/apiError`)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJWT = (id, email, role) =>{
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class userController {
    async registration(req, res, next){
        const {email, password, role} = req.body
        if(!email || !password){
            return next(ApiError.badRequest('Не введено логін або пароль!'))
        }
        const candidate = await User.findOne({where: {email}})
        if(candidate){
            return next(ApiError.badRequest('Корситувач з таким email вже зареєстрований!'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPassword, role})
        const basket = await Basket.create({user_id: user.id})
        const token = generateJWT(user.id, email, user.role)
        return res.json({token})

    }
    async login(req, res, next){
        const {email, password} = req.body
        if(!email || !password){
            return next(ApiError.badRequest('Не введено логін або пароль!'))
        }
        const user = await User.findOne({where: {email}})
        if(!user){
            return next(ApiError.badRequest('Користувача з таким email не знайдено!'))
        }
        let comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword){
            return next(ApiError.badRequest('Невірний пароль!'))
        }
        const token = generateJWT(user.id, email, user.role)
        return res.json({token})

    }
    async check(req, res){
        const token = generateJWT(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async update(req, res, next){
        const{id, role} = req.body
        const user = User.findOne({where: {id}})
        if(!user){
            return next(ApiError.badRequest('Користувача з даним id не знайдено!'))
        }
        user.count = role
        return  res.json(user)
    }
}

module.exports = new userController()