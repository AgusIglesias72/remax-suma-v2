"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize,
  DollarSign,
  Eye,
  Edit,
  Share,
  Heart,
  Star,
  Calendar,
  Camera,
  UserCheck,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Clock,
  MoreVertical,
  Plus,
  Home,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  XCircle
} from "lucide-react"

// Datos reales de propiedades con fotos
const propiedadesData = [
  {
    id: "371336-168",
    titulo: "Departamento 2 ambientes en Microcentro",
    direccion: "Av. 9 de Julio 1234, CABA",
    precio: "USD 165,000",
    tipoOperacion: "Venta",
    tipoPropiedad: "Departamento",
    ambientes: 2,
    dormitorios: 1,
    baños: 1,
    cocheras: 0,
    superficie: 58,
    superficieCubierta: 50,
    fechaPublicacion: "2024-07-15",
    fechaActualizacion: "2024-08-12",
    estado: "Activa",
    destacada: true,
    agente: {
      id: "agustin",
      nombre: "Agustín Vera",
      equipo: "Equipo A"
    },
    imagenes: 1,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/945754cf-26c0-4220-ad20-fd3a57c9c782/860x440/88458830-c63a-44a1-962b-313a22914b49.jpg",
    visitas: 87,
    contactos: 5,
    favoritos: 12
  },
  {
    id: "371159-272",
    titulo: "Casa moderna 3 ambientes en Barrio Norte",
    direccion: "Juncal 2890, CABA",
    precio: "USD 285,000",
    tipoOperacion: "Venta",
    tipoPropiedad: "Casa",
    ambientes: 3,
    dormitorios: 2,
    baños: 2,
    cocheras: 1,
    superficie: 120,
    superficieCubierta: 95,
    fechaPublicacion: "2024-06-20",
    fechaActualizacion: "2024-08-08",
    estado: "Activa",
    destacada: false,
    agente: {
      id: "maria",
      nombre: "María González",
      equipo: "Equipo A"
    },
    imagenes: 10,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/ebfb478b-32ff-468a-a10c-8cfb06aab5ed/860x440/5dd0decd-3bd6-4dde-984a-d632dd2bc61e.jpg",
    visitas: 124,
    contactos: 18,
    favoritos: 25
  },
  {
    id: "371194-149",
    titulo: "Loft estilo industrial en San Telmo",
    direccion: "Estados Unidos 765, CABA",
    precio: "USD 198,000",
    tipoOperacion: "Venta",
    tipoPropiedad: "Loft",
    ambientes: 2,
    dormitorios: 1,
    baños: 1,
    cocheras: 0,
    superficie: 75,
    superficieCubierta: 75,
    fechaPublicacion: "2024-07-01",
    fechaActualizacion: "2024-08-10",
    estado: "Reservada",
    destacada: true,
    agente: {
      id: "carlos",
      nombre: "Carlos Rodríguez",
      equipo: "Equipo B"
    },
    imagenes: 10,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/b30b0693-ccd0-4fe4-ba49-3dd81bc3fbf1/860x440/99d7ec01-5a6e-4857-b1ec-5960ddefc2b0.jpg",
    visitas: 156,
    contactos: 22,
    favoritos: 18
  },
  {
    id: "371194-150",
    titulo: "PH con terraza en Palermo Hollywood",
    direccion: "Thames 1456, CABA",
    precio: "USD 342,000",
    tipoOperacion: "Venta",
    tipoPropiedad: "PH",
    ambientes: 3,
    dormitorios: 2,
    baños: 2,
    cocheras: 0,
    superficie: 85,
    superficieCubierta: 70,
    fechaPublicacion: "2024-06-15",
    fechaActualizacion: "2024-08-05",
    estado: "Activa",
    destacada: true,
    agente: {
      id: "ana",
      nombre: "Ana López",
      equipo: "Equipo B"
    },
    imagenes: 10,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/7e5fbc7c-3b2a-459e-8868-24b386218b31/860x440/284bd3b5-407b-4fe3-8d87-cceadd42a791.jpg",
    visitas: 203,
    contactos: 31,
    favoritos: 42
  },
  {
    id: "371269-252",
    titulo: "Departamento familiar en Belgrano",
    direccion: "Av. Cabildo 3200, CABA",
    precio: "$180,000/mes",
    tipoOperacion: "Alquiler",
    tipoPropiedad: "Departamento",
    ambientes: 4,
    dormitorios: 3,
    baños: 2,
    cocheras: 1,
    superficie: 110,
    superficieCubierta: 95,
    fechaPublicacion: "2024-07-22",
    fechaActualizacion: "2024-08-11",
    estado: "Activa",
    destacada: false,
    agente: {
      id: "agustin",
      nombre: "Agustín Vera",
      equipo: "Equipo A"
    },
    imagenes: 10,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/c2bf70ea-9f0c-4db5-8880-bd691005a5db/860x440/05ab6370-46fe-4e7e-82ae-46c8aeaedde2.jpg",
    visitas: 78,
    contactos: 9,
    favoritos: 15
  },
  {
    id: "371473-22",
    titulo: "Casa quinta en Tigre",
    direccion: "Los Troncos 890, Tigre",
    precio: "USD 420,000",
    tipoOperacion: "Venta",
    tipoPropiedad: "Casa",
    ambientes: 5,
    dormitorios: 4,
    baños: 3,
    cocheras: 2,
    superficie: 350,
    superficieCubierta: 180,
    fechaPublicacion: "2024-05-30",
    fechaActualizacion: "2024-08-07",
    estado: "Activa",
    destacada: true,
    agente: {
      id: "maria",
      nombre: "María González",
      equipo: "Equipo A"
    },
    imagenes: 9,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/54fce55b-d3a4-49cf-88e3-8d3c687f57a5/860x440/9d5c0476-b5b0-46a9-b5a5-e52f08e287ec.jpg",
    visitas: 234,
    contactos: 45,
    favoritos: 67
  },
  {
    id: "371340-39",
    titulo: "Duplex moderno en Puerto Madero",
    direccion: "Macacha Güemes 515, CABA",
    precio: "USD 650,000",
    tipoOperacion: "Venta",
    tipoPropiedad: "Duplex",
    ambientes: 4,
    dormitorios: 3,
    baños: 3,
    cocheras: 2,
    superficie: 140,
    superficieCubierta: 120,
    fechaPublicacion: "2024-06-01",
    fechaActualizacion: "2024-08-09",
    estado: "Activa",
    destacada: true,
    agente: {
      id: "carlos",
      nombre: "Carlos Rodríguez",
      equipo: "Equipo B"
    },
    imagenes: 10,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/96b0eddb-1c6f-43be-abda-a1fb98c5a425/860x440/3ebd7eb0-4df8-49e4-9a9d-4fa175d6a613.jpg",
    visitas: 312,
    contactos: 58,
    favoritos: 89
  },
  {
    id: "371298-70",
    titulo: "Monoambiente en Villa Crespo",
    direccion: "Corrientes 4890, CABA",
    precio: "$95,000/mes",
    tipoOperacion: "Alquiler",
    tipoPropiedad: "Departamento",
    ambientes: 1,
    dormitorios: 0,
    baños: 1,
    cocheras: 0,
    superficie: 32,
    superficieCubierta: 30,
    fechaPublicacion: "2024-08-01",
    fechaActualizacion: "2024-08-13",
    estado: "Pausada",
    destacada: false,
    agente: {
      id: "ana",
      nombre: "Ana López",
      equipo: "Equipo B"
    },
    imagenes: 10,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/16eb5487-916a-4888-ae8e-30bbc9db1ebc/860x440/6d5d3374-1243-4d11-af90-96f7f8dbbb73.jpg",
    visitas: 45,
    contactos: 3,
    favoritos: 8
  },
  {
    id: "371190-234",
    titulo: "Departamento con balcón en Recoleta",
    direccion: "Av. Santa Fe 2100, CABA",
    precio: "USD 298,000",
    tipoOperacion: "Venta",
    tipoPropiedad: "Departamento",
    ambientes: 3,
    dormitorios: 2,
    baños: 2,
    cocheras: 1,
    superficie: 85,
    superficieCubierta: 75,
    fechaPublicacion: "2024-07-08",
    fechaActualizacion: "2024-08-06",
    estado: "Activa",
    destacada: false,
    agente: {
      id: "agustin",
      nombre: "Agustín Vera",
      equipo: "Equipo A"
    },
    imagenes: 10,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/e8845bee-47c9-43b6-8f10-55d466709e37/860x440/74dbbec2-1d4f-49d2-9a08-ef59fe597b90.jpg",
    visitas: 167,
    contactos: 24,
    favoritos: 33
  },
  {
    id: "371561-3",
    titulo: "Penthouse con vista al río en Olivos",
    direccion: "Av. del Libertador 1890, Olivos",
    precio: "USD 780,000",
    tipoOperacion: "Venta",
    tipoPropiedad: "Penthouse",
    ambientes: 5,
    dormitorios: 4,
    baños: 4,
    cocheras: 3,
    superficie: 180,
    superficieCubierta: 150,
    fechaPublicacion: "2024-05-15",
    fechaActualizacion: "2024-08-04",
    estado: "Reservada",
    destacada: true,
    agente: {
      id: "maria",
      nombre: "María González",
      equipo: "Equipo A"
    },
    imagenes: 10,
    imagen: "https://d1acdg20u0pmxj.cloudfront.net/listings/3e26c7cd-8292-441b-9d30-771b84c198c6/860x440/ea1dece2-0879-42fd-ac1c-dd00a72c83a3.jpg",
    visitas: 389,
    contactos: 72,
    favoritos: 124
  }
]

const agentsList = [
  { id: "all", name: "Todos los agentes", role: "Global", team: "Todos" },
  { id: "agustin", name: "Agustín Vera", role: "Agente", team: "Equipo A" },
  { id: "maria", name: "María González", role: "Agente", team: "Equipo A" },
  { id: "carlos", name: "Carlos Rodríguez", role: "Team Leader", team: "Equipo B" },
  { id: "ana", name: "Ana López", role: "Agente", team: "Equipo B" },
  { id: "team-a", name: "Equipo A", role: "Equipo", team: "Todos" },
  { id: "team-b", name: "Equipo B", role: "Equipo", team: "Todos" },
]

export default function PropiedadesPage() {
  const [selectedAgent, setSelectedAgent] = useState("agustin")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipoOperacion, setFilterTipoOperacion] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  const currentAgent = agentsList.find(agent => agent.id === selectedAgent) || agentsList[0]

  const filteredProperties = propiedadesData.filter(propiedad => {
    const matchesAgent = selectedAgent === "all" || 
      propiedad.agente.id === selectedAgent ||
      (selectedAgent === "team-a" && propiedad.agente.equipo === "Equipo A") ||
      (selectedAgent === "team-b" && propiedad.agente.equipo === "Equipo B")
    
    const matchesSearch = 
      propiedad.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propiedad.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propiedad.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTipoOperacion = filterTipoOperacion === "Todos" || propiedad.tipoOperacion === filterTipoOperacion
    const matchesEstado = filterEstado === "Todos" || propiedad.estado === filterEstado
    
    return matchesAgent && matchesSearch && matchesTipoOperacion && matchesEstado
  })

  const getStatsForAgent = (agentId: string) => {
    const agentProperties = propiedadesData.filter(p => 
      agentId === "all" ? true :
      p.agente.id === agentId ||
      (agentId === "team-a" && p.agente.equipo === "Equipo A") ||
      (agentId === "team-b" && p.agente.equipo === "Equipo B")
    )
    
    return {
      total: agentProperties.length,
      activas: agentProperties.filter(p => p.estado === "Activa").length,
      pausadas: agentProperties.filter(p => p.estado === "Pausada").length,
      reservadas: agentProperties.filter(p => p.estado === "Reservada").length,
      destacadas: agentProperties.filter(p => p.destacada).length,
      totalVisitas: agentProperties.reduce((sum, p) => sum + p.visitas, 0),
      totalContactos: agentProperties.reduce((sum, p) => sum + p.contactos, 0)
    }
  }

  const stats = getStatsForAgent(selectedAgent)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Todas las Propiedades</h1>
          <p className="text-gray-600 mt-1">Gestiona tu cartera completa de propiedades</p>
        </div>
        
        {/* Agent Selector */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-64 justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>{currentAgent.name}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Seleccionar vista</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {agentsList.map((agent) => (
                <DropdownMenuItem
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.role} • {agent.team}</div>
                  </div>
                  {agent.id === selectedAgent && <CheckCircle className="h-4 w-4 text-green-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Card className="w-80">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentAgent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={currentAgent.role === 'Agente' ? 'default' : currentAgent.role === 'Team Leader' ? 'secondary' : 'outline'}>
                      {currentAgent.role.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm">{currentAgent.name}</h3>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <p>Propiedades: {stats.total}</p>
                    <p>Visitas totales: {stats.totalVisitas.toLocaleString()}</p>
                    <p>Contactos: {stats.totalContactos}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Left: Filter Buttons with Icons */}
            <div className="flex items-center space-x-2">
              <Button
                variant={filterEstado === "Activa" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterEstado(filterEstado === "Activa" ? "Todos" : "Activa")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Activas
              </Button>
              <Button
                variant={filterEstado === "Pausada" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterEstado(filterEstado === "Pausada" ? "Todos" : "Pausada")}
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Pausadas
              </Button>
              <Button
                variant={filterEstado === "Reservada" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterEstado(filterEstado === "Reservada" ? "Todos" : "Reservada")}
                className="flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Reservadas
              </Button>
              
              <Separator orientation="vertical" className="h-6 mx-2" />
              
              <Button
                variant={filterTipoOperacion === "Venta" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTipoOperacion(filterTipoOperacion === "Venta" ? "Todos" : "Venta")}
                className="flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Venta
              </Button>
              <Button
                variant={filterTipoOperacion === "Alquiler" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTipoOperacion(filterTipoOperacion === "Alquiler" ? "Todos" : "Alquiler")}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Alquiler
              </Button>

              <Separator orientation="vertical" className="h-6 mx-2" />

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Right: Search */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar en propiedades"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredProperties.map((propiedad, index) => (
              <div key={propiedad.id}>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {/* Checkbox */}
                    <input type="checkbox" className="rounded" />
                    
                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                      {propiedad.estado === "Activa" && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                      {propiedad.estado === "Pausada" && <div className="w-3 h-3 bg-yellow-500 rounded-full" />}
                      {propiedad.estado === "Reservada" && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                    </div>

                    {/* Property Image */}
                    <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      {propiedad.imagen ? (
                        <img 
                          src={propiedad.imagen} 
                          alt={propiedad.titulo}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${propiedad.imagen ? 'hidden' : ''}`}>
                        <Camera className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Publication Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">{propiedad.id}</Badge>
                        <Badge variant={propiedad.tipoOperacion === 'Venta' ? 'default' : 'secondary'} className="text-xs">
                          {propiedad.tipoOperacion.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm text-blue-600 hover:text-blue-700 cursor-pointer truncate">
                        {propiedad.titulo}
                      </h3>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-sm font-medium text-gray-900">{propiedad.estado}</div>
                      {propiedad.estado === "Reservada" && (
                        <div className="text-xs text-gray-500">Vence en 90 días</div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-gray-900">{propiedad.precio}</div>
                      {propiedad.estado === "Activa" && Math.random() > 0.5 && (
                        <div className="text-xs text-red-500 flex items-center">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          -5%
                        </div>
                      )}
                    </div>

                    {/* Client */}
                    <div className="flex-shrink-0 w-32 text-center">
                      <div className="text-sm font-medium text-gray-900">{propiedad.agente.nombre}</div>
                    </div>

                    {/* Quality Score */}
                    <div className="flex-shrink-0 text-center">
                      <div className="relative inline-flex items-center justify-center w-12 h-12">
                        <svg className="w-12 h-12" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={
                              propiedad.visitas > 150 ? "#22c55e" :
                              propiedad.visitas > 100 ? "#eab308" :
                              propiedad.visitas > 50 ? "#f97316" : "#ef4444"
                            }
                            strokeWidth="2"
                            strokeDasharray={`${(propiedad.visitas / 200) * 100}, 100`}
                          />
                        </svg>
                        <span className="absolute text-xs font-semibold">
                          {Math.round((propiedad.visitas / 200) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="w-4 h-4 mr-2" />
                            Compartir
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Estadísticas
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="w-4 h-4 mr-2" />
                            Pausar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Additional Info Row */}
                  <div className="mt-3 ml-20 flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">Completitud:</span>
                      <div className="flex items-center space-x-1">
                        {Math.random() > 0.3 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs">{Math.round(Math.random() * 30 + 70)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{propiedad.contactos}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{propiedad.visitas}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Vence en {Math.round(Math.random() * 200 + 50)} días
                    </div>
                  </div>
                </div>
                {index < filteredProperties.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades</h3>
              <p className="text-gray-600 mb-4">No se encontraron propiedades con los filtros aplicados.</p>
              <Button asChild>
                <a href="/admin/propiedades/nueva">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Nueva Propiedad
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}