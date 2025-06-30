import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

// 从localStorage获取数据
const loadTasksFromStorage = () => {
  try {
    const tasks = localStorage.getItem('taskbox_tasks')
    return tasks ? JSON.parse(tasks) : []
  } catch (error) {
    console.error('Error loading tasks from storage:', error)
    return []
  }
}

// 保存数据到localStorage
const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem('taskbox_tasks', JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks to storage:', error)
  }
}

const initialState = {
  tasks: loadTasksFromStorage(),
  filter: {
    status: 'all',
    priority: 'all',
    project: 'all',
    search: '',
  },
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description || '',
        status: 'pending',
        priority: action.payload.priority || 'medium',
        dueDate: action.payload.dueDate || null,
        projectId: action.payload.projectId || null,
        tags: action.payload.tags || [],
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      }
      state.tasks.push(newTask)
      saveTasksToStorage(state.tasks)
    },

    updateTask: (state, action) => {
      const { id, ...updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: dayjs().toISOString(),
        }
        saveTasksToStorage(state.tasks)
      }
    },

    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
      saveTasksToStorage(state.tasks)
    },

    toggleTaskStatus: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed'
        task.updatedAt = dayjs().toISOString()
        saveTasksToStorage(state.tasks)
      }
    },

    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },

    setSorting: (state, action) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
    },

    clearCompleted: (state) => {
      state.tasks = state.tasks.filter(task => task.status !== 'completed')
      saveTasksToStorage(state.tasks)
    },

    importTasks: (state, action) => {
      state.tasks = action.payload
      saveTasksToStorage(state.tasks)
    }
  },
})

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  setFilter,
  setSorting,
  clearCompleted,
  importTasks
} = tasksSlice.actions

// 选择器
export const selectAllTasks = (state) => state.tasks.tasks
export const selectFilter = (state) => state.tasks.filter
export const selectSorting = (state) => ({
  sortBy: state.tasks.sortBy,
  sortOrder: state.tasks.sortOrder
})

export const selectFilteredTasks = (state) => {
  const tasks = selectAllTasks(state)
  const filter = selectFilter(state)
  const { sortBy, sortOrder } = selectSorting(state)

  let filteredTasks = tasks.filter(task => {
    // 状态过滤
    if (filter.status !== 'all' && task.status !== filter.status) {
      return false
    }
    
    // 优先级过滤
    if (filter.priority !== 'all' && task.priority !== filter.priority) {
      return false
    }
    
    // 项目过滤
    if (filter.project !== 'all' && task.projectId !== filter.project) {
      return false
    }
    
    // 搜索过滤
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      return task.title.toLowerCase().includes(searchLower) ||
             task.description.toLowerCase().includes(searchLower)
    }
    
    return true
  })

  // 排序
  filteredTasks.sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (sortBy === 'dueDate') {
      aValue = aValue ? dayjs(aValue).valueOf() : Infinity
      bValue = bValue ? dayjs(bValue).valueOf() : Infinity
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      aValue = priorityOrder[aValue]
      bValue = priorityOrder[bValue]
    } else if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = dayjs(aValue).valueOf()
      bValue = dayjs(bValue).valueOf()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filteredTasks
}

export const selectTaskStats = (state) => {
  const tasks = selectAllTasks(state)
  return {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    overdue: tasks.filter(task => 
      task.dueDate && 
      dayjs().isAfter(dayjs(task.dueDate)) && 
      task.status !== 'completed'
    ).length,
  }
}

export default tasksSlice.reducer 