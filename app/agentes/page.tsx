import Image from "next/image"
import { Construction, Users, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import Link from "next/link"

export default function AgentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-gray-600 hover:text-red-600 mb-6">
                <ArrowLeft size={16} className="mr-2" /> Volver al inicio
              </Link>
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Construction className="text-red-600" size={48} />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Página de Agentes</h1>
              <p className="text-xl text-gray-600 mb-8">Estamos trabajando para traerte la mejor experiencia</p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="text-yellow-600" size={24} />
                  </div>
                  <CardTitle className="text-lg">En Desarrollo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Estamos desarrollando una experiencia completa para conocer a nuestros agentes inmobiliarios.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <CardTitle className="text-lg">Equipo Profesional</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Contamos con {25} agentes especializados en diferentes zonas de Buenos Aires.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Construction className="text-green-600" size={24} />
                  </div>
                  <CardTitle className="text-lg">Próximamente</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Muy pronto podrás ver perfiles detallados, especialidades y contactar directamente con cada agente.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl">¿Qué encontrarás próximamente?</CardTitle>
                <CardDescription>La página de agentes incluirá todas estas funcionalidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="font-semibold mb-3 text-red-600">Perfiles Detallados</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Información personal y profesional</li>
                      <li>• Especialidades por zona</li>
                      <li>• Años de experiencia</li>
                      <li>• Certificaciones y logros</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-red-600">Funcionalidades</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Contacto directo por WhatsApp</li>
                      <li>• Calendario de disponibilidad</li>
                      <li>• Propiedades a cargo</li>
                      <li>• Valoraciones de clientes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Preview */}
            <div className="bg-white rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Conoce a algunos de nuestros agentes</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { name: "Roberto Raffo", properties: 8 },
                  { name: "Enriqueta Ure", properties: 6 },
                  { name: "Miguel Halife", properties: 12 },
                  { name: "Alejandro Marzilio", properties: 4 },
                  { name: "María González", properties: 15 },
                ].map((agent, index) => (
                  <div key={index} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <Image
                        src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt={agent.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-sm">{agent.name}</h3>
                    <p className="text-xs text-gray-500">{agent.properties} propiedades</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Mientras tanto, puedes explorar nuestras propiedades o contactarnos directamente
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/propiedades">
                  <Button className="bg-red-600 hover:bg-red-700">Ver Propiedades</Button>
                </Link>
                <Link href="/contacto">
                  <Button variant="outline">Contactar</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
