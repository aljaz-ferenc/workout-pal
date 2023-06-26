const User = require('../models/userModel')
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

exports.protect = async (req, res, next) => {
    try{
        const token = req.cookies.workouts
        
        if(!token) return next(new Error('You are not logged in.'))
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const currentUser = await User.findById(decoded.id)

        if(!currentUser) return next(new Error('The user with this token no longer exists'))

        req.user = currentUser
        
        return next()

    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.authenticateUser = async (req, res, next) => {
    try{
        const token = req.cookies.workouts

        if(!token) return next(new Error('You are not logged in.'))

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const currentUser = await User.findById(decoded.id)

        if(!currentUser) return next(new Error('The user with this token no longer exists'))

        res.status(200).json({
            status: 'success',
            data: currentUser
        })
    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updatePassword = async (req, res, next) => {
    const token = req.cookies.workouts

    if(!req.cookies.workouts) return next(new Error('This user does not exist.'))

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('+password')

    if(!(await user.checkPassword(req.body.passwordCurrent, user.password))){
        return next(new Error('Password incorrect'))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    sendToken(user.id, 200, res)
}

