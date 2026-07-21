import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { categoryAPI, productAPI } from '../api'
import { resolveImageUrl } from '../api'
import { Category, Product } from '../types'
import { ProductCard } from '../components/ProductCard'

export const CategoryProductsPage = () => {
  const { id } = useParams<{ id: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productsRes] = await Promise.all([
          categoryAPI.getById(parseInt(id!)),
          productAPI.getAll(parseInt(id!)),
        ])
        setCategory(categoryRes.data)
        setProducts(productsRes.data)
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link
            to="/categories"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回分类</span>
          </Link>
        </div>

        {loading ? (
          <div className="skeleton h-20 w-full rounded-lg mb-8" />
        ) : category ? (
          <div className="bg-white rounded-xl p-8 mb-8 shadow-sm">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                {category.logo && !logoError ? (
                  <img src={resolveImageUrl(category.logo)} alt={category.name} className="w-16 h-16 object-contain" onError={() => setLogoError(true)} />
                ) : (
                  <span className="text-4xl font-bold text-primary">{category.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-dark">{category.name}</h1>
                <p className="text-gray-500 mt-2">{category.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 mb-8 shadow-sm">
            <h1 className="text-3xl font-bold text-dark">分类不存在</h1>
          </div>
        )}

        <h2 className="text-2xl font-bold text-dark mb-6">
          {category?.name || '该分类'}下的产品 ({products.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden skeleton h-80" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">暂无产品</h3>
            <p className="text-gray-500">该分类下尚未添加任何产品</p>
          </div>
        )}
      </div>
    </div>
  )
}
