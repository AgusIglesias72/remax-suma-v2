'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'AGENT' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role: 'CLIENT' | 'AGENT') => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // Actualizar los metadatos del usuario en Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: role,
        }
      });

      // Redirigir según el rol
      if (role === 'AGENT') {
        router.push('/agent/setup');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a Real Estate!
          </h1>
          <p className="text-gray-600">
            Para comenzar, necesitamos saber cómo vas a usar la plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Opción Cliente */}
          <Card 
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === 'CLIENT' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setSelectedRole('CLIENT')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Busco Propiedad
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Quiero comprar, alquilar o invertir en propiedades
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Búsqueda avanzada</li>
                <li>• Favoritos y alertas</li>
                <li>• Contacto directo con agentes</li>
                <li>• Calculadora de hipotecas</li>
              </ul>
            </div>
          </Card>

          {/* Opción Agente */}
          <Card 
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === 'AGENT' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setSelectedRole('AGENT')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6m8 0H8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Soy Agente
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Trabajo en el sector inmobiliario y gestiono propiedades
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Gestión de propiedades</li>
                <li>• CRM integrado</li>
                <li>• Dashboard de métricas</li>
                <li>• Herramientas de marketing</li>
              </ul>
            </div>
          </Card>
        </div>

        {selectedRole && (
          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={() => handleRoleSelection(selectedRole)}
              disabled={isLoading}
              className="px-8 py-3"
            >
              {isLoading ? 'Configurando...' : 'Continuar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}