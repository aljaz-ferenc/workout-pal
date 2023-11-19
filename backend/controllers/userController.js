const User = require('../models/userModel')
const Workout = require('../models/workoutModel')
const jwt = require('jsonwebtoken')

const signToken = id => {
    return jwt.sign({ id: id._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })
}

const sendToken = (user, statusCode, res) => {
    const token = signToken(user)

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    }

    res.cookie('workouts', token, cookieOptions)
    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: user
    })
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: users
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.register = async (req, res) => {
    try {

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })


        const token = jwt.sign({ user: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        })

        res.status(201).json({
            status: 'success',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })


    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) return next(new Error('Please provide your email and pasword.'))


        const user = await User.findOne({ email: req.body.email }).select('+password')
        if (!user) return next(new Error('User not found.'))
        if (!await user.checkPassword(password, user.password)) return next(new Error('Password incorrect.'))


        user.password = undefined

        const token = jwt.sign({ user: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        })

        res.status(200).json({
            status: 'success',
            data: { token, user }
        })

    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie('workouts', '', { maxAge: 1 })
        res.status(200).json({
            status: 'success',
            data: 'logged out'
        })
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updateUser = async (req, res) => {
    let user

    try {
        if (req.body.updateField === 'weight') {
            user = await User.findByIdAndUpdate(req.params.userId, { $push: { weightMeasurements: { time: Date.now(), measurement: req.body.measurement } } }, { new: true })
        }
        if (req.body.updateField === 'water') {
            user = await User.findByIdAndUpdate(req.params.userId, { $push: { waterIntake: { time: Date.now(), measurement: req.body.measurement } }, waterGoal: req.body.goal }, { new: true })
        }
        if (req.body.updateField === 'workout') {
            user = await User.findByIdAndUpdate(req.params.userId, { $push: { completedWorkouts: { workout: req.body.workout, duration: req.body.duration, time: Date.now(), difficulty: req.body.difficulty } } }, { new: true })
        }


        res.status(200).json({
            status: 'success',
            data: user.waterIntake
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: "Could update user."
        })
    }
}

exports.getMyWorkouts = async (req, res) => {
    try {
        const userId = req.params.userId
        const workouts = await Workout.find({ user: userId })

        res.status(200).json({
            status: 'success',
            data: workouts
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: "Could not get the user's workouts"
        })
    }
}

exports.getWorkoutsByUser = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.params.userId })

        res.status(200).json({
            status: 'success',
            data: workouts
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: "Could not get the user's workouts"
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId).select('+password')
        const password = req.body.password

        if (!(await user.checkPassword(password, user.password))) return next(new Error('password incorrect'))
        await User.findByIdAndDelete(userId)
        await Workout.deleteMany({ user: userId })

        res.status(200).json({
            status: 'success',
            data: user
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getOneUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)

        res.status(200).json({
            status: 'success',
            data: user
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}