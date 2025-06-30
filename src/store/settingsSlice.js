import { createSlice } from '@reduxjs/toolkit'

// 从localStorage获取数据
const loadSettingsFromStorage = () => {
  try {
    const settings = localStorage.getItem('taskbox_settings')
    return settings ? JSON.parse(settings) : {
      theme: 'light',
      viewMode: 'list',
      language: 'zh-CN',
      notifications: {
        enabled: true,
        beforeDue: 24, // 到期前多少小时提醒
        sound: true,
      },
      autoSave: true,
      showCompleted: true,
    }
  } catch (error) {
    console.error('Error loading settings from storage:', error)
    return {
      theme: 'light',
      viewMode: 'list',
      language: 'zh-CN',
      notifications: {
        enabled: true,
        beforeDue: 24,
        sound: true,
      },
      autoSave: true,
      showCompleted: true,
    }
  }
}

// 保存数据到localStorage
const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem('taskbox_settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings to storage:', error)
  }
}

const initialState = loadSettingsFromStorage()

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      const newSettings = { ...state, ...action.payload }
      saveSettingsToStorage(newSettings)
      return newSettings
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      saveSettingsToStorage(state)
    },

    setViewMode: (state, action) => {
      state.viewMode = action.payload
      saveSettingsToStorage(state)
    },

    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload }
      saveSettingsToStorage(state)
    },
  },
})

export const {
  updateSettings,
  toggleTheme,
  setViewMode,
  updateNotificationSettings
} = settingsSlice.actions

export const selectSettings = (state) => state.settings

export default settingsSlice.reducer 