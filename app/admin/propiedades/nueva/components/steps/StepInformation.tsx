// app/admin/propiedades/nueva/components/steps/StepInformation.tsx
"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues, NewClientForm } from "../../types"
import { MOCK_CLIENTS } from "../../constants"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import Flag from "react-world-flags"
import {
  User,
  Users,
  Globe,
  Share2,
  Megaphone,
  MapPin as MapPinIcon,
  Link,
  ShoppingCart,
  Home,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar as CalendarIcon,
  ChevronsUpDown,
  Check,
  Plus
} from "lucide-react"

interface StepInformationProps {
  form: UseFormReturn<PropertyFormValues>
}

export function StepInformation({ form }: StepInformationProps) {
  const [clientSelectorOpen, setClientSelectorOpen] = useState(false)
  const [newClientSheetOpen, setNewClientSheetOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState("")
  const [newClientForm, setNewClientForm] = useState<NewClientForm>({
    nombre: "",
    apellido: "",
    dni: "",
    celular: "",
    email: "",
    genero: "femenino",
    tipoCliente: "activo",
    origen: "",
    categoria: ""
  })

  return (
    <div className="space-y-6">
      {/* Selector de Cliente */}
      <FormField
        control={form.control}
        name="cliente"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente *</FormLabel>
            <Popover open={clientSelectorOpen} onOpenChange={setClientSelectorOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={`w-full justify-between ${!field.value && "text-muted-foreground"}`}
                  >
                    {field.value
                      ? MOCK_CLIENTS.find((client) => client.id === field.value)?.name
                      : "Seleccionar cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar por nombre o DNI..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                    <CommandGroup>
                      {MOCK_CLIENTS.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={`${client.name} ${client.dni}`}
                          onSelect={() => {
                            form.setValue("cliente", client.id)
                            setSelectedClient(client.id)
                            setClientSelectorOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <User className="h-4 w-4" />
                            <div className="flex-1">
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-muted-foreground">DNI: {client.dni}</p>
                            </div>
                            <Check
                              className={`ml-auto h-4 w-4 ${
                                field.value === client.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <Separator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setClientSelectorOpen(false)
                          setNewClientSheetOpen(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tipo de Operación - Tabs */}
      <FormField
        control={form.control}
        name="operacion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de operación *</FormLabel>
            <FormControl>
              <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="venta">Venta</TabsTrigger>
                  <TabsTrigger value="alquiler">Alquiler</TabsTrigger>
                  <TabsTrigger value="alquiler-temporal">Alquiler Temporal</TabsTrigger>
                </TabsList>
              </Tabs>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tipo de Propiedad */}
      <FormField
        control={form.control}
        name="tipo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de propiedad *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Seleccionar tipo de propiedad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="departamento">🏢 Departamento</SelectItem>
                <SelectItem value="casa">🏠 Casa</SelectItem>
                <SelectItem value="ph">🏘️ PH</SelectItem>
                <SelectItem value="local">🏪 Local Comercial</SelectItem>
                <SelectItem value="oficina">🏢 Oficina</SelectItem>
                <SelectItem value="terreno">🌍 Terreno</SelectItem>
                <SelectItem value="quinta">🌳 Quinta</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Precio con Tabs de Moneda */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="precio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio *</FormLabel>
              <FormControl>
                <div className="flex">
                  <Tabs
                    value={form.watch("moneda")}
                    onValueChange={(value) => form.setValue("moneda", value)}
                    className="w-auto"
                  >
                    <TabsList className="grid grid-cols-2 h-11 rounded-r-none border-r">
                      <TabsTrigger value="ARS" className="flex items-center gap-2">
                        <Flag code="AR" className="w-4 h-3" />
                        ARS
                      </TabsTrigger>
                      <TabsTrigger value="USD" className="flex items-center gap-2">
                        <Flag code="US" className="w-4 h-3" />
                        USD
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Input
                    type="text"
                    placeholder={form.watch("moneda") === "ARS" ? "Ej: 45.000.000" : "Ej: 450.000"}
                    className="h-11 text-lg rounded-l-none flex-1"
                    value={field.value ? Number(field.value).toLocaleString('es-AR') : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      field.onChange(value)
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Expensas */}
      <FormField
        control={form.control}
        name="expensas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expensas (opcional)</FormLabel>
            <FormControl>
              <div className="flex">
                <div className="flex items-center px-3 border rounded-l-md bg-muted h-11">
                  <Flag code="AR" className="w-4 h-3 mr-2" />
                  <span className="text-sm font-medium">ARS</span>
                </div>
                <Input
                  type="text"
                  placeholder="Ej: 35.000"
                  className="h-11 rounded-l-none flex-1"
                  value={field.value ? Number(field.value).toLocaleString('es-AR') : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    field.onChange(value)
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>
              Gastos de mantenimiento del edificio o complejo
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fechaDisponibilidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de disponibilidad</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full h-11 justify-start text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Cuándo estará disponible la propiedad
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fechaVencimiento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de vencimiento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full h-11 justify-start text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Cuándo vence la publicación
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sheet para Nuevo Cliente */}
      <Sheet open={newClientSheetOpen} onOpenChange={setNewClientSheetOpen}>
        <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
          <SheetHeader className="px-6 py-4">
            <SheetTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Nuevo Cliente
            </SheetTitle>
            <Separator className="mt-4" />
          </SheetHeader>
          <div className="px-6 pb-6 space-y-8">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      placeholder="Nombre"
                      value={newClientForm.nombre}
                      onChange={(e) => setNewClientForm(prev => ({ ...prev, nombre: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      placeholder="Apellido"
                      value={newClientForm.apellido}
                      onChange={(e) => setNewClientForm(prev => ({ ...prev, apellido: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                      id="dni"
                      placeholder="12345678"
                      value={newClientForm.dni}
                      onChange={(e) => setNewClientForm(prev => ({ ...prev, dni: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genero">Género</Label>
                    <Select
                      value={newClientForm.genero}
                      onValueChange={(value) => setNewClientForm(prev => ({ ...prev, genero: value }))}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Seleccione género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contacto</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="+54">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+54">🇦🇷 +54</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+34">🇪🇸 +34</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="celular"
                      placeholder="11 1234-5678"
                      className="flex-1 h-10"
                      value={newClientForm.celular}
                      onChange={(e) => setNewClientForm(prev => ({ ...prev, celular: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Formato WhatsApp</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@email.com"
                    className="h-10"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Adicional</h3>

              <div className="space-y-2">
                <Label>Tipo de cliente</Label>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <Button
                    type="button"
                    variant={newClientForm.tipoCliente === 'activo' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewClientForm(prev => ({ ...prev, tipoCliente: 'activo' }))}
                    className="w-full"
                  >
                    Activo
                  </Button>
                  <Button
                    type="button"
                    variant={newClientForm.tipoCliente === 'potencial' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewClientForm(prev => ({ ...prev, tipoCliente: 'potencial' }))}
                    className="w-full"
                  >
                    Potencial
                  </Button>
                  <Button
                    type="button"
                    variant={newClientForm.tipoCliente === 'antiguo' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewClientForm(prev => ({ ...prev, tipoCliente: 'antiguo' }))}
                    className="w-full"
                  >
                    Antiguo
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="origen">Origen</Label>
                  <Select
                    value={newClientForm.origen}
                    onValueChange={(value) => setNewClientForm(prev => ({ ...prev, origen: value }))}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="referido">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Referido</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="web">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span>Página Web</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="redes">
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          <span>Redes Sociales</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="publicidad">
                        <div className="flex items-center gap-2">
                          <Megaphone className="h-4 w-4" />
                          <span>Publicidad</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cartel">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4" />
                          <span>Cartel en propiedad</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="portal">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          <span>Portal inmobiliario</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={newClientForm.categoria}
                    onValueChange={(value) => setNewClientForm(prev => ({ ...prev, categoria: value }))}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprador">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          <span>Comprador</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="vendedor">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Vendedor</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inquilino">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>Inquilino</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="propietario">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>Propietario</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inversor">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Inversor</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="button"
                onClick={() => {
                  if (!newClientForm.nombre || !newClientForm.apellido) {
                    alert('Por favor complete nombre y apellido')
                    return
                  }

                  const newClient = {
                    id: (MOCK_CLIENTS.length + 1).toString(),
                    name: `${newClientForm.nombre} ${newClientForm.apellido}`,
                    dni: newClientForm.dni || "00000000",
                    email: newClientForm.email,
                    phone: newClientForm.celular
                  }

                  form.setValue("cliente", newClient.id)
                  setSelectedClient(newClient.id)

                  setNewClientForm({
                    nombre: "",
                    apellido: "",
                    dni: "",
                    celular: "",
                    email: "",
                    genero: "femenino",
                    tipoCliente: "activo",
                    origen: "",
                    categoria: ""
                  })
                  setNewClientSheetOpen(false)
                }}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                Crear Cliente
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewClientForm({
                    nombre: "",
                    apellido: "",
                    dni: "",
                    celular: "",
                    email: "",
                    genero: "femenino",
                    tipoCliente: "activo",
                    origen: "",
                    categoria: ""
                  })
                  setNewClientSheetOpen(false)
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}