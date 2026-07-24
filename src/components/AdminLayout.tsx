import { useState, useEffect } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Grid3X3, Package, LogOut, Menu, X, Home, MessageSquare } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, username } = useAuthStore()

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { icon: LayoutDashboard, label: '控制台', path: '/admin/dashboard' },
    { icon: Grid3X3, label: '分类管理', path: '/admin/categories' },
    { icon: Package, label: '产品管理', path: '/admin/products' },
    { icon: MessageSquare, label: '留言管理', path: '/admin/messages' },
  ]

  // On desktop: sidebar is always visible (static), no overlay
  // On mobile: sidebar is an overlay with backdrop, defaults to closed
  const sidebarWidth = '256px'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-primary-900 text-white transition-transform duration-300 z-50 ${
          isMobile
            ? isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            : 'translate-x-0'
        }`}
        style={{ width: sidebarWidth }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">管</span>
              </div>
              <span className="text-xl font-bold">管理后台</span>
            </div>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left border-l-2 ${
                    isActive ? 'bg-white/15 border-secondary-500' : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left border-l-2 border-transparent hover:bg-white/5"
            >
              <Home className="w-5 h-5" />
              <span>返回首页</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="bg-white/5 rounded-lg p-3 mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold">{username?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{username}</p>
                <p className="text-sm text-gray-400">管理员</p>
              </div>
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

      {/* Main area: on desktop, offset by sidebar width; on mobile, full width */}
      <div style={{ marginLeft: isMobile ? '0' : sidebarWidth }}>
        {/* Top bar */}
        <header className="fixed top-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200/60 z-30" style={{ left: isMobile ? '0' : sidebarWidth }}>
          <div className="flex items-center justify-between h-14 px-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold text-dark">管理后台</h1>
            <span className="text-sm text-gray-500 hidden sm:inline">欢迎回来, {username}</span>
          </div>
        </header>

        {/* Content */}
        <main className="pt-14">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
