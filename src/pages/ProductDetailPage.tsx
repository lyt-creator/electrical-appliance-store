import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Share2, Copy, Check, X } from 'lucide-react'
import { productAPI, categoryAPI } from '../api'
import { Product, Category } from '../types'
import { ImageGallery } from '../components/ImageGallery'
import { ImageCarousel } from '../components/ImageCarousel'
import { ProductCard } from '../components/ProductCard'
import { resolveImageUrl } from '../api'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSharePanel, setShowSharePanel] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = product ? `${window.location.origin}/products/${product.id}` : ''
  const shareText = product ? `${product.name} - ¥${product.price.toFixed(2)} | 电器商城` : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
        const textarea = document.createElement('textarea')
        textarea.value = shareUrl
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || '电器商城产品',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        // 用户取消分享，无需处理
      }
    } else {
      handleCopyLink()
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(parseInt(id!))
        setProduct(res.data)
        if (res.data.categoryId) {
          const [catRes, productsRes] = await Promise.all([
            categoryAPI.getById(res.data.categoryId),
            productAPI.getAll(res.data.categoryId),
          ])
          setCategory(catRes.data)
          setRelatedProducts(productsRes.data.filter((p: Product) => p.id !== res.data.id).slice(0, 4))
        }
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center mb-4">
            <div className="skeleton h-6 w-24" />
          </div>
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl skeleton" />
            <div className="space-y-3">
              <div className="skeleton h-6 w-full" />
              <div className="skeleton h-8 w-1/3" />
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
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-lg font-bold text-dark mb-2">产品不存在</h1>
          <Link to="/products" className="text-primary hover:underline text-sm">
            返回产品列表
          </Link>
        </div>
      </div>
    )
  }

  // Parse specs into key-value pairs
  const specLines = product.specs ? product.specs.split('\n').filter(s => s.trim()) : []
  const specPairs = specLines.map(line => {
    const parts = line.split(/[:：]/)
    if (parts.length >= 2) {
      return { key: parts[0].trim(), value: parts.slice(1).join(':').trim() }
    }
    return { key: line.trim(), value: '' }
  })

  return (
    <div className="min-h-screen bg-light">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 h-12">
          <Link
            to="/products"
            className="flex items-center space-x-1.5 rounded-full p-2 hover:bg-gray-50 text-gray-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回</span>
          </Link>
          <button
            onClick={() => setShowSharePanel(true)}
            className="flex items-center space-x-1.5 rounded-full p-2 hover:bg-gray-50 text-gray-600 hover:text-primary-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm">分享</span>
          </button>
        </div>
      </div>

      {/* Share Panel Modal */}
      {showSharePanel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setShowSharePanel(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-5 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-dark">分享产品</h3>
              <button
                onClick={() => setShowSharePanel(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product preview */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3 mb-4">
              {product.images[0] && (
                <img
                  src={resolveImageUrl(product.images[0])}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-dark text-sm truncate">{product.name}</h4>
                <p className="text-xs text-gray-500 truncate">{product.categoryName}</p>
                <p className="text-sm text-secondary-500 font-bold">¥{product.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Share link */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1.5">产品链接</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-primary-700 text-white hover:bg-primary-800'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>复制</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native share button */}
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center space-x-2 bg-secondary-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-secondary-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>更多分享方式</span>
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              复制链接发送给好友，对方点击即可查看此产品
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Horizontal image carousel at top */}
        <div className="bg-white">
          <ImageCarousel images={product.images} productName={product.name} />
        </div>

        {/* Product basic info */}
        <div className="bg-white mt-2 p-4 space-y-3">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-block bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-medium">
                {product.categoryName}
              </span>
              {category?.logo && (
                <span className="text-xs text-gray-400">品牌: {product.categoryName}</span>
              )}
            </div>
            <h1 className="text-lg font-bold text-dark leading-tight tracking-tight">{product.name}</h1>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-secondary-500 font-bold text-2xl">¥{product.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Product description */}
        <div className="bg-white mt-2 p-4">
          <h3 className="font-semibold text-dark mb-3 flex items-center text-sm">
            <span className="w-1 h-4 bg-primary mr-2 rounded-full" />
            产品描述
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">{product.description || '暂无详细描述'}</p>
        </div>

        {/* Product specifications */}
        {specPairs.length > 0 && (
          <div className="bg-white mt-2 p-4">
            <h3 className="font-semibold text-dark mb-3 flex items-center text-sm">
              <span className="w-1 h-4 bg-primary mr-2 rounded-full" />
              规格参数
            </h3>
            <div className="bg-gray-50 rounded-2xl p-4 divide-y divide-gray-100">
              {specPairs.map((spec, index) => (
                <div key={index} className="flex items-center py-2.5 text-sm">
                  <span className="text-gray-400 w-28 flex-shrink-0">{spec.key}</span>
                  <span className="text-gray-700 flex-1">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand info */}
        {category && (
          <div className="bg-white mt-2 p-4">
            <h3 className="font-semibold text-dark mb-3 flex items-center text-sm">
              <span className="w-1 h-4 bg-primary mr-2 rounded-full" />
              品牌信息
            </h3>
            <div className="flex items-center space-x-3">
              {category.logo && (
                <img
                  src={resolveImageUrl(category.logo)}
                  alt={category.name}
                  className="w-12 h-12 object-contain rounded-lg border border-gray-100"
                />
              )}
              <div>
                <p className="font-medium text-dark text-sm">{category.name}</p>
                {category.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{category.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Image gallery - at bottom, uses detailImages */}
        {product.detailImages && product.detailImages.length > 0 && (
          <div className="mt-2">
            <ImageGallery images={product.detailImages} productName={product.name} />
          </div>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white mt-2 p-4">
            <h3 className="font-semibold text-dark mb-3 flex items-center text-sm">
              <span className="w-1 h-4 bg-primary mr-2 rounded-full" />
              同品牌推荐
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}

        <div className="h-6" />
      </div>
    </div>
  )
}
