const url = 'http://localhost:3000/api/v1'

export const loginUser = async (user) => {
    const response = await fetch(`${url}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
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
        credentials: 'include',
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
    return response
}

export const getMyWorkouts = async () => {
    const response = await fetch('http://localhost:3000/api/v1/users/workouts',
        {
            method: 'GET',
            credentials: 'include'
        })
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
        credentials: 'include'
    })

    return response
}

export const createWorkout = async (workout) => {
    const response = await fetch(`${url}/workouts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout)
    })
    return await response.json()
}

export const authenticateUser = async () => {
    try {

        const response = await fetch(`${url}/auth`, {
            method: 'GET',
            credentials: 'include'
        })

        return await response.json()
    } catch (err) {
        return err
    }
}

export const getAllWorkouts = async () => {
    const response = await fetch(`${url}/workouts`, {
        method: 'GET',
        credentials: 'include'
    })

    return await response.json()

}

export const deleteWorkout = async (workoutId) => {
    const response = await fetch(`${url}/workouts/workout/${workoutId}`, {
        method: 'DELETE',
        credentials: 'include'
    })

    return await response.json()
}

export const deleteUser = async (userId) => {
    const response = await fetch(`${url}/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    return await response.json()
}

export const logoutUser = async () => {
    const response = await fetch(`${url}/users/logout`, {
        method: 'GET',
        credentials: 'include'
    })
    return await response.json()
}

export const updatePassword = async (passwordCurrent, newPassword, passwordConfirm) => {
    const response = await fetch(`${url}/users/updateMyPassword`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            passwordCurrent,
            password: newPassword,
            passwordConfirm
        })
    })
    return await response.json()
}