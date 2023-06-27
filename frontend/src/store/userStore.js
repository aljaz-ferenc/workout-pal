import { create } from 'zustand'

export const useExerciseStore = create(set => ({
    exercises: [],
    addExercise: (payload) => set(state => ({ exercises: [...state.exercises, payload] })),
    removeExercise: (id) => set(state => ({ exercises: state.exercises.filter(ex => ex.id !== id) })),
    removeAllExercises: () => set(state => ({ exercises: [] })),
    updateWorkout: (payload) => set(state => ({ workout: payload })),
    workout: {},
    clearWorkout: () => set(state => ({ workout: {} }))
}))

export const useUserStore = create(set => ({
    user: {email: null, name: null, id: null},
    setUser: (payload) => set(state => ({ user: payload }))
}))

