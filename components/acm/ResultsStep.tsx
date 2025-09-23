'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Home,
  Ruler,
  Building2,
  Bed,
  Bath,
  Car,
  Calendar,
  MapPin,
  Check,
  X,
  Grid,
  List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property, PropertyAction } from '@/app/admin/acm/nuevo/page';

interface ResultsStepProps {
  properties: Property[];
  propertyActions: PropertyAction[];
  onPropertyAction: (propertyId: string, action: PropertyAction['action']) => void;
  getPropertyAction: (propertyId: string) => PropertyAction['action'] | null;
  getFilteredProperties: (filter?: 'selected' | 'discarded' | 'hidden') => Property[];
  onBack: () => void;
  onContinue: () => void;
}

export function ResultsStep({
  properties,
  propertyActions,
  onPropertyAction,
  getPropertyAction,
  getFilteredProperties,
  onBack,
  onContinue
}: ResultsStepProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<'all' | 'selected' | 'discarded'>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getVisibleProperties = () => {
    let filtered = properties.filter(p => getPropertyAction(p.id) !== 'hide');
    
    switch(activeFilter) {
      case 'selected':
        return filtered.filter(p => getPropertyAction(p.id) === 'select');
      case 'discarded':
        return filtered.filter(p => getPropertyAction(p.id) === 'discard');
      default:
        return filtered;
    }
  };

  const PropertyCard = ({ property }: { property: Property }) => {
    const action = getPropertyAction(property.id);
    
    return (
      <Card className={cn(
        "transition-all duration-200 overflow-hidden",
        action === 'select' && "ring-2 ring-green-500",
        action === 'discard' && "opacity-60"
      )}>
        <div className="relative">
          {/* Image */}
          <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <Home className="h-16 w-16 opacity-50" />
            </div>
            
            {/* Status Badge */}
            {action && (
              <div className="absolute top-3 right-3">
                {action === 'select' && (
                  <Badge className="bg-green-500 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Seleccionada
                  </Badge>
                )}
                {action === 'discard' && (
                  <Badge className="bg-red-500 text-white">
                    <X className="h-3 w-3 mr-1" />
                    Descartada
                  </Badge>
                )}
              </div>
            )}
            
            {/* Property ID */}
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-black/50 text-white">
                #{property.id}
              </Badge>
            </div>
          </div>

          <CardContent className="p-5">
            {/* Price */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(property.price)}
              </h3>
              {property.expenses && (
                <p className="text-sm text-gray-500 mt-1">
                  + {formatCurrency(property.expenses)} expensas
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mb-4 space-y-1">
              <p className="font-medium text-gray-900 line-clamp-1">
                {property.address}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {property.neighborhood}
              </p>
            </div>

            {/* Characteristics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Ruler className="h-4 w-4 text-gray-400" />
                <span>{property.totalArea}m² tot.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span>{property.coveredArea}m² cub.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bed className="h-4 w-4 text-gray-400" />
                <span>{property.bedrooms} dorm.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bath className="h-4 w-4 text-gray-400" />
                <span>{property.bathrooms} baño{property.bathrooms > 1 ? 's' : ''}</span>
              </div>
              {property.garage && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Car className="h-4 w-4 text-gray-400" />
                  <span>{property.garage} coch.</span>
                </div>
              )}
              {property.yearBuilt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{property.yearBuilt}</span>
                </div>
              )}
            </div>

            {/* Price per m2 */}
            <div className="pt-4 mb-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Precio/m²:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(property.price / property.totalArea)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant={action === 'select' ? 'default' : 'outline'}
                className={cn(
                  "h-10",
                  action === 'select' && "bg-green-500 hover:bg-green-600"
                )}
                onClick={() => onPropertyAction(
                  property.id, 
                  'select'
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={action === 'discard' ? 'default' : 'outline'}
                className={cn(
                  "h-10",
                  action === 'discard' && "bg-red-500 hover:bg-red-600"
                )}
                onClick={() => onPropertyAction(
                  property.id,
                  'discard'
                )}
              >
                <XCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-10"
                onClick={() => onPropertyAction(property.id, 'hide')}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className="py-8 px-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold mt-1">{properties.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Eye className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Seleccionadas</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {getFilteredProperties('selected').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-red-200 bg-red-50/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Descartadas</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {getFilteredProperties('discarded').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-gray-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocultas</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {getFilteredProperties('hidden').length}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <EyeOff className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions Alert */}
      <Alert className="mb-6 border-blue-200 bg-blue-50/50">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-sm leading-relaxed">
          <strong className="font-semibold">Instrucciones:</strong> Evalúa cada propiedad y utiliza los botones de acción:
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span><strong className="text-green-600">Seleccionar:</strong> Propiedades comparables para incluir en el análisis</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span><strong className="text-red-600">Descartar:</strong> Propiedades no comparables pero que permanecen visibles</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-gray-600" />
              <span><strong className="text-gray-600">Ocultar:</strong> Remover completamente de la vista</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Filters and View Mode */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
            size="sm"
          >
            Todas ({properties.filter(p => getPropertyAction(p.id) !== 'hide').length})
          </Button>
          <Button
            variant={activeFilter === 'selected' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('selected')}
            size="sm"
            className={activeFilter === 'selected' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Seleccionadas ({getFilteredProperties('selected').length})
          </Button>
          <Button
            variant={activeFilter === 'discarded' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('discarded')}
            size="sm"
            className={activeFilter === 'discarded' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Descartadas ({getFilteredProperties('discarded').length})
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className={cn(
        "grid gap-6 mb-8",
        viewMode === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      )}>
        {getVisibleProperties().map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          size="lg"
          onClick={onBack}
          className="h-12 px-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a Búsqueda
        </Button>
        
        <Button 
          size="lg"
          className="bg-green-600 hover:bg-green-700 h-12 px-6"
          onClick={onContinue}
          disabled={getFilteredProperties('selected').length === 0}
        >
          Ver Comparación
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}