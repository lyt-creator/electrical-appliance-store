import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Share2 } from 'lucide-react'
import { productAPI } from '../api'
import { Product } from '../types'
import { ImageGallery } from '../components/ImageGallery'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(parseInt(id!))
        setProduct(res.data)
      } catch (error) {
        console.error('获取产品失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen py-6">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center mb-4">
            <div className="skeleton h-6 w-24" />
          </div>
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl skeleton" />
            <div className="space-y-3">
              <div className="skeleton h-6 w-full" />
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-8 w-1/3" />
              <div className="skeleton h-5 w-full" />
              <div className="skeleton h-5 w-full" />
              <div className="skeleton h-5 w-full" />
              <div className="skeleton h-5 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">产品不存在</h1>
          <Link to="/products" className="text-primary hover:underline">
            返回产品列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <Link
              to="/products"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">返回</span>
            </Link>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        <div className="bg-white mt-2 p-4 space-y-4">
          <div>
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-2">
              {product.categoryName}
            </span>
            <h1 className="text-xl font-bold text-dark leading-tight">{product.name}</h1>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold text-secondary">¥{product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400 line-through">¥{(product.price * 1.2).toFixed(2)}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>品牌: {product.categoryName}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-white mt-2 p-4">
          <h3 className="font-semibold text-dark mb-3 flex items-center">
            <span className="w-1 h-5 bg-primary mr-3 rounded-full" />
            产品描述
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">{product.description || '暂无详细描述'}</p>
        </div>

        {product.specs && (
          <div className="bg-white mt-2 p-4">
            <h3 className="font-semibold text-dark mb-3 flex items-center">
              <span className="w-1 h-5 bg-primary mr-3 rounded-full" />
              产品规格
            </h3>
            <div className="space-y-2">
              {product.specs.split('\n').map((spec, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3" />
                  <span className="text-gray-600">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}
