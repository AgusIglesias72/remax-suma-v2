// app/not-found.tsx

"use client"
import Link from "next/link"
import Image from "next/image"
import { Home, Search, MapPin, ArrowLeft, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header con ilustración */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              {/* Ilustración de casa perdida */}
              <div className="w-48 h-48 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-50 rounded-full opacity-20"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-red-200 to-red-100 rounded-full opacity-40"></div>
                <div className="absolute inset-16 bg-gradient-to-br from-red-300 to-red-200 rounded-full opacity-60"></div>
                <div className="absolute inset-20 bg-red-500 rounded-full flex items-center justify-center">
                  <Home className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              4<span className="text-red-600">0</span>4
            </h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              ¡Ups! Esta página no existe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Parece que la página que buscas se mudó sin avisar o está en construcción. 
              Pero no te preocupes, tenemos muchas otras propiedades increíbles esperándote.
            </p>
          </div>

          {/* Opciones de navegación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
           
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Página Principal
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Vuelve al inicio y descubre todo lo que tenemos para ti
                  </p>
                </CardContent>
              </Link>
            </Card> <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/propiedades">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                    <Search className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Buscar Propiedades
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Explora nuestro catálogo completo de propiedades disponibles
                  </p>
                </CardContent>
              </Link>
            </Card>


          </div>

          {/* Propiedades destacadas */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Mientras tanto, mira estas propiedades destacadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
                  title: "Departamento en Palermo",
                  price: "$450.000",
                  location: "Palermo, CABA"
                },
                {
                  image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
                  title: "Casa en Vicente López",
                  price: "$890.000",
                  location: "Vicente López, BA"
                },
                {
                  image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
                  title: "Loft en Puerto Madero",
                  price: "$320.000",
                  location: "Puerto Madero, CABA"
                }
              ].map((property, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{property.title}</h4>
                  <p className="text-red-600 font-bold mb-1">{property.price}</p>
                  <p className="text-gray-600 text-sm flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {property.location}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/propiedades">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                  Ver Todas las Propiedades
                </Button>
              </Link>
            </div>
          </div>

          {/* Contacto de ayuda */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Necesitas ayuda para encontrar algo específico?
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Nuestro equipo de expertos está aquí para ayudarte a encontrar 
                la propiedad perfecta. No dudes en contactarnos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="tel:+541112345000">
                  <Button variant="outline" className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50">
                    <Phone className="w-4 h-4" />
                    +54 11 1234-5000
                  </Button>
                </Link>
                <Link href="mailto:info@remaxsuma.com">
                  <Button variant="outline" className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50">
                    <Mail className="w-4 h-4" />
                    info@remaxsuma.com
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Botón volver */}
          <div className="text-center mt-12">
            <Button 
              onClick={() => window.history.back()} 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la página anterior
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}