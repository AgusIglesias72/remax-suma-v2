'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Building2,
  Bed,
  Bath,
  Car,
  Ruler,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle2,
  X,
  Calculator,
  Save,
  FileText,
  Grid,
  List,
  MoreVertical
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

// Datos mock de propiedades para el análisis
const mockProperties = [
  {
    id: '420851184-30',
    images: ['/api/placeholder/400/300'],
    price: 90000,
    expenses: 100000,
    address: 'Caseros 4246 4246 Piso 5 Dpto C',
    location: 'Vicente Lopez, Buenos Aires, Argentina',
    status: 'Activa',
    views: 116,
    messages: 0,
    updated: '3',
    priceUSD: 2215.66,
    totalArea: 39.38,
    coveredArea: 40.62,
    uncoveredArea: 38.55,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Departamento Estándar'
  },
  {
    id: '420141226-149',
    images: ['/api/placeholder/400/300'],
    price: 109000,
    expenses: 60000,
    address: 'Gobernador Marcelino Ugarte 1661 Piso PB Dpto 3 (B1636)',
    location: 'Vicente Lopez, Buenos Aires, Argentina',
    status: 'Activa',
    views: 424,
    messages: 0,
    updated: '4',
    priceUSD: 2224.49,
    totalArea: 45.26,
    coveredArea: 49,
    uncoveredArea: 44,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Departamento Estándar'
  },
  {
    id: '420151234-111',
    images: ['/api/placeholder/400/300'],
    price: 330000,
    expenses: 400000,
    address: 'Av. Maipú 3250 Piso 8 Dpto A',
    location: 'Vicente Lopez, Buenos Aires, Argentina',
    status: 'Activa',
    views: 89,
    messages: 2,
    updated: '1',
    priceUSD: 3500.00,
    totalArea: 94.28,
    coveredArea: 95,
    uncoveredArea: 10,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    type: 'Departamento Premium'
  }
];

export default function NewACMPage() {
  const router = useRouter();
  const [acmName, setAcmName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState('resultados');
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    operation: 'venta',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    minArea: '',
    maxArea: ''
  });

  // Cálculos del análisis
  const calculateAnalysis = () => {
    const selected = mockProperties.filter(p => selectedProperties.includes(p.id));
    if (selected.length === 0) return null;

    const avgPrice = selected.reduce((acc, p) => acc + p.price, 0) / selected.length;
    const avgPricePerM2 = selected.reduce((acc, p) => acc + (p.price / p.totalArea), 0) / selected.length;
    const avgArea = selected.reduce((acc, p) => acc + p.totalArea, 0) / selected.length;

    return {
      avgPrice,
      avgPricePerM2,
      avgArea,
      count: selected.length,
      minPrice: Math.min(...selected.map(p => p.price)),
      maxPrice: Math.max(...selected.map(p => p.price))
    };
  };

  const analysis = calculateAnalysis();

  const handlePropertySelect = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    } else {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const handleSave = () => {
    // Lógica para guardar el ACM
    console.log('Guardando ACM:', {
      name: acmName,
      selectedProperties,
      analysis
    });
    router.push('/admin/acm');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin/acm')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Análisis Comparativo de Mercado</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    placeholder="Nombre del análisis"
                    value={acmName}
                    onChange={(e) => setAcmName(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/acm')}>
                Cancelar
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
                disabled={!acmName || selectedProperties.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar ACM
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel Izquierdo - Búsqueda y Filtros */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Búsqueda</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Dirección, barrio, código..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Ubicación</Label>
                  <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vicente-lopez">Vicente López</SelectItem>
                      <SelectItem value="palermo">Palermo</SelectItem>
                      <SelectItem value="belgrano">Belgrano</SelectItem>
                      <SelectItem value="recoleta">Recoleta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo de Propiedad</Label>
                  <Select value={filters.propertyType} onValueChange={(value) => setFilters({...filters, propertyType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="departamento">Departamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="ph">PH</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label>Rango de Precio (USD)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Mín"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Máx"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Superficie (m²)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Mín"
                      value={filters.minArea}
                      onChange={(e) => setFilters({...filters, minArea: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Máx"
                      value={filters.maxArea}
                      onChange={(e) => setFilters({...filters, maxArea: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Ambientes</Label>
                  <Select value={filters.rooms} onValueChange={(value) => setFilters({...filters, rooms: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cualquier cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 ambiente</SelectItem>
                      <SelectItem value="2">2 ambientes</SelectItem>
                      <SelectItem value="3">3 ambientes</SelectItem>
                      <SelectItem value="4">4+ ambientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Propiedades
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Panel Central - Resultados */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Propiedades Encontradas</CardTitle>
                    <CardDescription>
                      {mockProperties.length} resultados • {selectedProperties.length} seleccionadas
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full rounded-none border-b">
                    <TabsTrigger value="resultados" className="flex-1">
                      Resultados ({mockProperties.length})
                    </TabsTrigger>
                    <TabsTrigger value="seleccionadas" className="flex-1">
                      Seleccionadas ({selectedProperties.length})
                    </TabsTrigger>
                    <TabsTrigger value="ocultas" className="flex-1">
                      Ocultas (0)
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="resultados" className="mt-0">
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                      {mockProperties.map((property) => (
                        <div 
                          key={property.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            selectedProperties.includes(property.id) ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex gap-4">
                            {/* Checkbox */}
                            <div className="pt-1">
                              <Checkbox
                                checked={selectedProperties.includes(property.id)}
                                onCheckedChange={() => handlePropertySelect(property.id)}
                              />
                            </div>

                            {/* Imagen */}
                            <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <div className="w-full h-full bg-gray-300" />
                            </div>

                            {/* Información */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {formatCurrency(property.price)}
                                    {property.expenses && (
                                      <span className="text-sm text-gray-500 ml-2">
                                        + {formatCurrency(property.expenses)} expensas
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">{property.address}</p>
                                  <p className="text-xs text-gray-500">{property.location}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="mb-1">
                                    {property.status}
                                  </Badge>
                                  <div className="text-xs text-gray-500">
                                    #{property.id}
                                  </div>
                                </div>
                              </div>

                              {/* Características */}
                              <div className="flex gap-4 mt-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {property.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Ruler className="h-3 w-3" />
                                  {property.totalArea}m²
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {property.coveredArea}m²
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bed className="h-3 w-3" />
                                  {property.bedrooms}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bath className="h-3 w-3" />
                                  {property.bathrooms}
                                </span>
                                {property.garage && (
                                  <span className="flex items-center gap-1">
                                    <Car className="h-3 w-3" />
                                    {property.garage}
                                  </span>
                                )}
                                <span className="text-gray-500">
                                  {property.type}
                                </span>
                              </div>

                              {/* Precio por m2 */}
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-medium text-gray-700">
                                  USD/m²: {formatCurrency(property.price / property.totalArea)}
                                </span>
                                {selectedProperties.includes(property.id) && (
                                  <Badge className="bg-blue-600">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Seleccionada
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Acciones */}
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePropertySelect(property.id)}
                              >
                                {selectedProperties.includes(property.id) ? 'Quitar' : 'Seleccionar'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="seleccionadas" className="mt-0">
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                      {mockProperties
                        .filter(p => selectedProperties.includes(p.id))
                        .map((property) => (
                          <div key={property.id} className="p-4">
                            {/* Mismo formato que resultados */}
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold">{property.address}</h4>
                                <p className="text-sm text-gray-600">{formatCurrency(property.price)}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePropertySelect(property.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {selectedProperties.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                          No hay propiedades seleccionadas
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Panel Derecho - Análisis */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Análisis de Valor
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Valor Promedio</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(analysis.avgPrice)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Propiedades analizadas:</span>
                        <span className="font-medium">{analysis.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio mínimo:</span>
                        <span className="font-medium">{formatCurrency(analysis.minPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio máximo:</span>
                        <span className="font-medium">{formatCurrency(analysis.maxPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio/m² promedio:</span>
                        <span className="font-medium">{formatCurrency(analysis.avgPricePerM2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Superficie promedio:</span>
                        <span className="font-medium">{analysis.avgArea.toFixed(2)}m²</span>
                      </div>
                    </div>

                    <Separator />

                    <Button className="w-full" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generar Reporte
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">
                      Selecciona propiedades para generar el análisis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}