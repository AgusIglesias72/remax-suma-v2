// app/admin/propiedades/nueva/components/steps/StepLocation.tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues, LocationData } from "../../types"
import { useState } from "react"
import { PROVINCES } from "../../constants"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import { SearchAutocomplete } from "@/components/search/google-autocomplete"
import GoogleMapComponent from "@/components/maps/google-map"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StepLocationProps {
  form: UseFormReturn<PropertyFormValues>
}

export function StepLocation({ form }: StepLocationProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [apiDebugInfo, setApiDebugInfo] = useState<any>(null)

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation({
      lat: location.lat,
      lng: location.lng,
      address: location.address
    })

    // Auto-rellenar dirección
    form.setValue("direccion", location.address)

    // Parsear dirección con Google Geocoding API
    if (window.google && location.lat && location.lng) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode(
        { location: { lat: location.lat, lng: location.lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const components = results[0].address_components

            // Debug: Guardar toda la información de la API
            setApiDebugInfo({
              status,
              formatted_address: results[0].formatted_address,
              place_id: results[0].place_id,
              address_components: components.map(comp => ({
                long_name: comp.long_name,
                short_name: comp.short_name,
                types: comp.types
              })),
              location: {
                lat: location.lat,
                lng: location.lng
              }
            })

            // Limpiar campos antes de procesarlos
            form.setValue("barrio", "")

            let foundNeighborhood = false
            let detectedProvince = ''

            // Primera pasada: Detectar la provincia
            components.forEach((component) => {
              const types = component.types
              if (types.includes('administrative_area_level_1')) {
                const provinceName = component.long_name
                if (provinceName.includes('Buenos Aires') && !provinceName.includes('Ciudad')) {
                  detectedProvince = 'buenos-aires'
                } else if (provinceName.includes('Ciudad Autónoma') || provinceName.includes('Autonomous City')) {
                  detectedProvince = 'caba'
                }
              }
            })

            components.forEach((component) => {
              const types = component.types

              if (types.includes('route')) {
                // Extraer nombre de calle del resultado completo
                const fullAddress = results[0].formatted_address
                const streetMatch = fullAddress.match(/^([^0-9]+)\s*(\d+)?/)
                if (streetMatch) {
                  form.setValue("direccion", streetMatch[0].trim())
                }
              }

              // Lógica diferente para Ciudad vs Barrio según la provincia
              if (detectedProvince === 'buenos-aires') {
                // En Buenos Aires Provincia: locality = barrio, administrative_area_level_2 = ciudad
                if (types.includes('administrative_area_level_2')) {
                  form.setValue("ciudad", component.long_name)
                }
                if (types.includes('locality') && !foundNeighborhood) {
                  form.setValue("barrio", component.long_name)
                  foundNeighborhood = true
                }
              } else {
                // En CABA y otras provincias: locality = ciudad
                if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                  form.setValue("ciudad", component.long_name)
                }
              }

              if (types.includes('administrative_area_level_1')) {
                let provinceName = component.long_name
                let provinceValue = ''

                // Mapear nombres de provincias a valores del select
                if (provinceName.includes('Buenos Aires') && !provinceName.includes('Ciudad')) {
                  provinceValue = 'buenos-aires'
                } else if (provinceName.includes('Ciudad Autónoma') || provinceName.includes('Autonomous City')) {
                  provinceValue = 'caba'
                } else if (provinceName.includes('Córdoba') || provinceName === 'Córdoba') {
                  provinceValue = 'cordoba'
                } else if (provinceName.includes('Santa Fe')) {
                  provinceValue = 'santa-fe'
                } else if (provinceName.includes('Mendoza')) {
                  provinceValue = 'mendoza'
                }

                if (provinceValue) {
                  form.setValue("provincia", provinceValue)
                }
              }

              if (types.includes('postal_code')) {
                form.setValue("codigoPostal", component.long_name)
              }

              // Para CABA y otras provincias, usar la lógica tradicional de barrio
              if (detectedProvince !== 'buenos-aires' && !foundNeighborhood) {
                if (types.includes('sublocality_level_1')) {
                  form.setValue("barrio", component.long_name)
                  foundNeighborhood = true
                } else if (types.includes('neighborhood')) {
                  form.setValue("barrio", component.long_name)
                  foundNeighborhood = true
                } else if (types.includes('sublocality')) {
                  form.setValue("barrio", component.long_name)
                  foundNeighborhood = true
                }
              }
            })

            // Si no se encontró barrio, mantenerlo vacío
            if (!foundNeighborhood) {
              form.setValue("barrio", "")
            }
          }
        }
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Campo de búsqueda principal */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-3">
          <FormLabel className="text-base font-medium">Buscar dirección *</FormLabel>
          {apiDebugInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">
                    ?
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-md p-4">
                  <div className="text-xs">
                    <strong>API Response Debug:</strong>
                    <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-64">
                      {JSON.stringify(apiDebugInfo, null, 2)}
                    </pre>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <SearchAutocomplete
          placeholder="Ej: Av. Santa Fe 3421, Palermo, CABA"
          className="h-12 text-base"
          onLocationSelect={handleLocationSelect}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Busca la dirección y se autocompletarán los campos a continuación
        </p>
      </div>

      {/* Layout de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Formulario */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Detalles de la ubicación</h3>

          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección completa *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Av. Santa Fe 3421" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="piso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piso</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 5" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: A" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ciudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: CABA" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provincia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provincia *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Seleccionar provincia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="max-w-[--radix-select-trigger-width] w-[--radix-select-trigger-width]"
                      position="popper"
                      sideOffset={4}
                    >
                      {PROVINCES.map(province => (
                        <SelectItem key={province.value} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="codigoPostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 1425" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barrio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barrio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Palermo" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Columna derecha - Mapa */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Vista en el mapa</h3>
          <div className="border rounded-lg overflow-hidden bg-muted">
            {selectedLocation ? (
              <GoogleMapComponent
                properties={[{
                  id: "temp-location",
                  title: "Ubicación seleccionada",
                  latitude: selectedLocation.lat,
                  longitude: selectedLocation.lng,
                  price: 0,
                  address: selectedLocation.address,
                  operation_type: "Venta",
                  images: []
                }]}
                center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                zoom={16}
                height="400px"
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Selecciona una dirección</p>
                  <p className="text-sm">Para ver la ubicación en el mapa</p>
                </div>
              </div>
            )}
          </div>
          {selectedLocation && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              <strong>Dirección seleccionada:</strong><br />
              {selectedLocation.address}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}