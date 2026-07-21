import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false)
  const firstImage = product.images[0] || '/placeholder.png'

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-4xl text-gray-300">📦</span>
          </div>
        ) : (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
            {product.categoryName}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-dark mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description || '暂无描述'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-secondary">
            ¥{product.price.toFixed(2)}
          </span>
          <span className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
            查看详情
          </span>
        </div>
      </div>
    </Link>
  )
}
