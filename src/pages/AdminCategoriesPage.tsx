import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, ImagePlus } from 'lucide-react'
import { categoryAPI, uploadAPI } from '../api'
import { Category, CategoryRequest } from '../types'

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryRequest>({ name: '', description: '', logo: undefined })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll()
      setCategories(res.data)
    } catch (error) {
      console.error('获取分类失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ 
        name: category.name, 
        description: category.description || '',
        logo: category.logo || undefined
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', description: '', logo: undefined })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '', logo: undefined })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadAPI.image(file)
      setFormData({ ...formData, logo: res.data.url })
    } catch (error) {
      console.error('上传logo失败:', error)
    }
  }

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, formData)
      } else {
        await categoryAPI.create(formData)
      }
      handleCloseModal()
      fetchCategories()
    } catch (error) {
      console.error('保存分类失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个分类吗？删除后该分类下的所有产品也会被删除。')) {
      try {
        await categoryAPI.delete(id)
        fetchCategories()
      } catch (error) {
        console.error('删除分类失败:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark">分类管理</h1>
          <p className="text-gray-500 mt-1 text-sm">管理产品分类</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-1 sm:space-x-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>添加分类</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-20 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-20 text-center text-gray-500">
          暂无分类
        </div>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Logo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">名称</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">描述</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">创建时间</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{category.id}</td>
                    <td className="px-6 py-4">
                      {category.logo ? (
                        <img src={category.logo} alt={category.name} className="w-10 h-10 object-contain rounded-lg" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">无</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-dark">{category.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleOpenModal(category)} className="text-gray-500 hover:text-primary transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(category.id)} className="text-gray-500 hover:text-red-500 transition-colors">
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
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {category.logo ? (
                      <img src={category.logo} alt={category.name} className="w-12 h-12 object-contain rounded-lg border border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">无</span>
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-dark text-lg">{category.name}</span>
                      <span className="text-xs text-gray-400 ml-2">ID: {category.id}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2 leading-relaxed">{category.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleOpenModal(category)} className="flex items-center space-x-1 text-primary text-sm">
                      <Edit2 className="w-4 h-4" />
                      <span>编辑</span>
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="flex items-center space-x-1 text-red-500 text-sm">
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
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-dark">
                {editingCategory ? '编辑分类' : '添加分类'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">品牌Logo</label>
                <div className="flex items-center space-x-4">
                  {formData.logo ? (
                    <div className="relative">
                      <img src={formData.logo} alt="Logo" className="w-20 h-20 object-contain rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <ImagePlus className="w-6 h-6 text-gray-400" />
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  )}
                  <span className="text-sm text-gray-500">支持上传品牌Logo图片</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
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
                  {editingCategory ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
