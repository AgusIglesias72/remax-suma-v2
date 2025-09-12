import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Obtener información del usuario de nuestra base de datos
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { 
      profile: true,
      properties: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const isAgent = user?.role !== 'CLIENT';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user?.profile?.firstName || 'Usuario'}!
          </h1>
          <p className="mt-2 text-gray-600">
            {isAgent 
              ? 'Gestiona tus propiedades y leads desde tu panel de control' 
              : 'Encuentra la propiedad perfecta para vos'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Panel principal */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isAgent ? 'Tus Propiedades Recientes' : 'Propiedades Recomendadas'}
              </h2>
              
              {isAgent && user?.properties?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aún no has publicado ninguna propiedad</p>
                  <a 
                    href="/propiedades/nueva" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Publicar Primera Propiedad
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {user?.properties?.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{property.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{property.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                {isAgent ? (
                  <>
                    <a href="/propiedades/nueva" className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700">
                      Nueva Propiedad
                    </a>
                    <a href="/leads" className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200">
                      Ver Leads
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/propiedades" className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700">
                      Buscar Propiedades
                    </a>
                    <a href="/favorites" className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200">
                      Mis Favoritos
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tu Perfil</h3>
              <div className="text-sm text-gray-600">
                <p><strong>Rol:</strong> {user?.role}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Miembro desde:</strong> {user?.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}