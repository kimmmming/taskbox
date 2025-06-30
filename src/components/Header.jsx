import React from 'react'
import { Layout, Menu, Button, Space, Typography } from 'antd'
import { 
  CheckSquareOutlined, 
  BarChartOutlined, 
  ProjectOutlined, 
  SettingOutlined,
  BulbOutlined 
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme, selectSettings } from '../store/settingsSlice'

const { Header: AntHeader } = Layout
const { Title } = Typography

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const settings = useSelector(selectSettings)

  const menuItems = [
    {
      key: '/tasks',
      icon: <CheckSquareOutlined />,
      label: '任务管理'
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: '统计分析'
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目管理'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置'
    }
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Space align="center">
        <CheckSquareOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          TaskBox
        </Title>
      </Space>

      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ 
          border: 'none',
          flex: 1,
          justifyContent: 'center'
        }}
      />

      <Space>
        <Button
          type="text"
          icon={<BulbOutlined />}
          onClick={handleThemeToggle}
          title={settings.theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
        />
      </Space>
    </AntHeader>
  )
}

export default Header 