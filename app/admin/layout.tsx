"use client"

import * as React from "react"
import { 
  Home, 
  Building2, 
  Users, 
  MessageSquare, 
  Calendar,
  BarChart3,
  Settings,
  FileText,
  Bell,
  MapPin,
  DollarSign,
  UserPlus,
  Key,
  TrendingUp,
  Search,
  ChevronRight,
  PlusCircle,
  LogOut,
  Target,
  Filter,
  Shuffle,
  Wrench,
  Star,
  ClipboardList,
  User,
  CreditCard,
  HelpCircle,
  MoreVertical,
  Check,
  Clock,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUser, useClerk } from "@clerk/nextjs"
import Image from "next/image"
// ... resto de imports de UI components ...
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Menú principal para administradores y agentes
const mainNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
    label: "Principal",
  },
  {
    title: "Propiedades",
    icon: Building2,
    items: [
      {
        title: "Todas las Propiedades",
        href: "/admin/propiedades",
        icon: Search,
      },
      {
        title: "Nueva Propiedad",
        href: "/admin/propiedades/nueva",
        icon: PlusCircle,
        label: "Agregar",
      },
      {
        title: "Mis Listados",
        href: "/admin/propiedades/mis-listados",
        icon: Key,
      },
      {
        title: "Pendientes",
        href: "/admin/propiedades/pendientes",
        icon: FileText,
        badge: "3",
      },
    ],
  },
  {
    title: "Clientes",
    icon: Users,
    items: [
      {
        title: "Lista de Clientes",
        href: "/admin/clientes",
        icon: Users,
      },
      {
        title: "Nuevo Cliente",
        href: "/admin/clientes/nuevo",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Búsqueda",
    icon: Search,
    items: [
      {
        title: "Búsqueda Activa",
        href: "/admin/busqueda/activa",
        icon: Target,
      },
      {
        title: "Búsqueda Avanzada",
        href: "/admin/busqueda/avanzada",
        icon: Filter,
      },
      {
        title: "Matcher",
        href: "/admin/busqueda/matcher",
        icon: Shuffle,
      },
    ],
  },
  {
    title: "Herramientas",
    icon: Wrench,
    items: [
      {
        title: "ACM - Cotizador",
        href: "/admin/acm",
        icon: TrendingUp,
        label: "Nuevo",
      },
      {
        title: "Referidos",
        href: "/admin/herramientas/referidos",
        icon: Users,
      },
      {
        title: "Solicitud de Visitas",
        href: "/admin/herramientas/visitas",
        icon: Calendar,
      },
      {
        title: "Rating de Agentes",
        href: "/admin/herramientas/rating",
        icon: Star,
      },
    ],
  },
  {
    title: "Calendario",
    href: "/admin/calendario",
    icon: Calendar,
    label: "Agenda",
  },
  {
    title: "Estadísticas",
    icon: BarChart3,
    items: [
      {
        title: "Resumen General",
        href: "/admin/estadisticas",
        icon: TrendingUp,
      },
      {
        title: "Ventas",
        href: "/admin/estadisticas/ventas",
        icon: DollarSign,
      },
      {
        title: "Zonas",
        href: "/admin/estadisticas/zonas",
        icon: MapPin,
      },
    ],
  },
]

// Menú secundario (solo mensajes)
const secondaryNavItems = [
  {
    title: "Mensajes",
    href: "/admin/mensajes",
    icon: MessageSquare,
    badge: "12",
  },
]

// Opciones del final (configuración y reportes)
const bottomNavItems = [
  {
    title: "Reportes",
    href: "/admin/reportes",
    icon: ClipboardList,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
]

// Componente para el Header del Sidebar que responde al estado colapsado
function SidebarHeaderContent() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (isCollapsed) {
    return null // Header vacío cuando está colapsado
  }

  return (
    <Link href="/admin" className="flex items-center gap-3">
      <div className="relative h-8 w-8 flex-shrink-0">
        <Image
          src="/remax.svg"
          alt="RE/MAX"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-red-600">RE/MAX SUMA</span>
        <span className="text-xs text-muted-foreground">Panel Admin</span>
      </div>
    </Link>
  )
}

// Componente para el Footer del Sidebar que responde al estado colapsado
function SidebarFooterContent() {
  const { state } = useSidebar()
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const isCollapsed = state === "collapsed"

  // Obtener iniciales del usuario
  const initials = user ? 
    `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 
    user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 
    'U' 
    : 'U'

  // Obtener rol desde metadata
  const userRole = user?.publicMetadata?.role as string || 'CLIENT'
  const roleDisplay = {
    'CLIENT': 'Cliente',
    'AGENT': 'Agente',
    'TEAM_LEADER': 'Líder de Equipo',
    'OFFICE_MANAGER': 'Gerente',
    'ADMIN': 'Administrador'
  }[userRole] || 'Cliente'

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full h-auto p-2 hover:bg-accent",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed ? "justify-center" : "justify-between w-full"
          )}>
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.firstName || 'Usuario'}
                width={32}
                height={32}
                className="rounded-full flex-shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {initials}
              </div>
            )}
            {!isCollapsed && (
              <>
                <div className="flex flex-col flex-1 text-left">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">{roleDisplay}</span>
                </div>
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        side="right" 
        align="end" 
        className="w-56"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.firstName || 'Usuario'}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
              {initials}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.emailAddresses?.[0]?.emailAddress}
            </span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/admin/perfil" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/admin/configuracion" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/admin/facturacion" className="flex items-center gap-2 cursor-pointer">
            <CreditCard className="h-4 w-4" />
            <span>Facturación</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/admin/notificaciones" className="flex items-center gap-2 cursor-pointer">
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/ayuda" className="flex items-center gap-2 cursor-pointer">
            <HelpCircle className="h-4 w-4" />
            <span>Ayuda</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente helper para tooltips que solo aparecen cuando el sidebar está colapsado
function SidebarTooltip({ 
  children, 
  label 
}: { 
  children: React.ReactNode
  label: string 
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (!isCollapsed) {
    return <>{children}</>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side="right">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = React.useState<string[]>([])
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Verificar autenticación y rol
  React.useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }
    
    // Verificar si tiene permisos de admin/agente
    const userRole = user?.publicMetadata?.role as string
    const allowedRoles = ['AGENT', 'TEAM_LEADER', 'OFFICE_MANAGER', 'ADMIN', 'SUPER_ADMIN']
    
    if (isLoaded && user && !allowedRoles.includes(userRole)) {
      router.push('/admin') // Redirigir a dashboard de cliente
    }
  }, [isLoaded, user, router])

  // Mostrar loading mientras verifica autenticación
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar className="border-r" collapsible="icon">
          <SidebarHeader className="border-b px-6 py-4">
            <SidebarHeaderContent />
          </SidebarHeader>

          <SidebarContent>
            {/* Menú Principal */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                MENÚ PRINCIPAL
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        {item.items ? (
                          <Collapsible
                            open={openMenus.includes(item.title)}
                            onOpenChange={(open) => {
                              setOpenMenus(open 
                                ? [...openMenus, item.title]
                                : openMenus.filter(menu => menu !== item.title)
                              )
                            }}
                          >
                            <SidebarTooltip label={item.title}>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.title}</span>
                                  <ChevronRight className={cn(
                                    "ml-auto h-4 w-4 transition-transform",
                                    openMenus.includes(item.title) && "rotate-90"
                                  )} />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                            </SidebarTooltip>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.items.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <Link 
                                        href={subItem.href}
                                        className={cn(
                                          "flex items-center gap-2",
                                          pathname === subItem.href && "bg-accent text-accent-foreground"
                                        )}
                                      >
                                        <subItem.icon className="h-3 w-3" />
                                        <span className="flex-1">{subItem.title}</span>
                                        {subItem.badge && (
                                          <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                                            {subItem.badge}
                                          </Badge>
                                        )}
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          <SidebarTooltip label={item.title}>
                            <SidebarMenuButton asChild>
                              <Link 
                                href={item.href}
                                className={cn(
                                  pathname === item.href && "bg-accent text-accent-foreground"
                                )}
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                                {item.label && (
                                  <span className="ml-auto text-xs text-muted-foreground">
                                    {item.label}
                                  </span>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarTooltip>
                        )}
                      </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Menú Secundario - Mensajes */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                COMUNICACIÓN
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarTooltip label={`${item.title}${item.badge ? ` (${item.badge})` : ''}`}>
                        <SidebarMenuButton asChild>
                          <Link 
                            href={item.href}
                            className={cn(
                              pathname === item.href && "bg-accent text-accent-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarTooltip>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Espaciador para empujar las opciones finales hacia abajo */}
            <div className="flex-1" />

            {/* Opciones finales - Reportes y Configuración */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {bottomNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarTooltip label={item.title}>
                        <SidebarMenuButton asChild>
                          <Link 
                            href={item.href}
                            className={cn(
                              pathname === item.href && "bg-accent text-accent-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarTooltip>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <SidebarFooterContent />
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex flex-col">
          {/* Header con trigger del sidebar */}
          <header className="flex h-14 items-center gap-4 border-b px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <h1 className="text-sm font-medium">
                Bienvenido, {user?.firstName || 'Usuario'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Notificaciones en el header */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  align="end" 
                  className="w-80"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notificaciones</span>
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                      3 nuevas
                    </Badge>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Contenido de notificaciones... */}
                  
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      Ver todas las notificaciones
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/propiedades/nueva">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nueva Propiedad
                </Link>
              </Button>
            </div>
          </header>

          {/* Contenido principal */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </TooltipProvider>
  )
}