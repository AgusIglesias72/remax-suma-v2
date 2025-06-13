// components/agent-contact-card.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, Mail, MessageCircle, User, Building, Star, Send, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  properties_count: number
  avatar?: string
  specialties?: string[]
  experience_years?: number
  rating?: number
  office?: string
}

interface AgentContactCardProps {
  agent: Agent
  propertyTitle?: string
  propertyId?: string
}

export default function AgentContactCard({ 
  agent, 
  propertyTitle = "",
  propertyId = ""
}: AgentContactCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: propertyTitle 
      ? `Hola ${agent.name}, estoy interesado en la propiedad "${propertyTitle}". Me gustaría recibir más información.`
      : `Hola ${agent.name}, me gustaría recibir información sobre sus propiedades disponibles.`
  })

  const handleWhatsApp = () => {
    const phoneNumber = agent.phone.replace(/[^\d]/g, '')
    const message = encodeURIComponent(
      propertyTitle 
        ? `Hola ${agent.name}, estoy interesado en la propiedad "${propertyTitle}". Me gustaría recibir más información.`
        : `Hola ${agent.name}, me gustaría recibir información sobre sus propiedades disponibles.`
    )
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(
      propertyTitle 
        ? `Consulta sobre: ${propertyTitle}`
        : `Consulta sobre propiedades`
    )
    const body = encodeURIComponent(formData.message)
    window.open(`mailto:${agent.email}?subject=${subject}&body=${body}`, '_blank')
  }

  const handleCall = () => {
    window.open(`tel:${agent.phone}`, '_self')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData)
    alert('¡Mensaje enviado! El agente se contactará contigo pronto.')
    setIsFormOpen(false)
  }

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
              alt={agent.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 ring-2 ring-red-100"></div>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">{agent.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building size={14} />
              <span>RE/MAX SUMA</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <User size={14} />
                <span>{agent.properties_count} propiedades</span>
              </div>
              {agent.rating && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star size={14} className="text-yellow-500" />
                  <span>{agent.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Especialidades */}
        {agent.specialties && (
          <div className="flex flex-wrap gap-1 mt-3">
            {agent.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Botones de contacto principales */}
        <div className="grid grid-cols-1 gap-3">
          <Button 
            onClick={handleWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            <MessageCircle size={18} />
            WhatsApp
          </Button>
          
          <Button 
            onClick={handleCall}
            variant="outline" 
            className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Phone size={18} />
            {agent.phone}
          </Button>
          
          <Button 
            onClick={handleEmail}
            variant="outline" 
            className="w-full gap-2"
          >
            <Mail size={18} />
            Enviar Email
          </Button>
        </div>

        <Separator />

        {/* Botón para mostrar formulario de contacto */}
        <Button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          variant="outline" 
          className="w-full gap-2"
        >
          <Send size={18} />
          {isFormOpen ? 'Cerrar formulario' : 'Enviar mensaje personalizado'}
        </Button>

        {/* Formulario de contacto expandible */}
        {isFormOpen && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-gray-800">Enviar consulta</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="text-sm"
              />
              <Input
                type="email"
                placeholder="Tu email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="text-sm"
              />
              <Input
                type="tel"
                placeholder="Tu teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="text-sm"
              />
              <Textarea
                placeholder="Tu mensaje..."
                value={formData.message}
                onChange={(e : any) => setFormData({...formData, message: e.target.value})}
                rows={4}
                required
                className="text-sm resize-none"
              />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-sm">
                <Send size={16} className="mr-2" />
                Enviar consulta
              </Button>
            </form>
          </div>
        )}

        <Separator />

        {/* Información adicional del agente */}
        <div className="space-y-3 text-sm">
          <h4 className="font-medium text-gray-800">Información del agente</h4>
          
          {agent.experience_years && (
            <div className="flex items-center gap-2 text-gray-600">
              <Star size={14} />
              <span>{agent.experience_years} años de experiencia</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-gray-600">
            <Building size={14} />
            <span>Especialista en la zona</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={14} />
            <span>Vicente López y alrededores</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} />
            <span>Disponible 7 días a la semana</span>
          </div>
        </div>

        {/* CTA final */}
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-sm text-red-700 font-medium mb-2">
            ¿Listo para conocer tu próximo hogar?
          </p>
          <p className="text-xs text-red-600">
            Contacta con {agent.name.split(' ')[0]} ahora y agenda una visita
          </p>
        </div>
      </CardContent>
    </Card>
  )
}