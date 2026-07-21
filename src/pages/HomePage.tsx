import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { categoryAPI, productAPI } from '../api'
import { Category, Product } from '../types'
import { CategoryCard } from '../components/CategoryCard'
import { ProductCard } from '../components/ProductCard'

export const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          categoryAPI.getAll(),
          productAPI.getAll(),
        ])
        setCategories(categoriesRes.data.slice(0, 6))
        setFeaturedProducts(productsRes.data.slice(0, 4))
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-sm">精选优质电器</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              品质生活<br />
              <span className="text-secondary">从好电器开始</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              汇聚国内外知名品牌，提供厨房电器、卫浴电器、生活电器等全品类产品，
              让您的生活更便捷、更舒适。
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/categories"
                className="bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary/90 transition-colors text-center"
              >
                浏览分类
              </Link>
              <Link
                to="/products"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors text-center"
              >
                查看全部产品
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-dark">产品分类</h2>
              <p className="text-gray-500 mt-2">按类型快速找到您需要的电器</p>
            </div>
            <Link
              to="/categories"
              className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors font-medium"
            >
              <span>查看全部</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 skeleton h-40" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-dark">热门推荐</h2>
              <p className="text-gray-500 mt-2">精选优质电器产品</p>
            </div>
            <Link
              to="/products"
              className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors font-medium"
            >
              <span>更多产品</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden skeleton h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">50+</span>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">品牌合作</h3>
              <p className="text-gray-500">与众多知名品牌建立深度合作</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-secondary">500+</span>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">产品种类</h3>
              <p className="text-gray-500">涵盖各类电器产品满足您的需求</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">99%</span>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">客户满意度</h3>
              <p className="text-gray-500">优质服务赢得客户信赖</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
