const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

exports.authenticateUser = async (req, res, next) => {
    try {
        let token
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            throw new Error('You are not logged in.')
        }

        const decoded = jwt.verify(JSON.parse(token), process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.user)

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

