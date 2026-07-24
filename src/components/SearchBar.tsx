import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { productAPI } from '../api'
import { resolveImageUrl } from '../api'
import { Product } from '../types'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await productAPI.search(query.trim())
        setResults(res.data.slice(0, 6))
      } catch (error) {
        console.error('搜索失败:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowResults(false)
    }
  }

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`)
    setQuery('')
    setShowResults(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center bg-gray-50 rounded-full shadow-sm overflow-hidden border border-gray-200/60 focus-within:ring-2 focus-within:ring-primary-100 transition-shadow">
        <div className="pl-4">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="搜索产品名称、尺寸、规格..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          className="flex-1 px-2 py-2.5 text-sm focus:outline-none bg-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]) }}
            className="px-1.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="bg-secondary-500 hover:bg-secondary-600 text-white px-5 py-2 mr-1 text-sm font-medium rounded-full transition-colors whitespace-nowrap"
        >
          搜索
        </button>
      </form>

      {/* Search results dropdown */}
      {showResults && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-elevated border border-gray-100/60 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-400">
              <div className="w-6 h-6 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-sm">搜索中...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center space-x-3 p-3.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  {product.images[0] && (
                    <img
                      src={resolveImageUrl(product.images[0])}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-dark text-sm truncate">{product.name}</h4>
                    <p className="text-xs text-gray-400 truncate">
                      {product.categoryName} · ¥{product.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="w-full p-3 text-center text-sm text-secondary-500 hover:bg-secondary-50 transition-colors font-medium"
              >
                查看全部 "{query}" 的结果 →
              </button>
            </>
          ) : (
            <div className="p-6 text-center text-gray-400">
              <p className="text-sm">未找到相关产品</p>
              <p className="text-xs mt-1">试试搜索产品名称、品牌或规格</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
