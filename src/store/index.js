import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './tasksSlice'
import projectsReducer from './projectsSlice'
import settingsReducer from './settingsSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    projects: projectsReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store 