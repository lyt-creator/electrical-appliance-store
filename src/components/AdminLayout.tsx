import { useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { LayoutDashboard, Grid3X3, Package, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const { logout, username } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { icon: LayoutDashboard, label: '控制台', path: '/admin/dashboard' },
    { icon: Grid3X3, label: '分类管理', path: '/admin/categories' },
    { icon: Package, label: '产品管理', path: '/admin/products' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className={`fixed left-0 top-0 h-full bg-primary text-white transition-all duration-300 z-40 ${
        isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">管</span>
            </div>
            <span className="text-xl font-bold">管理后台</span>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-bold">{username?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium">{username}</p>
              <p className="text-sm text-gray-400">管理员</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-red-300"
          >
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 bg-white shadow-md z-30" style={{ left: isSidebarOpen ? '256px' : '0' }}>
        <div className="flex items-center justify-between h-16 px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold text-dark">管理后台</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">欢迎回来, {username}</span>
          </div>
        </div>
      </header>

      <main className="pt-16" style={{ marginLeft: isSidebarOpen ? '256px' : '0' }}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
