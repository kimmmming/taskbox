import React from 'react'
import { Row, Col, Card, Statistic } from 'antd'
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  SyncOutlined 
} from '@ant-design/icons'

const QuickStats = ({ stats }) => {
  const completionRate = stats.total > 0 ? 
    Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} sm={6}>
        <Card className="stats-card">
          <Statistic
            title="全部任务"
            value={stats.total}
            valueStyle={{ color: '#1890ff' }}
            prefix={<SyncOutlined />}
          />
        </Card>
      </Col>
      
      <Col xs={12} sm={6}>
        <Card className="stats-card">
          <Statistic
            title="已完成"
            value={stats.completed}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      
      <Col xs={12} sm={6}>
        <Card className="stats-card">
          <Statistic
            title="待办中"
            value={stats.pending + stats.inProgress}
            valueStyle={{ color: '#faad14' }}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
      
      <Col xs={12} sm={6}>
        <Card className="stats-card">
          <Statistic
            title="已延期"
            value={stats.overdue}
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<ExclamationCircleOutlined />}
          />
        </Card>
      </Col>
      
      <Col span={24}>
        <Card>
          <Statistic
            title="完成率"
            value={completionRate}
            precision={0}
            valueStyle={{ color: completionRate >= 80 ? '#52c41a' : completionRate >= 50 ? '#faad14' : '#ff4d4f' }}
            suffix="%"
          />
        </Card>
      </Col>
    </Row>
  )
}

export default QuickStats 