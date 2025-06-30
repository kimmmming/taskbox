import React from 'react'
import { 
  Card, 
  Checkbox, 
  Tag, 
  Space, 
  Button, 
  Typography, 
  Tooltip,
  Popconfirm
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  CalendarOutlined,
  ProjectOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTaskStatus, deleteTask } from '../store/tasksSlice'
import { selectProjectById } from '../store/projectsSlice'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const { Text, Paragraph } = Typography

const TaskItem = ({ task, onEdit }) => {
  const dispatch = useDispatch()
  const project = useSelector(state => selectProjectById(state, task.projectId))

  const handleToggleStatus = () => {
    dispatch(toggleTaskStatus(task.id))
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
  }

  const handleEdit = () => {
    onEdit(task)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'orange'
      case 'low': return 'green'
      default: return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'processing'
      case 'pending': return 'default'
      case 'overdue': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'in-progress': return '进行中'
      case 'pending': return '待办'
      case 'overdue': return '已延期'
      default: return status
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return '高优先级'
      case 'medium': return '中优先级'
      case 'low': return '低优先级'
      default: return priority
    }
  }

  const isOverdue = task.dueDate && 
    dayjs().isAfter(dayjs(task.dueDate)) && 
    task.status !== 'completed'

  const actualStatus = isOverdue ? 'overdue' : task.status

  return (
    <Card 
      className={`task-item ${task.status === 'completed' ? 'task-completed' : ''} priority-${task.priority}`}
      bodyStyle={{ padding: '16px 20px' }}
    >
      <Space align="start" style={{ width: '100%' }}>
        <Checkbox 
          checked={task.status === 'completed'}
          onChange={handleToggleStatus}
          style={{ marginTop: 4 }}
        />
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <Text 
              className="task-title"
              style={{ 
                fontSize: '16px', 
                fontWeight: 500,
                textDecoration: task.status === 'completed' ? 'line-through' : 'none'
              }}
            >
              {task.title}
            </Text>
          </div>
          
          {task.description && (
            <Paragraph 
              style={{ 
                margin: '8px 0',
                color: '#666'
              }}
              ellipsis={{ rows: 2, expandable: true }}
            >
              {task.description}
            </Paragraph>
          )}
          
          <Space size="small" wrap>
            <Tag color={getStatusColor(actualStatus)} className="status-tag">
              {getStatusText(actualStatus)}
            </Tag>
            
            <Tag color={getPriorityColor(task.priority)} className="status-tag">
              {getPriorityText(task.priority)}
            </Tag>
            
            {project && (
              <Tag icon={<ProjectOutlined />} color={project.color} className="status-tag">
                {project.name}
              </Tag>
            )}
            
            {task.dueDate && (
              <Tooltip title={`截止时间: ${dayjs(task.dueDate).format('YYYY-MM-DD HH:mm')}`}>
                <Tag 
                  icon={<CalendarOutlined />} 
                  color={isOverdue ? 'red' : 'blue'}
                  className="status-tag"
                >
                  {dayjs(task.dueDate).fromNow()}
                </Tag>
              </Tooltip>
            )}
            
            {task.tags && task.tags.length > 0 && (
              task.tags.map(tag => (
                <Tag key={tag} className="status-tag">{tag}</Tag>
              ))
            )}
          </Space>
          
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            创建于 {dayjs(task.createdAt).format('MM-DD HH:mm')}
            {task.updatedAt !== task.createdAt && (
              <span> · 更新于 {dayjs(task.updatedAt).format('MM-DD HH:mm')}</span>
            )}
          </div>
        </div>
        
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={handleEdit}
            title="编辑任务"
          />
          <Popconfirm
            title="确定要删除这个任务吗？"
            onConfirm={handleDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="删除任务"
            />
          </Popconfirm>
        </Space>
      </Space>
    </Card>
  )
}

export default TaskItem 