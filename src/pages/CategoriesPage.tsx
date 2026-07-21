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
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark mb-4">产品分类</h1>
          <p className="text-gray-500 text-lg">选择您感兴趣的电器品牌</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 skeleton h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">暂无分类</h3>
            <p className="text-gray-500">管理员尚未添加任何产品分类</p>
          </div>
        )}
      </div>
    </div>
  )
}
