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
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 p-3 group cursor-pointer"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-primary-50 group-hover:bg-primary-100 border border-primary-100/50 rounded-full flex items-center justify-center mb-2 transition-colors p-0.5 overflow-hidden">
          {showLogo ? (
            <img
              src={resolveImageUrl(category.logo)}
              alt={category.name}
              className="w-full h-full object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-base font-bold text-primary-700">{category.name.charAt(0)}</span>
          )}
        </div>
        <h3 className="text-xs font-medium text-dark group-hover:text-secondary-500 transition-colors tracking-wide">
          {category.name}
        </h3>
      </div>
    </Link>
  )
}
