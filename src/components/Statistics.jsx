import React from 'react'
import { Card, Row, Col, Typography, Progress, List, Tag } from 'antd'
import { useSelector } from 'react-redux'
import { selectAllTasks, selectTaskStats } from '../store/tasksSlice'
import { selectAllProjects } from '../store/projectsSlice'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const Statistics = () => {
  const tasks = useSelector(selectAllTasks)
  const stats = useSelector(selectTaskStats)
  const projects = useSelector(selectAllProjects)

  // 计算项目统计
  const projectStats = projects.map(project => {
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

  // 计算优先级统计
  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length,
  }

  // 最近创建的任务
  const recentTasks = tasks
    .slice()
    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    .slice(0, 5)

  // 即将到期的任务
  const upcomingTasks = tasks
    .filter(task => task.dueDate && task.status !== 'completed')
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())
    .slice(0, 5)

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>统计分析</Title>

      {/* 总体统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="任务状态分布">
            <div style={{ marginBottom: 16 }}>
              <Text>总任务数：{stats.total}</Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text>已完成：{stats.completed}</Text>
              <Progress 
                percent={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0} 
                strokeColor="#52c41a"
                size="small"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text>进行中：{stats.inProgress}</Text>
              <Progress 
                percent={stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0} 
                strokeColor="#1890ff"
                size="small"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text>待办：{stats.pending}</Text>
              <Progress 
                percent={stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0} 
                strokeColor="#faad14"
                size="small"
              />
            </div>
            <div>
              <Text>已延期：{stats.overdue}</Text>
              <Progress 
                percent={stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0} 
                strokeColor="#ff4d4f"
                size="small"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="优先级分布">
            <div style={{ marginBottom: 12 }}>
              <Text>高优先级：{priorityStats.high}</Text>
              <Progress 
                percent={stats.total > 0 ? Math.round((priorityStats.high / stats.total) * 100) : 0} 
                strokeColor="#ff4d4f"
                size="small"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text>中优先级：{priorityStats.medium}</Text>
              <Progress 
                percent={stats.total > 0 ? Math.round((priorityStats.medium / stats.total) * 100) : 0} 
                strokeColor="#faad14"
                size="small"
              />
            </div>
            <div>
              <Text>低优先级：{priorityStats.low}</Text>
              <Progress 
                percent={stats.total > 0 ? Math.round((priorityStats.low / stats.total) * 100) : 0} 
                strokeColor="#52c41a"
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 项目统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="项目完成情况">
            <List
              dataSource={projectStats}
              renderItem={project => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text strong>
                        <span style={{ color: project.color }}>●</span> {project.name}
                      </Text>
                      <Text>
                        {project.completedCount}/{project.taskCount} ({project.completionRate}%)
                      </Text>
                    </div>
                    <Progress 
                      percent={project.completionRate} 
                      strokeColor={project.color}
                      size="small"
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近任务和即将到期 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="最近创建的任务">
            <List
              dataSource={recentTasks}
              renderItem={task => (
                <List.Item>
                  <div>
                    <Text strong>{task.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {dayjs(task.createdAt).format('MM-DD HH:mm')}
                    </Text>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: '暂无任务' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="即将到期的任务">
            <List
              dataSource={upcomingTasks}
              renderItem={task => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>{task.title}</Text>
                      <Tag color={dayjs().add(1, 'day').isAfter(dayjs(task.dueDate)) ? 'red' : 'blue'}>
                        {dayjs(task.dueDate).format('MM-DD HH:mm')}
                      </Tag>
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: '暂无即将到期的任务' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Statistics 