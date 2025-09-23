// app/api/ai/validate-listing/route.ts
import { Anthropic } from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { aiValidationLimit } from '@/lib/rate-limit'

// Inicializar Anthropic solo si tenemos la API key
const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

export async function POST(request: NextRequest) {
  try {
    // Verificar que tengamos la API key configurada
    if (!anthropic) {
      return NextResponse.json(
        { error: 'API de IA no configurada. Por favor, configura ANTHROPIC_API_KEY en las variables de entorno.' },
        { status: 503 }
      )
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown'
    
    const { success, remaining } = await aiValidationLimit.check(ip)
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Límite de validaciones excedido',
          message: 'Has alcanzado el límite de 10 validaciones por hora.'
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { title, description, images, propertyData } = body

    const validationPrompt = `Analiza esta publicación inmobiliaria y proporciona feedback constructivo.

DATOS DE LA PUBLICACIÓN:
Título: ${title || 'Sin título'}
Descripción: ${description || 'Sin descripción'}
Cantidad de imágenes: ${images?.length || 0}
Tipo de propiedad: ${propertyData?.tipo || 'No especificado'}
Operación: ${propertyData?.operacion || 'No especificado'}
Precio: ${propertyData?.moneda || 'ARS'} ${propertyData?.precio || 'No especificado'}
Superficie: ${propertyData?.superficieTotales || 'No especificada'}m²

INSTRUCCIONES:
Evalúa la publicación y responde ÚNICAMENTE en formato JSON válido con esta estructura exacta:
{
  "score": número del 1-100,
  "titleFeedback": "sugerencia para mejorar el título",
  "descriptionFeedback": "sugerencia para mejorar la descripción",
  "imageFeedback": "feedback sobre las imágenes",
  "improvements": ["mejora 1", "mejora 2", "mejora 3"],
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "quickFixes": ["acción rápida 1", "acción rápida 2"]
}

Criterios de evaluación:
- Título: ¿Es atractivo, descriptivo y contiene palabras clave?
- Descripción: ¿Es completa, bien estructurada y persuasiva?
- Imágenes: ¿Hay suficientes? (ideal 8-10)
- Información: ¿Están todos los datos importantes?
- SEO: ¿Usa términos de búsqueda relevantes?

Sé constructivo y específico en el feedback.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 800,
      temperature: 0.3, // Más determinístico para validación consistente
      system: "Eres un experto en marketing inmobiliario y optimización de publicaciones de propiedades. Respondes SOLO en formato JSON válido.",
      messages: [
        {
          role: 'user',
          content: validationPrompt
        }
      ]
    })

    // Extraer y parsear la respuesta JSON
    let validation = {}
    if (response.content[0].type === 'text') {
      try {
        // Limpiar el texto por si tiene markdown o texto extra
        const jsonText = response.content[0].text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim()
        validation = JSON.parse(jsonText)
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError)
        // Respuesta por defecto si falla el parsing
        validation = {
          score: 50,
          titleFeedback: "No se pudo analizar el título completamente. Asegúrate de que sea descriptivo y atractivo.",
          descriptionFeedback: "No se pudo analizar la descripción completamente. Incluye detalles sobre la propiedad y el barrio.",
          imageFeedback: `Tienes ${images?.length || 0} imágenes. Se recomiendan entre 8-10 fotos de buena calidad.`,
          improvements: [
            "Completar todos los campos de información", 
            "Agregar más imágenes de diferentes ambientes", 
            "Mejorar la descripción con más detalles"
          ],
          strengths: ["Información básica presente", "Estructura clara"],
          quickFixes: ["Revisar ortografía y gramática", "Agregar palabras clave relevantes"]
        }
      }
    }

    return NextResponse.json({
      ...validation,
      remaining,
      message: `Validación completada. Te quedan ${remaining} validaciones esta hora.`
    })
  } catch (error) {
    console.error('Error validating listing:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Error de configuración. Por favor, verifica la API key.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error al validar la publicación. Por favor, intenta nuevamente.' },
      { status: 500 }
    )
  }
}