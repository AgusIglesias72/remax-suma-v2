'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Building2, DollarSign, Home, Bath, Bed, Ruler } from 'lucide-react';
import { SearchFilters } from '@/app/admin/acm/nuevo/page';

interface SearchStepProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function SearchStep({ filters, onFiltersChange, onSearch, isSearching }: SearchStepProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayValue = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    if (currentArray.includes(value)) {
      updateFilter(key, currentArray.filter(v => v !== value));
    } else {
      updateFilter(key, [...currentArray, value]);
    }
  };

  return (
    <div className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-sm">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl">Criterios de Búsqueda</CardTitle>
            <CardDescription className="text-base mt-2">
              Define los parámetros para encontrar propiedades comparables
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-10">
            {/* Ubicación Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Ubicación</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-11">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Dirección o Barrio
                  </Label>
                  <Input 
                    id="location"
                    placeholder="Ej: Vicente López, Olivos, Florida..."
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="radius" className="text-sm font-medium">
                    Radio de búsqueda
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="radius"
                      type="number" 
                      value={filters.radius}
                      onChange={(e) => updateFilter('radius', e.target.value)}
                      className="h-11"
                    />
                    <Select 
                      value={filters.radiusUnit}
                      onValueChange={(v) => updateFilter('radiusUnit', v)}
                    >
                      <SelectTrigger className="w-24 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="km">km</SelectItem>
                        <SelectItem value="m">mts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tipo de Operación y Propiedad */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Tipo de Operación y Propiedad</h3>
              </div>
              
              <div className="space-y-6 pl-11">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tipo de Operación</Label>
                  <RadioGroup 
                    value={filters.operationType}
                    onValueChange={(v) => updateFilter('operationType', v)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="venta" id="venta" />
                      <Label htmlFor="venta" className="font-normal cursor-pointer">
                        Venta
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alquiler" id="alquiler" />
                      <Label htmlFor="alquiler" className="font-normal cursor-pointer">
                        Alquiler
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="temporario" id="temporario" />
                      <Label htmlFor="temporario" className="font-normal cursor-pointer">
                        Alquiler Temporario
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tipos de Propiedad</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { value: 'departamento', label: 'Departamento' },
                      { value: 'casa', label: 'Casa' },
                      { value: 'ph', label: 'PH' },
                      { value: 'terreno', label: 'Terreno' },
                      { value: 'local', label: 'Local' },
                      { value: 'oficina', label: 'Oficina' }
                    ].map((type) => (
                      <div key={type.value} className="flex items-center space-x-3">
                        <Checkbox 
                          id={type.value}
                          checked={filters.propertyTypes.includes(type.value)}
                          onCheckedChange={() => toggleArrayValue('propertyTypes', type.value)}
                        />
                        <Label 
                          htmlFor={type.value} 
                          className="font-normal cursor-pointer select-none"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Rango de Precio */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Rango de Precio</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-11">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-medium">
                    Moneda
                  </Label>
                  <Select 
                    value={filters.currency}
                    onValueChange={(v) => updateFilter('currency', v)}
                  >
                    <SelectTrigger id="currency" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - Dólares</SelectItem>
                      <SelectItem value="ARS">ARS - Pesos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minPrice" className="text-sm font-medium">
                    Precio Mínimo
                  </Label>
                  <Input 
                    id="minPrice"
                    type="number" 
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxPrice" className="text-sm font-medium">
                    Precio Máximo
                  </Label>
                  <Input 
                    id="maxPrice"
                    type="number" 
                    placeholder="Sin límite"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Características */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Home className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">Características</h3>
              </div>
              
              <div className="space-y-6 pl-11">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      Ambientes
                    </Label>
                    <div className="flex gap-3">
                      {['1', '2', '3', '4', '5+'].map((room) => (
                        <Button
                          key={room}
                          type="button"
                          variant={filters.rooms.includes(room) ? 'default' : 'outline'}
                          size="sm"
                          className="h-10 px-4"
                          onClick={() => toggleArrayValue('rooms', room)}
                        >
                          {room}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Bath className="h-4 w-4" />
                      Baños
                    </Label>
                    <div className="flex gap-3">
                      {['1', '2', '3', '4+'].map((bath) => (
                        <Button
                          key={bath}
                          type="button"
                          variant={filters.bathrooms.includes(bath) ? 'default' : 'outline'}
                          size="sm"
                          className="h-10 px-4"
                          onClick={() => toggleArrayValue('bathrooms', bath)}
                        >
                          {bath}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Superficie Cubierta (m²)
                    </Label>
                    <div className="flex gap-3">
                      <Input 
                        type="number" 
                        placeholder="Mín"
                        value={filters.minCoveredArea}
                        onChange={(e) => updateFilter('minCoveredArea', e.target.value)}
                        className="h-11"
                      />
                      <Input 
                        type="number" 
                        placeholder="Máx"
                        value={filters.maxCoveredArea}
                        onChange={(e) => updateFilter('maxCoveredArea', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Superficie Total (m²)
                    </Label>
                    <div className="flex gap-3">
                      <Input 
                        type="number" 
                        placeholder="Mín"
                        value={filters.minTotalArea}
                        onChange={(e) => updateFilter('minTotalArea', e.target.value)}
                        className="h-11"
                      />
                      <Input 
                        type="number" 
                        placeholder="Máx"
                        value={filters.maxTotalArea}
                        onChange={(e) => updateFilter('maxTotalArea', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <Button 
                variant="outline" 
                size="lg"
                className="h-12 px-8"
              >
                Limpiar Filtros
              </Button>
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                onClick={onSearch}
                disabled={!filters.location || isSearching}
              >
                {isSearching ? (
                  <>Buscando...</>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Buscar Propiedades
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}