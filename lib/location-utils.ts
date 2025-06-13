// lib/location-utils.ts
// RUTA: lib/location-utils.ts
import type { PropertyType } from "@/lib/types"

export interface LocationData {
  address: string
  lat: number
  lng: number
  placeId?: string
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  types?: string[] // Para identificar si es barrio, ciudad, etc.
}

export interface SearchFilters {
  location?: LocationData
  radius?: number // en kilómetros - solo si no hay bounds
  operationType?: string
  propertyType?: string
  priceRange?: [number, number]
  rooms?: number
  bathrooms?: number
  features?: string[]
}

/**
 * Verifica si un punto está dentro de bounds geográficos
 */
export function isPointInBounds(
  lat: number, 
  lng: number, 
  bounds: { north: number; south: number; east: number; west: number }
): boolean {
  return lat >= bounds.south && 
         lat <= bounds.north && 
         lng >= bounds.west && 
         lng <= bounds.east
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 */
export function calculateDistance(
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (coords2.lat - coords1.lat) * (Math.PI / 180)
  const dLng = (coords2.lng - coords1.lng) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1.lat * (Math.PI / 180)) *
      Math.cos(coords2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}



/**
 * Obtiene información del tipo de lugar para mostrar al usuario
 */
export function getLocationTypeLabel(location: LocationData): string {
  if (!location.types) return "Ubicación"
  
  if (location.types.includes('neighborhood') || location.types.includes('sublocality')) {
    return "Barrio"
  }
  if (location.types.includes('locality')) {
    return "Ciudad"
  }
  if (location.types.includes('administrative_area_level_2')) {
    return "Partido"
  }
  if (location.types.includes('route')) {
    return "Calle"
  }
  if (location.types.includes('establishment')) {
    return "Lugar"
  }
  
  return "Zona"
}

/**
 * Genera un mensaje descriptivo para la búsqueda
 */
export function getSearchDescription(location: LocationData, count: number): string {
  const typeLabel = getLocationTypeLabel(location)
  const method = location.bounds ? "en" : "cerca de"
  
  return `${count} propiedades ${method} ${typeLabel.toLowerCase()} ${location.address}`
}
/**
 * Filtra propiedades por ubicación, basado en coincidencia de texto del barrio.
 */
export function filterPropertiesByLocation(
  properties: PropertyType[],
  location: LocationData
): PropertyType[] {
  if (!location.address) return properties;

  const searchAddress = location.address.toLowerCase();

  return properties.filter(property => {
    if (!property.neighborhood) return false;
    // Si el barrio de la propiedad está incluido en la dirección buscada, se mantiene.
    return searchAddress.includes(property.neighborhood.toLowerCase());
  });
}

/**
 * Filtra propiedades por operación (tu función, perfecta como está).
 */
export function filterPropertiesByOperation(
  properties: PropertyType[],
  operationType: string
): PropertyType[] {
  if (!operationType) return properties;

  const operationMap: Record<string, string> = {
    "venta": "Venta",
    "alquiler": "Alquiler", 
    "alquiler-temporal": "Alquiler Temporal"
  };
  
  const mappedOperation = operationMap[operationType.toLowerCase()] || operationType;
  return properties.filter(property => 
    property.operation_type?.toLowerCase() === mappedOperation.toLowerCase()
  );
}

/**
 * Filtra propiedades por tipo (tu función, perfecta como está).
 */
export function filterPropertiesByType(
  properties: PropertyType[],
  propertyType: string
): PropertyType[] {
  if (!propertyType) return properties;
  
  const typeMap: Record<string, string> = {
    "departamento-estandar": "Departamento Estándar",
    "casa": "Casa",
    "departamento-duplex": "Departamento Dúplex", 
    "local": "Local",
    "terrenos-lotes": "Terrenos y Lotes",
    "terrenos-y-lotes": "Terrenos y Lotes",
    "departamento-monoambiente": "Departamento Monoambiente",
    "oficina": "Oficina",
    "cochera": "Cochera",
    "casa-duplex": "Casa Dúplex",
    "departamento-penthouse": "Departamento Penthouse",
    "casa-triplex": "Casa Triplex",
    "ph": "PH"
  };
  
  const mappedType = typeMap[propertyType.toLowerCase()] || propertyType;
  return properties.filter(property => 
    property.property_type?.toLowerCase() === mappedType.toLowerCase()
  );
}

/**
 * Filtra propiedades por rango de precio.
 */
export function filterPropertiesByPrice(
  properties: PropertyType[],
  priceRange: [number, number]
): PropertyType[] {
  const [min, max] = priceRange;
  return properties.filter(property => {
    const price = property.price || 0;
    return price >= min && price <= max;
  });
}

/**
 * Filtra propiedades por número de ambientes (VERSIÓN MEJORADA).
 */
export function filterPropertiesByRooms(
  properties: PropertyType[],
  rooms: number | string
): PropertyType[] {
  if (rooms === 'monoambiente') {
    // Si el filtro es 'monoambiente', buscamos el tipo de propiedad correspondiente.
    return properties.filter(p => p.property_type === 'Departamento Monoambiente');
  }

  if (typeof rooms === 'number') {
    if (rooms >= 5) { // Lógica para "5+"
      return properties.filter(p => p.rooms != null && p.rooms >= 5);
    }
    // Lógica para números exactos (1, 2, 3, 4)
    return properties.filter(p => p.rooms === rooms);
  }

  // Si no es un caso conocido, no se aplica el filtro.
  return properties;
}

/**
 * Filtra propiedades por número de baños (VERSIÓN MEJORADA).
 */
export function filterPropertiesByBathrooms(
    properties: PropertyType[],
    bathrooms: number
): PropertyType[] {
    if (bathrooms >= 4) { // Lógica para "4+"
        return properties.filter(p => p.bathrooms != null && p.bathrooms >= 4);
    }
    // Lógica para números exactos (1, 2, 3)
    return properties.filter(p => p.bathrooms === bathrooms);
}

// ===================================================================
// FUNCIÓN PRINCIPAL "ORQUESTADORA"
// ===================================================================

/**
 * Aplica una cadena de filtros a la lista de propiedades.
 * Esta función ahora llama a las funciones auxiliares de arriba.
 */
export function applyAllFilters(
  properties: PropertyType[],
  filters: SearchFilters
): PropertyType[] {
  let filteredProperties = [...properties];

  if (filters.location) {
    filteredProperties = filterPropertiesByLocation(filteredProperties, filters.location);
  }

  if (filters.operationType) {
    filteredProperties = filterPropertiesByOperation(filteredProperties, filters.operationType);
  }

  if (filters.propertyType) {
    filteredProperties = filterPropertiesByType(filteredProperties, filters.propertyType);
  }
  
  if (filters.priceRange) {
    filteredProperties = filterPropertiesByPrice(filteredProperties, filters.priceRange);
  }

  if (filters.rooms !== undefined) {
    filteredProperties = filterPropertiesByRooms(filteredProperties, filters.rooms);
  }

  if (filters.bathrooms !== undefined) {
    filteredProperties = filterPropertiesByBathrooms(filteredProperties, filters.bathrooms);
  }

  // Aquí puedes añadir más filtros en el futuro, como el de "features".
  // if (filters.features && filters.features.length > 0) { ... }

  return filteredProperties;
}


// ... (resto de las funciones como getPropertiesCenter)
export function getPropertiesCenter(
    properties: PropertyType[]
  ): { lat: number; lng: number } | undefined {
    if (properties.length === 0) return undefined;
    if (properties.length === 1) {
      return { lat: properties[0].latitude!, lng: properties[0].longitude! };
    }
  
    let totalLat = 0;
    let totalLng = 0;
    let validCount = 0;
  
    for (const prop of properties) {
      if (prop.latitude && prop.longitude) {
        totalLat += prop.latitude;
        totalLng += prop.longitude;
        validCount++;
      }
    }
    
    if (validCount === 0) return undefined;
  
    return {
      lat: totalLat / validCount,
      lng: totalLng / validCount,
    };
  }

// La exportación de tipos se mantiene igual

/**
 * Convierte Google Maps LatLngBounds a nuestro formato
 */
export function convertGoogleBounds(bounds: google.maps.LatLngBounds) {
  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()
  
  return {
    north: ne.lat(),
    south: sw.lat(),
    east: ne.lng(),
    west: sw.lng()
  }
}

/**
 * Radios de búsqueda predefinidos (solo para fallback)
 */
export const SEARCH_RADIUS_OPTIONS = [
  { value: 1, label: "1 km" },
  { value: 2, label: "2 km" },
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 15, label: "15 km" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" }
]