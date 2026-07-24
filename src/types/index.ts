export interface Category {
  id: number
  name: string
  logo?: string
  description?: string
  pinned?: boolean
  pinnedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  categoryId: number
  categoryName: string
  name: string
  price: number
  description?: string
  images: string[]
  detailImages?: string[]
  specs?: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
  }
}

export interface CategoryRequest {
  name: string
  logo?: string
  description?: string
}

export interface ProductRequest {
  name: string
  categoryId: number
  price: number
  description?: string
  images: string[]
  detailImages?: string[]
  specs?: string
}
