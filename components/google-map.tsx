// components/google-map.tsx
"use client"

import { useCallback, useState, useMemo, useEffect, useRef } from "react"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import Image from "next/image"
import Link from "next/link"
import type { PropertyType } from "@/lib/types"
import { formatPrice } from "@/lib/data"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { BedDouble, Bath,  Car, Star,  Ruler } from "lucide-react" // <- AÑADIR ÍCONOS
import FavoriteButton from "@/components/favorite-button" // <- AÑADIR BOTÓN DE FAVORITOS


// --- Constantes y Helpers fuera del componente para evitar re-declaraciones ---

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const defaultCenter = {
  lat: -34.6037,
  lng: -58.3816, // Buenos Aires
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  gestureHandling: "cooperative" as const,
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  ],
}

/**
 * MEJORA: Unificamos la lógica para obtener la información de la operación.
 * Devuelve tanto el color como el texto para evitar duplicar la lógica del switch.
 */
const getOperationInfo = (property: PropertyType): { text: string; color: string } => {
  const operationType = property.operation_type || property.tipo_operacion || (property.price && property.price > 500000 ? 'venta' : 'alquiler');
  
  switch (operationType) {
    case 'venta':
    case 'sale':
      return { text: 'En Venta', color: '#EF4444' }; // Rojo
    case 'alquiler':
    case 'rent':
      return { text: 'En Alquiler', color: '#3B82F6' }; // Azul
    case 'alquiler-temporal':
      return { text: 'Alquiler Temporal', color: '#10B981' }; // Verde
    default:
      return { text: 'En Venta', color: '#EF4444' }; // Rojo por defecto
  }
};
const MAP_PIN_PATH = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5z';

/**
 * MEJORA: La función para crear el ícono sigue igual, pero ahora se alimenta de getOperationInfo.
 */
const createCustomMarkerIcon = (color: string, isSelected: boolean) => {
  if (typeof window !== 'undefined' && window.google) {
    return {
      path: MAP_PIN_PATH,
      
      // 2. Ajustamos la escala para que se vea bien.
      scale: isSelected ? 1.8 : 1.5,
      
      // 3. El color dinámico sigue funcionando igual.
      fillColor: color,
      fillOpacity: 1,
      
      // 4. Mantenemos el borde blanco para un buen contraste.
      strokeColor: "#ffffff",
      strokeWeight: 1.5,
      
      // 5. ¡CRÍTICO! Le decimos a Google Maps dónde está la punta del pin.
      // El path tiene un tamaño de 24x24, así que el centro es (12, 12) y la punta (12, 24).
      anchor: new window.google.maps.Point(12, 24),
      
      // 6. (Opcional) Ayuda a posicionar etiquetas si las usaras en el futuro.
      labelOrigin: new window.google.maps.Point(12, 9),
    };
  }
  return undefined;
};

// --- Componente Principal ---
interface GoogleMapComponentProps {
  properties: PropertyType[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  // AÑADIMOS ESTA PROP
  onPropertyClick?: (property: PropertyType) => void 
}

export default function GoogleMapComponent({
  properties,
  center,
  zoom = 12,
  height = "400px",
  // La recibimos aquí
  onPropertyClick, 
}: GoogleMapComponentProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null);

  // Filtrar propiedades válidas (sin cambios, ya estaba bien)
  const validProperties = useMemo(() =>
    properties.filter(p => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)),
    [properties]
  );

  /**
   * MEJORA: Se añade un useEffect para limpiar la selección si la propiedad ya no está en la lista.
   * Esto evita errores si la lista de propiedades se actualiza desde fuera.
   */
  useEffect(() => {
    if (selectedProperty && !validProperties.find(p => p.id === selectedProperty.id)) {
      setSelectedProperty(null);
    }
  }, [validProperties, selectedProperty]);

  // Cálculo del centro del mapa (sin cambios, ya estaba bien)
  const mapCenter = useMemo(() => {
    if (center) return center;
    if (validProperties.length === 1) {
      return { lat: validProperties[0].latitude!, lng: validProperties[0].longitude! };
    }
    if (validProperties.length > 1) {
      const avgLat = validProperties.reduce((sum, prop) => sum + prop.latitude!, 0) / validProperties.length;
      const avgLng = validProperties.reduce((sum, prop) => sum + prop.longitude!, 0) / validProperties.length;
      return { lat: avgLat, lng: avgLng };
    }
    return defaultCenter;
  }, [center, validProperties]);

  // Callback onLoad para ajustar límites (sin cambios, ya estaba bien)
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map; // Guardamos la instancia del mapa

    if (validProperties.length > 1 && !center) {
      const bounds = new window.google.maps.LatLngBounds();
      validProperties.forEach(p => bounds.extend({ lat: p.latitude!, lng: p.longitude! }));
      map.fitBounds(bounds);
      
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [validProperties, center]);

  // Memoizar el ícono para cada marcador
  const getMarkerIcon = (property: PropertyType) => {
    const { color } = getOperationInfo(property);
    const isSelected = selectedProperty?.id === property.id;
    return createCustomMarkerIcon(color, isSelected);
  };
  
  /**
   * MEJORA: Memoizamos las opciones del InfoWindow para no crear un objeto en cada render.
   */
  const infoWindowOptions = useMemo(() => ({
    pixelOffset: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(0, -10) : undefined
  }), []);

  // Manejadores de eventos (sin cambios)
  const handleMarkerClick = (property: PropertyType) => {
 
    setSelectedProperty(property);
    
    // Hacemos que el mapa se mueva suavemente al pin seleccionado
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: property.latitude!,
        lng: property.longitude!,
      });
      // Opcional: Si quieres asegurarte un nivel de zoom cercano
      if (mapRef.current.getZoom()! < 15) {
        mapRef.current.setZoom(15);
      }
    }

    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };  const handleInfoWindowClose = () => setSelectedProperty(null);

  // Renderizado condicional (sin cambios, ya estaba bien)
  if (loadError) return <div>Error al cargar el mapa.</div>;
  if (!isLoaded) return <div style={{ height }} className="flex items-center justify-center bg-gray-100">Cargando mapa...</div>;
  
  // MEJORA: Se calcula la info de la operación una sola vez para el InfoWindow
  const selectedPropertyInfo = selectedProperty ? getOperationInfo(selectedProperty) : null;

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden relative border border-gray-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        options={mapOptions}
      >
        {validProperties.map(property => (
          <Marker
            key={property.id}
            position={{ lat: property.latitude!, lng: property.longitude! }}
            onClick={() => handleMarkerClick(property)}
            icon={getMarkerIcon(property)}
            title={property.title}
          />
        ))}

        {selectedProperty && selectedPropertyInfo && (
  <InfoWindow
  position={{ lat: selectedProperty.latitude!, lng: selectedProperty.longitude! }}
  onCloseClick={handleInfoWindowClose}
  options={infoWindowOptions}
>
  {/* MEJORA: Contenedor con mejor espaciado y ancho */}
  <div className="max-w-sm p-1 space-y-2 font-sans">
    
    {/* SECCIÓN DE IMAGEN */}
    {selectedProperty.images?.[0] && (
      <div className="relative h-40 mb-2 overflow-hidden rounded-lg">
        <Image src={selectedProperty.images[0]} alt={selectedProperty.title} fill className="object-cover"/>
      </div>
    )}

    {/* SECCIÓN DE TÍTULO Y FAVORITOS */}
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-base font-bold leading-tight text-gray-800">
        {selectedProperty.title}
      </h3>
      {/* FUNCIONALIDAD: Botón de Favoritos */}
      <FavoriteButton property={selectedProperty} size="sm" />
    </div>

    {/* SECCIÓN DE PRECIO Y OPERACIÓN */}
    <div>
      <span 
        className="px-2 py-1 text-xs font-bold text-white rounded-full"
        style={{ backgroundColor: selectedPropertyInfo.color }}
      >
        {selectedPropertyInfo.text}
      </span>
      <p className="mt-2 text-xl font-extrabold text-gray-900" style={{ color: selectedPropertyInfo.color }}>
        {formatPrice(selectedProperty.price, selectedProperty.currency)}
      </p>
    </div>

    {/* SECCIÓN DE CARACTERÍSTICAS CON ÍCONOS */}
    <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-600 border-t">
      {selectedProperty.rooms && (
        <div className="flex items-center gap-1.5">
          <BedDouble size={16} className="text-gray-500" />
          <span className="font-medium">{selectedProperty.rooms} amb.</span>
        </div>
      )}
      {selectedProperty.bathrooms && (
        <div className="flex items-center gap-1.5">
          <Bath size={16} className="text-gray-500" />
          <span className="font-medium">{selectedProperty.bathrooms} baños</span>
        </div>
      )}
      {selectedProperty.covered_surface && (
        <div className="flex items-center gap-1.5">
          <Ruler size={16} className="text-gray-500" />
          <span className="font-medium">{selectedProperty.covered_surface}m²</span>
        </div>
      )}
      {selectedProperty.parking && (
        <div className="flex items-center gap-1.5">
          <Car size={16} className="text-gray-500" />
          <span className="font-medium">Cochera</span>
        </div>
      )}
    </div>

    {/* BOTÓN DE ACCIÓN */}
    <Link 
      href={`/propiedades/${selectedProperty.id}`} 
      className="inline-block w-full px-3 py-2 mt-2 text-sm font-semibold text-center text-white rounded-lg transition-opacity hover:opacity-90"
      style={{ backgroundColor: selectedPropertyInfo.color }}
    >
      Ver Detalles de la Propiedad
    </Link>
  </div>
</InfoWindow>
        )}
      </GoogleMap>

      {/* Leyenda y contador (sin cambios) */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <h4 className="font-semibold text-gray-700 mb-2">Leyenda</h4>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getOperationInfo({
            operation_type: 'venta',
            tipo_operacion: "",
            parking: undefined,
            id: "",
            mls_id: "",
            title: "",
            description: "",
            status: "",
            property_type: "",
            address: "",
            city: "",
            latitude: 0,
            longitude: 0,
            rooms: 0,
            bedrooms: 0,
            bathrooms: 0,
            garages: 0,
            price: 0,
            currency: "",
            agent_name: "",
            days_on_market: 0,
            created_at: "",
            listing_date: "",
            images: []
          }).color }}></div>
          <span>En Venta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getOperationInfo({
            operation_type: 'alquiler',
            tipo_operacion: "",
            parking: undefined,
            id: "",
            mls_id: "",
            title: "",
            description: "",
            status: "",
            property_type: "",
            address: "",
            city: "",
            latitude: 0,
            longitude: 0,
            rooms: 0,
            bedrooms: 0,
            bathrooms: 0,
            garages: 0,
            price: 0,
            currency: "",
            agent_name: "",
            days_on_market: 0,
            created_at: "",
            listing_date: "",
            images: []
          }).color }}></div>
          <span>En Alquiler</span>
        </div>
      </div>
      
      {validProperties.length < properties.length && (
         <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-600">
           Mostrando {validProperties.length} de {properties.length} propiedades.
         </div>
      )}
    </div>
  );
}