import { useState, useRef, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const lightboxRafRef = useRef<number | null>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Throttled scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      if (!scrollContainerRef.current) {
        rafRef.current = null
        return
      }
      const imageHeight = scrollContainerRef.current.offsetHeight
      if (imageHeight > 0) {
        const newIndex = Math.round(scrollContainerRef.current.scrollTop / imageHeight)
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex)
        }
      }
      rafRef.current = null
    })
  }, [currentIndex])

  const handleLightboxScroll = useCallback(() => {
    if (lightboxRafRef.current) return
    lightboxRafRef.current = requestAnimationFrame(() => {
      if (!lightboxRef.current) {
        lightboxRafRef.current = null
        return
      }
      const imageHeight = lightboxRef.current.offsetHeight
      if (imageHeight > 0) {
        const newIndex = Math.round(lightboxRef.current.scrollTop / imageHeight)
        if (newIndex !== lightboxIndex) {
          setLightboxIndex(newIndex)
        }
      }
      lightboxRafRef.current = null
    })
  }, [lightboxIndex])

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index)
    if (scrollContainerRef.current) {
      const imageHeight = scrollContainerRef.current.offsetHeight
      scrollContainerRef.current.scrollTo({
        top: index * imageHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  const goToLightboxImage = useCallback((index: number) => {
    setLightboxIndex(index)
    if (lightboxRef.current) {
      const imageHeight = lightboxRef.current.offsetHeight
      lightboxRef.current.scrollTo({
        top: index * imageHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  // Open lightbox at current image
  const openLightbox = () => {
    setLightboxIndex(currentIndex)
    setIsLightboxOpen(true)
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (lightboxRafRef.current) cancelAnimationFrame(lightboxRafRef.current)
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
      {/* Main gallery with CSS scroll-snap for native smooth scrolling */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="overflow-y-auto scrollbar-hide"
        style={{
          maxHeight: '75vh',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative flex items-center justify-center"
            style={{
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              height: '75vh',
            }}
            onClick={openLightbox}
          >
            <img
              src={image}
              alt={`${productName} - ${index + 1}`}
              className="w-full h-full object-contain"
              draggable={false}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                {index + 1} / {images.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="flex items-center justify-center space-x-2 py-3 bg-white border-t border-gray-100">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-secondary w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              aria-label={`查看第 ${index + 1} 张图片`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute top-4 left-4 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
          <div
            ref={lightboxRef}
            onScroll={handleLightboxScroll}
            className="flex-1 overflow-y-auto scrollbar-hide"
            style={{
              scrollSnapType: 'y mandatory',
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorY: 'contain',
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-center"
                style={{
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  height: '100vh',
                }}
              >
                <img
                  src={image}
                  alt={`${productName} - ${index + 1}`}
                  className="max-w-full max-h-screen object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-2 pb-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToLightboxImage(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === lightboxIndex ? 'bg-white w-6' : 'bg-white/40 w-2 hover:bg-white/60'
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
