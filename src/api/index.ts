import axios from 'axios'
import { Category, Product, LoginRequest, LoginResponse, CategoryRequest, ProductRequest, Message, MessageRequest } from '../types'

// Use Railway backend API URL when deployed on Vercel, fallback to /api for local dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const instance = axios.create({
  baseURL: API_BASE_URL,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const categoryAPI = {
  getAll: () => instance.get<Category[]>('/categories'),
  getById: (id: number) => instance.get<Category>(`/categories/${id}`),
  create: (data: CategoryRequest) => instance.post<Category>('/categories', data),
  update: (id: number, data: CategoryRequest) => instance.put<Category>(`/categories/${id}`, data),
  delete: (id: number) => instance.delete(`/categories/${id}`),
  pin: (id: number) => instance.put<Category>(`/categories/${id}/pin`),
  unpin: (id: number) => instance.put<Category>(`/categories/${id}/unpin`),
}

export const productAPI = {
  getAll: (categoryId?: number) => instance.get<Product[]>('/products', { params: { categoryId } }),
  getById: (id: number) => instance.get<Product>(`/products/${id}`),
  create: (data: ProductRequest) => instance.post<Product>('/products', data),
  update: (id: number, data: ProductRequest) => instance.put<Product>(`/products/${id}`, data),
  delete: (id: number) => instance.delete(`/products/${id}`),
  search: (keyword: string) => instance.get<Product[]>('/search', { params: { q: keyword } }),
}

export const adminAPI = {
  login: (data: LoginRequest) => instance.post<LoginResponse>('/admin/login', data),
  verify: () => instance.get('/admin/verify'),
}

export const uploadAPI = {
  image: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return instance.post<{ url: string }>('/upload', formData)
  },
}

export const messageAPI = {
  create: (data: MessageRequest) => instance.post<Message>('/messages', data),
  getAll: () => instance.get<Message[]>('/messages'),
  markAsRead: (id: number) => instance.put<Message>(`/messages/${id}/read`),
  delete: (id: number) => instance.delete(`/messages/${id}`),
}

// Helper to resolve image URLs (uploads are served from the backend)
export const resolveImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // Relative path like /uploads/xxx.jpg -> prepend backend URL
  const baseUrl = API_BASE_URL.replace('/api', '')
  return `${baseUrl}${url}`
}

// Helper to get the shareable site URL
// In production (VITE_API_URL is a full URL), use that domain for reliability
// In local dev (VITE_API_URL is '/api'), fall back to window.location.origin
export const getShareableUrl = (path: string): string => {
  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    const baseUrl = API_BASE_URL.replace(/\/api$/, '')
    return `${baseUrl}${path}`
  }
  return `${window.location.origin}${path}`
}
