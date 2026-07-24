import { useState, useEffect } from 'react'
import { productAPI } from '../api'
import { Product } from '../types'
import { ProductCard } from '../components/ProductCard'

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productAPI.getAll()
        setProducts(res.data)
      } catch (error) {
        console.error('获取产品失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-1 h-6 bg-secondary-500 rounded-full" />
            <h1 className="text-3xl font-bold text-dark tracking-tight">全部产品</h1>
          </div>
          <p className="text-gray-500 text-lg">浏览我们的全部电器产品</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-card overflow-hidden skeleton h-80" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">暂无产品</h3>
            <p className="text-gray-500">管理员尚未添加任何产品</p>
          </div>
        )}
      </div>
    </div>
  )
}
