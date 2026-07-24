import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { categoryAPI, productAPI } from '../api'
import { Category, Product } from '../types'
import { CategoryCard } from '../components/CategoryCard'
import { ProductCard } from '../components/ProductCard'
import { SearchBar } from '../components/SearchBar'

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
        setCategories(categoriesRes.data)
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
      <section className="relative bg-gradient-to-r from-primary-800 to-primary-700 text-white overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl opacity-[0.08]" />
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-secondary-500 rounded-full blur-3xl opacity-[0.12]" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-3xl opacity-[0.05]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-secondary-500" />
              <span className="text-xs tracking-wide">精选优质电器</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight tracking-tight">
              品质生活<br />
              <span className="text-secondary-500">从好电器开始</span>
            </h1>
            <p className="text-sm md:text-base text-gray-200 mb-5 leading-relaxed">
              汇聚国内外知名品牌，提供厨房电器、卫浴电器、生活电器等全品类产品，
              让您的生活更便捷、更舒适。
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Link
                to="/categories"
                className="bg-secondary-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-secondary-600 transition-all text-center text-sm shadow-soft hover:shadow-card-hover"
              >
                浏览分类
              </Link>
              <Link
                to="/products"
                className="bg-white/10 backdrop-blur text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-all text-center text-sm border border-white/15"
              >
                查看全部产品
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search bar section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <SearchBar />
        </div>
      </section>

      <section className="py-6 bg-light animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1 h-5 bg-secondary-500 rounded-full" />
                <h2 className="text-xl font-bold text-dark tracking-tight">产品分类</h2>
              </div>
              <p className="text-gray-500 mt-0.5 text-xs ml-3">按类型快速找到您需要的电器</p>
            </div>
            <Link
              to="/categories"
              className="flex items-center space-x-1 text-primary hover:text-secondary-500 transition-colors font-medium text-xs"
            >
              <span>查看全部</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-2 skeleton h-20 shadow-soft" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-2">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-6 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1 h-5 bg-secondary-500 rounded-full" />
                <h2 className="text-xl font-bold text-dark tracking-tight">热门推荐</h2>
              </div>
              <p className="text-gray-500 mt-0.5 text-xs ml-3">精选优质电器产品</p>
            </div>
            <Link
              to="/products"
              className="flex items-center space-x-1 text-primary hover:text-secondary-500 transition-colors font-medium text-xs"
            >
              <span>更多产品</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden skeleton h-52 shadow-soft" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 bg-gradient-to-r from-primary-50 to-secondary-50/50 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center bg-white rounded-2xl shadow-soft p-5 transition-all duration-300 hover:shadow-card-hover">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold text-primary-700">50+</span>
              </div>
              <h3 className="text-sm font-semibold text-dark mb-0.5 tracking-tight">品牌合作</h3>
              <p className="text-gray-500 text-xs">与众多知名品牌建立深度合作</p>
            </div>
            <div className="text-center bg-white rounded-2xl shadow-soft p-5 transition-all duration-300 hover:shadow-card-hover">
              <div className="w-12 h-12 bg-secondary-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold text-secondary-500">500+</span>
              </div>
              <h3 className="text-sm font-semibold text-dark mb-0.5 tracking-tight">产品种类</h3>
              <p className="text-gray-500 text-xs">涵盖各类电器产品满足您的需求</p>
            </div>
            <div className="text-center bg-white rounded-2xl shadow-soft p-5 transition-all duration-300 hover:shadow-card-hover">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold text-primary-700">99%</span>
              </div>
              <h3 className="text-sm font-semibold text-dark mb-0.5 tracking-tight">客户满意度</h3>
              <p className="text-gray-500 text-xs">优质服务赢得客户信赖</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
