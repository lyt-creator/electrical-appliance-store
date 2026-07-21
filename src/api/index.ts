import axios from 'axios'
import { Category, Product, LoginRequest, LoginResponse, CategoryRequest, ProductRequest } from '../types'

const API_BASE_URL = '/api'

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
