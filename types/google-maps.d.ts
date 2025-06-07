// types/google-maps.d.ts
// RUTA: types/google-maps.d.ts
// Extensión de tipos para Google Maps en caso de problemas con @types/google.maps

declare global {
  interface Window {
    google: typeof google;
  }
}

// Si tienes problemas con los tipos, puedes usar estas definiciones básicas
export interface PlaceResult {
  formatted_address?: string;
  name?: string;
  place_id?: string;
  geometry?: {
    location?: {
      lat(): number;
      lng(): number;
    };
  };
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export interface AutocompleteOptions {
  componentRestrictions?: {
    country: string | string[];
  };
  fields?: string[];
  types?: string[];
}

// Tipos para el contexto del provider
export interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

// Tipos para los componentes
export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}