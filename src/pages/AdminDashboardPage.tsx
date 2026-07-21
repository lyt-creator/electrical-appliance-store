import { useState, useEffect } from 'react'
import { Package, Grid3X3, TrendingUp, Users } from 'lucide-react'
import { categoryAPI, productAPI } from '../api'

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ categories: 0, products: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          categoryAPI.getAll(),
          productAPI.getAll(),
        ])
        setStats({
          categories: categoriesRes.data.length,
          products: productsRes.data.length,
        })
      } catch (error) {
        console.error('获取统计数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statsCards = [
    {
      icon: Grid3X3,
      label: '产品分类',
      value: loading ? '...' : stats.categories,
      color: 'bg-blue-500',
    },
    {
      icon: Package,
      label: '产品总数',
      value: loading ? '...' : stats.products,
      color: 'bg-green-500',
    },
    {
      icon: TrendingUp,
      label: '今日访问',
      value: '1234',
      color: 'bg-yellow-500',
    },
    {
      icon: Users,
      label: '注册用户',
      value: '567',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">控制台</h1>
        <p className="text-gray-500 mt-1">欢迎来到电器商城管理后台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-dark mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-dark mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/categories"
              className="bg-primary/5 text-primary p-4 rounded-lg hover:bg-primary/10 transition-colors text-center"
            >
              <Grid3X3 className="w-8 h-8 mx-auto mb-2" />
              <span className="font-medium">分类管理</span>
            </a>
            <a
              href="/admin/products"
              className="bg-secondary/5 text-secondary p-4 rounded-lg hover:bg-secondary/10 transition-colors text-center"
            >
              <Package className="w-8 h-8 mx-auto mb-2" />
              <span className="font-medium">产品管理</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-dark mb-4">最近更新</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600">产品: 奥普浴霸LTO1E</span>
              <span className="text-sm text-gray-400">2小时前</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600">分类: 海尔</span>
              <span className="text-sm text-gray-400">1天前</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">产品: 格力空调KFR-72</span>
              <span className="text-sm text-gray-400">2天前</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
