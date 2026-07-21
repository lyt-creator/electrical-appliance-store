import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Category } from '../types'
import { resolveImageUrl } from '../api'

interface CategoryCardProps {
  category: Category
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const [logoError, setLogoError] = useState(false)

  const showLogo = category.logo && !logoError

  return (
    <Link
      to={`/categories/${category.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 group cursor-pointer"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors p-2 overflow-hidden">
          {showLogo ? (
            <img
              src={resolveImageUrl(category.logo)}
              alt={category.name}
              className="w-full h-full object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-3xl font-bold text-primary">{category.name.charAt(0)}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-dark mb-2 group-hover:text-secondary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  )
}
