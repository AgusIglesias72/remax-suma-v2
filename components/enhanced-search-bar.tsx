import React, { useState } from 'react';
import { Search, Home, MapPin, Bed, DollarSign, Filter, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchAutocomplete } from "@/components/google-autocomplete";

// Datos para los selects (actualizados con tu estructura)
const operationTypes = [
  { value: 'venta', label: 'Venta' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'alquiler-temporal', label: 'Alquiler Temporal' }
];

const propertyTypes = [
  { value: 'cualquier-tipo', label: 'Cualquier tipo' },
  { value: 'departamento-estandar', label: 'Departamento Estándar' },
  { value: 'casa', label: 'Casa' },
  { value: 'departamento-duplex', label: 'Departamento Dúplex' },
  { value: 'local', label: 'Local' },
  { value: 'terrenos-lotes', label: 'Terrenos y Lotes' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'cochera', label: 'Cochera' }
];

const roomOptions = [
  { value: 'monoambiente', label: 'Monoambiente' },
  { value: '1', label: '1 ambiente' },
  { value: '2', label: '2 ambientes' },
  { value: '3', label: '3 ambientes' },
  { value: '4', label: '4 ambientes' },
  { value: '5+', label: '5+ ambientes' }
];

const priceRanges = [
  { value: '0-100000', label: 'Hasta $100.000' },
  { value: '100000-200000', label: '$100.000 - $200.000' },
  { value: '200000-500000', label: '$200.000 - $500.000' },
  { value: '500000-1000000', label: '$500.000 - $1.000.000' },
  { value: '1000000+', label: 'Más de $1.000.000' }
];

interface SearchFormData {
  operation: string;
  propertyType: string;
  rooms: string;
  selectedLocation: { address: string; lat: number; lng: number } | null;
  priceRange: string;
}

interface EnhancedSearchBarProps {
  onSearch: (data: SearchFormData) => void;
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  selectedLocation: { address: string; lat: number; lng: number } | null;
  mounted: boolean;
  className?: string;
}

// Componente para Select personalizado con mejor diseño
interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onValueChange, 
  placeholder, 
  options, 
  icon, 
  className = '' 
}) => (
  <div className={`relative ${className}`}>
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none flex items-center">
      {icon}
    </div>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full pl-10 pr-4 h-12 min-h-[48px] border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-300 [&>span]:text-left [&>span]:flex [&>span]:items-center [&>span]:h-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl border border-gray-200 shadow-lg bg-white">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="cursor-pointer hover:bg-red-50 focus:bg-red-50 rounded-lg mx-1 my-0.5 flex items-center"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({ 
  onSearch, 
  onLocationSelect, 
  selectedLocation, 
  mounted, 
  className = '' 
}) => {
  const [formData, setFormData] = useState<SearchFormData>({
    operation: '',
    propertyType: '',
    rooms: '',
    selectedLocation: null,
    priceRange: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      selectedLocation: location
    }));
    onLocationSelect(location);
  };

  const clearLocation = () => {
    setFormData(prev => ({
      ...prev,
      selectedLocation: null
    }));
    onLocationSelect(null as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchData = {
      ...formData,
      selectedLocation: selectedLocation || formData.selectedLocation
    };
    onSearch(searchData);
  };

  const clearFilters = () => {
    setFormData({
      operation: '',
      propertyType: '',
      rooms: '',
      selectedLocation: null,
      priceRange: ''
    });
    onLocationSelect(null as any);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-6xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fila principal de búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Operación */}
          <CustomSelect
            value={formData.operation}
            onValueChange={(value) => handleInputChange('operation', value)}
            placeholder="Operación"
            options={operationTypes}
            icon={<ShoppingBag size={18} />}
          />

          {/* Tipo de propiedad */}
          <CustomSelect
            value={formData.propertyType}
            onValueChange={(value) => handleInputChange('propertyType', value)}
            placeholder="Tipo"
            options={propertyTypes}
            icon={<Home size={18} />}
          />

          {/* Cantidad de ambientes - NUEVO */}
          <CustomSelect
            value={formData.rooms}
            onValueChange={(value) => handleInputChange('rooms', value)}
            placeholder="Ambientes"
            options={roomOptions}
            icon={<Bed size={18} />}
          />

          {/* Ubicación con Google Maps */}
          <div className="relative lg:col-span-2">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none flex items-center">
              <MapPin size={18} />
            </div>
            <SearchAutocomplete
              onLocationSelect={handleLocationChange}
              placeholder="Buscar por ubicación, barrio o código"
              className="w-full pl-10 pr-4 h-12 min-h-[48px] border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200 hover:border-gray-300 flex items-center"
            />
          </div>

          {/* Botón de búsqueda */}
          <div className="lg:col-span-1">
            <Button
              type="submit"
              className="w-full h-12 min-h-[48px] bg-red-600 hover:bg-red-700 text-white font-semibold px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              disabled={!mounted}
            >
              <Search size={18} />
              <span className="hidden sm:inline">Buscar</span>
            </Button>
          </div>
        </div>

        {/* Mostrar ubicación seleccionada */}
        {(selectedLocation || formData.selectedLocation) && mounted && (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 animate-in slide-in-from-top duration-300">
            <span className="flex items-center gap-2">
              <div className="flex items-center">
                <MapPin size={16} />
              </div>
              Buscarás cerca de: <strong>{(selectedLocation || formData.selectedLocation)?.address}</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLocation}
              className="text-green-600 hover:text-green-700 hover:bg-green-100 h-auto p-2 rounded-full transition-colors flex items-center justify-center"
              type="button"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Filtros avanzados */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
            >
              <div className="flex items-center">
                <Filter size={16} />
              </div>
              {showAdvanced ? 'Filtros básicos' : 'Filtros avanzados'}
            </button>

            {(formData.operation || formData.propertyType || formData.rooms || selectedLocation || formData.priceRange) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top duration-300">
              {/* Rango de precios */}
              <CustomSelect
                value={formData.priceRange}
                onValueChange={(value) => handleInputChange('priceRange', value)}
                placeholder="Precio"
                options={priceRanges}
                icon={<DollarSign size={18} />}
              />

              {/* Espacio para futuros filtros */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center">
                  <Home size={18} />
                </div>
                <select
                  className="w-full pl-10 pr-4 h-12 min-h-[48px] border border-gray-200 rounded-xl bg-gray-50 text-gray-400 font-medium cursor-not-allowed flex items-center"
                  disabled
                >
                  <option>Superficie (Próximamente)</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center">
                  <MapPin size={18} />
                </div>
                <select
                  className="w-full pl-10 pr-4 h-12 min-h-[48px] border border-gray-200 rounded-xl bg-gray-50 text-gray-400 font-medium cursor-not-allowed flex items-center"
                  disabled
                >
                  <option>Zona (Próximamente)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Búsquedas populares mejoradas */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600 mb-3 px-1">Búsquedas populares:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Propiedades en venta', action: () => handleInputChange('operation', 'venta') },
              { label: 'Palermo', action: () => handleLocationChange({ address: 'Palermo, Buenos Aires', lat: -34.5875, lng: -58.4164 }) },
              { label: 'Casas', action: () => handleInputChange('propertyType', 'casa') },
              { label: '2 ambientes', action: () => handleInputChange('rooms', '2') },
              { label: 'Ver todas', action: clearFilters }
            ].map((search, index) => (
              <button
                key={index}
                type="button"
                onClick={search.action}
                className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-full text-sm font-medium transition-all duration-200 border border-transparent hover:border-red-200 hover:scale-105"
              >
                {search.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EnhancedSearchBar;