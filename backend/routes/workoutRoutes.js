const express = require('express')
const workoutController = require('../controllers/workoutController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route('/')
    .get(workoutController.getAllWorkouts)
    .post(workoutController.createWorkout)

router.route('/workout/:workoutId')
    .get(workoutController.getOneWorkout)
    .delete(workoutController.deleteWorkout)

module.exports = router