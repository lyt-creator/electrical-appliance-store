import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { productAPI } from '../api'
import { Product } from '../types'
import { ProductCard } from '../components/ProductCard'

export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!keyword.trim()) {
        setLoading(false)
        return
      }
      try {
        const res = await productAPI.search(keyword)
        setProducts(res.data)
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [keyword])

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <a
            href="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
            <Search className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="text"
              defaultValue={keyword}
              placeholder="搜索产品..."
              className="flex-1 px-4 py-2 text-lg focus:outline-none"
            />
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
              搜索
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark">
            搜索结果: "{keyword}" ({products.length} 个结果)
          </h2>
        </div>

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
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">未找到相关产品</h3>
            <p className="text-gray-500 mb-4">尝试使用其他关键词搜索</p>
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              返回首页
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
