"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, MapPin, Bed, ChevronDown, X, Filter, DollarSign, Check, Bath, Car } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchAutocomplete } from "@/components/search/google-autocomplete";
import { type LocationData } from "@/lib/location-utils";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import EnhancedSearchBar from '@/components/search/enhanced-search-bar';
import PopularSearches from '@/components/search/popular-searches';

// Operation types with styling for mobile
const operationTypes = [
  { value: 'alquiler', label: 'Alquilar', bgColor: 'bg-blue-600', bgColorHover: 'bg-blue-700' },
  { value: 'venta', label: 'Comprar', bgColor: 'bg-red-600', bgColorHover: 'bg-red-700' }
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
  { value: '999999999', label: 'Sin máximo' },
  { value: '100000', label: '$100.000' },
  { value: '200000', label: '$200.000' },
  { value: '300000', label: '$300.000' },
  { value: '500000', label: '$500.000' },
  { value: '1000000', label: '$1.000.000' },
  { value: '2000000', label: '$2.000.000' }
];

const priceRanges = {
  venta: [
    { value: 'all', label: 'Cualquier precio' },
    { value: '0-100000', label: 'Hasta USD 100.000' },
    { value: '100000-200000', label: 'USD 100.000 - 200.000' },
    { value: '200000-300000', label: 'USD 200.000 - 300.000' },
    { value: '300000-500000', label: 'USD 300.000 - 500.000' },
    { value: '500000+', label: 'Más de USD 500.000' },
  ],
  alquiler: [
    { value: 'all', label: 'Cualquier precio' },
    { value: '0-1000', label: 'Hasta USD 1.000' },
    { value: '1000-1500', label: 'USD 1.000 - 1.500' },
    { value: '1500-2000', label: 'USD 1.500 - 2.000' },
    { value: '2000-3000', label: 'USD 2.000 - 3.000' },
    { value: '3000+', label: 'Más de USD 3.000' },
  ],
}

interface MobileSearchFormData {
  operation: string;
  propertyType: string[];
  rooms: string[];
  selectedLocations: { address: string; lat: number; lng: number }[];
  priceFrom: string;
  priceTo: string;
  bathrooms: string;
  garages: string;
}

// Componente MultiSelect para mobile
interface MobileMultiSelectProps {
  values: string[];
  onValueChange: (values: string[]) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
}

const MobileMultiSelect: React.FC<MobileMultiSelectProps> = ({ 
  values = [], 
  onValueChange, 
  placeholder, 
  options = [], 
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && event.target && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, mounted]);
  
  const toggleOption = (optionValue: string) => {
    if (!onValueChange || !optionValue || !mounted) return;
    
    try {
      const currentValues = Array.isArray(values) ? values : [];
      
      // Si es el placeholder "Ambientes" implementamos lógica correlativa
      if (placeholder === "Ambientes") {
        const numericValues = ['1', '2', '3', '4', '5+'];
        const selectedNumeric = currentValues.filter(v => numericValues.includes(v)).sort();
        
        if (currentValues.includes(optionValue)) {
          // Si deseleccionamos, también deseleccionamos los valores mayores
          if (numericValues.includes(optionValue)) {
            const optionIndex = numericValues.indexOf(optionValue);
            const newValues = currentValues.filter(v => {
              if (!numericValues.includes(v)) return true; // Mantener monoambiente
              const vIndex = numericValues.indexOf(v);
              return vIndex < optionIndex;
            });
            onValueChange(newValues);
          } else {
            // Para monoambiente
            onValueChange(currentValues.filter(v => v !== optionValue));
          }
        } else {
          // Si seleccionamos, seleccionamos todos los valores hasta ese número
          if (numericValues.includes(optionValue)) {
            const optionIndex = numericValues.indexOf(optionValue);
            const rangesToAdd = numericValues.slice(0, optionIndex + 1);
            const nonNumericValues = currentValues.filter(v => !numericValues.includes(v));
            const newValues = [...nonNumericValues, ...rangesToAdd];
            onValueChange(newValues);
          } else {
            // Para monoambiente
            onValueChange([...currentValues, optionValue]);
          }
        }
      } else {
        // Comportamiento normal para otros selectores
        if (currentValues.includes(optionValue)) {
          onValueChange(currentValues.filter(v => v !== optionValue));
        } else {
          onValueChange([...currentValues, optionValue]);
        }
      }
    } catch (error) {
      console.error('Error in toggleOption:', error);
    }
  };

  const getDisplayText = () => {
    const safeValues = Array.isArray(values) ? values : [];
    const safeOptions = Array.isArray(options) ? options : [];
    
    if (safeValues.length === 0) return placeholder;
    
    // Lógica especial para Ambientes
    if (placeholder === "Ambientes") {
      const numericValues = ['1', '2', '3', '4', '5+'];
      const selectedNumeric = safeValues.filter(v => numericValues.includes(v)).sort((a, b) => {
        if (a === '5+') return 1;
        if (b === '5+') return -1;
        return parseInt(a) - parseInt(b);
      });
      const hasMonoambiente = safeValues.includes('monoambiente');
      
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
    if (safeValues.length === 1) {
      const option = safeOptions.find(opt => opt && opt.value === safeValues[0]);
      return option?.label || placeholder;
    }
    return `${safeValues.length} seleccionados`;
  };

  if (!mounted) {
    return (
      <div className="relative">
        <div className="w-full h-12 pl-10 pr-10 border border-gray-200 rounded-xl bg-white text-gray-400 text-sm flex items-center relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
          {placeholder}
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-300 text-left text-sm relative"
      >
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
        <span className={`block truncate pr-6 ${values.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
          {getDisplayText()}
        </span>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left hover:bg-red-50 
                border-b border-gray-50 last:border-b-0 transition-colors duration-150 text-sm
                ${values.includes(option.value) ? 'bg-red-50 text-red-700' : 'text-gray-700'}
              `}
            >
              <span className="font-medium">{option.label}</span>
              {values.includes(option.value) && (
                <Check size={16} className="text-red-600" />
              )}
            </button>
          ))}
          
          {values.length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <button
                type="button"
                onClick={() => onValueChange && onValueChange([])}
                className="w-full text-sm text-gray-600 hover:text-red-700 font-medium py-2 rounded-lg hover:bg-red-50 transition-colors duration-150"
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

interface HeroSectionProps {
  onLocationSelect?: (location: LocationData) => void;
  selectedLocation?: LocationData | null;
  mounted?: boolean;
}

export default function HeroSection({ 
  onLocationSelect, 
  selectedLocation, 
  mounted = true 
}: HeroSectionProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<MobileSearchFormData>({
    operation: 'venta', // Default to Comprar
    propertyType: [],
    rooms: [],
    selectedLocations: [],
    priceFrom: '0',
    priceTo: '999999999',
    bathrooms: '',
    garages: ''
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationInputValue, setLocationInputValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const isAlreadySelected = formData.selectedLocations.some(
        loc => loc.address === selectedLocation.address
      );
      if (!isAlreadySelected) {
        setFormData(prev => ({ 
          ...prev, 
          selectedLocations: [...prev.selectedLocations, {
            address: selectedLocation.address,
            lat: selectedLocation.lat,
            lng: selectedLocation.lng
          }]
        }));
      }
    }
  }, [selectedLocation, formData.selectedLocations]);

  const handleInputChange = (field: keyof MobileSearchFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (location: LocationData) => {
    const isAlreadySelected = formData.selectedLocations.some(
      loc => loc.address === location.address
    );
    if (!isAlreadySelected) {
      setFormData(prev => ({ 
        ...prev, 
        selectedLocations: [...prev.selectedLocations, {
          address: location.address,
          lat: location.lat,
          lng: location.lng
        }]
      }));
    }
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const clearLocation = () => {
    setFormData(prev => ({ ...prev, selectedLocations: [] }));
    setLocationInputValue('');
  };

  const removeLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.filter((_, i) => i !== index)
    }));
  };

  const handleSearch = () => {
    if (!mounted || !isClient) return;

    try {
      const params = new URLSearchParams();

    if (formData.operation) {
      params.set("operacion", formData.operation);
    }
    if (formData.propertyType && formData.propertyType.length > 0) {
      params.set("tipos", formData.propertyType.join(','));
    }
    if (formData.rooms && formData.rooms.length > 0) {
      params.set("ambientes", formData.rooms.join(','));
    }
    if (formData.selectedLocations && formData.selectedLocations.length > 0) {
      const addresses = formData.selectedLocations.map(loc => loc.address).join('|');
      const latitudes = formData.selectedLocations.map(loc => loc.lat.toString()).join(',');
      const longitudes = formData.selectedLocations.map(loc => loc.lng.toString()).join(',');
      
      params.set("ubicaciones", addresses);
      params.set("latitudes", latitudes);
      params.set("longitudes", longitudes);
    }
    if (formData.priceFrom && formData.priceFrom !== '0') {
      params.set("precio-desde", formData.priceFrom);
    }
    if (formData.priceTo && formData.priceTo !== '999999999') {
      params.set("precio-hasta", formData.priceTo);
    }
    if (formData.bathrooms && formData.bathrooms !== 'any') {
      params.set("banos", formData.bathrooms);
    }
    if (formData.garages && formData.garages !== 'any') {
      params.set("cocheras", formData.garages);
    }

      const queryString = params.toString();
      router.push(`/propiedades${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      console.error('Error in handleSearch:', error);
    }
  };

  const handleEnhancedSearch = (data: {
    operation: string;
    propertyType: string[];
    rooms: string[];
    selectedLocations: { address: string; lat: number; lng: number }[];
    priceFrom: string;
    priceTo: string;
    surfaceFrom: string;
    surfaceTo: string;
    bathrooms: string;
    garages: string;
  }) => {
    if (!mounted || !isClient) return;
    
    try {
  
    const params = new URLSearchParams();
  
    if (data.operation) {
      params.set("operacion", data.operation);
    }
    if (data.propertyType && data.propertyType.length > 0) {
      params.set("tipos", data.propertyType.join(','));
    }
    if (data.rooms && data.rooms.length > 0) {
      params.set("ambientes", data.rooms.join(','));
    }
    if (data.selectedLocations && data.selectedLocations.length > 0) {
      const addresses = data.selectedLocations.map(loc => loc.address).join('|');
      const latitudes = data.selectedLocations.map(loc => loc.lat.toString()).join(',');
      const longitudes = data.selectedLocations.map(loc => loc.lng.toString()).join(',');
      
      params.set("ubicaciones", addresses);
      params.set("latitudes", latitudes);
      params.set("longitudes", longitudes);
    }
    if (data.priceFrom && data.priceFrom !== '0') {
      params.set("precio-desde", data.priceFrom);
    }
    if (data.priceTo && data.priceTo !== '999999999') {
      params.set("precio-hasta", data.priceTo);
    }
    if (data.surfaceFrom) {
      params.set("superficie-desde", data.surfaceFrom);
    }
    if (data.surfaceTo) {
      params.set("superficie-hasta", data.surfaceTo);
    }
    if (data.bathrooms) {
      params.set("banos", data.bathrooms);
    }
    if (data.garages) {
      params.set("cocheras", data.garages);
    }
  
      router.push(`/propiedades?${params.toString()}`);
    } catch (error) {
      console.error('Error in handleEnhancedSearch:', error);
    }
  };

  const handleQuickOperation = (operation: string) => {
    if (!mounted || !isClient) return;
    try {
      const params = new URLSearchParams();
      params.set("operacion", operation);
      router.push(`/propiedades?${params.toString()}`);
    } catch (error) {
      console.error('Error in handleQuickOperation:', error);
    }
  };

  const handlePopularSearch = (searchParams: Record<string, string>) => {
    if (!mounted || !isClient) return;
    try {
      const params = new URLSearchParams(searchParams);
      router.push(`/propiedades?${params.toString()}`);
    } catch (error) {
      console.error('Error in handlePopularSearch:', error);
    }
  };

  const clearFilters = () => {
    setFormData({
      operation: 'venta',
      propertyType: [],
      rooms: [],
      selectedLocations: [],
      priceFrom: '0',
      priceTo: '999999999',
      bathrooms: '',
      garages: ''
    });
    setLocationInputValue('');
  };

  const hasFilters = formData.propertyType.length > 0 || formData.rooms.length > 0 || formData.selectedLocations.length > 0 || (formData.priceFrom && formData.priceFrom !== '0') || (formData.priceTo && formData.priceTo !== '999999999') || (formData.bathrooms && formData.bathrooms !== 'any') || (formData.garages && formData.garages !== 'any');

  // Prevent hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <section 
      className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-6 md:mb-16">
          <h1 className="text-white drop-shadow-2xl">
            <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-1 md:mb-2">
              Tu Hogar Perfecto
            </span>
            <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
              Te Está <span className="relative">
                Esperando
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></span>
              </span>
            </span>
            
            {/* Decorative element - hidden on mobile */}
            <div className="hidden md:flex mt-8 justify-center">
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                <span className="text-sm font-medium tracking-wider uppercase">RE/MAX SUMA</span>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>
          </h1>
        </div>

        {/* Desktop Search - Enhanced Search Bar */}
        <div className="hidden md:block">
          <EnhancedSearchBar 
            onSearch={handleEnhancedSearch}
            onLocationSelect={handleLocationChange}
            selectedLocation={formData.selectedLocations[0] || null}
            mounted={mounted}
          />
          
          {/* Popular Searches - Desktop only */}
          <div className="mt-8 text-center">
            <PopularSearches onSearch={handlePopularSearch} />
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="block md:hidden px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-5 space-y-4 max-w-md sm:max-w-lg mx-auto overflow-visible">
            
            {/* Operation Type Switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {operationTypes.map((operation) => (
                <button
                  key={operation.value}
                  onClick={() => handleInputChange('operation', operation.value)}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-all duration-200 text-sm ${
                    formData.operation === operation.value
                      ? `${operation.bgColor} text-white shadow-md`
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {operation.label}
                </button>
              ))}
            </div>

            {/* Location Search */}
            <div className="relative">
              <SearchAutocomplete
                onLocationSelect={handleLocationChange}
                placeholder="¿Dónde buscás?"
                className="w-full h-12 pr-10 border-2 border-gray-200 rounded-xl focus:ring-0 focus:outline-none focus:border-gray-400 text-gray-700 placeholder-gray-400 text-sm font-medium"
                value={locationInputValue}
                onChange={setLocationInputValue}
              />
              {formData.selectedLocations.length > 0 && (
                <button
                  onClick={clearLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selected Locations Badge */}
            {formData.selectedLocations.length > 0 && mounted && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2.5">
                <MapPin size={14} className="text-green-600" />
                <span className="text-green-800 text-xs font-medium flex-1">
                  {formData.selectedLocations.map(loc => loc.address.split(',')[0]).join(', ')}
                </span>
                <button
                  onClick={clearLocation}
                  className="text-green-600 hover:text-green-800"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Property Type - Now above Filters */}
            <MobileMultiSelect
              values={formData.propertyType}
              onValueChange={(values) => handleInputChange('propertyType', values)}
              placeholder="Tipo"
              options={propertyTypes}
              icon={<Home size={16} />}
            />

            {/* Rooms - Now above Filters */}
            <MobileMultiSelect
              values={formData.rooms}
              onValueChange={(values) => handleInputChange('rooms', values)}
              placeholder="Ambientes"
              options={roomOptions}
              icon={<Bed size={16} />}
            />

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-600" />
                <span className="text-gray-700 font-medium text-sm">Filtros</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Advanced Filters */}
            <div 
              className={`overflow-visible transition-all duration-300 ease-in-out ${
                showAdvanced ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-4 pt-2">
                {/* Price Range */}
                <div className="space-y-2">
                  <span className="text-xs text-gray-600 font-medium">Precio</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                        <DollarSign size={16} />
                      </div>
                      <Select 
                        value={formData.priceFrom || '0'} 
                        onValueChange={(value) => handleInputChange('priceFrom', value)}
                      >
                        <SelectTrigger className="w-full h-12 pl-10 pr-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-300 text-sm">
                          <SelectValue placeholder="Desde" />
                        </SelectTrigger>
                        <SelectContent>
                          {priceFromRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                        <DollarSign size={16} />
                      </div>
                      <Select 
                        value={formData.priceTo || '999999999'} 
                        onValueChange={(value) => handleInputChange('priceTo', value)}
                      >
                        <SelectTrigger className="w-full h-12 pl-10 pr-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-300 text-sm">
                          <SelectValue placeholder="Hasta" />
                        </SelectTrigger>
                        <SelectContent>
                          {priceToRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Bathrooms and Garages */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Bathrooms */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                      <Bath size={16} />
                    </div>
                    <Select 
                      value={formData.bathrooms} 
                      onValueChange={(value) => handleInputChange('bathrooms', value)}
                    >
                      <SelectTrigger className="w-full h-12 pl-10 pr-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-300 text-sm">
                        <SelectValue placeholder="Baños" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Todos</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Garages */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                      <Car size={16} />
                    </div>
                    <Select 
                      value={formData.garages} 
                      onValueChange={(value) => handleInputChange('garages', value)}
                    >
                      <SelectTrigger className="w-full h-12 pl-10 pr-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-gray-400 bg-white text-gray-700 font-medium transition-all duration-200 hover:border-gray-300 text-sm">
                        <SelectValue placeholder="Cocheras" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Todas</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full text-xs text-gray-500 hover:text-red-600 transition-colors py-2"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-base ${
                formData.operation === 'alquiler' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={!mounted}
            >
              <Search size={16} />
              Buscar
            </Button>

          </div>
        </div>
      </div>
    </section>
  );
}