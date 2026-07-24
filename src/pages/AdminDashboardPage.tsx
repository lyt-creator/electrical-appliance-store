import { useState, useEffect } from 'react'
import { Package, Grid3X3 } from 'lucide-react'
import { categoryAPI, productAPI } from '../api'
import { Product, Category } from '../types'

interface RecentItem {
  type: '产品' | '分类'
  name: string
  updatedAt: string
}

function formatTime(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return date.toLocaleDateString()
}

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ categories: 0, products: 0 })
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
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

        // Build recent updates from real data
        const catItems: RecentItem[] = categoriesRes.data.map((c: Category) => ({
          type: '分类' as const,
          name: c.name,
          updatedAt: c.updatedAt,
        }))
        const prodItems: RecentItem[] = productsRes.data.map((p: Product) => ({
          type: '产品' as const,
          name: p.name,
          updatedAt: p.updatedAt,
        }))

        // Combine, sort by updatedAt desc, take top 5
        const all = [...catItems, ...prodItems]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5)

        setRecentItems(all)
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
      borderColor: 'border-blue-500',
    },
    {
      icon: Package,
      label: '产品总数',
      value: loading ? '...' : stats.products,
      color: 'bg-green-500',
      borderColor: 'border-green-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark tracking-tight">控制台</h1>
        <p className="text-gray-500 mt-1">欢迎来到电器商城管理后台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsCards.map((card) => (
          <div key={card.label} className={`bg-white rounded-2xl shadow-soft hover:shadow-card-hover p-6 transition-shadow border-t-2 ${card.borderColor}`}>
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-dark mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="font-semibold text-dark mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/categories"
              className="bg-primary/5 text-primary p-4 rounded-xl shadow-soft hover:bg-primary/10 hover:-translate-y-0.5 transition-all text-center"
            >
              <Grid3X3 className="w-8 h-8 mx-auto mb-2" />
              <span className="font-medium">分类管理</span>
            </a>
            <a
              href="/admin/products"
              className="bg-secondary/5 text-secondary p-4 rounded-xl shadow-soft hover:bg-secondary/10 hover:-translate-y-0.5 transition-all text-center"
            >
              <Package className="w-8 h-8 mx-auto mb-2" />
              <span className="font-medium">产品管理</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="font-semibold text-dark mb-4">最近更新</h3>
          <div className="space-y-2">
            {loading ? (
              <div className="text-center text-gray-400 py-8 text-sm">加载中...</div>
            ) : recentItems.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">暂无更新记录</div>
            ) : (
              recentItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    index < recentItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-gray-600">
                    <span className="text-xs text-gray-400 mr-1">{item.type}:</span>
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-400">{formatTime(item.updatedAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
