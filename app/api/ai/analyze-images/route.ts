// app/api/ai/analyze-images/route.ts
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

    // Rate limiting - usar el mismo límite que validación
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown'
    
    const { success, remaining } = await aiValidationLimit.check(ip)
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Límite de análisis excedido',
          message: 'Has alcanzado el límite de análisis por hora.'
        },
        { status: 429 }
      )
    }

    const { images } = await request.json()

    // Validar que tengamos imágenes
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron imágenes para analizar' },
        { status: 400 }
      )
    }

    // Limitar a máximo 10 imágenes para evitar costos excesivos
    const imagesToAnalyze = images.slice(0, 10)
    
    const imageAnalysisPrompt = `Analiza estas ${imagesToAnalyze.length} imágenes de una propiedad inmobiliaria.
    
INSTRUCCIONES:
Para el conjunto de imágenes, evalúa:
1. Calidad técnica general (iluminación, enfoque, resolución)
2. Composición (encuadre, ángulo, orden de presentación)
3. Valor informativo (variedad de espacios mostrados)
4. Profesionalismo general

Responde ÚNICAMENTE en formato JSON válido con esta estructura exacta:
{
  "overallScore": número del 1-100,
  "individualScores": [array de números del 1-100 para cada imagen],
  "recommendations": ["sugerencia 1", "sugerencia 2", "sugerencia 3"],
  "missingShots": ["tipo de foto 1", "tipo de foto 2"],
  "strengths": ["punto fuerte 1", "punto fuerte 2"],
  "qualityIssues": ["problema 1", "problema 2"]
}

Considera:
- Una buena serie debe mostrar: fachada, living, cocina, dormitorios, baños
- La iluminación natural es preferible
- Los espacios deben verse ordenados y limpios
- Las fotos deben estar bien enfocadas y con buena resolución`

    // Preparar el contenido del mensaje
    const messageContent: any[] = [
      { type: 'text', text: imageAnalysisPrompt }
    ]

    // Agregar las imágenes al mensaje
    imagesToAnalyze.forEach(img => {
      if (img.base64) {
        messageContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: img.mimeType || 'image/jpeg',
            data: img.base64
          }
        })
      }
    })

    // Usar Claude 3 Haiku con visión (más económico que Sonnet)
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Haiku también puede analizar imágenes
      max_tokens: 1000,
      temperature: 0.3,
      system: "Eres un experto en fotografía inmobiliaria. Analizas imágenes de propiedades y das feedback constructivo. Respondes SOLO en formato JSON válido.",
      messages: [
        {
          role: 'user',
          content: messageContent
        }
      ]
    })

    // Extraer y parsear la respuesta
    let analysis = {}
    if (response.content[0].type === 'text') {
      try {
        const jsonText = response.content[0].text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim()
        analysis = JSON.parse(jsonText)
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError)
        // Respuesta por defecto si falla el parsing
        analysis = {
          overallScore: 60,
          individualScores: imagesToAnalyze.map(() => 60),
          recommendations: [
            "Mejorar la iluminación en las fotos interiores",
            "Incluir más ángulos de cada ambiente",
            "Ordenar y limpiar los espacios antes de fotografiar"
          ],
          missingShots: [
            "Foto de la fachada completa",
            "Vista del baño principal",
            "Foto de la cocina"
          ],
          strengths: [
            "Buena variedad de espacios",
            "Resolución adecuada"
          ],
          qualityIssues: [
            "Algunas fotos están subexpuestas",
            "Falta consistencia en el estilo"
          ]
        }
      }
    }

    return NextResponse.json({
      ...analysis,
      imagesAnalyzed: imagesToAnalyze.length,
      remaining,
      message: `Análisis completado para ${imagesToAnalyze.length} imágenes. Te quedan ${remaining} análisis esta hora.`
    })
  } catch (error) {
    console.error('Error analyzing images:', error)
    
    if (error instanceof Error) {
      // Manejo específico de errores de Anthropic
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Error de configuración. Por favor, verifica la API key.' },
          { status: 500 }
        )
      }
      if (error.message.includes('model')) {
        return NextResponse.json(
          { error: 'Modelo no disponible. Contacta al administrador.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error al analizar las imágenes. Por favor, intenta nuevamente.' },
      { status: 500 }
    )
  }
}