// components/coming-soon.tsx
import Link from "next/link"
import { Construction, ArrowLeft, Calendar, Bell, Users, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ComingSoonProps {
  title: string
  description: string
  expectedDate?: string
  features?: string[]
  contactInfo?: {
    name: string
    phone: string
    email: string
  }
}

export default function ComingSoon({ 
  title, 
  description, 
  expectedDate,
  features = [],
  contactInfo 
}: ComingSoonProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Icono principal animado */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-yellow-200 to-orange-100 rounded-full animate-pulse delay-75"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-yellow-300 to-orange-200 rounded-full animate-pulse delay-150"></div>
              <div className="absolute inset-12 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-full flex items-center justify-center">
                <Construction className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <Badge className="bg-yellow-100 text-yellow-800 mb-4">
            <Construction className="w-3 h-3 mr-1" />
            En Construcción
          </Badge>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          
          {expectedDate && (
            <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Disponible: {expectedDate}</span>
            </div>
          )}
        </div>

        {/* Características que vendrán */}
        {features.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                ¿Qué encontrarás próximamente?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de contacto */}
        {contactInfo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                ¿Necesitas ayuda ahora?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Mientras trabajamos en esta sección, puedes contactar directamente con {contactInfo.name}:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`tel:${contactInfo.phone}`}>
                    <Button className="bg-green-600 hover:bg-green-700 gap-2 w-full sm:w-auto">
                      <Phone className="w-4 h-4" />
                      {contactInfo.phone}
                    </Button>
                  </Link>
                  <Link href={`mailto:${contactInfo.email}`}>
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                      <Bell className="w-4 h-4" />
                      {contactInfo.email}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navegación alternativa */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Mientras tanto, puedes explorar otras secciones:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/propiedades">
              <Button className="bg-red-600 hover:bg-red-700">
                Ver Propiedades
              </Button>
            </Link>
            <Link href="/buscar-ubicacion">
              <Button variant="outline">
                Buscar por Zona
              </Button>
            </Link>
          </div>
          
          <div className="pt-8">
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}