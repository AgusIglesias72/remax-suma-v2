// app/api/ai/generate-description/route.ts
import { Anthropic } from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { aiGenerationLimit } from '@/lib/rate-limit'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    // Verificar que tengamos la API key configurada
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY no está configurada')
      return NextResponse.json(
        { error: 'API de IA no configurada correctamente' },
        { status: 503 }
      )
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown'
    
    const { success, remaining } = await aiGenerationLimit.check(ip)
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Límite de solicitudes excedido',
          message: 'Has alcanzado el límite de 5 generaciones por hora. Por favor, intenta más tarde.'
        },
        { status: 429 }
      )
    }

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error parseando body:', parseError)
      return NextResponse.json(
        { error: 'Datos inválidos en la solicitud' },
        { status: 400 }
      )
    }

    const { propertyData } = body

    // Validar que tengamos los datos necesarios
    if (!propertyData) {
      console.error('No se recibió propertyData')
      return NextResponse.json(
        { error: 'No se recibieron datos de la propiedad' },
        { status: 400 }
      )
    }

    if (!propertyData.tipo || !propertyData.operacion) {
      console.error('Datos incompletos:', { tipo: propertyData.tipo, operacion: propertyData.operacion })
      return NextResponse.json(
        { error: 'Datos de propiedad incompletos. Se requiere tipo y operación.' },
        { status: 400 }
      )
    }

    console.log('Generando descripción para:', {
      tipo: propertyData.tipo,
      operacion: propertyData.operacion,
      ciudad: propertyData.ciudad
    })

    const prompt = `Genera una descripción profesional y atractiva para una propiedad inmobiliaria en Argentina con las siguientes características:

    Tipo de propiedad: ${propertyData.tipo}
    Operación: ${propertyData.operacion}
    Ubicación: ${propertyData.direccion || 'No especificada'}, ${propertyData.barrio || ''}, ${propertyData.ciudad || ''}
    Ambientes: ${propertyData.ambientes || 'No especificado'}
    Dormitorios: ${propertyData.dormitorios || 'No especificado'}
    Baños: ${propertyData.baños || 'No especificado'}
    Superficie: ${propertyData.superficieTotales || 'No especificada'}m²
    Precio: ${propertyData.moneda || 'ARS'} ${propertyData.precio || 'Consultar'}
    ${propertyData.expensas ? `Expensas: ARS ${propertyData.expensas}` : ''}
    Antigüedad: ${propertyData.antiguedad || 'No especificada'}
    Orientación: ${propertyData.orientacion || 'No especificada'}
    Características adicionales: ${propertyData.caracteristicasPropiedad?.join(', ') || 'No especificadas'}
    
    Instrucciones para la descripción:
    1. Debe tener entre 150-250 palabras
    2. Destacar las características más atractivas primero
    3. Mencionar el barrio y sus beneficios si está disponible
    4. Usar un tono profesional pero cálido y acogedor
    5. NO inventar características que no fueron mencionadas
    6. NO usar superlativos exagerados
    7. Incluir un llamado a la acción sutil al final
    8. Usar términos inmobiliarios argentinos (departamento, ambiente, etc.)
    9. Si falta información importante, no la menciones`

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Modelo más económico y rápido
        max_tokens: 500,
        temperature: 0.7,
        system: "Eres un agente inmobiliario profesional argentino con años de experiencia escribiendo descripciones atractivas de propiedades. Usas un español neutro argentino.",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      // Extraer el texto de la respuesta
      let description = ''
      if (response.content[0].type === 'text') {
        description = response.content[0].text
      }

      // Calcular tokens usados (estimado)
      const tokensUsed = response.usage?.input_tokens || 0 + response.usage?.output_tokens || 0

      console.log('Descripción generada exitosamente')

      return NextResponse.json({ 
        description,
        tokensUsed,
        remaining,
        message: `Descripción generada con éxito. Te quedan ${remaining} generaciones esta hora.`
      })
    } catch (anthropicError) {
      console.error('Error de Anthropic:', anthropicError)
      
      // Verificar si es un error de API key
      if (anthropicError instanceof Error && anthropicError.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API key de Anthropic no válida o no configurada' },
          { status: 503 }
        )
      }
      
      throw anthropicError // Re-lanzar para el catch general
    }
  } catch (error) {
    console.error('Error generating description:', error)
    
    // Manejo de errores específicos
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Error de configuración del servidor' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error al generar la descripción. Por favor, intenta nuevamente.' },
      { status: 500 }
    )
  }
}