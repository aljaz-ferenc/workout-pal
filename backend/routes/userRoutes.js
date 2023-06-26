const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route('/')
    .get(userController.getAllUsers)

router.route('/:userId')
    .delete(userController.deleteUser)

router.route('/workouts')
    .get(userController.getMyWorkouts)


router.route('/login')
    .post(userController.login)

router.route('/signup')
    .post(userController.register)

router.route('/logout')
    .get(userController.logout)

router.route('/updateMyPassword')
    .patch(authController.updatePassword)

module.exports = router