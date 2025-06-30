import React from 'react'
import { Layout, Row, Col, Typography, Space, Divider } from 'antd'
import { 
  GithubOutlined, 
  HeartFilled, 
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined
} from '@ant-design/icons'

const { Footer: AntFooter } = Layout
const { Text, Link } = Typography

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <AntFooter style={{ 
      backgroundColor: '#001529',
      color: '#fff',
      padding: '40px 50px 20px',
      marginTop: 'auto'
    }}>
      <Row gutter={[32, 24]}>
        {/* 产品信息 */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="middle">
            <Text style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              TaskBox
            </Text>
            <Text style={{ color: '#ccc' }}>
              智能任务管理系统，让工作更高效，让生活更有序。
            </Text>
            <Text style={{ color: '#ccc', fontSize: '12px' }}>
              Version 1.0.0
            </Text>
          </Space>
        </Col>

        {/* 功能链接 */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small">
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              功能特性
            </Text>
            <Link style={{ color: '#ccc' }} href="#tasks">任务管理</Link>
            <Link style={{ color: '#ccc' }} href="#projects">项目管理</Link>
            <Link style={{ color: '#ccc' }} href="#statistics">数据统计</Link>
            <Link style={{ color: '#ccc' }} href="#settings">系统设置</Link>
          </Space>
        </Col>

        {/* 支持链接 */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small">
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              帮助支持
            </Text>
            <Link style={{ color: '#ccc' }} href="#help">使用指南</Link>
            <Link style={{ color: '#ccc' }} href="#faq">常见问题</Link>
            <Link style={{ color: '#ccc' }} href="#feedback">意见反馈</Link>
            <Link style={{ color: '#ccc' }} href="#contact">联系我们</Link>
          </Space>
        </Col>

        {/* 联系信息 */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small">
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              联系方式
            </Text>
            <Space style={{ color: '#ccc' }}>
              <MailOutlined />
              <Text style={{ color: '#ccc' }}>support@taskbox.com</Text>
            </Space>
            <Space style={{ color: '#ccc' }}>
              <PhoneOutlined />
              <Text style={{ color: '#ccc' }}>400-888-8888</Text>
            </Space>
            <Space style={{ color: '#ccc' }}>
              <GlobalOutlined />
              <Text style={{ color: '#ccc' }}>www.taskbox.com</Text>
            </Space>
          </Space>
        </Col>
      </Row>

      <Divider style={{ borderColor: '#434343', margin: '32px 0 20px' }} />

      {/* 版权信息 */}
      <Row justify="space-between" align="middle">
        <Col xs={24} md={12}>
          <Space style={{ color: '#ccc', fontSize: '12px' }}>
            <Text style={{ color: '#ccc' }}>
              © {currentYear} TaskBox. All rights reserved.
            </Text>
            <Text style={{ color: '#ccc' }}>|</Text>
            <Link style={{ color: '#ccc' }} href="#privacy">隐私政策</Link>
            <Text style={{ color: '#ccc' }}>|</Text>
            <Link style={{ color: '#ccc' }} href="#terms">服务条款</Link>
          </Space>
        </Col>

        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space style={{ color: '#ccc', fontSize: '12px' }}>
            <Text style={{ color: '#ccc' }}>
              Made with <HeartFilled style={{ color: '#ff4d4f' }} /> by AI金同学
            </Text>
            <Link 
              href="https://github.com" 
              target="_blank"
              style={{ color: '#ccc' }}
            >
              <GithubOutlined style={{ fontSize: '16px' }} />
            </Link>
          </Space>
        </Col>
      </Row>
    </AntFooter>
  )
}

export default Footer 