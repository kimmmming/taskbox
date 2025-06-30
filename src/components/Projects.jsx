import React, { useState } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Row, 
  Col, 
  Typography, 
  List, 
  Progress,
  Tag,
  Popconfirm
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ProjectOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllProjects, deleteProject } from '../store/projectsSlice'
import { selectAllTasks } from '../store/tasksSlice'
import ProjectForm from './ProjectForm'

const { Title } = Typography

const Projects = () => {
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  
  const projects = useSelector(selectAllProjects)
  const tasks = useSelector(selectAllTasks)
  const dispatch = useDispatch()

  const handleAddProject = () => {
    setEditingProject(null)
    setShowProjectForm(true)
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setShowProjectForm(true)
  }

  const handleDeleteProject = (projectId) => {
    dispatch(deleteProject(projectId))
  }

  const handleCloseForm = () => {
    setShowProjectForm(false)
    setEditingProject(null)
  }

  // 计算项目统计
  const projectsWithStats = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.id)
    const completed = projectTasks.filter(task => task.status === 'completed').length
    const total = projectTasks.length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      ...project,
      taskCount: total,
      completedCount: completed,
      completionRate
    }
  })

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={2} style={{ margin: 0 }}>
              项目管理
            </Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddProject}
              size="large"
            >
              新建项目
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={`项目列表 (${projects.length})`}>
            <List
              dataSource={projectsWithStats}
              renderItem={project => (
                <List.Item
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditProject(project)}
                      title="编辑项目"
                    />,
                    project.id !== 'default' && (
                      <Popconfirm
                        key="delete"
                        title="确定要删除这个项目吗？删除后该项目下的任务将移动到默认项目。"
                        onConfirm={() => handleDeleteProject(project.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          title="删除项目"
                        />
                      </Popconfirm>
                    )
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        backgroundColor: project.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ProjectOutlined style={{ color: 'white', fontSize: '18px' }} />
                      </div>
                    }
                    title={
                      <Space>
                        <span>{project.name}</span>
                        {project.id === 'default' && <Tag color="blue">默认</Tag>}
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          {project.description || '暂无描述'}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Space>
                            <span>任务数量: {project.taskCount}</span>
                            <span>已完成: {project.completedCount}</span>
                            <span>完成率: {project.completionRate}%</span>
                          </Space>
                        </div>
                        <Progress 
                          percent={project.completionRate} 
                          strokeColor={project.color}
                          size="small"
                          style={{ maxWidth: 300 }}
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无项目' }}
            />
          </Card>
        </Col>
      </Row>

      <ProjectForm
        visible={showProjectForm}
        project={editingProject}
        onClose={handleCloseForm}
      />
    </div>
  )
}

export default Projects 