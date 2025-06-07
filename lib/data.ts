import type { PropertyType, AgentType, DatabaseType } from "./types"

// Datos del mock proporcionado
export const mockDatabase: DatabaseType = {
  properties: [
    {
      id: "1",
      mls_id: "371165-214",
      title: "Departamento Estándar de 3 ambientes en V.Lopez-Vias/Rio",
      description: "Excelente departamento estándar en Vicente Lopez. 70m² cubiertos. Ideal para alquiler temporal.",
      status: "Activa",
      operation_type: "Alquiler temporal",
      property_type: "Departamento Estándar",
      address: "Avenida del Libertador 230",
      neighborhood: "V.Lopez-Vias/Rio",
      city: "Vicente Lopez",
      latitude: -34.5329,
      longitude: -58.4695,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      covered_surface: 70,
      uncovered_surface: null,
      semicovered_surface: 10,
      land_surface: null,
      total_built_surface: 80,
      price: 1000,
      currency: "USD",
      agent_name: "Roberto JorgeRaffo",
      days_on_market: 25,
      created_at: "2025-05-15T10:30:00Z",
      listing_date: "2025-05-15",
      images: [
        "https://d1acdg20u0pmxj.cloudfront.net/listings/4380d021-7286-43e5-91d2-414fee04e082/860x440/b866798b-e39b-4cfb-b172-21b2a25137db.webp",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=860&h=440&fit=crop",
      ],
    },
    {
      id: "2",
      mls_id: "371278-121",
      title: "Departamento Dúplex de 5 ambientes en Colegiales",
      description: "Excelente departamento dúplex en Colegiales. Ideal para venta.",
      status: "Activa",
      operation_type: "Venta",
      property_type: "Departamento Dúplex",
      address: "Teodoro Garcia 3150",
      neighborhood: null,
      city: "Colegiales",
      latitude: -34.5624,
      longitude: -58.4512,
      rooms: 5,
      bedrooms: 3,
      bathrooms: 2,
      garages: 0,
      covered_surface: null,
      uncovered_surface: null,
      semicovered_surface: null,
      land_surface: null,
      total_built_surface: null,
      price: 760000,
      currency: "USD",
      agent_name: "EnriquetaUre",
      days_on_market: 18,
      created_at: "2025-05-22T14:15:00Z",
      listing_date: "2025-05-22",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=860&h=440&fit=crop",
      ],
    },
    {
      id: "3",
      mls_id: "371352-236",
      title: "Local de 0 ambientes en Palermo",
      description: "Excelente local en Palermo. Ideal para venta.",
      status: "Activa",
      operation_type: "Venta",
      property_type: "Local",
      address: "Jerónimo Salguero 1883",
      neighborhood: null,
      city: "Palermo",
      latitude: -34.5889,
      longitude: -58.4298,
      rooms: 0,
      bedrooms: 0,
      bathrooms: 1,
      garages: 0,
      covered_surface: null,
      uncovered_surface: null,
      semicovered_surface: null,
      land_surface: null,
      total_built_surface: null,
      price: 150000,
      currency: "USD",
      agent_name: "MiguelHalife",
      days_on_market: 42,
      created_at: "2025-04-25T09:45:00Z",
      listing_date: "2025-04-25",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=860&h=440&fit=crop",
      ],
    },
    {
      id: "4",
      mls_id: "371352-238",
      title: "Terrenos y Lotes de 0 ambientes en San Telmo",
      description: "Excelente terrenos y lotes en San Telmo. Ideal para venta.",
      status: "Activa",
      operation_type: "Venta",
      property_type: "Terrenos y Lotes",
      address: "Perú 684",
      neighborhood: null,
      city: "San Telmo",
      latitude: -34.6142,
      longitude: -58.3776,
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      garages: 0,
      covered_surface: null,
      uncovered_surface: null,
      semicovered_surface: null,
      land_surface: null,
      total_built_surface: null,
      price: 850000,
      currency: "USD",
      agent_name: "MiguelHalife",
      days_on_market: 35,
      created_at: "2025-05-02T16:20:00Z",
      listing_date: "2025-05-02",
      images: [
        "https://images.unsplash.com/photo-1560449752-5cb6fa4d5adf?w=860&h=440&fit=crop",
        "https://d1acdg20u0pmxj.cloudfront.net/listings/905f64a5-1c07-4ede-9e2e-fb7449e29017/860x440/ad44e2c2-7e10-46fb-b7e0-d8e500374941.webp",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=860&h=440&fit=crop",
      ],
    },
    {
      id: "5",
      mls_id: "371366-13",
      title: "Casa de 4 ambientes en Esc.-B.Belen",
      description: "Excelente casa en Rincon de Milberg. 220m² cubiertos. Terreno de 360m². Ideal para venta.",
      status: "Activa",
      operation_type: "Venta",
      property_type: "Casa",
      address: "Los Robles 234",
      neighborhood: "Esc.-B.Belen",
      city: "Rincon de Milberg",
      latitude: -34.4134,
      longitude: -58.6521,
      rooms: 4,
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      covered_surface: 220,
      uncovered_surface: null,
      semicovered_surface: null,
      land_surface: 360,
      total_built_surface: 220,
      price: 465000,
      currency: "USD",
      agent_name: "AlejandroMarzilio",
      days_on_market: 12,
      created_at: "2025-05-25T11:10:00Z",
      listing_date: "2025-05-25",
      images: [
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=860&h=440&fit=crop",
        "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=860&h=440&fit=crop",
      ],
    },
  ],
  agents: [
    {
      id: "1",
      name: "Roberto JorgeRaffo",
      email: "roberto.raffo@remaxsuma.com",
      phone: "+54 11 1234-5001",
      properties_count: 8,
      avatar: "/images/agent1.jpg",
    },
    {
      id: "2",
      name: "EnriquetaUre",
      email: "enriqueta.ure@remaxsuma.com",
      phone: "+54 11 1234-5002",
      properties_count: 6,
      avatar: "/images/agent2.jpg",
    },
    {
      id: "3",
      name: "MiguelHalife",
      email: "miguel.halife@remaxsuma.com",
      phone: "+54 11 1234-5003",
      properties_count: 12,
      avatar: "/images/agent3.jpg",
    },
    {
      id: "4",
      name: "AlejandroMarzilio",
      email: "alejandro.marzilio@remaxsuma.com",
      phone: "+54 11 1234-5004",
      properties_count: 4,
      avatar: "/images/agent4.jpg",
    },
    {
      id: "5",
      name: "María González",
      email: "maria.gonzalez@remaxsuma.com",
      phone: "+54 11 1234-5005",
      properties_count: 15,
      avatar: "/images/agent5.jpg",
    },
  ],
  stats: {
    total_properties: 50,
    active_properties: 47,
    total_agents: 25,
    total_cities: 30,
    total_value: 13287950,
    average_price: 265759,
    price_range: {
      min: 600,
      max: 1540000,
    },
    property_types: {
      "Departamento Estándar": 28,
      Casa: 6,
      "Terrenos y Lotes": 3,
      "Departamento Dúplex": 2,
      Local: 2,
      "Departamento Monoambiente": 2,
      Cochera: 2,
      Oficina: 1,
      "Casa Dúplex": 1,
      "Departamento Penthouse": 1,
      "Casa Triplex": 1,
      PH: 1,
    },
    operation_types: {
      Venta: 42,
      Alquiler: 5,
      "Alquiler temporal": 3,
    },
    top_cities: [
      "Vicente Lopez",
      "Colegiales",
      "Palermo",
      "San Telmo",
      "Villa Urquiza",
      "Villa Pueyrredón",
      "San Fernando",
    ],
  },
  generated_at: "2025-06-06T20:30:00Z",
  source: "reporte_propiedades26052025.csv",
  version: "1.0",
}

// Funciones helper para trabajar con los datos
export const getAgentByName = (agentName: string): AgentType | undefined => {
  return mockDatabase.agents.find((agent) => agent.name === agentName)
}

export const getPropertyById = (id: string): PropertyType | undefined => {
  return mockDatabase.properties.find((property) => property.id === id)
}

export const formatPrice = (price: number, currency: string): string => {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(price)
}

export const formatSurface = (surface: number | null | undefined): string => {
  if (!surface) return "N/A"
  return `${surface}m²`
}

export const getOperationTypeLabel = (operationType: string): string => {
  const labels: Record<string, string> = {
    Venta: "Venta",
    Alquiler: "Alquiler",
    "Alquiler temporal": "Alquiler Temporal",
  }
  return labels[operationType] || operationType
}

export const getPropertyTypeLabel = (propertyType: string): string => {
  return propertyType
}

// Exportar datos para compatibilidad con componentes existentes
export const allProperties = mockDatabase.properties
export const featuredProperties = mockDatabase.properties.slice(0, 3)
export const agents = mockDatabase.agents
export const stats = mockDatabase.stats
