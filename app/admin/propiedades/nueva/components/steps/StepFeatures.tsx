// app/admin/propiedades/nueva/components/steps/StepFeatures.tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "../../types"
import { PROPERTY_STATES, PROPERTY_AMENITIES } from "../../constants"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Ruler, 
  Clock, 
  Compass,
  Search,
  ArrowUpDown
} from "lucide-react"
import { useState, useEffect } from "react"

interface StepFeaturesProps {
  form: UseFormReturn<PropertyFormValues>
}

export function StepFeatures({ form }: StepFeaturesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["ambientes"])

  // Calcular superficie total automáticamente
  const superficieCubiertos = Number(form.watch("superficieCubiertos")) || 0
  const superficieDescubiertos = Number(form.watch("superficieDescubiertos")) || 0
  const superficieTotal = superficieCubiertos + superficieDescubiertos

  // Actualizar el campo total cuando cambien los otros
  useEffect(() => {
    if (superficieTotal > 0) {
      form.setValue("superficieTotales", superficieTotal.toString())
    } else {
      form.setValue("superficieTotales", "")
    }
  }, [superficieCubiertos, superficieDescubiertos, superficieTotal, form])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="space-y-8">
      {/* Características Principales */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Características Principales
        </h3>

        {/* Fila única: Ambientes, Dormitorios, Baños y Cocheras */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="ambientes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  Ambientes *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dormitorios"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-primary" />
                  Dormitorios *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baños"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-primary" />
                  Baños *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cocheras"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  Cocheras
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Superficies */}
        <div className="space-y-4">
          <h4 className="text-base font-medium flex items-center gap-2">
            <Ruler className="h-4 w-4 text-primary" />
            Metros Cuadrados
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="superficieCubiertos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Cubiertos (m²)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder=""
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="superficieDescubiertos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Descubiertos (m²)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder=""
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="superficieTotales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Totales (m²) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-11 bg-muted text-muted-foreground cursor-not-allowed"
                      value={superficieTotal > 0 ? superficieTotal : ''}
                      readOnly
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Antigüedad y Orientación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="antiguedad"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Antigüedad
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="0">A estrenar</SelectItem>
                    <SelectItem value="1-5">1 a 5 años</SelectItem>
                    <SelectItem value="6-10">6 a 10 años</SelectItem>
                    <SelectItem value="11-20">11 a 20 años</SelectItem>
                    <SelectItem value="21-50">21 a 50 años</SelectItem>
                    <SelectItem value="50+">Más de 50 años</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orientacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  Orientación
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="norte">Norte</SelectItem>
                    <SelectItem value="sur">Sur</SelectItem>
                    <SelectItem value="este">Este</SelectItem>
                    <SelectItem value="oeste">Oeste</SelectItem>
                    <SelectItem value="noreste">Noreste</SelectItem>
                    <SelectItem value="noroeste">Noroeste</SelectItem>
                    <SelectItem value="sureste">Sureste</SelectItem>
                    <SelectItem value="suroeste">Suroeste</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Detalles de la Propiedad */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Detalles de la propiedad</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "contratoExclusivo", label: "Contrato Exclusivo" },
            { name: "cartel", label: "Cartel", optional: true },
            { name: "ofreceFinanciamiento", label: "Ofrece financiamiento" },
            { name: "aptoCredito", label: "Apto crédito" },
            { name: "aptoComercial", label: "Apto comercial" },
            { name: "aptoProfesional", label: "Apto profesional" },
            { name: "aptoMovilidadReducida", label: "Apto movilidad reducida" },
            { name: "pozo", label: "Pozo" },
            { name: "countryBarrioPrivado", label: "Country o barrio privado", optional: true }
          ].map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name as any}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2">
                      {item.label}
                      {item.optional && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                          Opcional
                        </span>
                      )}
                    </FormLabel>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="w-16"
                      >
                        Sí
                      </Button>
                      <Button
                        type="button"
                        variant={!field.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="w-16"
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Estado de la Propiedad */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Estado de la propiedad</h3>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
            Opcional
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROPERTY_STATES.map((estado) => (
            <FormField
              key={estado}
              control={form.control}
              name="estadoPropiedad"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(estado)}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || []
                        if (checked) {
                          field.onChange([...currentValues, estado])
                        } else {
                          field.onChange(currentValues.filter((value) => value !== estado))
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    {estado}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Características de la Propiedad */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Características de la propiedad</h3>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
            Opcional
          </span>
        </div>

        {/* Buscador de características */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar característica"
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categorías colapsables */}
        <div className="space-y-4">
          {/* Ambientes */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50"
              onClick={() => toggleCategory("ambientes")}
            >
              <span className="font-medium">Ambientes</span>
              <ArrowUpDown className="h-4 w-4" />
            </button>
            {expandedCategories.includes("ambientes") && (
              <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                {PROPERTY_AMENITIES.ambientes
                  .filter(item => 
                    item.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((caracteristica) => (
                    <FormField
                      key={caracteristica}
                      control={form.control}
                      name="caracteristicasPropiedad"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(caracteristica)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || []
                                if (checked) {
                                  field.onChange([...currentValues, caracteristica])
                                } else {
                                  field.onChange(currentValues.filter((value) => value !== caracteristica))
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {caracteristica}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}