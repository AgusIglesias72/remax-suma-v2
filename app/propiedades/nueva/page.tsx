// app/propiedades/nueva-v2/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchAutocomplete } from "@/components/search/google-autocomplete"
import { ArrowLeft, Building, DollarSign, MapPin, Ruler, FileText, Save, Loader2, CheckCircle, Edit3, Sparkles } from "lucide-react"
import Link from "next/link"

// 🆕 INTERFAZ COMPLETA CON BARRIO
interface FormData {
  operation_type: string
  property_type: string
  title: string
  description: string
  address: string
  latitude: number | null
  longitude: number | null
  
  // Campos de dirección separados
  street: string           // Calle
  street_number: string    // Número
  floor: string           // Piso (opcional)
  apartment: string       // Departamento (opcional)
  neighborhood: string    // 🆕 Barrio (locality no administrativo)
  locality: string        // Localidad (administrative_area_level_2)
  province: string        // Provincia
  postal_code: string     // Código postal
  country: string         // País
  
  covered_surface: number | null
  rooms: number | null
  bedrooms: number | null
  bathrooms: number | null
  garages: number | null
  price: number | null
  price_currency: string
  expenses: number | null
  expenses_currency: string
}

const OPERATION_TYPES = [
  { value: "Venta", label: "Venta" },
  { value: "Alquiler", label: "Alquiler" },
  { value: "Alquiler Temporal", label: "Alquiler Temporario" }
]

const PROPERTY_TYPES = [
  { value: "Departamento Estándar", label: "Departamento Estándar" },
  { value: "Casa", label: "Casa" },
  { value: "Departamento Dúplex", label: "Departamento Dúplex" },
  { value: "Local", label: "Local" },
  { value: "Terrenos y Lotes", label: "Terrenos y Lotes" },
  { value: "Departamento Monoambiente", label: "Departamento Monoambiente" },
  { value: "Oficina", label: "Oficina" },
  { value: "Cochera", label: "Cochera" },
  { value: "PH", label: "PH" },
  { value: "Casa Dúplex", label: "Casa Dúplex" },
  { value: "Departamento Penthouse", label: "Departamento Penthouse" },
  { value: "Casa Triplex", label: "Casa Triplex" }
]

const CURRENCIES = [
  { value: "USD", label: "US$ (Dólares)" },
  { value: "ARS", label: "$ (Pesos Argentinos)" }
]

const PROVINCES = [
  "Buenos Aires", "CABA", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", 
  "Entre Ríos", "Salta", "Misiones", "Corrientes", "San Juan", "Jujuy",
  "Río Negro", "Neuquén", "Formosa", "Chaco", "Chubut", "Santiago del Estero",
  "San Luis", "Catamarca", "La Rioja", "La Pampa", "Santa Cruz", "Tierra del Fuego"
]

const STEPS = [
  { id: 1, title: "Información Básica", icon: Building, description: "Tipo de operación y propiedad" },
  { id: 2, title: "Ubicación", icon: MapPin, description: "Dirección y coordenadas" },
  { id: 3, title: "Características", icon: Ruler, description: "Superficie y ambientes" },
  { id: 4, title: "Información Económica", icon: DollarSign, description: "Precios y expensas" },
  { id: 5, title: "Descripción", icon: FileText, description: "Título y detalles" },
  { id: 6, title: "Revisión y Confirmación", icon: CheckCircle, description: "Revisa y confirma la información" }
]

export default function NuevaPropiedadPageV2() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [lastApiResponse, setLastApiResponse] = useState<any>(null)
  const [addressFieldsVisible, setAddressFieldsVisible] = useState(false)
  const [localityOptions, setLocalityOptions] = useState<string[]>([])
  const [loadingLocalities, setLoadingLocalities] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    operation_type: "",
    property_type: "",
    title: "",
    description: "",
    address: "",
    latitude: null,
    longitude: null,
    
    // Campos de dirección iniciales
    street: "",
    street_number: "",
    floor: "",
    apartment: "",
    neighborhood: "",      // 🆕 Barrio
    locality: "",
    province: "Buenos Aires",
    postal_code: "",
    country: "Argentina",
    
    covered_surface: null,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
    garages: null,
    price: null,
    price_currency: "USD",
    expenses: null,
    expenses_currency: "ARS"
  })

  // Monitorear cambios de paso
  useEffect(() => {
    console.log(`📍 PASO ACTUAL: ${currentStep}`)
    if (currentStep === 6) {
      console.log('⚠️ ESTAMOS EN PASO 6 - Solo mostrar resumen, NO hacer POST automático')
    }
  }, [currentStep])

  // Cargar localidades iniciales para Buenos Aires
  useEffect(() => {
    handleProvinceChange("Buenos Aires");
  }, [])

  // 🆕 FUNCIÓN PARA OBTENER LOCALIDADES POR PROVINCIA
  const fetchLocalitiesForProvince = async (provinceName: string) => {
    console.log('🔍 Obteniendo localidades para provincia:', provinceName)
    
    try {
      setLoadingLocalities(true);
      
      const knownLocalities: Record<string, string[]> = {
        "Buenos Aires": [
          "Vicente López", "San Isidro", "Tigre", "San Fernando", "Quilmes", 
          "Avellaneda", "Lanús", "Lomas de Zamora", "Almirante Brown", "Berazategui",
          "Florencio Varela", "Esteban Echeverría", "La Matanza", "Morón", "Tres de Febrero",
          "Hurlingham", "Ituzaingó", "Merlo", "Moreno", "José C. Paz", "Malvinas Argentinas",
          "Pilar", "Escobar", "Campana", "Zárate", "Luján", "Mercedes", "Navarro"
        ],
        "CABA": [
          "CABA"
        ],
        "Córdoba": [
          "Córdoba Capital", "Villa María", "Río Cuarto", "San Francisco", "Villa Carlos Paz",
          "Alta Gracia", "Cosquín", "La Falda", "Jesus María", "Bell Ville"
        ],
        "Santa Fe": [
          "Santa Fe Capital", "Rosario", "Rafaela", "Reconquista", "Venado Tuerto",
          "Santo Tomé", "Esperanza", "Casilda", "Villa Gobernador Gálvez"
        ]
      };

      const localities = knownLocalities[provinceName] || [];
      console.log(`✅ Localidades encontradas para ${provinceName}:`, localities);
      
      return localities;

    } catch (error) {
      console.error("💥 Error obteniendo localidades:", error);
      return [];
    } finally {
      setLoadingLocalities(false);
    }
  }

  // Manejar cambio de provincia
  const handleProvinceChange = async (newProvince: string) => {
    console.log('🗺️ Cambiando provincia a:', newProvince);
    
    setFormData(prev => ({
      ...prev,
      province: newProvince,
      locality: ""
    }));

    const localities = await fetchLocalitiesForProvince(newProvince);
    setLocalityOptions(localities);
  }

  // 🆕 FUNCIÓN MEJORADA: Google Maps API con distinción Barrio/Localidad
  const parseAndFillAddressWithGoogleMaps = async (fullAddress: string) => {
    console.log('🔍 Parseando dirección con Google Maps API:', fullAddress)
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está configurada");
      parseAndFillAddressManual(fullAddress);
      return;
    }

    try {
      const encodedAddress = encodeURIComponent(fullAddress);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&language=es&region=ar`;

      console.log("🔍 Consultando Google Maps API...");
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(`Error de Google Maps API: ${data.status}`);
      }

      if (!data.results || data.results.length === 0) {
        throw new Error("No se encontraron resultados");
      }

      const result = data.results[0];
      const components = result.address_components;
      
      console.log("🔍 Componentes de dirección:", components);

      // Inicializar datos de ubicación
      const locationData = {
        calle: "",
        numero: "",
        barrio: "",      // 🆕 Para locality no administrativo
        localidad: "",   // Para administrative_area_level_2
        provincia: "",
        codigoPostal: "",
        pais: ""
      };

      // Procesar cada componente
      components.forEach((component: any) => {
        const types = component.types;
        const longName = component.long_name;
        
        console.log(`🔍 Analizando: "${longName}" con tipos: [${types.join(", ")}]`);

        // 1. NÚMERO DE CALLE
        if (types.includes("street_number")) {
          locationData.numero = longName;
          console.log(`✅ NÚMERO: ${longName}`);
        }

        // 2. NOMBRE DE LA CALLE
        if (types.includes("route")) {
          locationData.calle = longName;
          console.log(`✅ CALLE: ${longName}`);
        }

        // 3. 🆕 BARRIO vs LOCALIDAD - DISTINCIÓN CLAVE
        if (types.includes("administrative_area_level_2")) {
          // Es área administrativa = Localidad (Vicente López, CABA)
          locationData.localidad = longName;
          console.log(`✅ LOCALIDAD (administrative): ${longName}`);
        } else if (types.includes("locality") && !locationData.barrio) {
          // Es locality pero NO administrative = Barrio (Olivos, Palermo)
          locationData.barrio = longName;
          console.log(`✅ BARRIO (locality): ${longName}`);
        } else if (types.includes("sublocality_level_1") && !locationData.barrio) {
          // Sublocality también puede ser barrio
          locationData.barrio = longName;
          console.log(`✅ BARRIO (sublocality): ${longName}`);
        }

        // 4. PROVINCIA
        if (types.includes("administrative_area_level_1")) {
          let provinceName = longName;
          
          if (longName.includes("Provincia de Buenos Aires")) {
            provinceName = "Buenos Aires";
          } else if (longName.includes("Ciudad Autónoma") || longName.includes("Autonomous City")) {
            provinceName = "CABA";
            // Para CABA, si no tenemos localidad, usar CABA como localidad
            if (!locationData.localidad) {
              locationData.localidad = "CABA";
              console.log(`✅ LOCALIDAD (CABA por defecto): CABA`);
            }
          }
          
          locationData.provincia = provinceName;
          console.log(`✅ PROVINCIA: ${provinceName}`);
        }

        // 5. CÓDIGO POSTAL
        if (types.includes("postal_code")) {
          const numericPostalCode = longName.replace(/[^0-9]/g, '');
          locationData.codigoPostal = numericPostalCode;
          console.log(`✅ CP: ${numericPostalCode}`);
        }

        // 6. PAÍS
        if (types.includes("country")) {
          locationData.pais = longName;
          console.log(`✅ PAÍS: ${longName}`);
        }
      });

      console.log("🎯 DATOS FINALES DETECTADOS:", locationData);

      // Actualizar campos
      setFormData(prev => ({
        ...prev,
        street: locationData.calle || prev.street,
        street_number: locationData.numero || prev.street_number,
        neighborhood: locationData.barrio || prev.neighborhood,     // 🆕 Barrio
        locality: locationData.localidad || prev.locality,
        province: locationData.provincia || prev.province,
        postal_code: locationData.codigoPostal || prev.postal_code,
        country: locationData.pais || prev.country
      }));

      // Cargar localidades para la provincia detectada
      const provinceToUse = locationData.provincia || formData.province;
      if (provinceToUse) {
        const localities = await fetchLocalitiesForProvince(provinceToUse);
        
        if (locationData.localidad && !localities.includes(locationData.localidad)) {
          localities.unshift(locationData.localidad);
        }
        
        setLocalityOptions(localities);
      }

    } catch (error) {
      console.error("💥 Error parseando con Google Maps:", error);
      parseAndFillAddressManual(fullAddress);
    }
  }

  // Función de fallback manual
  const parseAndFillAddressManual = async (fullAddress: string) => {
    console.log('🔧 Parseando dirección manualmente:', fullAddress)
    
    const parts = fullAddress.split(',').map(p => p.trim())
    
    let street = ""
    let streetNumber = ""
    let neighborhood = ""
    let locality = ""
    let province = "Buenos Aires"
    
    if (parts.length > 0) {
      const firstPart = parts[0]
      const match = firstPart.match(/^(.+?)\s+(\d+)/)
      if (match) {
        street = match[1].trim()
        streetNumber = match[2].trim()
      } else {
        street = firstPart
      }
    }
    
    // Buscar barrio, localidad y provincia
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].toLowerCase()
      
      // Detectar barrios conocidos
      if ((part.includes('olivos') || part.includes('palermo') || 
          part.includes('belgrano') || part.includes('recoleta') ||
          part.includes('san telmo') || part.includes('puerto madero')) && !neighborhood) {
        neighborhood = parts[i]
      }
      
      // Detectar localidades administrativas
      if (part.includes('vicente lópez') || part.includes('san isidro') || 
          part.includes('caba') || part.includes('ciudad autónoma')) {
        locality = parts[i]
      }
      
      if (PROVINCES.some(prov => prov.toLowerCase() === part)) {
        province = parts[i]
      }
    }
    
    setFormData(prev => ({
      ...prev,
      street: street || prev.street,
      street_number: streetNumber || prev.street_number,
      neighborhood: neighborhood || prev.neighborhood,
      locality: locality || prev.locality,
      province: province || prev.province,
      postal_code: prev.postal_code || "1636"
    }))

    const localities = await fetchLocalitiesForProvince(province);
    if (locality && !localities.includes(locality)) {
      localities.unshift(locality);
    }
    setLocalityOptions(localities);
  }

  const handleInputChange = (field: keyof FormData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      latitude: location.lat,
      longitude: location.lng
    }))
    
    // Parsear con Google Maps API
    parseAndFillAddressWithGoogleMaps(location.address)
    
    // Mostrar campos expandidos
    setAddressFieldsVisible(true)
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.operation_type && formData.property_type
      case 2:
        return formData.address && formData.latitude && formData.longitude &&
               formData.street && formData.locality && formData.province
      case 3:
        return formData.covered_surface
      case 4:
        return formData.price
      case 5:
        return formData.title && formData.description
      case 6:
        return true
      default:
        return false
    }
  }

  const isStepCompleted = (stepId: number) => {
    switch (stepId) {
      case 1:
        return formData.operation_type && formData.property_type
      case 2:
        return formData.address && formData.latitude && formData.longitude &&
               formData.street && formData.locality && formData.province
      case 3:
        return formData.covered_surface
      case 4:
        return formData.price
      case 5:
        return formData.title && formData.description
      case 6:
        return false
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 6) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateForm = () => {
    const required = [
      'operation_type', 'property_type', 'title', 'description', 
      'address', 'street', 'locality', 'province', 'price', 'covered_surface'
    ]
    
    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        alert(`El campo ${field} es requerido`)
        return false
      }
    }
    
    if (!formData.latitude || !formData.longitude) {
      alert("Por favor selecciona una ubicación válida")
      return false
    }
    
    return true
  }

  const handleFinalSubmit = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/propiedades/nueva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setLastApiResponse(result)
        alert(`¡Éxito! ${result.message}`)
        
        const resetForm = confirm('¿Quieres resetear el formulario?')
        if (resetForm) {
          setFormData({
            operation_type: "",
            property_type: "",
            title: "",
            description: "",
            address: "",
            latitude: null,
            longitude: null,
            street: "",
            street_number: "",
            floor: "",
            apartment: "",
            neighborhood: "",
            locality: "",
            province: "Buenos Aires",
            postal_code: "",
            country: "Argentina",
            covered_surface: null,
            rooms: null,
            bedrooms: null,
            bathrooms: null,
            garages: null,
            price: null,
            price_currency: "USD",
            expenses: null,
            expenses_currency: "ARS"
          })
          setCurrentStep(1)
          setAddressFieldsVisible(false)
          setTimeout(() => handleProvinceChange("Buenos Aires"), 100)
        }
      } else {
        alert(`❌ Error: ${result.message}`)
      }
    } catch (error) {
      console.error('💥 Error:', error)
      alert('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Tipo de Operación *
              </Label>
              <Select value={formData.operation_type} onValueChange={(value) => handleInputChange('operation_type', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecciona el tipo de operación" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Tipo de Propiedad *
              </Label>
              <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecciona el tipo de propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Dirección *
              </Label>
              <SearchAutocomplete
                onLocationSelect={handleLocationSelect}
                placeholder="Buscar dirección (ej: Libertador 1024, Buenos Aires)"
                className="h-12"
              />
              {formData.address && (
                <p className="text-sm text-green-600 mt-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ubicación seleccionada: {formData.address}
                </p>
              )}
            </div>

            {/* 🆕 CAMPOS EXPANDIDOS CON BARRIO INCLUIDO */}
            {addressFieldsVisible && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                <div className="flex items-center mb-4">
                  <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-medium text-blue-800">
                    Confirma y ajusta los datos de la dirección
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Calle */}
                  <div>
                    <Label htmlFor="street" className="text-xs font-medium text-gray-700 mb-2 block">
                      Calle *
                    </Label>
                    <Input
                      id="street"
                      placeholder="ej: Libertador"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Número */}
                  <div>
                    <Label htmlFor="street_number" className="text-xs font-medium text-gray-700 mb-2 block">
                      Número *
                    </Label>
                    <Input
                      id="street_number"
                      placeholder="ej: 1024"
                      value={formData.street_number}
                      onChange={(e) => handleInputChange('street_number', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Piso */}
                  <div>
                    <Label htmlFor="floor" className="text-xs font-medium text-gray-700 mb-2 block">
                      Piso
                    </Label>
                    <Input
                      id="floor"
                      placeholder="ej: 5"
                      value={formData.floor}
                      onChange={(e) => handleInputChange('floor', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Departamento */}
                  <div>
                    <Label htmlFor="apartment" className="text-xs font-medium text-gray-700 mb-2 block">
                      Departamento
                    </Label>
                    <Input
                      id="apartment"
                      placeholder="ej: A"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* 🆕 BARRIO - CAMPO NUEVO */}
                  <div>
                    <Label htmlFor="neighborhood" className="text-xs font-medium text-gray-700 mb-2 block">
                      Barrio
                    </Label>
                    <Input
                      id="neighborhood"
                      placeholder="ej: Olivos, Palermo, Recoleta"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Localidad */}
                  <div>
                    <Label htmlFor="locality" className="text-xs font-medium text-gray-700 mb-2 block">
                      Localidad *
                    </Label>
                    <Select 
                      value={formData.locality} 
                      onValueChange={(value) => handleInputChange('locality', value)}
                      disabled={loadingLocalities}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder={
                          loadingLocalities 
                            ? "Cargando localidades..." 
                            : "Selecciona localidad"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {localityOptions.map(locality => (
                          <SelectItem key={locality} value={locality}>
                            {locality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Provincia */}
                  <div>
                    <Label htmlFor="province" className="text-xs font-medium text-gray-700 mb-2 block">
                      Provincia *
                    </Label>
                    <Select value={formData.province} onValueChange={handleProvinceChange}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecciona provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVINCES.map(province => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Código Postal */}
                  <div>
                    <Label htmlFor="postal_code" className="text-xs font-medium text-gray-700 mb-2 block">
                      Código Postal
                    </Label>
                    <Input
                      id="postal_code"
                      placeholder="ej: 1636"
                      value={formData.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* País */}
                  <div>
                    <Label htmlFor="country" className="text-xs font-medium text-gray-700 mb-2 block">
                      País *
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      className="h-10 bg-gray-100"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Superficie Cubierta (m²) *
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="ej: 85"
                className="h-12"
                value={formData.covered_surface || ""}
                onChange={(e) => handleInputChange('covered_surface', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Cantidad de Ambientes
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="ej: 3"
                className="h-12"
                value={formData.rooms || ""}
                onChange={(e) => handleInputChange('rooms', e.target.value ? Number(e.target.value) : null)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Dormitorios
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="ej: 2"
                  className="h-12"
                  value={formData.bedrooms || ""}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Baños
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="ej: 1"
                  className="h-12"
                  value={formData.bathrooms || ""}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Cocheras
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="ej: 1"
                  className="h-12"
                  value={formData.garages || ""}
                  onChange={(e) => handleInputChange('garages', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Precio *
              </Label>
              <div className="flex gap-3">
                <Select 
                  value={formData.price_currency} 
                  onValueChange={(value) => handleInputChange('price_currency', value)}
                >
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(curr => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  placeholder="ej: 150000"
                  className="flex-1 h-12"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange('price', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Expensas (opcional)
              </Label>
              <div className="flex gap-3">
                <Select 
                  value={formData.expenses_currency} 
                  onValueChange={(value) => handleInputChange('expenses_currency', value)}
                >
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(curr => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="0"
                  placeholder="ej: 25000"
                  className="flex-1 h-12"
                  value={formData.expenses || ""}
                  onChange={(e) => handleInputChange('expenses', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Título *
              </Label>
              <Input
                placeholder="ej: Hermoso departamento 3 ambientes en Palermo"
                className="h-12"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-gray-700">
                  Descripción *
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                      disabled
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Crear con IA
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Próximamente</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                placeholder="Describe la propiedad, sus características principales, estado, comodidades..."
                rows={8}
                className="resize-none"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Resumen de la Propiedad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <strong>Operación:</strong> {formData.operation_type}<br/>
                  <strong>Tipo:</strong> {formData.property_type}<br/>
                  <strong>Superficie:</strong> {formData.covered_surface} m²<br/>
                  {formData.rooms && <span><strong>Ambientes:</strong> {formData.rooms}<br/></span>}
                </div>
                <div>
                  <strong>Precio:</strong> {formData.price_currency === 'USD' ? 'US$' : '$'} {formData.price?.toLocaleString()}<br/>
                  <strong>Dirección:</strong> {formData.address}<br/>
                  {formData.expenses && <span><strong>Expensas:</strong> {formData.expenses_currency === 'USD' ? 'US$' : '$'} {formData.expenses.toLocaleString()}<br/></span>}
                </div>
              </div>

              {/* 🆕 MOSTRAR DETALLES CON BARRIO INCLUIDO */}
              {addressFieldsVisible && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <strong className="text-gray-700">Detalles de dirección:</strong>
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Calle:</strong> {formData.street} {formData.street_number}<br/>
                    {formData.floor && <span><strong>Piso:</strong> {formData.floor}<br/></span>}
                    {formData.apartment && <span><strong>Depto:</strong> {formData.apartment}<br/></span>}
                    {formData.neighborhood && <span><strong>Barrio:</strong> {formData.neighborhood}<br/></span>}
                    <strong>Localidad:</strong> {formData.locality}<br/>
                    <strong>Provincia:</strong> {formData.province}<br/>
                    {formData.postal_code && <span><strong>CP:</strong> {formData.postal_code}<br/></span>}
                    <strong>País:</strong> {formData.country}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-green-200">
                <strong>Título:</strong> {formData.title}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">¿Todo está correcto?</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Al confirmar, se procesará automáticamente en RedRemax.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop&crop=center')`,
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link 
              href="/propiedades" 
              className="inline-flex items-center gap-2 text-white hover:text-red-300 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver a propiedades
            </Link>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">
                Cargar Nueva Propiedad
              </h1>
              <p className="text-white/80 text-lg">
                
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const isCompleted = isStepCompleted(step.id)
                const isCurrent = currentStep === step.id
                const IconComponent = step.icon
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div 
                      className={`flex flex-col items-center cursor-pointer transition-all ${
                        isCurrent ? 'scale-110' : ''
                      }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isCurrent 
                            ? 'bg-red-600 border-red-600 text-white' 
                            : 'bg-white/20 border-white/40 text-white/60'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={20} />
                        ) : (
                          <IconComponent size={20} />
                        )}
                      </div>
                      <span 
                        className={`mt-2 text-xs font-medium text-center transition-colors ${
                          isCurrent ? 'text-white' : 'text-white/60'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    
                    {index < STEPS.length - 1 && (
                      <div 
                        className={`w-16 h-0.5 mx-4 transition-colors ${
                          isStepCompleted(step.id) ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto">
            <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl text-gray-800">
                  {(() => {
                    const StepIcon = STEPS[currentStep - 1].icon
                    return <StepIcon size={28} className="text-red-600" />
                  })()}
                  {STEPS[currentStep - 1].title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {STEPS[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <div className="mb-8">
                  {renderStepContent()}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6"
                  >
                    Anterior
                  </Button>

                  <div className="text-sm text-gray-500">
                    Paso {currentStep} de {STEPS.length}
                  </div>

                  {currentStep < 6 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="px-6 bg-red-600 hover:bg-red-700"
                    >
                      {currentStep === 5 ? 'Revisar' : 'Siguiente'}
                    </Button>
                  ) : (
                    <Button 
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isLoading || !validateCurrentStep()}
                      className="px-8 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Publicando en RedRemax...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar y Publicar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Debug Panel */}
            {lastApiResponse && (
              <Card className="backdrop-blur-sm bg-yellow-50/95 border-yellow-200 mt-6">
                <CardHeader>
                  <CardTitle className="text-yellow-800 text-lg">
                    🛠️ Debug - Última Respuesta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-yellow-100 p-4 rounded-lg overflow-auto max-h-60 text-yellow-900">
                    {JSON.stringify(lastApiResponse, null, 2)}
                  </pre>
                  <Button 
                    onClick={() => setLastApiResponse(null)}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Limpiar Debug
                  </Button>
                </CardContent>
              </Card>
            )}
          </form>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}