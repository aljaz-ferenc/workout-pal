const Workout = require('../models/workoutModel')

exports.getAllWorkouts = async (req, res) => {
    try {
        const publicWorkouts = await Workout.find({ public: true })

        res.status(200).json({
            status: 'success',
            data: publicWorkouts
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.createWorkout = async (req, res) => {
    try {
        const workout = await Workout.create(req.body)

        res.status(201).json({
            status: 'success',
            data: workout
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.workoutId)
        if (!workout) return next(new Error('This workout does not exist.'))

        res.status(200).json({
            status: 'success',
            data: workout
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Could not delete the workout.'
        })
    }
}

exports.getOneWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.workoutId)

        res.status(200).json({
            status: 'success',
            data: workout
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Could not get the workout.'
        })
    }
}