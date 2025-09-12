import { PrismaClient, UserRole, PropertyStatus, OperationType, PropertyType, Currency } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Crear agencia demo
  const agency = await prisma.agency.upsert({
    where: { slug: 'inmobiliaria-demo' },
    update: {},
    create: {
      name: 'Inmobiliaria Demo',
      slug: 'inmobiliaria-demo',
      email: 'info@demo.com',
      phone: '+54 11 4567-8901',
      description: 'Agencia inmobiliaria de demostración',
      address: {
        street: 'Av. Corrientes',
        number: '1234',
        city: 'Buenos Aires',
        province: 'CABA',
        country: 'Argentina'
      },
      settings: {},
      commissionRules: {
        defaultRate: 3.5,
        agentSplit: 70
      }
    }
  });

  console.log('✅ Agencia creada:', agency.name);

  // Crear usuario agente demo (sin clerkId para testing)
  const agent = await prisma.user.upsert({
    where: { email: 'agente@demo.com' },
    update: {},
    create: {
      email: 'agente@demo.com',
      role: UserRole.AGENT,
      agencyId: agency.id,
      profile: {
        create: {
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          phone: '+54 11 1234-5678',
          phoneVerified: true,
          bio: 'Agente inmobiliario especializado en propiedades residenciales en CABA.',
          licenseNumber: 'CPI-1234',
          specializations: ['APARTMENT', 'HOUSE'],
          areasOfOperation: ['Palermo', 'Recoleta', 'Puerto Madero'],
          yearsOfExperience: 8
        }
      }
    },
    include: {
      profile: true
    }
  });

  console.log('✅ Agente creado:', agent.profile?.firstName, agent.profile?.lastName);

  // Crear edificio demo
  const building = await prisma.building.create({
    data: {
      name: 'Torre Ejemplo',
      description: 'Moderno edificio en el corazón de Palermo con todas las comodidades.',
      address: 'Av. Santa Fe 2500, Palermo, CABA',
      latitude: -34.5875,
      longitude: -58.3974,
      floors: 15,
      units: 45,
      yearBuilt: 2018,
      architect: 'Estudio Arquitectos SA',
      amenities: [
        'pileta',
        'gimnasio',
        'sum',
        'seguridad24h',
        'cocheras'
      ]
    }
  });

  console.log('✅ Edificio creado:', building.name);

  // Crear propiedades demo
  const properties = [
    {
      title: 'Departamento 2 ambientes en Palermo',
      description: 'Hermoso departamento de 2 ambientes con balcón y vista a la ciudad. Cocina integrada, dormitorio principal con vestidor, baño completo. Muy luminoso y en excelente estado.',
      operationType: OperationType.SALE,
      propertyType: PropertyType.APARTMENT,
      status: PropertyStatus.ACTIVE,
      location: {
        province: 'CABA',
        city: 'Buenos Aires',
        neighborhood: 'Palermo',
        street: 'Av. Santa Fe',
        streetNumber: '2500',
        floor: '8',
        apartment: 'A',
        latitude: -34.5875,
        longitude: -58.3974
      },
      price: {
        amount: 180000,
        currency: Currency.USD
      },
      features: {
        totalArea: 55,
        coveredArea: 48,
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['balcon', 'cocina_integrada', 'vestidor']
      }
    },
    {
      title: 'Casa 3 dormitorios en Recoleta',
      description: 'Elegante casa de estilo francés en el barrio de Recoleta. 3 dormitorios, 2 baños, living comedor, cocina independiente, patio y terraza. Ideal para familia.',
      operationType: OperationType.RENT,
      propertyType: PropertyType.HOUSE,
      status: PropertyStatus.ACTIVE,
      location: {
        province: 'CABA',
        city: 'Buenos Aires',
        neighborhood: 'Recoleta',
        street: 'Posadas',
        streetNumber: '1234',
        latitude: -34.5930,
        longitude: -58.3960
      },
      price: {
        amount: 1200,
        currency: Currency.USD,
        expensesAmount: 250
      },
      features: {
        totalArea: 120,
        coveredArea: 95,
        rooms: 4,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['patio', 'terraza', 'cocina_independiente']
      }
    },
    {
      title: 'Loft moderno en Puerto Madero',
      description: 'Espectacular loft con vista al río en Puerto Madero. Ambiente integrado, mezzanine, baño completo, cocina de diseño. Edificio con amenities completos.',
      operationType: OperationType.SALE,
      propertyType: PropertyType.LOFT,
      status: PropertyStatus.ACTIVE,
      location: {
        province: 'CABA',
        city: 'Buenos Aires',
        neighborhood: 'Puerto Madero',
        street: 'Pierina Dealessi',
        streetNumber: '750',
        floor: '12',
        apartment: '1205',
        latitude: -34.6118,
        longitude: -58.3643
      },
      price: {
        amount: 320000,
        currency: Currency.USD
      },
      features: {
        totalArea: 85,
        coveredArea: 78,
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['vista_rio', 'mezzanine', 'cocina_diseno', 'edificio_amenities']
      }
    }
  ];

  for (const propertyData of properties) {
    const property = await prisma.property.create({
      data: {
        title: propertyData.title,
        description: propertyData.description,
        operationType: propertyData.operationType,
        propertyType: propertyData.propertyType,
        status: propertyData.status,
        code: `DEMO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        slug: propertyData.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-'),
        agentId: agent.id,
        agencyId: agency.id,
        buildingId: propertyData.propertyType === PropertyType.APARTMENT ? building.id : undefined,
        publishedAt: new Date(),
        location: {
          create: propertyData.location
        },
        prices: {
          create: {
            amount: propertyData.price.amount,
            currency: propertyData.price.currency,
            expensesAmount: propertyData.price.expensesAmount || null,
            isActive: true
          }
        },
        features: {
          create: {
            category: 'GENERAL',
            totalArea: propertyData.features.totalArea,
            coveredArea: propertyData.features.coveredArea,
            rooms: propertyData.features.rooms,
            bedrooms: propertyData.features.bedrooms,
            bathrooms: propertyData.features.bathrooms,
            amenities: propertyData.features.amenities,
            condition: 'EXCELLENT'
          }
        },
        images: {
          create: [
            {
              url: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop`,
              altText: `Imagen principal - ${propertyData.title}`,
              isMain: true,
              order: 0,
              width: 800,
              height: 600,
              format: 'jpg'
            },
            {
              url: `https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop`,
              altText: `Vista interior - ${propertyData.title}`,
              isMain: false,
              order: 1,
              width: 800,
              height: 600,
              format: 'jpg'
            }
          ]
        }
      },
      include: {
        location: true,
        prices: true,
        features: true,
        images: true
      }
    });

    console.log(`✅ Propiedad creada: ${property.title} - ${property.code}`);
  }

  // Crear usuario cliente demo
  const client = await prisma.user.upsert({
    where: { email: 'cliente@demo.com' },
    update: {},
    create: {
      email: 'cliente@demo.com',
      role: UserRole.CLIENT,
      profile: {
        create: {
          firstName: 'María',
          lastName: 'González',
          phone: '+54 11 9876-5432',
          phoneVerified: true
        }
      },
      favoriteLists: {
        create: {
          name: 'Mis Favoritos',
          description: 'Lista principal de favoritos',
          isDefault: true
        }
      }
    },
    include: {
      profile: true,
      favoriteLists: true
    }
  });

  console.log('✅ Cliente creado:', client.profile?.firstName, client.profile?.lastName);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📊 Datos creados:');
  console.log(`- 1 Agencia: ${agency.name}`);
  console.log(`- 1 Agente: ${agent.profile?.firstName} ${agent.profile?.lastName}`);
  console.log(`- 1 Cliente: ${client.profile?.firstName} ${client.profile?.lastName}`);
  console.log(`- 1 Edificio: ${building.name}`);
  console.log(`- ${properties.length} Propiedades`);
  console.log('\n🔗 Puedes acceder con:');
  console.log('- Agente: agente@demo.com');
  console.log('- Cliente: cliente@demo.com');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });