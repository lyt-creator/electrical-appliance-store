import { useState } from 'react'
import { X, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react'
import { messageAPI } from '../api'

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  productId?: number
  productName?: string
}

export const MessageModal = ({ isOpen, onClose, productId, productName }: MessageModalProps) => {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('请输入留言内容')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await messageAPI.create({
        name: name.trim() || undefined,
        contact: contact.trim() || undefined,
        content: content.trim(),
        productId: productId || undefined,
        productName: productName || undefined,
      })
      setSuccess(true)
      setName('')
      setContact('')
      setContent('')
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1800)
    } catch (err: any) {
      setError(err.response?.data?.error || '提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      setName('')
      setContact('')
      setContent('')
      setError('')
      setSuccess(false)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in-up"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-elevated overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-700" />
            </div>
            <h3 className="text-base font-bold text-dark">客户留言</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-base font-semibold text-dark mb-1">留言提交成功</p>
            <p className="text-sm text-gray-500">感谢您的留言，我们会尽快查看</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {/* Product context */}
            {productName && (
              <div className="flex items-center space-x-2 bg-primary-50/60 rounded-xl px-3 py-2.5">
                <span className="text-xs text-primary-700 font-medium">咨询产品:</span>
                <span className="text-xs text-gray-600 truncate">{productName}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                您的称呼 <span className="text-gray-300">(选填)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="如：张先生"
                maxLength={30}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                联系方式 <span className="text-gray-300">(选填)</span>
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="手机号或微信号，方便我们联系您"
                maxLength={50}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                留言内容 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入您想咨询或反馈的内容..."
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:border-primary-400 focus:bg-white transition-colors resize-none"
              />
              <p className="text-right text-xs text-gray-400 mt-1">{content.length}/500</p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-primary-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>提交中...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>提交留言</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              您的留言将发送给管理员，我们会在第一时间处理
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
