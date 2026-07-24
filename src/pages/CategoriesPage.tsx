import { useState, useEffect } from 'react'
import { categoryAPI } from '../api'
import { Category } from '../types'
import { CategoryCard } from '../components/CategoryCard'

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll()
        setCategories(res.data)
      } catch (error) {
        console.error('获取分类失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-1 h-5 bg-secondary-500 rounded-full" />
            <h1 className="text-xl font-bold text-dark tracking-tight">产品分类</h1>
          </div>
          <p className="text-gray-500 text-sm">选择您感兴趣的电器品牌</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-card p-2 skeleton h-20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-base font-semibold text-dark mb-1">暂无分类</h3>
            <p className="text-gray-500 text-sm">管理员尚未添加任何产品分类</p>
          </div>
        )}
      </div>
    </div>
  )
}
