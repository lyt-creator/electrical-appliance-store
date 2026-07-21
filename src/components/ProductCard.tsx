import { Link } from 'react-router-dom'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const firstImage = product.images[0] || '/placeholder.png'

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={firstImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-secondary text-white text-xs px-2 py-1 rounded-full">
          {product.categoryName}
        </div>
      </div>
      <div className="p-4">
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
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
            查看详情
          </button>
        </div>
      </div>
    </Link>
  )
}
