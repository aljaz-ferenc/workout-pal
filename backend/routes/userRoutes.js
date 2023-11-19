const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()



router.route('/workouts/:userId')
    .get(userController.getMyWorkouts)


router.route('/login')
    .post(userController.login)

router.route('/signup')
    .post(userController.register)

router.route('/logout')
    .get(userController.logout)

router.route('/updateMyPassword')
    .patch(authController.updatePassword)
    
router.route('/:userId')
    .delete(userController.deleteUser)
    .patch(userController.updateUser)
    .get(userController.getOneUser)

router.route('/')
    .get(userController.getAllUsers)

module.exports = router