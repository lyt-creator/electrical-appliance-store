import { useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { resolveImageUrl } from '../api'

interface ImageCarouselProps {
  images: string[]
  productName: string
}

export const ImageCarousel = ({ images, productName }: ImageCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const itemWidth = scrollRef.current.offsetWidth
    const newIndex = Math.round(scrollLeft / itemWidth)
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      })
    }
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null && lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || lightboxIndex === null) return
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchStartX.current - touchEndX
    const deltaY = touchStartY.current! - touchEndY

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        if (lightboxIndex < images.length - 1) {
          setLightboxIndex(lightboxIndex + 1)
        }
      } else {
        if (lightboxIndex > 0) {
          setLightboxIndex(lightboxIndex - 1)
        }
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">暂无图片</span>
      </div>
    )
  }

  return (
    <>
      <div className="relative bg-white">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-x-auto scrollbar-hide flex snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full snap-center relative flex items-center justify-center bg-white cursor-zoom-in"
              style={{ minHeight: '40vh' }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={resolveImageUrl(image)}
                alt={`${productName} - ${index + 1}`}
                className="w-full max-h-[55vh] object-contain"
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
      </div>

      {/* Fullscreen lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Previous button */}
          {lightboxIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
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

          {/* Next button */}
          {lightboxIndex < images.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
