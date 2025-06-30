import React from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Switch, 
  Select, 
  InputNumber,
  Button,
  Space,
  Divider,
  message,
  Upload
} from 'antd'
import { 
  ExportOutlined, 
  ImportOutlined, 
  DeleteOutlined 
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { 
  updateSettings, 
  selectSettings,
  toggleTheme,
  setViewMode,
  updateNotificationSettings
} from '../store/settingsSlice'
import { clearCompleted, importTasks, selectAllTasks } from '../store/tasksSlice'

const { Title, Text } = Typography
const { Option } = Select

const Settings = () => {
  const dispatch = useDispatch()
  const settings = useSelector(selectSettings)
  const tasks = useSelector(selectAllTasks)

  const handleSettingChange = (key, value) => {
    dispatch(updateSettings({ [key]: value }))
  }

  const handleNotificationChange = (key, value) => {
    dispatch(updateNotificationSettings({ [key]: value }))
  }

  const handleExportTasks = () => {
    try {
      const dataStr = JSON.stringify(tasks, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `taskbox-tasks-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      message.success('任务数据导出成功')
    } catch (error) {
      message.error('导出失败')
    }
  }

  const handleImportTasks = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result)
        if (Array.isArray(importedTasks)) {
          dispatch(importTasks(importedTasks))
          message.success('任务数据导入成功')
        } else {
          message.error('文件格式不正确')
        }
      } catch (error) {
        message.error('文件解析失败')
      }
    }
    reader.readAsText(file)
    return false // 阻止自动上传
  }

  const handleClearCompleted = () => {
    dispatch(clearCompleted())
    message.success('已清除所有已完成的任务')
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>设置</Title>

      <Row gutter={[16, 16]}>
        {/* 外观设置 */}
        <Col xs={24} lg={12}>
          <Card title="外观设置">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>深色模式</Text>
                <Switch
                  checked={settings.theme === 'dark'}
                  onChange={() => dispatch(toggleTheme())}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>视图模式</Text>
                <Select
                  value={settings.viewMode}
                  onChange={(value) => dispatch(setViewMode(value))}
                  style={{ width: 120 }}
                >
                  <Option value="list">列表视图</Option>
                  <Option value="card">卡片视图</Option>
                  <Option value="kanban">看板视图</Option>
                </Select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>显示已完成任务</Text>
                <Switch
                  checked={settings.showCompleted}
                  onChange={(checked) => handleSettingChange('showCompleted', checked)}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* 通知设置 */}
        <Col xs={24} lg={12}>
          <Card title="通知设置">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>启用通知</Text>
                <Switch
                  checked={settings.notifications.enabled}
                  onChange={(checked) => handleNotificationChange('enabled', checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>提前提醒时间(小时)</Text>
                <InputNumber
                  min={1}
                  max={168}
                  value={settings.notifications.beforeDue}
                  onChange={(value) => handleNotificationChange('beforeDue', value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>提醒声音</Text>
                <Switch
                  checked={settings.notifications.sound}
                  onChange={(checked) => handleNotificationChange('sound', checked)}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* 数据管理 */}
        <Col span={24}>
          <Card title="数据管理">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>数据备份与恢复</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Button 
                      icon={<ExportOutlined />} 
                      onClick={handleExportTasks}
                    >
                      导出任务数据
                    </Button>
                    
                    <Upload
                      accept=".json"
                      beforeUpload={handleImportTasks}
                      showUploadList={false}
                    >
                      <Button icon={<ImportOutlined />}>
                        导入任务数据
                      </Button>
                    </Upload>
                  </Space>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  导出的数据包含所有任务信息，可用于备份或迁移到其他设备
                </Text>
              </div>

              <Divider />

              <div>
                <Text strong>数据清理</Text>
                <div style={{ marginTop: 8 }}>
                  <Button 
                    danger
                    icon={<DeleteOutlined />} 
                    onClick={handleClearCompleted}
                  >
                    清除已完成任务
                  </Button>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  此操作将永久删除所有已完成的任务，请谨慎操作
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 其他设置 */}
        <Col span={24}>
          <Card title="其他设置">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>自动保存</Text>
                <Switch
                  checked={settings.autoSave}
                  onChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>语言</Text>
                <Select
                  value={settings.language}
                  onChange={(value) => handleSettingChange('language', value)}
                  style={{ width: 120 }}
                >
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="en-US">English</Option>
                </Select>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 关于信息 */}
        <Col span={24}>
          <Card title="关于 TaskBox">
            <Space direction="vertical" size="small">
              <Text>版本：v1.0.0</Text>
              <Text>作者：AI金同学</Text>
              <Text>描述：智能任务管理系统，帮助您高效管理个人和团队任务</Text>
              <Text type="secondary">
                TaskBox 是一个现代化、简洁易用的在线任务管理工具，支持任务创建、编辑、分类、统计等功能。
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Settings 