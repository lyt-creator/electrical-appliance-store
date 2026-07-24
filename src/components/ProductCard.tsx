import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../types'
import { resolveImageUrl } from '../api'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false)
  const firstImage = resolveImageUrl(product.images[0]) || '/placeholder.png'

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-4xl text-gray-300">📦</span>
          </div>
        ) : (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="inline-block bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full text-xs font-medium">
            {product.categoryName}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-dark mb-1 line-clamp-1 tracking-tight group-hover:text-secondary-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2.5 line-clamp-1">
          {product.description || '暂无描述'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-base text-secondary-500 font-bold">
            ¥{product.price.toFixed(2)}
          </span>
          <span className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-1 rounded-full text-xs transition-colors">
            详情
          </span>
        </div>
      </div>
    </Link>
  )
}
