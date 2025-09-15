"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bell, Heart, User, Plus, Search, FileText } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useUser()
  const [fabOpen, setFabOpen] = useState(false)

  const navItems = [
    {
      id: "propiedades",
      href: "/propiedades",
      icon: Home,
      label: "Propiedades",
      active: pathname === "/propiedades"
    },
    {
      id: "alertas",
      href: "/alertas",
      icon: Bell,
      label: "Alertas",
      active: pathname === "/alertas",
      badge: user ? 2 : 0
    },
    {
      id: "fab",
      type: "fab",
      icon: Plus,
      label: "Publicar"
    },
    {
      id: "favorites",
      href: user ? "/favorites" : "/sign-in",
      icon: Heart,
      label: "Favoritos",
      active: pathname === "/favorites",
      badge: user ? 5 : 0
    },
    {
      id: "profile",
      href: user ? "/admin" : "/sign-in",
      icon: User,
      label: "Mi Perfil",
      active: pathname === "/admin" || pathname.startsWith("/perfil")
    }
  ]

  const fabOptions = [
    {
      href: "/propiedades/nueva",
      icon: Home,
      label: "Publicar Propiedad",
      color: "bg-blue-500"
    },
    {
      href: "/busqueda/nueva",
      icon: Search,
      label: "Publicar Búsqueda",
      color: "bg-green-500"
    }
  ]

  return (
    <>
      {/* Overlay cuando el FAB está abierto */}
      {fabOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setFabOpen(false)}
        />
      )}

      {/* Opciones del FAB */}
      <div className={cn(
        "fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 transition-all duration-300 md:hidden",
        fabOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}>
        {fabOptions.map((option, index) => (
          <Link
            key={option.href}
            href={option.href}
            onClick={() => setFabOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transform transition-all duration-300",
              option.color,
              "text-white font-medium text-sm",
              fabOpen ? "scale-100" : "scale-0",
              {
                "transition-delay-75": index === 0,
                "transition-delay-150": index === 1
              }
            )}
          >
            <option.icon className="h-5 w-5" />
            <span className="whitespace-nowrap">{option.label}</span>
          </Link>
        ))}
      </div>

      {/* Barra de navegación inferior */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-5 h-[72px]">
          {navItems.map((item) => {
            if (item.type === "fab") {
              return (
                <button
                  key={item.id}
                  onClick={() => setFabOpen(!fabOpen)}
                  className="flex flex-col items-center justify-center gap-1 relative"
                >
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white shadow-md",
                    "transform transition-all duration-300",
                    fabOpen ? "rotate-45 scale-110" : "rotate-0 scale-100"
                  )}>
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <span className="text-[9px] font-medium text-gray-500 mt-1">
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <Link
                key={item.id}
                href={item.href || "/"}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 relative cursor-pointer",
                  "transition-all duration-200",
                  item.active 
                    ? "text-red-600" 
                    : "text-gray-500 hover:text-gray-700 active:scale-95"
                )}
              >
                <div className="relative">
                  <item.icon 
                    className={cn(
                      "h-5 w-5",
                      item.active && "fill-current"
                    )} 
                    strokeWidth={item.active ? 2.5 : 2}
                  />
                  {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 min-w-[1.25rem] p-0 flex items-center justify-center text-[10px] bg-red-600 border-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "text-[9px] font-medium",
                  item.active ? "font-semibold" : ""
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}