import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, MapPin, Bed, DollarSign, Filter, ChevronDown, ChevronUp, Check, Car, Ruler, Bath } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SearchAutocomplete } from "@/components/search/google-autocomplete";

// Datos para las operaciones con diseño de tabs moderno
const operationTypes = [
  { value: 'alquiler', label: 'Alquilar', shortLabel: 'Alquilar' },
  { value: 'venta', label: 'Comprar', shortLabel: 'Comprar' },
  { value: 'alquiler-temporal', label: 'Alquiler Temporario', shortLabel: 'Alquiler Temporario' }
];

const propertyTypes = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'ph', label: 'PH' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'cochera', label: 'Cochera' },
  { value: 'otros', label: 'Otros' }
];

const roomOptions = [
  { value: 'monoambiente', label: 'Monoambiente' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' }
];

// Rangos de precio - divididos en desde y hasta
const priceFromRanges = [
  { value: '0', label: 'Sin mínimo' },
  { value: '50000', label: '$50.000' },
  { value: '100000', label: '$100.000' },
  { value: '200000', label: '$200.000' },
  { value: '300000', label: '$300.000' },
  { value: '500000', label: '$500.000' },
  { value: '1000000', label: '$1.000.000' }
];

const priceToRanges = [
  { value: '100000', label: '$100.000' },
  { value: '200000', label: '$200.000' },
  { value: '300000', label: '$300.000' },
  { value: '500000', label: '$500.000' },
  { value: '1000000', label: '$1.000.000' },
  { value: '2000000', label: '$2.000.000' },
  { value: '999999999', label: 'Sin máximo' }
];

// Rangos de superficie
const surfaceFromRanges = [
  { value: '0', label: 'Sin mínimo' },
  { value: '30', label: '30 m²' },
  { value: '50', label: '50 m²' },
  { value: '70', label: '70 m²' },
  { value: '100', label: '100 m²' },
  { value: '150', label: '150 m²' },
  { value: '200', label: '200 m²' }
];

const surfaceToRanges = [
  { value: '50', label: '50 m²' },
  { value: '70', label: '70 m²' },
  { value: '100', label: '100 m²' },
  { value: '150', label: '150 m²' },
  { value: '200', label: '200 m²' },
  { value: '300', label: '300 m²' },
  { value: '999999', label: 'Sin máximo' }
];

// Opciones de baños
const bathroomOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' }
];

// Opciones de cocheras
const garageOptions = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3+' }
];

interface SearchFormData {
  operation: string;
  propertyType: string[];  // Cambiado a array para selección múltiple
  rooms: string[];         // Cambiado a array para selección múltiple
  selectedLocations: { address: string; lat: number; lng: number }[]; // Cambiado a array
  priceFrom: string;
  priceTo: string;
  surfaceFrom: string;
  surfaceTo: string;
  bathrooms: string;
  garages: string;
}

interface EnhancedSearchBarProps {
  onSearch: (data: SearchFormData) => void;
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  selectedLocation: { address: string; lat: number; lng: number } | null;
  mounted: boolean;
  className?: string;
}

// Componente de tabs moderno para operaciones
interface OperationTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const OperationTabs: React.FC<OperationTabsProps> = ({ value, onValueChange, className = '' }) => (
  <div className={`absolute -top-10 left-0 flex ${className}`}>
    {operationTypes.map((operation, index) => (
      <button
        key={operation.value}
        type="button"
        onClick={() => onValueChange(operation.value)}
        className={`
          relative cursor-pointer px-4 py-2.5 text-sm font-medium transition-all duration-300 
          border border-gray-200 border-b-white
          ${value === operation.value 
            ? 'text-red-600 bg-white z-20 border-b-white' 
            : 'text-gray-600 bg-gray-50 hover:text-gray-900 hover:bg-gray-100 z-10 border-b-gray-200'
          }
          ${index === 0 ? 'rounded-tl-lg' : '-ml-px'}
          ${index === operationTypes.length - 1 ? 'rounded-tr-lg' : ''}
        `}
        style={{
          ...(value === operation.value && {
            boxShadow: '0 -2px 8px rgba(0,0,0,0.08), 2px 0 4px rgba(0,0,0,0.04), -2px 0 4px rgba(0,0,0,0.04)',
            marginBottom: '-1px'
          })
        }}
      >
        {operation.shortLabel}
      </button>
    ))}
  </div>
);

// Componente para MultiSelect con selección múltiple
interface MultiSelectProps {
  values: string[];
  onValueChange: (values: string[]) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  values, 
  onValueChange, 
  placeholder, 
  options, 
  icon, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const toggleOption = (optionValue: string) => {
    // Si es el placeholder "Ambientes" implementamos lógica correlativa
    if (placeholder === "Ambientes") {
      const numericValues = ['1', '2', '3', '4', '5+'];
      
      if (values.includes(optionValue)) {
        // Si deseleccionamos, también deseleccionamos los valores mayores
        if (numericValues.includes(optionValue)) {
          const optionIndex = numericValues.indexOf(optionValue);
          const newValues = values.filter(v => {
            if (!numericValues.includes(v)) return true; // Mantener monoambiente
            const vIndex = numericValues.indexOf(v);
            return vIndex < optionIndex;
          });
          onValueChange(newValues);
        } else {
          // Para monoambiente
          onValueChange(values.filter(v => v !== optionValue));
        }
      } else {
        // Si seleccionamos, seleccionamos todos los valores hasta ese número
        if (numericValues.includes(optionValue)) {
          const optionIndex = numericValues.indexOf(optionValue);
          const rangesToAdd = numericValues.slice(0, optionIndex + 1);
          const nonNumericValues = values.filter(v => !numericValues.includes(v));
          const newValues = [...nonNumericValues, ...rangesToAdd];
          onValueChange(newValues);
        } else {
          // Para monoambiente
          onValueChange([...values, optionValue]);
        }
      }
    } else {
      // Comportamiento normal para otros selectores
      if (values.includes(optionValue)) {
        onValueChange(values.filter(v => v !== optionValue));
      } else {
        onValueChange([...values, optionValue]);
      }
    }
  };

  const getDisplayText = () => {
    if (values.length === 0) return placeholder;
    
    // Lógica especial para Ambientes
    if (placeholder === "Ambientes") {
      const numericValues = ['1', '2', '3', '4', '5+'];
      const selectedNumeric = values.filter(v => numericValues.includes(v)).sort((a, b) => {
        if (a === '5+') return 1;
        if (b === '5+') return -1;
        return parseInt(a) - parseInt(b);
      });
      const hasMonoambiente = values.includes('monoambiente');
      
      if (selectedNumeric.length === 0 && hasMonoambiente) {
        return 'Monoambiente';
      } else if (selectedNumeric.length === 1 && !hasMonoambiente) {
        return selectedNumeric[0] === '5+' ? '5+ Ambientes' : `${selectedNumeric[0]} Ambiente`;
      } else if (selectedNumeric.length > 1) {
        const first = selectedNumeric[0];
        const last = selectedNumeric[selectedNumeric.length - 1];
        const suffix = hasMonoambiente ? ', Monoambiente' : '';
        return `${first}-${last} Ambientes${suffix}`;
      } else if (hasMonoambiente && selectedNumeric.length > 0) {
        const first = selectedNumeric[0];
        const last = selectedNumeric[selectedNumeric.length - 1];
        return selectedNumeric.length === 1 
          ? `Monoambiente, ${first} Ambiente`
          : `Monoambiente, ${first}-${last} Ambientes`;
      }
    }
    
    // Comportamiento normal para otros selectores
    if (values.length === 1) {
      const option = options.find(opt => opt.value === values[0]);
      return option?.label || placeholder;
    }
    return `${values.length} seleccionados`;
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none flex items-center">
        {icon}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer pl-10 pr-10 h-12 min-h-[48px] border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-300 flex items-center justify-between text-left"
      >
        <span className={`text-sm truncate ${values.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
          {getDisplayText()}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left hover:bg-red-50 cursor-pointer 
                border-b border-gray-50 last:border-b-0 transition-colors duration-150
                ${values.includes(option.value) ? 'bg-red-50 text-red-700' : 'text-gray-700'}
              `}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {values.includes(option.value) && (
                <Check size={16} className="text-red-600 ml-2" />
              )}
            </button>
          ))}
          
          {values.length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <button
                type="button"
                onClick={() => onValueChange([])}
                className="w-full cursor-pointer text-sm text-red-600 hover:text-red-700 font-medium py-2 rounded-lg hover:bg-red-50 transition-colors duration-150"
              >
                Limpiar selección
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
}) => {
  const isCompact = className.includes('compact');
  
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 
        pointer-events-none flex items-center`}>
        {icon}
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`w-full cursor-pointer ${isCompact ? 
          'pl-7 pr-3 h-8 min-h-[32px] text-xs' : 'pl-10 pr-4 h-12 min-h-[48px]'} 
          border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 
          focus:border-transparent bg-white text-gray-700 font-medium transition-all duration-200 
          hover:border-gray-300 [&>span]:text-left [&>span]:flex [&>span]:items-center [&>span]:h-full 
          [&>svg]:h-3 [&>svg]:w-3`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-lg border border-gray-200 shadow-lg bg-white z-50">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className={`cursor-pointer hover:bg-red-50 focus:bg-red-50 
                data-[highlighted]:bg-red-50 flex items-center 
                px-4 py-3 transition-colors duration-150 ${isCompact ? 'text-xs' : 'text-sm'}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({ 
  onSearch, 
  onLocationSelect, 
  selectedLocation, 
  mounted, 
  className = '' 
}) => {
  const [formData, setFormData] = useState<SearchFormData>({
    operation: 'alquiler', // Valor por defecto para mostrar tab activo
    propertyType: [],       // Array vacío para selección múltiple
    rooms: [],              // Array vacío para selección múltiple
    selectedLocations: [],  // Array vacío para múltiples ubicaciones
    priceFrom: '',
    priceTo: '',
    surfaceFrom: '',
    surfaceTo: '',
    bathrooms: '',
    garages: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationInputValue, setLocationInputValue] = useState('');

  const handleInputChange = (field: keyof SearchFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (location: { address: string; lat: number; lng: number }) => {
    // Verificar si la ubicación ya está seleccionada
    const isAlreadySelected = formData.selectedLocations.some(
      loc => loc.address === location.address
    );
    
    if (!isAlreadySelected) {
      setFormData(prev => ({
        ...prev,
        selectedLocations: [...prev.selectedLocations, location]
      }));
      // Limpiar el input después de seleccionar
      setLocationInputValue('');
      onLocationSelect(location);
    }
  };

  const removeLocation = (addressToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.filter(
        loc => loc.address !== addressToRemove
      )
    }));
  };

  const clearAllLocations = () => {
    setFormData(prev => ({
      ...prev,
      selectedLocations: []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchData = {
      ...formData,
      selectedLocations: formData.selectedLocations
    };
    onSearch(searchData);
  };

  const clearFilters = () => {
    setFormData({
      operation: 'alquiler', // Mantener la operación por defecto
      propertyType: [],       // Array vacío
      rooms: [],              // Array vacío
      selectedLocations: [],  // Array vacío
        priceFrom: '',
      priceTo: '',
      surfaceFrom: '',
      surfaceTo: '',
      bathrooms: '',
      garages: ''
    });
  };

  return (
    <div className={`relative bg-white shadow-2xl p-6 md:p-8 max-w-5xl mx-auto ${className}`} style={{ marginTop: '2.5rem', borderRadius: '0 1rem 1rem 1rem' }}>
      {/* Selector de operación con tabs tipo solapas */}
      <OperationTabs
        value={formData.operation}
        onValueChange={(value) => handleInputChange('operation', value)}
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Fila principal de búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

          {/* Tipo de propiedad - MultiSelect */}
          <MultiSelect
            values={formData.propertyType}
            onValueChange={(values) => handleInputChange('propertyType', values)}
            placeholder="Tipo"
            options={propertyTypes}
            icon={<Home size={18} />}
          />

          {/* Cantidad de ambientes - MultiSelect */}
          <MultiSelect
            values={formData.rooms}
            onValueChange={(values) => handleInputChange('rooms', values)}
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
              value={locationInputValue}
              onChange={setLocationInputValue}
            />
          </div>

          {/* Botón de búsqueda */}
          <div className="xl:col-span-1">
            <Button
              type="submit"
              className="w-full h-12 min-h-[48px] cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              disabled={!mounted}
            >
              <Search size={18} />
              <span className="hidden sm:inline">Buscar</span>
            </Button>
          </div>
        </div>

        {/* Mostrar ubicaciones seleccionadas como badges */}
        {formData.selectedLocations.length > 0 && mounted && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {formData.selectedLocations.map((location, index) => {
                // Mostrar solo la parte antes de la primera coma
                const shortName = location.address.split(',')[0].trim();
                return (
                  <div 
                    key={`${location.address}-${index}`}
                    className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium animate-in slide-in-from-left duration-300"
                  >
                    <MapPin size={12} />
                    <span className="max-w-24 truncate">{shortName}</span>
                    <button
                      type="button"
                      onClick={() => removeLocation(location.address)}
                      className="text-green-600 hover:text-green-800 transition-colors ml-0.5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
            {formData.selectedLocations.length > 1 && (
              <button
                type="button"
                onClick={clearAllLocations}
                className="cursor-pointer text-xs text-green-600 hover:text-green-800 transition-colors"
              >
                Limpiar todas las ubicaciones
              </button>
            )}
          </div>
        )}

        {/* Filtros avanzados con altura fija */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
            >
              <div className="flex items-center">
                <Filter size={16} />
              </div>
              Filtros avanzados
              {showAdvanced ? (
                <ChevronUp size={16} className="transition-transform duration-200" />
              ) : (
                <ChevronDown size={16} className="transition-transform duration-200" />
              )}
            </button>

            {(formData.operation || formData.propertyType.length > 0 || formData.rooms.length > 0 || formData.selectedLocations.length > 0 || formData.priceFrom || formData.priceTo || formData.surfaceFrom || formData.surfaceTo || formData.bathrooms || formData.garages) && (
              <button
                type="button"
                onClick={clearFilters}
                className="cursor-pointer text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Contenedor con altura dinámica */}
          <div 
            className={`transition-all duration-300 ease-in-out ${showAdvanced ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0 overflow-hidden pt-0'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
              {/* Sección Precio */}
              <div className="lg:col-span-2">
                <h4 className="text-xs font-medium text-gray-600 mb-2 px-1">Precio</h4>
                <div className="grid grid-cols-2 gap-2">
                  <CustomSelect
                    value={formData.priceFrom}
                    onValueChange={(value) => handleInputChange('priceFrom', value)}
                    placeholder="Desde"
                    options={priceFromRanges}
                    icon={<DollarSign size={14} />}
                    className="compact"
                  />
                  <CustomSelect
                    value={formData.priceTo}
                    onValueChange={(value) => handleInputChange('priceTo', value)}
                    placeholder="Hasta"
                    options={priceToRanges}
                    icon={<DollarSign size={14} />}
                    className="compact"
                  />
                </div>
              </div>

              {/* Sección Superficie */}
              <div className="lg:col-span-2">
                <h4 className="text-xs font-medium text-gray-600 mb-2 px-1">Superficie</h4>
                <div className="grid grid-cols-2 gap-2">
                  <CustomSelect
                    value={formData.surfaceFrom}
                    onValueChange={(value) => handleInputChange('surfaceFrom', value)}
                    placeholder="Desde"
                    options={surfaceFromRanges}
                    icon={<Ruler size={14} />}
                    className="compact"
                  />
                  <CustomSelect
                    value={formData.surfaceTo}
                    onValueChange={(value) => handleInputChange('surfaceTo', value)}
                    placeholder="Hasta"
                    options={surfaceToRanges}
                    icon={<Ruler size={14} />}
                    className="compact"
                  />
                </div>
              </div>

              {/* Baños */}
              <div className="lg:col-span-1">
                <h4 className="text-xs font-medium text-gray-600 mb-2 px-1">Baños</h4>
                <CustomSelect
                  value={formData.bathrooms}
                  onValueChange={(value) => handleInputChange('bathrooms', value)}
                  placeholder="Baños"
                  options={bathroomOptions}
                  icon={<Bath size={14} />}
                  className="compact"
                />
              </div>

              {/* Cocheras */}
              <div className="lg:col-span-1">
                <h4 className="text-xs font-medium text-gray-600 mb-2 px-1">Cocheras</h4>
                <CustomSelect
                  value={formData.garages}
                  onValueChange={(value) => handleInputChange('garages', value)}
                  placeholder="Cocheras"
                  options={garageOptions}
                  icon={<Car size={14} />}
                  className="compact"
                />
              </div>
            </div>
          </div>
        </div>

     
      </form>
    </div>
  );
};

export default EnhancedSearchBar;