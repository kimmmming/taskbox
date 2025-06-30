import React from 'react'
import { Space, Select, Input, Button } from 'antd'
import { SearchOutlined, ClearOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter, selectFilter, setSorting, selectSorting } from '../store/tasksSlice'
import { selectAllProjects } from '../store/projectsSlice'

const { Option } = Select

const TaskFilters = () => {
  const dispatch = useDispatch()
  const filter = useSelector(selectFilter)
  const sorting = useSelector(selectSorting)
  const projects = useSelector(selectAllProjects)

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ [key]: value }))
  }

  const handleSortingChange = (field, order) => {
    dispatch(setSorting({ sortBy: field, sortOrder: order }))
  }

  const handleClearFilters = () => {
    dispatch(setFilter({
      status: 'all',
      priority: 'all',
      project: 'all',
      search: '',
    }))
  }

  return (
    <Space wrap size="middle" style={{ width: '100%' }}>
      <Input.Search
        placeholder="搜索任务标题或描述..."
        value={filter.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        style={{ width: 250 }}
        prefix={<SearchOutlined />}
        allowClear
      />

      <Select
        placeholder="按状态筛选"
        value={filter.status}
        onChange={(value) => handleFilterChange('status', value)}
        style={{ width: 120 }}
      >
        <Option value="all">全部状态</Option>
        <Option value="pending">待办</Option>
        <Option value="in-progress">进行中</Option>
        <Option value="completed">已完成</Option>
      </Select>

      <Select
        placeholder="按优先级筛选"
        value={filter.priority}
        onChange={(value) => handleFilterChange('priority', value)}
        style={{ width: 120 }}
      >
        <Option value="all">全部优先级</Option>
        <Option value="high">高优先级</Option>
        <Option value="medium">中优先级</Option>
        <Option value="low">低优先级</Option>
      </Select>

      <Select
        placeholder="按项目筛选"
        value={filter.project}
        onChange={(value) => handleFilterChange('project', value)}
        style={{ width: 150 }}
      >
        <Option value="all">全部项目</Option>
        {projects.map(project => (
          <Option key={project.id} value={project.id}>
            <span style={{ color: project.color }}>●</span> {project.name}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="排序方式"
        value={`${sorting.sortBy}_${sorting.sortOrder}`}
        onChange={(value) => {
          const [field, order] = value.split('_')
          handleSortingChange(field, order)
        }}
        style={{ width: 150 }}
      >
        <Option value="createdAt_desc">创建时间(新→旧)</Option>
        <Option value="createdAt_asc">创建时间(旧→新)</Option>
        <Option value="updatedAt_desc">更新时间(新→旧)</Option>
        <Option value="updatedAt_asc">更新时间(旧→新)</Option>
        <Option value="dueDate_asc">截止时间(近→远)</Option>
        <Option value="dueDate_desc">截止时间(远→近)</Option>
        <Option value="priority_desc">优先级(高→低)</Option>
        <Option value="priority_asc">优先级(低→高)</Option>
      </Select>

      <Button
        icon={<ClearOutlined />}
        onClick={handleClearFilters}
        title="清除所有筛选条件"
      >
        清除筛选
      </Button>
    </Space>
  )
}

export default TaskFilters 