'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Search,
  FileText,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Download,
  Eye,
  TrendingUp,
  Building2,
  MapPin
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos mock de ACMs guardados
const mockACMs = [
  {
    id: 'GABI',
    name: 'GABI',
    client: '-',
    location: '[Búsqueda por barrio]',
    operationType: 'Venta',
    propertyType: 'Departamento Dúplex',
    rooms: '8+',
    date: '02/09/2025',
    status: 'active',
    selectedProperties: 3,
    estimatedValue: 450000
  },
  {
    id: 'rene',
    name: 'rene',
    client: '-',
    location: '[Búsqueda por barrio]',
    operationType: 'Venta',
    propertyType: 'Departamento Dúplex',
    rooms: '7+',
    date: '01/09/2025',
    status: 'active',
    selectedProperties: 5,
    estimatedValue: 380000
  },
  {
    id: 'MATY YAMI',
    name: 'MATY YAMI',
    client: '-',
    location: '[Búsqueda por barrio]',
    operationType: 'Venta',
    propertyType: 'Departamento Dúplex',
    rooms: '7+',
    date: '29/08/2025',
    status: 'active',
    selectedProperties: 4,
    estimatedValue: 520000
  },
  {
    id: 'GUSTAVO SAN FERNANDO',
    name: 'GUSTAVO SAN FERNANDO',
    client: '-',
    location: '[Búsqueda por barrio]',
    operationType: 'Venta',
    propertyType: 'PH',
    rooms: '3+',
    date: '24/08/2025',
    status: 'archived',
    selectedProperties: 6,
    estimatedValue: 290000
  },
  {
    id: 'ALEJANDRA MALLO',
    name: 'ALEJANDRA MALLO',
    client: '-',
    location: '[Búsqueda por barrio]',
    operationType: 'Venta',
    propertyType: 'PH',
    rooms: '4+',
    date: '24/08/2025',
    status: 'archived',
    selectedProperties: 2,
    estimatedValue: 310000
  },
  {
    id: 'KARI LOCAL',
    name: 'KARI LOCAL',
    client: '-',
    location: '[Búsqueda por barrio]',
    operationType: 'Venta',
    propertyType: 'Casa',
    rooms: '4+',
    date: '22/08/2025',
    status: 'archived',
    selectedProperties: 8,
    estimatedValue: 680000
  }
];

export default function ACMListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('activos');
  
  // Filtrar ACMs según el tab activo y término de búsqueda
  const filteredACMs = mockACMs.filter(acm => {
    const matchesTab = activeTab === 'activos' ? acm.status === 'active' : acm.status === 'archived';
    const matchesSearch = acm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acm.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acm.propertyType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleNewACM = () => {
    router.push('/admin/acm/nuevo');
  };

  const handleEditACM = (id: string) => {
    router.push(`/admin/acm/${id}/editar`);
  };

  const handleViewACM = (id: string) => {
    router.push(`/admin/acm/${id}`);
  };

  const handleDuplicateACM = (id: string) => {
    // Lógica para duplicar
    console.log('Duplicar ACM:', id);
  };

  const handleDeleteACM = (id: string) => {
    // Lógica para eliminar
    if (confirm('¿Estás seguro de eliminar este ACM?')) {
      console.log('Eliminar ACM:', id);
    }
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Análisis Comparativo de Mercado
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona y crea análisis de valor basados en propiedades comparables
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleNewACM}
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear nuevo
        </Button>
      </div>

      {/* Search and Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, cliente o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="activos">
                  Activos ({mockACMs.filter(a => a.status === 'active').length})
                </TabsTrigger>
                <TabsTrigger value="archivados">
                  Archivados ({mockACMs.filter(a => a.status === 'archived').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">NOMBRE</TableHead>
                <TableHead className="font-semibold">CLIENTE</TableHead>
                <TableHead className="font-semibold">UBICACIONES</TableHead>
                <TableHead className="font-semibold">TIPO DE OPERACIÓN</TableHead>
                <TableHead className="font-semibold">TIPO DE PROPIEDAD</TableHead>
                <TableHead className="font-semibold text-center">ÚLTIMA MODIFICACIÓN</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredACMs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No se encontraron análisis {activeTab === 'activos' ? 'activos' : 'archivados'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredACMs.map((acm) => (
                  <TableRow 
                    key={acm.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewACM(acm.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        {acm.name}
                      </div>
                    </TableCell>
                    <TableCell>{acm.client}</TableCell>
                    <TableCell>
                      <span className="text-gray-600">{acm.location}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{acm.operationType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{acm.propertyType}</span>
                        <Badge variant="secondary" className="text-xs">
                          {acm.rooms}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-600">
                      {acm.date}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleViewACM(acm.id);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver análisis
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEditACM(acm.id);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateACM(acm.id);
                          }}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            // Exportar lógica
                          }}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteACM(acm.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      {activeTab === 'activos' && filteredACMs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Análisis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredACMs.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Valor Promedio Estimado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  filteredACMs.reduce((acc, acm) => acc + acm.estimatedValue, 0) / filteredACMs.length
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Propiedades Analizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredACMs.reduce((acc, acm) => acc + acm.selectedProperties, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Último Análisis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredACMs[0]?.date}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}