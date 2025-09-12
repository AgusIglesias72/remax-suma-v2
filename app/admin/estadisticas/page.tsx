"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Home,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  ChevronDown,
  Building,
  UserCheck,
  Briefcase,
  Star
} from "lucide-react"

// Datos mock mejorados basados en las imágenes - Gráfico comodín
const comodinData = [
  { name: 'Ene', actual: 3, objetivo: 3 },
  { name: 'Feb', actual: 3, objetivo: 3 },
  { name: 'Mar', actual: 0, objetivo: 0 },
  { name: 'Abr', actual: 3, objetivo: 3 },
  { name: 'May', actual: 1, objetivo: 4 },
  { name: 'Jun', actual: 1, objetivo: 2 },
  { name: 'Jul', actual: 3, objetivo: 3 },
  { name: 'Ago', actual: 5, objetivo: 5 },
]

const monthlyVisitorsData = [
  { name: 'Ene', visitors: 82, mobile: 45, desktop: 37 },
  { name: 'Feb', visitors: 123, mobile: 68, desktop: 55 },
  { name: 'Mar', visitors: 98, mobile: 52, desktop: 46 },
  { name: 'Abr', visitors: 67, mobile: 35, desktop: 32 },
  { name: 'May', visitors: 89, mobile: 48, desktop: 41 },
  { name: 'Jun', visitors: 105, mobile: 58, desktop: 47 },
]

const dailyVisitorsData = Array.from({length: 30}, (_, i) => ({
  day: `${i + 1}`,
  visitors: Math.floor(Math.random() * 100) + 50,
  date: `Jun ${i + 1}`
}))

const pieData = [
  { name: 'Desktop', value: 24828, color: '#3b82f6' },
  { name: 'Mobile', value: 25010, color: '#06b6d4' },
  { name: 'Tablet', value: 8500, color: '#8b5cf6' },
  { name: 'Others', value: 3200, color: '#f59e0b' },
]

const operationTypeData = [
  { name: 'Alquiler', value: 65, color: '#22c55e' },
  { name: 'Venta', value: 35, color: '#ef4444' },
]

const kpisData = [
  {
    title: "Nuevas Captaciones",
    value: "8",
    change: "+60%",
    trend: "up",
    icon: Home,
    target: "10",
    description: "Meta mensual"
  },
  {
    title: "Cartera Activa", 
    value: "42",
    change: "+5%",
    trend: "up", 
    icon: Briefcase,
    target: "45",
    description: "Propiedades en cartera"
  },
  {
    title: "Porcentaje Exclusividad",
    value: "85%",
    change: "+3%",
    trend: "up",
    icon: Star,
    target: "90%", 
    description: "Exclusivas vs compartidas"
  },
  {
    title: "Puntas de Reservas",
    value: "5",
    change: "+67%",
    trend: "up",
    icon: Target,
    target: "6",
    description: "Reservas concretadas"
  },
  {
    title: "Puntas Canceladas",
    value: "1",
    change: "-50%", 
    trend: "up",
    icon: XCircle,
    target: "<2",
    description: "Reservas perdidas"
  },
  {
    title: "Visitas Programadas",
    value: "24",
    change: "+20%",
    trend: "up",
    icon: Users,
    target: "30",
    description: "Visitas del mes"
  },
]

const agentsList = [
  { id: "agustin", name: "Agustín Vera", role: "Agente", team: "Equipo A" },
  { id: "maria", name: "María González", role: "Agente", team: "Equipo A" },
  { id: "carlos", name: "Carlos Rodríguez", role: "Team Leader", team: "Equipo B" },
  { id: "ana", name: "Ana López", role: "Agente", team: "Equipo B" },
  { id: "team-a", name: "Equipo A", role: "Equipo", team: "Todos" },
  { id: "team-b", name: "Equipo B", role: "Equipo", team: "Todos" },
  { id: "all", name: "Todos los agentes", role: "Global", team: "Todos" },
]

const COLORS = {
  primary: '#3b82f6',
  secondary: '#06b6d4', 
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  purple: '#8b5cf6',
  indigo: '#6366f1',
  pink: '#ec4899',
  gradient: {
    blue: ['#3b82f6', '#1d4ed8'],
    green: ['#22c55e', '#15803d'],
    purple: ['#8b5cf6', '#7c3aed'],
    orange: ['#f59e0b', '#d97706'],
  }
}

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function EstadisticasPage() {
  const [selectedAgent, setSelectedAgent] = useState("agustin")
  const [operationType, setOperationType] = useState("total")
  const [selectedMetric, setSelectedMetric] = useState("Puntas cerradas (Cant.)")

  const currentAgent = agentsList.find(agent => agent.id === selectedAgent) || agentsList[0]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas - Dashboard</h1>
          <p className="text-gray-600 mt-1">Panel de métricas y rendimiento inmobiliario</p>
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
                    <p>Ticket Promedio: 63.333</p>
                    <p>Ranking Red: 2079</p>
                    <p>Ranking Oficina: 85</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Operation Type Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={operationType} onValueChange={setOperationType} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="total" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Total
              </TabsTrigger>
              <TabsTrigger value="alquiler" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Alquiler
              </TabsTrigger>
              <TabsTrigger value="venta" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Venta
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpisData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      kpi.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' ? 
                        <TrendingUp className="h-4 w-4" /> : 
                        <TrendingDown className="h-4 w-4" />
                      }
                      <span className="text-sm font-medium">{kpi.change}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Meta: {kpi.target}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{kpi.description}</span>
                    <span>{Math.round((parseInt(kpi.value.replace(/[^0-9]/g, '')) / parseInt(kpi.target.replace(/[^0-9]/g, ''))) * 100)}%</span>
                  </div>
                  <Progress 
                    value={Math.round((parseInt(kpi.value.replace(/[^0-9]/g, '')) / parseInt(kpi.target.replace(/[^0-9]/g, ''))) * 100)} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Chart */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Visitantes por mes</CardTitle>
                <CardDescription>Enero - Junio 2024</CardDescription>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+5.2% este mes</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              Mostrando total de visitantes por los últimos 6 meses
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyVisitorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="visitors" 
                  fill="url(#blueGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#93c5fd" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Horizontal Bar Chart */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Distribución por Dispositivo</CardTitle>
                <CardDescription>Enero - Junio 2024</CardDescription>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+5.2% este mes</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              Mostrando total de visitantes por los últimos 6 meses
            </div>
            <div className="space-y-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.value.toLocaleString()}</div>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${(item.value / Math.max(...pieData.map(d => d.value))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Multiple Series Chart */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Desktop vs Mobile</CardTitle>
                <CardDescription>Enero - Junio 2024</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">24.828</div>
                <div className="text-sm text-gray-500">Desktop</div>
                <div className="text-2xl font-bold mt-2">25.010</div>
                <div className="text-sm text-gray-500">Mobile</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              Mostrando total de visitantes por los últimos 6 meses
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyVisitorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="desktop" 
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="mobile" 
                  fill={COLORS.secondary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Distribución Alquiler vs Venta</CardTitle>
                <CardDescription>Enero - Junio 2024</CardDescription>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+5.2% este mes</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              Mostrando distribución de operaciones por los últimos 6 meses
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={operationTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {operationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {operationTypeData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Comodín */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Gráfico comodín</CardTitle>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span className="text-sm">Actual</span>
                  <div className="w-4 h-4 bg-secondary rounded"></div>
                  <span className="text-sm">Objetivo</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Puntas cerradas (Cant.)">Puntas cerradas (Cant.)</SelectItem>
                  <SelectItem value="Nuevas captaciones">Nuevas captaciones</SelectItem>
                  <SelectItem value="Cartera activa">Cartera activa</SelectItem>
                  <SelectItem value="Porcentaje exclusividad">Porcentaje exclusividad</SelectItem>
                  <SelectItem value="Puntas de reservas">Puntas de reservas</SelectItem>
                  <SelectItem value="Puntas canceladas ($)">Puntas canceladas ($)</SelectItem>
                  <SelectItem value="Puntas canceladas (Cant.)">Puntas canceladas (Cant.)</SelectItem>
                </SelectContent>
              </Select>
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
                        <Badge className="bg-red-100 text-red-600">
                          AGENTE
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm">{currentAgent.name}</h3>
                      <div className="text-xs text-gray-600 space-y-0.5">
                        <p>Ticket Promedio: 63.333</p>
                        <p>Ranking Red: 2079</p>
                        <p>Ranking Oficina: 85</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comodinData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="actual" 
                fill={COLORS.primary}
                radius={[4, 4, 0, 0]}
                name="Actual"
              />
              <Bar 
                dataKey="objetivo" 
                fill={COLORS.secondary}
                radius={[4, 4, 0, 0]}
                name="Objetivo"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}