// components/google-map.tsx
"use client"

import { useCallback, useState, useMemo, useEffect, useRef } from "react"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import Image from "next/image"
import Link from "next/link"
import type { PropertyType } from "@/lib/types"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { Bed, Bath, Car, Ruler, MapPin } from "lucide-react"

// --- Constantes y Helpers ---
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

// Función mejorada para formatear precios (SIN abreviaciones)
const formatPrice = (price: number) => {
  return `$${price.toLocaleString('es-AR')}`
}

// Información de operación
const getOperationInfo = (property: PropertyType): { text: string; color: string } => {
  const operationType = property.operation_type || 'Venta';
  
  switch (operationType) {
    case 'Venta':
      return { text: 'En Venta', color: '#EF4444' }; // Rojo
    case 'Alquiler':
      return { text: 'En Alquiler', color: '#3B82F6' }; // Azul
    case 'Alquiler Temporal':
      return { text: 'Alquiler Temporal', color: '#10B981' }; // Verde
    default:
      return { text: 'En Venta', color: '#EF4444' };
  }
}

// Ícono del pin personalizado
const MAP_PIN_PATH = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5z';

const createCustomMarkerIcon = (color: string, isSelected: boolean) => {
  if (typeof window !== 'undefined' && window.google) {
    return {
      path: MAP_PIN_PATH,
      scale: isSelected ? 1.8 : 1.5,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 1.5,
      anchor: new window.google.maps.Point(12, 24),
      labelOrigin: new window.google.maps.Point(12, 9),
    };
  }
  return undefined;
}

// --- Componente Principal ---
interface GoogleMapComponentProps {
  properties: PropertyType[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  onPropertyClick?: (property: PropertyType) => void 
}

export default function GoogleMapComponent({
  properties,
  center,
  zoom = 12,
  height = "400px",
  onPropertyClick, 
}: GoogleMapComponentProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null);

  // Filtrar propiedades válidas
  const validProperties = useMemo(() =>
    properties.filter(p => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)),
    [properties]
  );

  // Limpiar selección si la propiedad ya no está en la lista
  useEffect(() => {
    if (selectedProperty && !validProperties.find(p => p.id === selectedProperty.id)) {
      setSelectedProperty(null);
    }
  }, [validProperties, selectedProperty]);

  // Cálculo del centro del mapa
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

  // Callback onLoad para ajustar límites
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

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

  // Funciones para manejar eventos
  const getMarkerIcon = (property: PropertyType) => {
    const { color } = getOperationInfo(property);
    const isSelected = selectedProperty?.id === property.id;
    return createCustomMarkerIcon(color, isSelected);
  };

  const handleMarkerClick = (property: PropertyType) => {
    setSelectedProperty(property);
    
    if (mapRef.current) {
      // Calcular un offset más sutil para que el InfoWindow sea visible
      const lat = property.latitude!;
      const lng = property.longitude!;
      
      // Ajuste más sutil - solo unos 80-100 metros al sur
      const adjustedLat = lat - 0.0008;
      
      mapRef.current.panTo({
        lat: adjustedLat,
        lng: lng,
      });
      
      // Asegurar un nivel de zoom apropiado
      if (mapRef.current.getZoom()! < 15) {
        mapRef.current.setZoom(15);
      }
    }

    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  const handleInfoWindowClose = () => setSelectedProperty(null);

  // Renderizado condicional
  if (loadError) return <div>Error al cargar el mapa.</div>;
  if (!isLoaded) return <div style={{ height }} className="flex items-center justify-center bg-gray-100">Cargando mapa...</div>;

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
            options={{
              pixelOffset: new window.google.maps.Size(0, 240), // Aparecer ARRIBA del pin
              maxWidth: 320, // Más ancho
            }}
          >
            <div className="relative p-0 m-0 bg-white rounded-lg shadow-lg overflow-hidden" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', width: '300px' }}>
              {/* Flecha apuntando hacia abajo al pin */}
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              ></div>
              {/* Imagen de la propiedad */}
              {selectedProperty.images?.[0] && (
                <div className="relative h-40 w-full">
                  <img 
                    src={selectedProperty.images[0]} 
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                  />
                  <div className="absolute top-3 left-3">
                    <span 
                      className="px-3 py-1.5 text-sm font-semibold text-white rounded-full"
                      style={{ backgroundColor: selectedPropertyInfo.color }}
                    >
                      {selectedPropertyInfo.text}
                    </span>
                  </div>
                </div>
              )}

              {/* Contenido */}
              <div className="p-4">
                {/* Título y precio */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-base leading-tight mb-2" style={{ margin: 0, lineHeight: '1.3' }}>
                    {selectedProperty.title}
                  </h3>
                  <p className="text-xl font-bold mb-2" style={{ color: selectedPropertyInfo.color, margin: 0 }}>
                    {formatPrice(selectedProperty.price)}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-1" />
                    <span>{selectedProperty.neighborhood || selectedProperty.address}</span>
                  </div>
                </div>

                {/* Características */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  {selectedProperty.rooms && (
                    <div className="flex items-center gap-1.5">
                      <Bed size={14} />
                      <span>{selectedProperty.rooms} amb</span>
                    </div>
                  )}
                  {selectedProperty.bathrooms && (
                    <div className="flex items-center gap-1.5">
                      <Bath size={14} />
                      <span>{selectedProperty.bathrooms} baños</span>
                    </div>
                  )}
                  {selectedProperty.total_built_surface && (
                    <div className="flex items-center gap-1.5">
                      <Ruler size={14} />
                      <span>{selectedProperty.total_built_surface}m²</span>
                    </div>
                  )}
                  {selectedProperty.parking && (
                    <div className="flex items-center gap-1.5">
                      <Car size={14} />
                      <span>Cochera</span>
                    </div>
                  )}
                </div>

                {/* Botón de acción */}
                <Link href={`/propiedades/${selectedProperty.id}`}>
                  <button 
                    className="w-full text-white py-3 px-4 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{ 
                      backgroundColor: selectedPropertyInfo.color,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Detalles de la Propiedad
                  </button>
                </Link>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Leyenda */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <h4 className="font-semibold text-gray-700 mb-2">Leyenda</h4>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>En Venta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>En Alquiler</span>
        </div>
      </div>
      
      {/* Contador de propiedades */}
      {validProperties.length < properties.length && (
         <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-600">
           Mostrando {validProperties.length} de {properties.length} propiedades
         </div>
      )}
    </div>
  );
}