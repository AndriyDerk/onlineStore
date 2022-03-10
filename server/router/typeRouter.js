const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const authMiddleware = require('../middleware/authMiddleware')

router.post(`/`,authMiddleware, typeController.create)
router.get(`/`, typeController.getAll)

module.exports = router