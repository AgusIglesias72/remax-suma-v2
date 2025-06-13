// components/navbar.tsx - VERSIÓN FINAL CON FAVORITOS COMPLETOS
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell, User, Heart, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NotificationsDropdown from "@/components/notifications-dropdown"
import FavoritesDropdown from "@/components/favorites-dropdown"

// Componente de botón seguro para hidratación
function SafeButton({ 
  children, 
  onClick, 
  variant = "ghost", 
  size = "icon", 
  className = "",
  ...props 
}: any) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button 
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 w-9 ${className}`}
        disabled
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  )
}

// Componente de dropdown seguro
function SafeDropdown({ trigger, children, ...props }: any) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return trigger
  }

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/remax.webp"
              alt="REMAX SUMA Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/propiedades" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Propiedades
            </Link>
            <Link href="/vender" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Vender
            </Link>
            <Link href="/alquilar" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Alquilar
            </Link>
            <Link href="/agentes" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Agentes
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Sistema de notificaciones completo */}
            <NotificationsDropdown />

            {/* Sistema de favoritos completo */}
            <FavoritesDropdown />

            {/* Botón de usuario */}
            <SafeDropdown
              trigger={
                <SafeButton className="rounded-full">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    {mounted && (
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                        alt="Carlos Rodríguez"
                        fill
                        className="object-cover"
                      />
                    )}
                    {!mounted && (
                      <User className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
                    )}
                  </div>
                </SafeButton>
              }
            >
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                        alt="Carlos Rodríguez"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Carlos Rodríguez</p>
                      <p className="text-xs text-gray-500">Agente Inmobiliario</p>
                      <p className="text-xs text-green-600">● Online</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Sección Personal */}
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="mr-3 h-4 w-4" />
                    <div>
                      <p className="font-medium">Mi Perfil</p>
                      <p className="text-xs text-gray-500">Configuración personal</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="cursor-pointer">
                    <Heart className="mr-3 h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium">Favoritos</p>
                      <p className="text-xs text-gray-500">Propiedades guardadas</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                {/* Sección Profesional */}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                      <p className="font-medium">Dashboard</p>
                      <p className="text-xs text-gray-500">Panel de control</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/propiedades/nueva" className="cursor-pointer">
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <div>
                      <p className="font-medium">Nueva Propiedad</p>
                      <p className="text-xs text-gray-500">Publicar inmueble</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/agenda" className="cursor-pointer">
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium">Agenda</p>
                      <p className="text-xs text-gray-500">Visitas y citas</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/mensajes" className="cursor-pointer">
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div>
                      <p className="font-medium">Mensajes</p>
                      <p className="text-xs text-gray-500">Chat con clientes</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                {/* Configuración */}
                <DropdownMenuItem asChild>
                  <Link href="/perfil?tab=configuracion" className="cursor-pointer">
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Configuración</p>
                      <p className="text-xs text-gray-500">Ajustes de cuenta</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/ayuda" className="cursor-pointer">
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Ayuda</p>
                      <p className="text-xs text-gray-500">Soporte técnico</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <div>
                    <p className="font-medium">Cerrar Sesión</p>
                    <p className="text-xs opacity-75">Salir de la cuenta</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </SafeDropdown>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <SafeButton 
              onClick={() => mounted && setMobileMenuOpen(!mobileMenuOpen)}
              className=""
            >
              {mounted ? (
                mobileMenuOpen ? <X size={24} /> : <Menu size={24} />
              ) : (
                <Menu size={24} />
              )}
            </SafeButton>
          </div>
        </div>

        {/* Mobile menu */}
        {mounted && mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/propiedades"
                className="text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Propiedades
              </Link>
              <Link
                href="/vender"
                className="text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vender
              </Link>
              <Link
                href="/alquilar"
                className="text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Alquilar
              </Link>
              <Link
                href="/agentes"
                className="text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Agentes
              </Link>
              <Link
                href="/contacto"
                className="text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              
              <div className="pt-4 flex flex-col space-y-2">
                {/* Perfil */}
                <Link href="/perfil" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Mi perfil
                  </Button>
                </Link>
                
                {/* Favoritos */}
                <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="mr-2 h-4 w-4 text-red-600" />
                    Favoritos
                  </Button>
                </Link>
                
                {/* Notificaciones */}
                <Link href="/perfil?tab=notificaciones" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notificaciones
                  </Button>
                </Link>

                {/* Dashboard */}
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </Button>
                </Link>

                {/* Agenda */}
                <Link href="/agenda" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Agenda
                  </Button>
                </Link>

                {/* Publicar Propiedad */}
                <Button className="bg-red-600 hover:bg-red-700 w-full" onClick={() => setMobileMenuOpen(false)}>
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Publicar Propiedad
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}