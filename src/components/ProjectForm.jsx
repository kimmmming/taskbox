import React, { useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  message,
  ColorPicker
} from 'antd'
import { useDispatch } from 'react-redux'
import { addProject, updateProject } from '../store/projectsSlice'

const { TextArea } = Input

const ProjectForm = ({ visible, project, onClose }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    if (visible) {
      if (project) {
        // 编辑模式，填充表单
        form.setFieldsValue({
          ...project,
        })
      } else {
        // 新建模式，重置表单
        form.resetFields()
      }
    }
  }, [visible, project, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      const projectData = {
        ...values,
        color: typeof values.color === 'string' ? values.color : values.color?.toHexString?.() || '#1890ff',
      }

      if (project) {
        // 更新项目
        dispatch(updateProject({ id: project.id, ...projectData }))
        message.success('项目更新成功')
      } else {
        // 创建项目
        dispatch(addProject(projectData))
        message.success('项目创建成功')
      }
      
      onClose()
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  return (
    <Modal
      title={project ? '编辑项目' : '新建项目'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      width={500}
      okText="保存"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          color: '#1890ff',
        }}
      >
        <Form.Item
          name="name"
          label="项目名称"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="项目描述"
        >
          <TextArea 
            rows={3} 
            placeholder="请输入项目描述（可选）" 
          />
        </Form.Item>

        <Form.Item
          name="color"
          label="项目颜色"
          rules={[{ required: true, message: '请选择项目颜色' }]}
        >
          <ColorPicker 
            showText 
            presets={[
              {
                label: '推荐颜色',
                colors: [
                  '#1890ff',
                  '#52c41a',
                  '#faad14',
                  '#ff4d4f',
                  '#722ed1',
                  '#13c2c2',
                  '#fa541c',
                  '#eb2f96',
                ],
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProjectForm 