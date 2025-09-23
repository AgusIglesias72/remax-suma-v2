'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// Importar los componentes de cada etapa
import { SearchStep } from '@/components/acm/SearchStep';
import { ResultsStep } from '@/components/acm/ResultsStep';
import { ComparisonStep } from '@/components/acm/ComparisonStep';
import { StepIndicator } from '@/components/acm/StepIndicator';

// Tipos
export interface Property {
  id: string;
  images: string[];
  price: number;
  expenses?: number;
  address: string;
  location: string;
  neighborhood?: string;
  status: string;
  views: number;
  messages: number;
  updated: string;
  priceUSD: number;
  totalArea: number;
  coveredArea: number;
  uncoveredArea?: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  garage?: number;
  type: string;
  yearBuilt?: number;
  orientation?: string;
  amenities?: string[];
}

export interface PropertyAction {
  propertyId: string;
  action: 'select' | 'discard' | 'hide';
  timestamp: Date;
}

export interface SearchFilters {
  location: string;
  radius: string;
  radiusUnit: string;
  operationType: string;
  propertyTypes: string[];
  minPrice: string;
  maxPrice: string;
  currency: string;
  rooms: string[];
  bathrooms: string[];
  minCoveredArea: string;
  maxCoveredArea: string;
  minTotalArea: string;
  maxTotalArea: string;
  neighborhoodType: string[];
  amenities: string[];
  status: string;
}

// Datos mock
const mockProperties: Property[] = [
  {
    id: '420851184-30',
    images: ['/api/placeholder/400/300'],
    price: 90000,
    expenses: 100000,
    address: 'Caseros 4246 Piso 5 Dpto C',
    location: 'Vicente Lopez, Buenos Aires',
    neighborhood: 'Vicente Lopez',
    status: 'Activa',
    views: 116,
    messages: 0,
    updated: '3',
    priceUSD: 90000,
    totalArea: 40.62,
    coveredArea: 39.38,
    uncoveredArea: 1.24,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Departamento',
    yearBuilt: 2018,
    orientation: 'Norte',
    amenities: ['Balcón', 'Cocina integrada']
  },
  {
    id: '420141226-149',
    images: ['/api/placeholder/400/300'],
    price: 109000,
    expenses: 60000,
    address: 'Gobernador Ugarte 1661 PB Dpto 3',
    location: 'Vicente Lopez, Buenos Aires',
    neighborhood: 'Vicente Lopez',
    status: 'Activa',
    views: 424,
    messages: 0,
    updated: '4',
    priceUSD: 109000,
    totalArea: 49,
    coveredArea: 45.26,
    uncoveredArea: 3.74,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Departamento',
    yearBuilt: 2015,
    orientation: 'Este'
  },
  {
    id: '420151234-111',
    images: ['/api/placeholder/400/300'],
    price: 330000,
    expenses: 40000,
    address: 'Av. Maipú 3250 Piso 8 Dpto A',
    location: 'Vicente Lopez, Buenos Aires',
    neighborhood: 'Vicente Lopez',
    status: 'Activa',
    views: 89,
    messages: 2,
    updated: '1',
    priceUSD: 330000,
    totalArea: 105,
    coveredArea: 95,
    uncoveredArea: 10,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    type: 'Departamento Premium',
    yearBuilt: 2020,
    orientation: 'Noreste',
    amenities: ['Balcón', 'Parrilla', 'Sum', 'Gimnasio', 'Piscina']
  },
  {
    id: '420151234-112',
    images: ['/api/placeholder/400/300'],
    price: 125000,
    expenses: 80000,
    address: 'Laprida 2150 Piso 3',
    location: 'Vicente Lopez, Buenos Aires',
    neighborhood: 'Florida',
    status: 'Activa',
    views: 201,
    messages: 5,
    updated: '2',
    priceUSD: 125000,
    totalArea: 55,
    coveredArea: 52,
    uncoveredArea: 3,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    garage: 1,
    type: 'Departamento',
    yearBuilt: 2019,
    orientation: 'Sur'
  },
  {
    id: '420151234-113',
    images: ['/api/placeholder/400/300'],
    price: 280000,
    expenses: 35000,
    address: 'Libertador 1800 Piso 10',
    location: 'Vicente Lopez, Buenos Aires',
    neighborhood: 'Olivos',
    status: 'Activa',
    views: 356,
    messages: 8,
    updated: '1',
    priceUSD: 280000,
    totalArea: 92,
    coveredArea: 85,
    uncoveredArea: 7,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    garage: 2,
    type: 'Departamento',
    yearBuilt: 2021,
    orientation: 'Norte',
    amenities: ['Vista al río', 'Balcón aterrazado', 'Sum', 'Seguridad 24hs']
  }
];

export default function NuevoACMPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'search' | 'results' | 'comparison'>('search');
  const [acmName, setAcmName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados de búsqueda
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
    radius: '1',
    radiusUnit: 'km',
    operationType: 'venta',
    propertyTypes: ['departamento'],
    minPrice: '',
    maxPrice: '',
    currency: 'USD',
    rooms: [],
    bathrooms: [],
    minCoveredArea: '',
    maxCoveredArea: '',
    minTotalArea: '',
    maxTotalArea: '',
    neighborhoodType: ['abierto', 'cerrado'],
    amenities: [],
    status: 'activa'
  });

  // Estados de resultados
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [propertyActions, setPropertyActions] = useState<PropertyAction[]>([]);
  
  // Funciones de utilidad
  const getPropertyAction = (propertyId: string): PropertyAction['action'] | null => {
    const action = propertyActions.find(a => a.propertyId === propertyId);
    return action ? action.action : null;
  };

  const handlePropertyAction = (propertyId: string, action: PropertyAction['action']) => {
    setPropertyActions(prev => {
      const filtered = prev.filter(a => a.propertyId !== propertyId);
      if (action === 'select' || action === 'discard' || action === 'hide') {
        return [...filtered, { propertyId, action, timestamp: new Date() }];
      }
      return filtered;
    });
  };

  // Adaptamos los filtros para que coincidan los nombres internos con los externos
  const getFilteredProperties = (filter?: 'selected' | 'discarded' | 'hidden') => {
    if (!filter) return searchResults;
    // Mapeo de los filtros externos a los valores internos de acción
    const actionMap: Record<'selected' | 'discarded' | 'hidden', 'select' | 'discard' | 'hide'> = {
      selected: 'select',
      discarded: 'discard',
      hidden: 'hide'
    };
    return searchResults.filter(p => getPropertyAction(p.id) === actionMap[filter]);
  };

  // Cálculos del análisis
  const calculateAnalysis = () => {
    const selected = getFilteredProperties('selected');
    if (selected.length === 0) return null;

    const prices = selected.map(p => p.price);
    const areas = selected.map(p => p.totalArea);
    const pricesPerM2 = selected.map(p => p.price / p.totalArea);

    return {
      count: selected.length,
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgArea: areas.reduce((a, b) => a + b, 0) / areas.length,
      minArea: Math.min(...areas),
      maxArea: Math.max(...areas),
      avgPricePerM2: pricesPerM2.reduce((a, b) => a + b, 0) / pricesPerM2.length,
      minPricePerM2: Math.min(...pricesPerM2),
      maxPricePerM2: Math.max(...pricesPerM2),
      medianPrice: prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)],
      standardDeviation: Math.sqrt(
        prices.reduce((sq, n) => {
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          return sq + Math.pow(n - avg, 2);
        }, 0) / prices.length
      )
    };
  };

  // Handlers
  const handleSearch = async () => {
    setIsSearching(true);
    // Simular búsqueda
    setTimeout(() => {
      setSearchResults(mockProperties);
      setIsSearching(false);
      setCurrentStep('results');
    }, 1500);
  };

  const handleSaveACM = () => {
    const selectedProperties = getFilteredProperties('selected');
    console.log('Guardando ACM:', {
      name: acmName,
      filters: searchFilters,
      selectedProperties,
      analysis: calculateAnalysis()
    });
    router.push('/admin/acm');
  };

  const getStepNumber = () => {
    switch(currentStep) {
      case 'search': return 1;
      case 'results': return 2;
      case 'comparison': return 3;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/admin/acm')}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Nuevo Análisis Comparativo
                  </h1>
                  <Input
                    placeholder="Nombre del análisis"
                    value={acmName}
                    onChange={(e) => setAcmName(e.target.value)}
                    className="w-72 h-9 text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <StepIndicator 
                  currentStep={getStepNumber()}
                  completedSteps={
                    currentStep === 'comparison' ? [1, 2] : 
                    currentStep === 'results' ? [1] : 
                    []
                  }
                />
                
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 h-10 px-6"
                  onClick={handleSaveACM}
                  disabled={!acmName || getFilteredProperties('selected').length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar ACM
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs 
          value={currentStep} 
          onValueChange={(v) => setCurrentStep(v as any)}
          className="h-full"
        >
          <TabsList className="w-full rounded-none bg-white border-b h-14 p-0">
            <TabsTrigger 
              value="search" 
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔍</span>
                <span className="font-medium">Búsqueda Avanzada</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="results" 
              disabled={searchResults.length === 0}
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🏠</span>
                <span className="font-medium">
                  Resultados {searchResults.length > 0 && `(${searchResults.length})`}
                </span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="comparison"
              disabled={getFilteredProperties('selected').length === 0}
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span className="font-medium">
                  Comparación {getFilteredProperties('selected').length > 0 && `(${getFilteredProperties('selected').length})`}
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-0">
            <SearchStep
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            <ResultsStep
              properties={searchResults}
              propertyActions={propertyActions}
              onPropertyAction={handlePropertyAction}
              getPropertyAction={getPropertyAction}
              getFilteredProperties={getFilteredProperties}
              onBack={() => setCurrentStep('search')}
              onContinue={() => setCurrentStep('comparison')}
            />
          </TabsContent>

          <TabsContent value="comparison" className="mt-0">
            <ComparisonStep
              selectedProperties={getFilteredProperties('selected')}
              analysis={calculateAnalysis()}
              currency={searchFilters.currency}
              onBack={() => setCurrentStep('results')}
              onSave={handleSaveACM}
              acmName={acmName}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}