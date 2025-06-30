import React, { useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message 
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, updateTask } from '../store/tasksSlice'
import { selectAllProjects } from '../store/projectsSlice'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const TaskForm = ({ visible, task, onClose }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const projects = useSelector(selectAllProjects)

  useEffect(() => {
    if (visible) {
      if (task) {
        // 编辑模式，填充表单
        form.setFieldsValue({
          ...task,
          dueDate: task.dueDate ? dayjs(task.dueDate) : null,
          tags: task.tags ? task.tags.join(', ') : '',
        })
      } else {
        // 新建模式，重置表单
        form.resetFields()
      }
    }
  }, [visible, task, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      const taskData = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      }

      if (task) {
        // 更新任务
        dispatch(updateTask({ id: task.id, ...taskData }))
        message.success('任务更新成功')
      } else {
        // 创建任务
        dispatch(addTask(taskData))
        message.success('任务创建成功')
      }
      
      onClose()
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  return (
    <Modal
      title={task ? '编辑任务' : '新建任务'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      width={600}
      okText="保存"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priority: 'medium',
          projectId: 'default',
        }}
      >
        <Form.Item
          name="title"
          label="任务标题"
          rules={[{ required: true, message: '请输入任务标题' }]}
        >
          <Input placeholder="请输入任务标题" />
        </Form.Item>

        <Form.Item
          name="description"
          label="任务描述"
        >
          <TextArea 
            rows={3} 
            placeholder="请输入任务描述（可选）" 
          />
        </Form.Item>

        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true, message: '请选择优先级' }]}
        >
          <Select placeholder="请选择优先级">
            <Option value="high">高优先级</Option>
            <Option value="medium">中优先级</Option>
            <Option value="low">低优先级</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="projectId"
          label="所属项目"
        >
          <Select placeholder="请选择项目">
            {projects.map(project => (
              <Option key={project.id} value={project.id}>
                <span style={{ color: project.color }}>●</span> {project.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="截止时间"
        >
          <DatePicker 
            showTime 
            placeholder="请选择截止时间（可选）"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="标签"
          help="多个标签请用逗号分隔"
        >
          <Input placeholder="例如：工作, 紧急, 会议" />
        </Form.Item>

        {task && (
          <Form.Item
            name="status"
            label="任务状态"
          >
            <Select placeholder="请选择状态">
              <Option value="pending">待办</Option>
              <Option value="in-progress">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default TaskForm 