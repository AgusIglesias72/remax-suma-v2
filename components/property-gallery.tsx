// components/property-gallery.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Share2, Heart, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PropertyGalleryProps {
  images: string[]
  title: string
  operationType?: string
  propertyType?: string
  onShare?: () => void
  onFavorite?: () => void
  isFavorite?: boolean
}

export default function PropertyGallery({
  images,
  title,
  operationType,
  propertyType,
  onShare,
  onFavorite,
  isFavorite = false
}: PropertyGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Image src="/placeholder.svg" alt="Sin imagen" width={100} height={100} className="mx-auto mb-2" />
          <p>Sin imágenes disponibles</p>
        </div>
      </div>
    )
  }

  const goToPrevious = () => {
    setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
  }

  const goToNext = () => {
    setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
  }

  const getOperationTypeLabel = (type?: string) => {
    const map: Record<string, string> = {
      "Venta": "Venta",
      "Alquiler": "Alquiler", 
      "Alquiler Temporal": "Alquiler Temporal"
    }
    return map[type || ""] || type || "Venta"
  }

  return (
    <div className="space-y-4">
      {/* Imagen Principal */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden group">
        <Image
          src={images[selectedImageIndex]}
          alt={`${title} - Imagen ${selectedImageIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
        
        {/* Overlay con badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {operationType && (
            <Badge className="bg-red-600 text-white hover:bg-red-700">
              {getOperationTypeLabel(operationType)}
            </Badge>
          )}
          {propertyType && (
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {propertyType}
            </Badge>
          )}
        </div>

        {/* Contador de imágenes */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {selectedImageIndex + 1} / {images.length}
        </div>

        {/* Botones de acción */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-white/90 hover:bg-white"
            onClick={() => setIsModalOpen(true)}
          >
            <Maximize2 size={18} />
          </Button>
          {onShare && (
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full bg-white/90 hover:bg-white"
              onClick={onShare}
            >
              <Share2 size={18} />
            </Button>
          )}
          {onFavorite && (
            <Button
              variant="secondary"
              size="icon"
              className={`rounded-full ${
                isFavorite 
                  ? "bg-red-600 text-white hover:bg-red-700" 
                  : "bg-white/90 hover:bg-white"
              }`}
              onClick={onFavorite}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          )}
        </div>

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}

        {/* Indicadores de navegación */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedImageIndex 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={index}
              className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                index === selectedImageIndex 
                  ? "ring-2 ring-red-600 scale-105" 
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Image
                src={image}
                alt={`${title} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
              {index === 4 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-medium">
                  +{images.length - 5}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Modal de galería completa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </Button>
            
            <div className="relative max-w-6xl max-h-full">
              <Image
                src={images[selectedImageIndex]}
                alt={`${title} - Imagen ${selectedImageIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-h-[90vh]"
              />
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={goToNext}
                  >
                    <ChevronRight size={24} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}