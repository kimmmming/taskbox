import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

// 从localStorage获取数据
const loadProjectsFromStorage = () => {
  try {
    const projects = localStorage.getItem('taskbox_projects')
    return projects ? JSON.parse(projects) : [
      {
        id: 'default',
        name: '默认项目',
        description: '未分类的任务',
        color: '#1890ff',
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      }
    ]
  } catch (error) {
    console.error('Error loading projects from storage:', error)
    return []
  }
}

// 保存数据到localStorage
const saveProjectsToStorage = (projects) => {
  try {
    localStorage.setItem('taskbox_projects', JSON.stringify(projects))
  } catch (error) {
    console.error('Error saving projects to storage:', error)
  }
}

const initialState = {
  projects: loadProjectsFromStorage()
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      const newProject = {
        id: uuidv4(),
        name: action.payload.name,
        description: action.payload.description || '',
        color: action.payload.color || '#1890ff',
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      }
      state.projects.push(newProject)
      saveProjectsToStorage(state.projects)
    },

    updateProject: (state, action) => {
      const { id, ...updates } = action.payload
      const projectIndex = state.projects.findIndex(project => project.id === id)
      if (projectIndex !== -1) {
        state.projects[projectIndex] = {
          ...state.projects[projectIndex],
          ...updates,
          updatedAt: dayjs().toISOString(),
        }
        saveProjectsToStorage(state.projects)
      }
    },

    deleteProject: (state, action) => {
      // 不能删除默认项目
      if (action.payload !== 'default') {
        state.projects = state.projects.filter(project => project.id !== action.payload)
        saveProjectsToStorage(state.projects)
      }
    },
  },
})

export const { addProject, updateProject, deleteProject } = projectsSlice.actions

export const selectAllProjects = (state) => state.projects.projects
export const selectProjectById = (state, projectId) => 
  state.projects.projects.find(project => project.id === projectId)

export default projectsSlice.reducer 