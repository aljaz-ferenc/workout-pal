const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

// const signToken = id => {
//     console.log(process.env.JWT_SECRET)
//     return jwt.sign(id , process.env.JWT_SECRET, {
//         expiresIn:'24h'
//     })
// }

// const sendToken = (user, statusCode, res) => {
//     const token = signToken(user)

//     const cookieOptions = {
//         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//          secure: false
//     }

//     res.cookie('workouts', token, cookieOptions)
//     user.password = undefined

//     res.status(statusCode).json({
//         status: 'success',
//         token,
//         data: user
//     })
// }

exports.protect = async (req, res, next) => {
    console.log('protect')
    try {
        const token = req.cookies.workouts

        if (!token) return next(new Error('You are not logged in.'))

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        const currentUser = await User.findById(decoded.id)

        if (!currentUser) return next(new Error('The user with this token no longer exists'))

        req.user = currentUser

        return next()

    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.authenticateUser = async (req, res, next) => {
    try {
        let token
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        console.log('aaaaaaaaaaaaaaaaaaaaa' + token)

        if (!token) {
            throw new Error('You are not logged in.')
        }

        const decoded = jwt.verify(JSON.parse(token), process.env.JWT_SECRET);
        console.log(decoded);

        const currentUser = await User.findById(decoded.user)
        console.log(currentUser)
        if (!currentUser) {
            throw new Error('User with this token does not exist.')
        }

        req.user = currentUser

        res.status(200).json({
            status: 'success',
            message: 'loggedIn',
            data: {
                id: decoded.user,
                name: currentUser.name,
                email: currentUser.email
            }
        })

    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'You are not authenticated.'
        })
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const userId = req.body.id

        const user = await User.findById(userId).select('+password')
        if(!user) return next(new Error('This user does not exist.'))

        if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
            return next(new Error('Password incorrect'))
        }

        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        await user.save()

        res.status(201).json({
            status: 'success'
        })
        
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'You are not authenticated.'
        })
    }
}

