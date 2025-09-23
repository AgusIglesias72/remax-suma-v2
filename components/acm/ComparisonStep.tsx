'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Save,
  FileText,
  TrendingUp,
  Home,
  MapPin,
  Ruler,
  Building2,
  Bed,
  Bath,
  Car,
  DollarSign,
  BarChart3,
  Calculator,
  Download
} from 'lucide-react';
import { Property } from '@/app/admin/acm/nuevo/page';

interface Analysis {
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgArea: number;
  minArea: number;
  maxArea: number;
  avgPricePerM2: number;
  minPricePerM2: number;
  maxPricePerM2: number;
  medianPrice: number;
  standardDeviation: number;
}

interface ComparisonStepProps {
  selectedProperties: Property[];
  analysis: Analysis | null;
  currency: string;
  onBack: () => void;
  onSave: () => void;
  acmName: string;
}

export function ComparisonStep({
  selectedProperties,
  analysis,
  currency,
  onBack,
  onSave,
  acmName
}: ComparisonStepProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number, reference: number) => {
    const diff = ((value - reference) / reference) * 100;
    return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
  };

  if (!analysis) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay propiedades seleccionadas
          </h3>
          <p className="text-gray-600 mb-6">
            Vuelve al paso anterior y selecciona al menos una propiedad para generar el análisis comparativo.
          </p>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Resultados
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Analysis Card */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-2xl flex items-center gap-3">
              <TrendingUp className="h-7 w-7" />
              Análisis Estadístico del Mercado
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Valor Estimado Principal */}
            <div className="text-center mb-10">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
                Valor de Mercado Estimado
              </p>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatCurrency(analysis.avgPrice)}
              </div>
              <p className="text-gray-500 mt-3">
                Basado en <span className="font-semibold">{analysis.count}</span> propiedades comparables
              </p>
            </div>

            {/* Estadísticas Detalladas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Valores */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Análisis de Valores</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Precio Promedio</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(analysis.avgPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Mediana</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(analysis.medianPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Mínimo</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{formatCurrency(analysis.minPrice)}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage(analysis.minPrice, analysis.avgPrice)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Máximo</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{formatCurrency(analysis.maxPrice)}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage(analysis.maxPrice, analysis.avgPrice)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Desv. Estándar</span>
                    <span className="text-gray-900">{formatCurrency(analysis.standardDeviation)}</span>
                  </div>
                </div>
              </div>

              {/* Superficies */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Ruler className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Análisis de Superficies</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Superficie Promedio</span>
                    <span className="font-semibold text-gray-900">
                      {analysis.avgArea.toFixed(2)}m²
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Mínima</span>
                    <span className="text-gray-900">{analysis.minArea.toFixed(2)}m²</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Máxima</span>
                    <span className="text-gray-900">{analysis.maxArea.toFixed(2)}m²</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Rango</span>
                    <span className="text-gray-900">
                      {(analysis.maxArea - analysis.minArea).toFixed(2)}m²
                    </span>
                  </div>
                </div>
              </div>

              {/* Precio por m² */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Valor por m²</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Promedio/m²</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(analysis.avgPricePerM2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Mínimo/m²</span>
                    <span className="text-gray-900">{formatCurrency(analysis.minPricePerM2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Máximo/m²</span>
                    <span className="text-gray-900">{formatCurrency(analysis.maxPricePerM2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Variación</span>
                    <span className="text-gray-900">
                      ±{((analysis.maxPricePerM2 - analysis.minPricePerM2) / 2).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendación */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">💡 Recomendación de Precio</h4>
              <p className="text-gray-700 leading-relaxed">
                Basándonos en el análisis de las <strong>{analysis.count} propiedades comparables</strong>, 
                el valor de mercado sugerido es de <strong className="text-blue-600">{formatCurrency(analysis.avgPrice)}</strong>, 
                con un rango razonable entre <strong>{formatCurrency(analysis.avgPrice * 0.95)}</strong> y{' '}
                <strong>{formatCurrency(analysis.avgPrice * 1.05)}</strong> dependiendo de las características 
                específicas y el estado de la propiedad.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Properties Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Home className="h-6 w-6" />
            Propiedades Comparables Seleccionadas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Mini Property Card */}
                <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-400 opacity-50" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/50 text-white">
                    #{property.id}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h4 className="font-bold text-lg text-gray-900">
                      {formatCurrency(property.price)}
                    </h4>
                    {property.expenses && (
                      <p className="text-xs text-gray-500">
                        + {formatCurrency(property.expenses)} exp.
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {property.address}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.neighborhood}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3" />
                      <span>{property.totalArea}m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      <span>{property.bedrooms} dorm.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{property.coveredArea}m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      <span>{property.bathrooms} baño{property.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 mt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Precio/m²:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(property.price / property.totalArea)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Insights */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Insights Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Rango de Confianza (95%)</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(analysis.avgPrice * 0.95)} - {formatCurrency(analysis.avgPrice * 1.05)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Coeficiente de Variación</p>
                <p className="font-semibold text-gray-900">
                  {((analysis.standardDeviation / analysis.avgPrice) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Dispersión de Precios</p>
                <p className="font-semibold text-gray-900">
                  {((analysis.maxPrice / analysis.minPrice - 1) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <Button 
            variant="outline"
            size="lg"
            onClick={onBack}
            className="h-12 px-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Resultados
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              size="lg"
              className="h-12 px-6"
            >
              <Download className="h-5 w-5 mr-2" />
              Exportar PDF
            </Button>
            
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 h-12 px-8"
              onClick={onSave}
              disabled={!acmName}
            >
              <Save className="h-5 w-5 mr-2" />
              Guardar Análisis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}