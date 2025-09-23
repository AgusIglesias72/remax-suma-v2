// lib/rate-limit.ts
interface RateLimitEntry {
    count: number
    resetTime: number
  }
  
  class SimpleRateLimit {
    private limits: Map<string, RateLimitEntry> = new Map()
    
    constructor(
      private maxRequests: number = 5,
      private windowMs: number = 60 * 60 * 1000 // 1 hora por defecto
    ) {}
  
    async check(identifier: string): Promise<{ success: boolean; remaining: number }> {
      const now = Date.now()
      const entry = this.limits.get(identifier)
  
      // Si no existe entrada o ya expiró, crear una nueva
      if (!entry || now > entry.resetTime) {
        this.limits.set(identifier, {
          count: 1,
          resetTime: now + this.windowMs
        })
        return { success: true, remaining: this.maxRequests - 1 }
      }
  
      // Si todavía estamos en la ventana de tiempo
      if (entry.count < this.maxRequests) {
        entry.count++
        this.limits.set(identifier, entry)
        return { success: true, remaining: this.maxRequests - entry.count }
      }
  
      // Límite excedido
      return { success: false, remaining: 0 }
    }
  
    // Limpiar entradas expiradas (llamar periódicamente)
    cleanup(): void {
      const now = Date.now()
      for (const [key, entry] of this.limits.entries()) {
        if (now > entry.resetTime) {
          this.limits.delete(key)
        }
      }
    }
  }
  
  // Exportar instancias para diferentes tipos de límites
  export const aiGenerationLimit = new SimpleRateLimit(5, 60 * 60 * 1000) // 5 por hora
  export const aiValidationLimit = new SimpleRateLimit(10, 60 * 60 * 1000) // 10 por hora
  
  // Opcional: Limpiar cada 10 minutos
  if (typeof window === 'undefined') {
    setInterval(() => {
      aiGenerationLimit.cleanup()
      aiValidationLimit.cleanup()
    }, 10 * 60 * 1000)
  }