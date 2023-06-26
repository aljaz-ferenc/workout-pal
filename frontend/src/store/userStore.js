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
    userId: null,
    setUser: (payload) => set(state => ({ userId: payload }))
}))

