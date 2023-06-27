// const url = 'https://workout-pal-ethj.onrender.com/api/v1'
// const url = 'http://localhost:3000/api/v1'
const url = 'https://elegant-bat-buckle.cyclic.app/api/v1'

export const loginUser = async (user) => {

    const response = await fetch(`${url}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        
        },
        body: JSON.stringify({
            email: user.email,
            password: user.password
        })
    })

    return await response.json()
}


export const signupUser = async (user) => {
    const response = await fetch(`${url}/users/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: user.password,
            passwordConfirm: user.passwordConfirm
        })
    })
    return await response.json()
}

export const getMyWorkouts = async (userId) => {
    const response = await fetch(`${url}/users/workouts/${userId}`)
    return response
}

export const getWorkoutsByUser = async (userId) => {
    const response = await fetch(`${url}/users/${userId}/workouts`)
    return response
}

export const getOneWorkout = async (workoutId) => {
    console.log(workoutId)
    const response = await fetch(`${url}/workouts/workout/${workoutId}`, {
        method: 'GET',
    })

    return response
}

export const createWorkout = async (workout) => {
    console.log(workout)
    const response = await fetch(`${url}/workouts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout)
    })
    return await response.json()
}

export const authenticateUser = async () => {
    try {
        const token = localStorage.getItem('workout-pal')
        if (!token) throw new Error('Token not found')

        const response = await fetch(`${url}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
        })
        return await response.json()
    } catch (err) {
        return err
    }
}

export const getAllWorkouts = async () => {
    const response = await fetch(`${url}/workouts`, {
        method: 'GET',
    })

    return await response.json()

}

export const deleteWorkout = async (workoutId) => {
    const response = await fetch(`${url}/workouts/workout/${workoutId}`, {
        method: 'DELETE',
    })

    return await response.json()
}

export const deleteUser = async (userId, password) => {
    console.log(userId)
    const response = await fetch(`${url}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })
    return await response.json()
}

export const logoutUser = async () => {
    const response = await fetch(`${url}/users/logout`, {
        method: 'GET',
    })
    return await response.json()
}

export const updatePassword = async (id, passwordCurrent, newPassword, passwordConfirm) => {
    const response = await fetch(`${url}/users/updateMyPassword`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            passwordCurrent,
            password: newPassword,
            passwordConfirm
        })
    })
    return await response.json()
}
