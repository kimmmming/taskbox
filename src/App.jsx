import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/Header'
import Footer from './components/Footer'
import TaskList from './components/TaskList'
import Statistics from './components/Statistics'
import Projects from './components/Projects'
import Settings from './components/Settings'

const { Content } = Layout

function App() {
  return (
    <div className="app-container">
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Content className="main-content">
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </div>
  )
}

export default App 