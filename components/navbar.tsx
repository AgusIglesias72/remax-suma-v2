"use client"

import { useState } from "react"
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

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/propiedades" className="text-gray-700 hover:text-red-600 font-medium">
              Propiedades
            </Link>
            <Link href="/vender" className="text-gray-700 hover:text-red-600 font-medium">
              Vender
            </Link>
            <Link href="/alquilar" className="text-gray-700 hover:text-red-600 font-medium">
              Alquilar
            </Link>
            <Link href="/agentes" className="text-gray-700 hover:text-red-600 font-medium">
              Agentes
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-red-600 font-medium">
              Contacto
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <NotificationsDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Favoritos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  <DropdownMenuItem>
                    <Link href="/propiedades/1" className="flex items-center w-full">
                      <div className="relative w-10 h-10 mr-2">
                        <Image
                          src="https://d1acdg20u0pmxj.cloudfront.net/listings/4380d021-7286-43e5-91d2-414fee04e082/860x440/b866798b-e39b-4cfb-b172-21b2a25137db.webp"
                          alt="Propiedad"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium">Departamento en Vicente Lopez</p>
                        <p className="text-xs text-red-600">USD 1,000</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/propiedades/2" className="flex items-center w-full">
                      <div className="relative w-10 h-10 mr-2">
                        <Image
                          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=860&h=440&fit=crop"
                          alt="Propiedad"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium">Departamento Dúplex en Colegiales</p>
                        <p className="text-xs text-red-600">USD 760,000</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil?tab=favoritos" className="cursor-pointer justify-center text-red-600">
                    Ver todos los favoritos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Usuario"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil?tab=favoritos" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favoritos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/propiedades/nueva" className="cursor-pointer">
                    <span>Publicar propiedad</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
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
                <Link href="/perfil" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Mi perfil
                  </Button>
                </Link>
                <Link href="/perfil?tab=favoritos" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="mr-2 h-4 w-4" />
                    Favoritos
                  </Button>
                </Link>
                <Link href="/perfil?tab=notificaciones" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notificaciones
                  </Button>
                </Link>
                <Button className="bg-red-600 hover:bg-red-700 w-full">Publicar Propiedad</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
