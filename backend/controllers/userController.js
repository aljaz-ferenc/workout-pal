const User = require('../models/userModel')
const Workout = require('../models/workoutModel')
const jwt = require('jsonwebtoken')

const signToken = id => {
    return jwt.sign({ id: id._id }, process.env.JWT_SECRET, {
        expiresIn:'24h'
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

        sendToken(user, 201, res)

        
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        if(!email || !password) return next(new Error('Please provide your email and pasword.'))

        const user = await User.findOne({email: req.body.email}).select('+password')
        if(!user) return next(new Error('User not found.'))

        if(!await user.checkPassword(password, user.password)) return next(new Error('Password incorrect.'))
        sendToken(user, 200, res)


    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.logout = async (req, res) => {
    try{
        res.cookie('workouts', '', {maxAge: 1})
        res.status(200).json({
            status: 'success',
            data: 'logged out'
        })
    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getMyWorkouts = async (req, res) => {

    try{
        const token = req.cookies.workouts

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const workouts = await Workout.find({user: decoded.id})

        res.status(200).json({
            status: 'success',
            data: workouts
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: "Could not get the user's workouts"
        })
    }
}

exports.getWorkoutsByUser = async (req, res) => {
    try{
        const workouts = await Workout.find({user: req.params.userId})

        res.status(200).json({
            status: 'success',
            data: workouts
        })

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: "Could not get the user's workouts"
        })
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const userId = req.params.userId
        const user = await User.findByIdAndDelete(userId)
        const workouts = await Workout.deleteMany({user: userId})

        res.status(200).json({
            status: 'success',
            data: user
        })

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: "Could not get the user's workouts"
        })
    }
}