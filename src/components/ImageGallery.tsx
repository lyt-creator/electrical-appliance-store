import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { resolveImageUrl } from '../api'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleScroll = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      if (!scrollContainerRef.current) {
        rafRef.current = null
        return
      }
      // Since images flow with page scroll, we use scroll position relative to viewport
      rafRef.current = null
    })
  }, [])

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  // Touch handlers for swipe in lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchStartX.current - touchEndX
    const deltaY = touchStartY.current! - touchEndY

    // Only handle horizontal swipes (not vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        // Swipe left -> next
        if (lightboxIndex < images.length - 1) {
          setLightboxIndex(lightboxIndex + 1)
        }
      } else {
        // Swipe right -> prev
        if (lightboxIndex > 0) {
          setLightboxIndex(lightboxIndex - 1)
        }
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">暂无图片</span>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main gallery - flows with page scroll */}
      <div ref={scrollContainerRef} onScroll={handleScroll}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative flex items-center justify-center cursor-zoom-in"
            onClick={() => openLightbox(index)}
          >
            <img
              src={resolveImageUrl(image)}
              alt={`${productName} - ${index + 1}`}
              className="w-full"
              draggable={false}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
                {index + 1} / {images.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="flex items-center justify-center space-x-1.5 py-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-secondary w-4' : 'bg-gray-300 w-1.5 hover:bg-gray-400'
              }`}
              aria-label={`查看第 ${index + 1} 张图片`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen lightbox with horizontal swipe */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Previous arrow */}
          {lightboxIndex > 0 && (
            <button
              onClick={prevLightboxImage}
              className="absolute left-2 sm:left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <img
            src={resolveImageUrl(images[lightboxIndex])}
            alt={`${productName} - ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Next arrow */}
          {lightboxIndex < images.length - 1 && (
            <button
              onClick={nextLightboxImage}
              className="absolute right-2 sm:right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(index) }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === lightboxIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5 hover:bg-white/60'
                  }`}
                  aria-label={`查看第 ${index + 1} 张图片`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
