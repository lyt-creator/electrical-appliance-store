import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, logout } = useAuthStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const isAdminPage = location.pathname.startsWith('/admin')

  if (isAdminPage) return null

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-lg text-dark hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="菜单"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center ring-1 ring-primary-700/10 shadow-soft">
                <span className="text-white font-bold text-sm">电</span>
              </div>
              <span className="text-lg font-bold text-primary-700 tracking-tight">电器商城</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className={`relative inline-flex items-center py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${location.pathname === '/' ? 'text-primary-700' : 'text-dark hover:text-primary-700'}`}>
              首页
              <span className={`absolute left-0 right-0 bottom-0 h-0.5 rounded-full bg-secondary-500 transition-opacity duration-200 ${location.pathname === '/' ? 'opacity-100' : 'opacity-0'}`}></span>
            </a>
            <a href="/categories" className={`relative inline-flex items-center py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${location.pathname.startsWith('/categories') ? 'text-primary-700' : 'text-dark hover:text-primary-700'}`}>
              分类
              <span className={`absolute left-0 right-0 bottom-0 h-0.5 rounded-full bg-secondary-500 transition-opacity duration-200 ${location.pathname.startsWith('/categories') ? 'opacity-100' : 'opacity-0'}`}></span>
            </a>
            <a href="/products" className={`relative inline-flex items-center py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${location.pathname.startsWith('/products') ? 'text-primary-700' : 'text-dark hover:text-primary-700'}`}>
              全部产品
              <span className={`absolute left-0 right-0 bottom-0 h-0.5 rounded-full bg-secondary-500 transition-opacity duration-200 ${location.pathname.startsWith('/products') ? 'opacity-100' : 'opacity-0'}`}></span>
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="搜索产品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-44 sm:w-52 text-sm bg-gray-50 border border-transparent rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-100 transition-all"
                />
              </div>
            </form>

            {isLoggedIn ? (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="p-2 text-dark hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="管理后台"
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-dark hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="退出登录"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <a
                href="/admin"
                className="bg-secondary-500 text-white px-4 py-1.5 rounded-full hover:bg-secondary-600 transition-all duration-200 font-medium text-xs sm:text-sm whitespace-nowrap shadow-soft"
              >
                <span className="hidden sm:inline">管理员登录</span>
                <span className="sm:hidden">登录</span>
              </a>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
            <nav className="flex flex-col space-y-1 px-2">
              <a href="/" className="px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 hover:text-primary-700 rounded-lg transition-colors duration-200">首页</a>
              <a href="/categories" className="px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 hover:text-primary-700 rounded-lg transition-colors duration-200">分类</a>
              <a href="/products" className="px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 hover:text-primary-700 rounded-lg transition-colors duration-200">全部产品</a>
              <form onSubmit={handleSearch} className="px-2 pt-3">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="搜索产品..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-transparent rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-100 transition-all"
                  />
                </div>
              </form>
              {!isLoggedIn && (
                <a
                  href="/admin"
                  className="mt-2 px-4 py-2.5 bg-secondary-500 text-white rounded-full text-center font-medium text-sm shadow-soft hover:bg-secondary-600 transition-colors duration-200"
                >
                  管理员登录
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
