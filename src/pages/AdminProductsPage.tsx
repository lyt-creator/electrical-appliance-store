import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, ImagePlus } from 'lucide-react'
import { productAPI, categoryAPI, uploadAPI } from '../api'
import { Product, ProductRequest, Category } from '../types'

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    categoryId: 1,
    price: 0,
    description: '',
    images: [],
    specs: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
      ])
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        description: product.description || '',
        images: product.images,
        specs: product.specs || '',
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        categoryId: categories[0]?.id || 1,
        price: 0,
        description: '',
        images: [],
        specs: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 1,
      price: 0,
      description: '',
      images: [],
      specs: '',
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadAPI.image(file)
      setFormData({ ...formData, images: [...formData.images, res.data.url] })
    } catch (error) {
      console.error('上传图片失败:', error)
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData)
      } else {
        await productAPI.create(formData)
      }
      handleCloseModal()
      fetchData()
    } catch (error) {
      console.error('保存产品失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个产品吗？')) {
      try {
        await productAPI.delete(id)
        fetchData()
      } catch (error) {
        console.error('删除产品失败:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark">产品管理</h1>
          <p className="text-gray-500 mt-1 text-sm">管理商城产品</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-1 sm:space-x-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>添加产品</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-20 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-20 text-center text-gray-500">
          暂无产品
        </div>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">名称</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">分类</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">价格</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">图片数</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{product.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-dark">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.categoryName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary">
                      ¥{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.images.length}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleOpenModal(product)} className="text-gray-500 hover:text-primary transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-gray-400">ID: {product.id}</span>
                      <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                        {product.categoryName}
                      </span>
                    </div>
                    <h3 className="font-bold text-dark text-base leading-snug">{product.name}</h3>
                  </div>
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg ml-3 flex-shrink-0"
                    />
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2 leading-relaxed">{product.description}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-secondary">¥{product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">{product.images.length}张图片</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleOpenModal(product)} className="flex items-center space-x-1 text-primary text-sm">
                      <Edit2 className="w-4 h-4" />
                      <span>编辑</span>
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="flex items-center space-x-1 text-red-500 text-sm">
                      <Trash2 className="w-4 h-4" />
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-dark">
                {editingProduct ? '编辑产品' : '添加产品'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">产品名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">价格</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品规格</label>
                <textarea
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="每行一个规格，例如：功率: 1000W"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品图片</label>
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`图片 ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <ImagePlus className="w-6 h-6 text-gray-400" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingProduct ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
