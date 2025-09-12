
// components/favorite-button.tsx
// RUTA: components/favorite-button.tsx
"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import type { PropertyType } from "@/lib/types"
import { useState } from "react"

interface FavoriteButtonProps {
  property: PropertyType
  size?: "sm" | "md" | "lg"
  variant?: "icon" | "text"
  className?: string
  showText?: boolean
}

export default function FavoriteButton({ 
  property, 
  size = "md", 
  variant = "icon",
  className = "",
  showText = false
}: FavoriteButtonProps) {
  const { mounted, isFavorite, toggleFavorite } = useFavorites()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const favorite = mounted ? isFavorite(property.id) : false

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!mounted) return
    
    setIsAnimating(true)
    toggleFavorite(property)
    
    // Remover animación después de un tiempo
    setTimeout(() => setIsAnimating(false), 300)
  }

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20
  }[size]

  const buttonSize = {
    sm: "h-7 w-7",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  }[size]

  if (variant === "text") {
    return (
      <Button
        variant={favorite ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        className={`gap-2 transition-all duration-200 ${
          favorite 
            ? "bg-red-600 hover:bg-red-700 text-white" 
            : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        } ${isAnimating ? "scale-105" : ""} ${className}`}
        disabled={!mounted}
      >
        <Heart 
          size={iconSize} 
          fill={favorite ? "currentColor" : "none"}
          className={`transition-all duration-200 ${isAnimating ? "animate-pulse" : ""}`}
        />
        {showText && (favorite ? "Guardado" : "Guardar")}
      </Button>
    )
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleToggle}
      className={`${buttonSize} rounded-full transition-all duration-200 ${
        favorite 
          ? "bg-red-600 text-white hover:bg-red-700 shadow-lg" 
          : "bg-white/90 hover:bg-white hover:scale-105"
      } ${isAnimating ? "animate-bounce" : ""} ${className}`}
      disabled={!mounted}
    >
      <Heart 
        size={iconSize} 
        fill={favorite ? "currentColor" : "none"}
        className={`transition-all duration-200 ${
          favorite ? "text-white" : "text-gray-600"
        } ${isAnimating ? "scale-110" : ""}`}
      />
      <span className="sr-only">
        {favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      </span>
    </Button>
  )
}