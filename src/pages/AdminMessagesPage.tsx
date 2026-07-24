import { useState, useEffect } from 'react'
import { MessageSquare, Trash2, CheckCheck, Mail, MailOpen, Phone, Package, RefreshCw } from 'lucide-react'
import { messageAPI } from '../api'
import { Message } from '../types'

function formatTime(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

export const AdminMessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await messageAPI.getAll()
      setMessages(res.data)
    } catch (error) {
      console.error('获取留言失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await messageAPI.markAsRead(id)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条留言吗？')) return
    try {
      await messageAPI.delete(id)
      setMessages(prev => prev.filter(m => m.id !== id))
    } catch (error) {
      console.error('删除留言失败:', error)
    }
  }

  const handleMarkAllRead = async () => {
    const unread = messages.filter(m => !m.isRead)
    for (const msg of unread) {
      try {
        await messageAPI.markAsRead(msg.id)
      } catch (error) {
        console.error('标记已读失败:', error)
      }
    }
    setMessages(prev => prev.map(m => ({ ...m, isRead: true })))
  }

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.isRead
    if (filter === 'read') return m.isRead
    return true
  })

  const unreadCount = messages.filter(m => !m.isRead).length

  const filterTabs = [
    { key: 'all' as const, label: '全部', count: messages.length },
    { key: 'unread' as const, label: '未读', count: unreadCount },
    { key: 'read' as const, label: '已读', count: messages.length - unreadCount },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark tracking-tight">留言管理</h1>
          <p className="text-gray-500 mt-1">
            管理客户留言
            {unreadCount > 0 && (
              <span className="ml-2 text-red-500 font-medium">{unreadCount} 条未读</span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center space-x-1.5 bg-primary-50 text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              <span>全部已读</span>
            </button>
          )}
          <button
            onClick={fetchMessages}
            className="flex items-center space-x-1.5 bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>刷新</span>
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center space-x-1 bg-white rounded-xl p-1 shadow-soft w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-primary-700 text-white shadow-soft'
                : 'text-gray-500 hover:text-dark hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === tab.key ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-soft skeleton h-32" />
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-400">
            {filter === 'unread' ? '暂无未读留言' : filter === 'read' ? '暂无已读留言' : '暂无留言'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl shadow-soft p-5 transition-all hover:shadow-card-hover border-l-4 ${
                msg.isRead ? 'border-transparent' : 'border-secondary-500'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    msg.isRead ? 'bg-gray-100 text-gray-400' : 'bg-primary-50 text-primary-700'
                  }`}>
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-dark text-sm">{msg.name}</span>
                      {!msg.isRead && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">新</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-400 mt-0.5">
                      <span>{formatTime(msg.createdAt)}</span>
                      {msg.contact && (
                        <span className="flex items-center space-x-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{msg.contact}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                      title="标记为已读"
                    >
                      <MailOpen className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="删除留言"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product context */}
              {msg.productName && (
                <div className="flex items-center space-x-1.5 bg-primary-50/50 rounded-lg px-3 py-1.5 mb-3">
                  <Package className="w-3.5 h-3.5 text-primary-600" />
                  <span className="text-xs text-primary-700 font-medium">咨询产品:</span>
                  <span className="text-xs text-gray-600">{msg.productName}</span>
                </div>
              )}

              {/* Message content */}
              <div className="flex items-start space-x-2">
                {msg.isRead ? (
                  <MailOpen className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                ) : (
                  <Mail className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm text-gray-600 leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
