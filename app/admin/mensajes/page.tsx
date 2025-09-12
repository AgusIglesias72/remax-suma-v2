"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Search,
  Filter,
  Calendar,
  Clock,
  Mail,
  Phone,
  Home,
  User,
  Building2,
  MapPin,
  Eye,
  Reply,
  Archive,
  Trash2,
  Star,
  StarOff,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  MessageCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Datos mock de mensajes
const mensajesData = [
  {
    id: "1",
    tipo: "Consulta",
    fecha: "2024-08-14",
    hora: "14:30",
    nombre: "María Fernández",
    email: "maria.fernandez@email.com",
    telefono: "+54 11 1234-5678",
    origen: "Página Web",
    propiedad: {
      id: "MLS-001234",
      titulo: "Departamento 2 amb. en Palermo",
      direccion: "Av. Santa Fe 3456, CABA",
      precio: "USD 180,000",
      tipo: "Venta"
    },
    mensaje: "Hola, estoy interesada en conocer más detalles sobre este departamento. ¿Podríamos coordinar una visita? Tengo disponibilidad entre semana por las mañanas.",
    estado: "Pendiente",
    prioridad: "Alta",
    destacado: true,
    leido: false
  },
  {
    id: "2",
    tipo: "Visita",
    fecha: "2024-08-14",
    hora: "12:15",
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@gmail.com",
    telefono: "+54 11 9876-5432",
    origen: "WhatsApp",
    propiedad: {
      id: "MLS-002345",
      titulo: "Casa 4 amb. con jardín en San Isidro",
      direccion: "Belgrano 789, San Isidro",
      precio: "USD 350,000",
      tipo: "Venta"
    },
    mensaje: "Buenos días, me gustaría agendar una visita para este fin de semana. ¿Tienen disponibilidad el sábado por la tarde?",
    estado: "Respondido",
    prioridad: "Media",
    destacado: false,
    leido: true
  },
  {
    id: "3",
    tipo: "Información",
    fecha: "2024-08-14",
    hora: "10:45",
    nombre: "Ana López",
    email: "ana.lopez@hotmail.com",
    telefono: "+54 11 5555-7777",
    origen: "Mercado Libre",
    propiedad: {
      id: "MLS-003456",
      titulo: "Monoambiente en Villa Crespo",
      direccion: "Corrientes 4567, CABA",
      precio: "$120,000/mes",
      tipo: "Alquiler"
    },
    mensaje: "Consulto por las expensas y si acepta garantía propietaria. También me interesa saber sobre el estado del edificio.",
    estado: "Pendiente",
    prioridad: "Media",
    destacado: false,
    leido: false
  },
  {
    id: "4",
    tipo: "Oferta",
    fecha: "2024-08-13",
    hora: "16:20",
    nombre: "Roberto Martínez",
    email: "roberto.martinez@empresa.com",
    telefono: "+54 11 4444-3333",
    origen: "Página Web",
    propiedad: {
      id: "MLS-004567",
      titulo: "PH 3 amb. en San Telmo",
      direccion: "Defensa 123, CABA",
      precio: "USD 275,000",
      tipo: "Venta"
    },
    mensaje: "Hola, quiero hacer una oferta formal de USD 250,000 por esta propiedad. Cuento con pre-aprobación crediticia. Espero su respuesta.",
    estado: "En Proceso",
    prioridad: "Alta",
    destacado: true,
    leido: true
  },
  {
    id: "5",
    tipo: "Consulta",
    fecha: "2024-08-13",
    hora: "11:30",
    nombre: "Laura Gómez",
    email: "laura.gomez@yahoo.com",
    telefono: "+54 11 2222-8888",
    origen: "Instagram",
    propiedad: {
      id: "MLS-005678",
      titulo: "Loft en Barracas",
      direccion: "Av. Montes de Oca 890, CABA",
      precio: "$95,000/mes",
      tipo: "Alquiler"
    },
    mensaje: "Vi esta propiedad en Instagram. ¿Está disponible? Me interesa mucho el diseño industrial. ¿Cuándo podría verla?",
    estado: "Respondido",
    prioridad: "Baja",
    destacado: false,
    leido: true
  }
]

const filtrosOrigen = ["Todos", "Página Web", "WhatsApp", "Mercado Libre", "Instagram", "Email", "Teléfono"]
const filtrosEstado = ["Todos", "Pendiente", "Respondido", "En Proceso", "Archivado"]
const filtrosPrioridad = ["Todos", "Alta", "Media", "Baja"]

export default function MensajesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [filterOrigen, setFilterOrigen] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")
  const [filterPrioridad, setFilterPrioridad] = useState("Todos")
  const [currentTab, setCurrentTab] = useState("todos")
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  const filteredMessages = mensajesData.filter(mensaje => {
    const matchesSearch = 
      mensaje.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensaje.propiedad.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensaje.propiedad.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesOrigen = filterOrigen === "Todos" || mensaje.origen === filterOrigen
    const matchesEstado = filterEstado === "Todos" || mensaje.estado === filterEstado
    const matchesPrioridad = filterPrioridad === "Todos" || mensaje.prioridad === filterPrioridad
    
    const matchesTab = 
      currentTab === "todos" ||
      (currentTab === "pendientes" && mensaje.estado === "Pendiente") ||
      (currentTab === "respondidos" && mensaje.estado === "Respondido") ||
      (currentTab === "destacados" && mensaje.destacado)
    
    return matchesSearch && matchesOrigen && matchesEstado && matchesPrioridad && matchesTab
  })

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const selectAllMessages = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([])
    } else {
      setSelectedMessages(filteredMessages.map(m => m.id))
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return <Badge variant="destructive" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />Pendiente</Badge>
      case "Respondido":
        return <Badge variant="secondary" className="text-xs"><CheckCircle className="w-3 h-3 mr-1" />Respondido</Badge>
      case "En Proceso":
        return <Badge variant="default" className="text-xs"><Clock className="w-3 h-3 mr-1" />En Proceso</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{estado}</Badge>
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta": return "border-l-red-500"
      case "Media": return "border-l-yellow-500"
      case "Baja": return "border-l-green-500"
      default: return "border-l-gray-300"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Mensajes</h1>
          <p className="text-gray-600 mt-1">Gestiona todas las comunicaciones con clientes potenciales</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="h-8 text-sm">
            {mensajesData.filter(m => m.estado === "Pendiente").length} pendientes
          </Badge>
          <Button className="h-8">
            <Reply className="w-4 h-4 mr-2" />
            Responder Seleccionados
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, MLS-ID o propiedad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avanzados
              </Button>
            </div>

            {/* Filters Row */}
            <div className="flex items-center space-x-4">
              <Select value={filterOrigen} onValueChange={setFilterOrigen}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Origen" />
                </SelectTrigger>
                <SelectContent>
                  {filtrosOrigen.map(origen => (
                    <SelectItem key={origen} value={origen}>{origen}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {filtrosEstado.map(estado => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {filtrosPrioridad.map(prioridad => (
                    <SelectItem key={prioridad} value={prioridad}>{prioridad}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Mostrando {filteredMessages.length} de {mensajesData.length} mensajes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Todos ({mensajesData.length})
          </TabsTrigger>
          <TabsTrigger value="pendientes" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Pendientes ({mensajesData.filter(m => m.estado === "Pendiente").length})
          </TabsTrigger>
          <TabsTrigger value="respondidos" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Respondidos ({mensajesData.filter(m => m.estado === "Respondido").length})
          </TabsTrigger>
          <TabsTrigger value="destacados" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Destacados ({mensajesData.filter(m => m.destacado).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Lista de Mensajes</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedMessages.length === filteredMessages.length}
                    onCheckedChange={selectAllMessages}
                  />
                  <span className="text-sm text-gray-600">
                    {selectedMessages.length > 0 && `${selectedMessages.length} seleccionados`}
                  </span>
                  {selectedMessages.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm">
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredMessages.map((mensaje, index) => (
                  <div key={mensaje.id}>
                    <div 
                      className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${getPrioridadColor(mensaje.prioridad)} ${
                        !mensaje.leido ? 'bg-blue-50' : ''
                      } ${selectedMessage === mensaje.id ? 'bg-blue-100' : ''}`}
                      onClick={() => setSelectedMessage(selectedMessage === mensaje.id ? null : mensaje.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={selectedMessages.includes(mensaje.id)}
                          onCheckedChange={() => toggleMessageSelection(mensaje.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {mensaje.nombre.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900">{mensaje.nombre}</h3>
                              {mensaje.destacado && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                              {!mensaje.leido && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getEstadoBadge(mensaje.estado)}
                              <Badge variant="outline" className="text-xs">{mensaje.tipo}</Badge>
                              <span className="text-xs text-gray-500">{mensaje.fecha} • {mensaje.hora}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{mensaje.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{mensaje.telefono}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{mensaje.origen}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <Home className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm">{mensaje.propiedad.titulo}</h4>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">{mensaje.propiedad.id}</Badge>
                                    <Badge variant={mensaje.propiedad.tipo === 'Venta' ? 'default' : 'secondary'} className="text-xs">
                                      {mensaje.propiedad.tipo}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{mensaje.propiedad.direccion}</span>
                                  </div>
                                  <span className="font-medium text-green-600">{mensaje.propiedad.precio}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white border rounded-lg p-3">
                            <p className="text-sm text-gray-700 leading-relaxed">{mensaje.mensaje}</p>
                          </div>

                          {selectedMessage === mensaje.id && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button size="sm">
                                    <Reply className="w-4 h-4 mr-2" />
                                    Responder
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(`tel:${mensaje.telefono}`, '_self')}
                                  >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Llamar
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      const phoneNumber = mensaje.telefono.replace(/[^0-9]/g, '')
                                      const message = `Hola ${mensaje.nombre}, te escribo desde RE/MAX SUMA en relación a tu consulta sobre la propiedad "${mensaje.propiedad.titulo}".`
                                      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
                                    }}
                                    className="bg-green-600 text-white hover:bg-green-700"
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    WhatsApp
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver Propiedad
                                  </Button>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Star className="w-4 h-4 mr-2" />
                                      Destacar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Archive className="w-4 h-4 mr-2" />
                                      Archivar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Send className="w-4 h-4 mr-2" />
                                      Reenviar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < filteredMessages.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              {filteredMessages.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
                  <p className="text-gray-600">No se encontraron mensajes con los filtros aplicados.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}