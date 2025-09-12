"use client"

import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  MessageSquare,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Heart,
  Phone
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Stats cards data
const stats = [
  {
    title: "Propiedades Activas",
    value: "156",
    change: "+12",
    changeType: "positive",
    icon: Building2,
    description: "vs. mes anterior",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Clientes Activos",
    value: "234",
    change: "+18",
    changeType: "positive",
    icon: Users,
    description: "nuevos este mes",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Ventas del Mes",
    value: "$2.4M",
    change: "+25%",
    changeType: "positive",
    icon: DollarSign,
    description: "vs. mes anterior",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Tasa de Conversión",
    value: "8.2%",
    change: "-0.5%",
    changeType: "negative",
    icon: TrendingUp,
    description: "últimos 30 días",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

// Recent properties
const recentProperties = [
  {
    id: 1,
    title: "Casa en Palermo",
    address: "Av. Santa Fe 3421",
    price: "$450,000",
    status: "disponible",
    views: 234,
    favorites: 12,
    agent: "María García",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Departamento en Recoleta",
    address: "Callao 1234",
    price: "$280,000",
    status: "reservado",
    views: 189,
    favorites: 8,
    agent: "Juan Pérez",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "PH en San Telmo",
    address: "Defensa 567",
    price: "$320,000",
    status: "disponible",
    views: 145,
    favorites: 15,
    agent: "Carlos López",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop",
  },
]

// Upcoming appointments
const upcomingAppointments = [
  {
    id: 1,
    time: "10:00 AM",
    client: "Roberto Martínez",
    property: "Casa en Palermo",
    type: "Visita",
  },
  {
    id: 2,
    time: "12:30 PM",
    client: "Ana Rodríguez",
    property: "Depto en Belgrano",
    type: "Llamada",
  },
  {
    id: 3,
    time: "3:00 PM",
    client: "Luis González",
    property: "PH en San Telmo",
    type: "Visita",
  },
]

// Recent activities
const recentActivities = [
  {
    id: 1,
    action: "Nueva propiedad agregada",
    description: "Casa moderna en Palermo",
    time: "Hace 2 horas",
    user: "María García",
  },
  {
    id: 2,
    action: "Cliente contactado",
    description: "Roberto Martínez - Interesado en Belgrano",
    time: "Hace 4 horas",
    user: "Juan Pérez",
  },
  {
    id: 3,
    action: "Visita programada",
    description: "Ana Rodríguez - Depto en Recoleta",
    time: "Hace 5 horas",
    user: "Carlos López",
  },
  {
    id: 4,
    action: "Oferta recibida",
    description: "$275,000 por PH en San Telmo",
    time: "Hace 6 horas",
    user: "Sistema",
  },
]

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta, aquí está el resumen de tu actividad
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.changeType === "positive" ? (
                    <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Properties - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Propiedades Recientes</CardTitle>
                  <CardDescription>
                    Últimas propiedades agregadas al sistema
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center space-x-4">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-16 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{property.title}</p>
                        <Badge 
                          variant={property.status === "disponible" ? "default" : "secondary"}
                        >
                          {property.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {property.address}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {property.price}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {property.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {property.favorites}
                        </span>
                        <span>• {property.agent}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-red-600 mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Citas de Hoy</CardTitle>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date().toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium">
                        {appointment.time}
                      </span>
                      <Badge variant={appointment.type === "Visita" ? "default" : "secondary"} className="mt-1">
                        {appointment.type === "Visita" ? (
                          <Eye className="h-3 w-3 mr-1" />
                        ) : (
                          <Phone className="h-3 w-3 mr-1" />
                        )}
                        {appointment.type}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {appointment.client}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.property}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline" size="sm">
                Ver calendario completo
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Objetivos del Mes</CardTitle>
              <CardDescription>
                Progreso hacia tus metas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Ventas</span>
                  <span className="font-medium">8/10</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Visitas</span>
                  <span className="font-medium">42/50</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Nuevos Clientes</span>
                  <span className="font-medium">18/25</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Listados</span>
                  <span className="font-medium">12/15</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Building2 className="h-4 w-4 mr-2" />
                Nueva Propiedad
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Cita
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Mensaje
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}