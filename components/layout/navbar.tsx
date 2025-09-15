"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell, Heart, User, LogOut, Settings, HelpCircle, Calendar, MessageSquare, LayoutDashboard, Plus, MessageCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser, useClerk } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth/auth-modal"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState<'sign-in' | 'sign-up'>('sign-in')
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Obtener rol desde metadata de Clerk
  const userRole = user?.publicMetadata?.role as string || 'CLIENT'
  const isAgent = ['AGENT', 'TEAM_LEADER', 'OFFICE_MANAGER', 'ADMIN'].includes(userRole)

  // Formatear el rol para mostrar
  const formatRole = (role: string) => {
    const roles: Record<string, string> = {
      'CLIENT': 'Cliente',
      'AGENT': 'Agente Inmobiliario',
      'TEAM_LEADER': 'Líder de Equipo',
      'OFFICE_MANAGER': 'Gerente de Oficina',
      'ADMIN': 'Administrador'
    }
    return roles[role] || 'Cliente'
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/remax.svg"
              alt="REMAX SUMA Logo"
              width={100}
              height={35}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-8 flex-1">
            <Link href="/propiedades" className="cursor-pointer text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
              Propiedades
            </Link>
            <Link href="/vender" className="cursor-pointer text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
              Vender
            </Link>
            <Link href="/alquilar" className="cursor-pointer text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
              Alquilar
            </Link>
            <Link href="/agentes" className="cursor-pointer text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
              Agentes
            </Link>
            <Link href="/contacto" className="cursor-pointer text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
              Contacto
            </Link>
          </nav>

          {/* Acciones Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {mounted && isLoaded ? (
              user ? (
                <>
                  {/* Notificaciones */}
                  <Button variant="ghost" size="icon" className="cursor-pointer relative h-9 w-9">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      4
                    </Badge>
                  </Button>

                  {/* Favoritos */}
                  <Button variant="ghost" size="icon" className="cursor-pointer relative h-9 w-9">
                    <Heart className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      1
                    </Badge>
                  </Button>

                  {/* Mensajes/Contactos */}
                  <Button variant="ghost" size="icon" className="cursor-pointer relative h-9 w-9">
                    <MessageCircle className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      3
                    </Badge>
                  </Button>

                  {/* Dropdown de Usuario Personalizado */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="cursor-pointer h-9 w-9 rounded-full">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                          {user.imageUrl ? (
                            <Image
                              src={user.imageUrl}
                              alt={user.firstName || 'Usuario'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
                          )}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 p-0">
                      {/* Header del Usuario */}
                      <div className="flex items-center gap-3 p-4 border-b">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          {user.imageUrl ? (
                            <Image
                              src={user.imageUrl}
                              alt={user.firstName || 'Usuario'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{formatRole(userRole)}</p>
                          <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            Online
                          </p>
                        </div>
                      </div>

                      {/* Opciones del Menú */}
                      <div className="py-2">
                        <DropdownMenuItem asChild>
                          <Link href="/perfil" className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">Mi Perfil</p>
                              <p className="text-xs text-gray-500">Configuración personal</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link href="/favorites" className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
                            <Heart className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="font-medium">Favoritos</p>
                              <p className="text-xs text-gray-500">Propiedades guardadas</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
                            <LayoutDashboard className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">Dashboard</p>
                              <p className="text-xs text-gray-500">Panel de control</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        {isAgent && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href="/propiedades/nueva" className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
                                <Plus className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="font-medium">Nueva Propiedad</p>
                                  <p className="text-xs text-gray-500">Publicar inmueble</p>
                                </div>
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link href="/agenda" className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="font-medium">Agenda</p>
                                  <p className="text-xs text-gray-500">Visitas y citas</p>
                                </div>
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link href="/mensajes" className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="font-medium">Mensajes</p>
                                  <p className="text-xs text-gray-500">Chat con clientes</p>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link href="/configuracion" className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
                            <Settings className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">Configuración</p>
                              <p className="text-xs text-gray-500">Ajustes de cuenta</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link href="/ayuda" className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer">
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">Ayuda</p>
                              <p className="text-xs text-gray-500">Soporte técnico</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => signOut({ redirectUrl: '/' })}
                        >
                          <LogOut className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Cerrar Sesión</p>
                            <p className="text-xs opacity-75">Salir de la cuenta</p>
                          </div>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Botón Publicar para usuarios no autenticados */}
                  <Link href="/propiedades/nueva" className="cursor-pointer">
                    <Button size="sm" className="cursor-pointer bg-red-600 hover:bg-red-700 font-medium">
                      Publicar
                    </Button>
                  </Link>
                  
                  {/* Ícono de usuario para login/registro */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="cursor-pointer h-9 w-9 rounded-full">
                        <User className="h-5 w-5 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={() => {
                          setAuthModalView('sign-in');
                          setAuthModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <User className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="font-medium">Iniciar Sesión</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setAuthModalView('sign-up');
                          setAuthModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Plus className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="font-medium">Registrarse</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Acciones móvil - Solo notificaciones y mensajes */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <>
                {/* Notificaciones móvil */}
                <Button variant="ghost" size="icon" className="cursor-pointer relative h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-600 border-0">
                    4
                  </Badge>
                </Button>

                {/* Mensajes móvil */}
                <Button variant="ghost" size="icon" className="cursor-pointer relative h-8 w-8">
                  <MessageCircle className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-600 border-0">
                    3
                  </Badge>
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 text-xs"
                onClick={() => {
                  setAuthModalView('sign-in');
                  setAuthModalOpen(true);
                }}
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Autenticación */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </header>
  )
}