export interface AgentType {
  id: string
  name: string
  email: string
  phone: string
  properties_count: number
  avatar?: string
  bio?: string
}

export interface PropertyType {
  features: never[]
  tipo_operacion: string
  parking: any
  id: string
  mls_id: string
  title: string
  description: string
  status: string
  operation_type: string
  property_type: string
  address: string
  neighborhood?: string | null
  city: string
  latitude: number
  longitude: number
  rooms: number
  bedrooms: number
  bathrooms: number
  garages: number
  covered_surface?: number | null
  uncovered_surface?: number | null
  semicovered_surface?: number | null
  land_surface?: number | null
  total_built_surface?: number
  price: number
  currency: string
  agent_name: string
  days_on_market: number
  created_at: string
  listing_date: string
  images: string[]
}

export interface StatsType {
  total_properties: number
  active_properties: number
  total_agents: number
  total_cities: number
  total_value: number
  average_price: number
  price_range: {
    min: number
    max: number
  }
  property_types: Record<string, number>
  operation_types: Record<string, number>
  top_cities: string[]
}

export interface DatabaseType {
  properties: PropertyType[]
  agents: AgentType[]
  stats: StatsType
  generated_at: string
  source: string
  version: string
}

export interface SearchFilters {
  location?: Location;
  radius?: number;
  operationType?: 'venta' | 'alquiler' | 'alquiler-temporal';
  propertyType?: string;
  priceRange?: [number, number];
  // ANTES: rooms?: number;
  // AHORA: Permitimos string para 'monoambiente'
  rooms?: number | string; 
  bathrooms?: number;
  features?: string[];
}