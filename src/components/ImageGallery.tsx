import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollContainerRef.current && images.length > 1) {
      const imageHeight = scrollContainerRef.current.offsetHeight
      scrollContainerRef.current.scrollTo({
        top: currentIndex * imageHeight,
        behavior: 'auto',
      })
    }
  }, [currentIndex, images.length])

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const imageHeight = scrollContainerRef.current.offsetHeight
    const scrollTop = scrollContainerRef.current.scrollTop
    const newIndex = Math.round(scrollTop / imageHeight)
    setCurrentIndex(newIndex)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
    if (scrollContainerRef.current) {
      const imageHeight = scrollContainerRef.current.offsetHeight
      scrollContainerRef.current.scrollTo({
        top: index * imageHeight,
        behavior: 'auto',
      })
    }
  }

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">暂无图片</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="overflow-y-auto scroll-smooth -ms-overflow-style: none scrollbar-hide"
        style={{ maxHeight: '75vh', overscrollBehaviorY: 'contain' }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative flex items-center justify-center py-2"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={image}
              alt={`${productName} - ${index + 1}`}
              className="w-full h-auto object-contain"
              draggable={false}
              style={{ maxHeight: '75vh' }}
            />
            {images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {index + 1} / {images.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center space-x-2 py-3 bg-white border-t border-gray-100">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-secondary w-6' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col" onClick={() => setIsLightboxOpen(false)}>
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute top-4 right-4 text-white/70 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
          <div
            className="flex-1 overflow-y-auto scroll-smooth"
            onClick={(e) => e.stopPropagation()}
            style={{ overscrollBehaviorY: 'contain' }}
          >
            {images.map((image, index) => (
              <div key={index} className="flex items-center justify-center py-4">
                <img
                  src={image}
                  alt={`${productName} - ${index + 1}`}
                  className="max-w-full max-h-screen object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
