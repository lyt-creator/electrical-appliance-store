import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, logout, username } = useAuthStore()

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">电</span>
              </div>
              <span className="text-xl font-bold text-primary">电器商城</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-dark hover:text-secondary transition-colors font-medium">首页</a>
            <a href="/categories" className="text-dark hover:text-secondary transition-colors font-medium">分类</a>
            <a href="/products" className="text-dark hover:text-secondary transition-colors font-medium">全部产品</a>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <input
                type="text"
                placeholder="搜索产品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-secondary w-48 sm:w-64"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary/90 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="管理后台"
                >
                  <User className="w-6 h-6 text-dark" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-6 h-6 text-dark" />
                </button>
              </div>
            ) : (
              <a
                href="/admin"
                className="bg-secondary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">管理员登录</span>
                <span className="sm:hidden">登录</span>
              </a>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <a href="/" className="px-4 py-2 text-dark hover:bg-gray-100 rounded-lg">首页</a>
              <a href="/categories" className="px-4 py-2 text-dark hover:bg-gray-100 rounded-lg">分类</a>
              <a href="/products" className="px-4 py-2 text-dark hover:bg-gray-100 rounded-lg">全部产品</a>
              <form onSubmit={handleSearch} className="px-4 pt-2">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="搜索产品..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-secondary"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary/90 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
              {!isLoggedIn && (
                <a
                  href="/admin"
                  className="px-4 py-2 bg-secondary text-white rounded-lg text-center font-medium"
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
