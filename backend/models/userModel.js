const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your username.'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide your password.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: 'Passwords do not match.'
        }
    },
    weightMeasurements: {
        type: [Object],
        default: []
    },
    waterIntake: {
        type: [Object],
        default: []
    },
    waterGoal: {
        type: Number,
        default: 2000
    },
    completedWorkouts: {
        type: [Object],
        default: []
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)

    this.passwordConfirm = undefined
})

userSchema.methods.checkPassword = async function (candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass)
}

const userModel = mongoose.model('User', userSchema)

module.exports = userModel