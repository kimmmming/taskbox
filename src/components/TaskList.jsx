import React, { useState } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Row, 
  Col, 
  Empty,
  Typography 
} from 'antd'
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { selectFilteredTasks, selectTaskStats } from '../store/tasksSlice'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'
import TaskFilters from './TaskFilters'
import QuickStats from './QuickStats'

const { Title } = Typography

const TaskList = () => {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  
  const tasks = useSelector(selectFilteredTasks)
  const stats = useSelector(selectTaskStats)

  const handleAddTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  return (
    <div>
      {/* 页面标题和快速统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={2} style={{ margin: 0 }}>
              任务管理
            </Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddTask}
              size="large"
            >
              新建任务
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 快速统计卡片 */}
      <QuickStats stats={stats} />

      {/* 过滤器 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <TaskFilters />
          </Card>
        </Col>
      </Row>

      {/* 任务列表 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={`任务列表 (${tasks.length})`}
            bodyStyle={{ padding: tasks.length === 0 ? 0 : 24 }}
          >
            {tasks.length === 0 ? (
              <Empty 
                image={<FileTextOutlined className="empty-state-icon" />}
                description="暂无任务，点击上方按钮创建您的第一个任务吧！"
                className="empty-state"
              />
            ) : (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {tasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onEdit={handleEditTask}
                  />
                ))}
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      {/* 任务表单模态框 */}
      <TaskForm
        visible={showTaskForm}
        task={editingTask}
        onClose={handleCloseForm}
      />
    </div>
  )
}

export default TaskList 