const mongoose = require('mongoose')
const User = require('./userModel')

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name of the workout.']
    },
    rounds: {
        type: Number,
        default: 1,
        min: 1
    },
    restBetweenSets: {
        type: Number,
        min: 5
    },
    restBetweenRounds: {
        type: Number,
        min: 5
    },
    exercises: {
        type: [Object],
        required: [true, 'Please add exercises to the workout.']
    },
    public: {
        type: Boolean,
        required: [true, 'Please specify whether the workout is public of private.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A workout needs a user.']
    },
    difficulty: {
        type: String,
        required: [true, 'Please provide the difficulty.'],
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    duration: {
        type: Number,
        required: [true, 'Please provide the duration.']
    }
})

workoutSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name _id'
    })

    next()
})

const workoutModel = mongoose.model('Workout', workoutSchema)

module.exports = workoutModel