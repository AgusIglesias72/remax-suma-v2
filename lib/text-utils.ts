// lib/text-utils.ts
/**
 * Normaliza texto para comparaciones insensibles a mayúsculas y acentos
 * Útil para comparar localidades como "Vicente López" vs "vicente lopez"
 */
export function normalizeText(text: string): string {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .toLowerCase()                           // Convertir a minúsculas
      .normalize('NFD')                        // Descomponer caracteres Unicode
      .replace(/[\u0300-\u036f]/g, '')        // Eliminar diacríticos (acentos, tildes, etc.)
      .replace(/\s+/g, ' ')                   // Normalizar espacios múltiples a uno solo
      .trim();                                // Eliminar espacios al inicio y final
  }
  
  /**
   * Compara dos textos de forma normalizada
   * @param text1 - Primer texto a comparar
   * @param text2 - Segundo texto a comparar
   * @returns true si los textos son equivalentes después de normalizar
   */
  export function compareNormalized(text1: string, text2: string): boolean {
    return normalizeText(text1) === normalizeText(text2);
  }
  
  /**
   * Busca un texto en una lista de opciones de forma normalizada
   * @param searchText - Texto a buscar
   * @param options - Lista de opciones donde buscar
   * @returns La opción que coincide o null si no se encuentra
   */
  export function findNormalizedMatch(searchText: string, options: string[]): string | null {
    const normalizedSearch = normalizeText(searchText);
    
    return options.find(option => 
      normalizeText(option) === normalizedSearch
    ) || null;
  }
  
  /**
   * Función mejorada para seleccionar opciones en dropdowns de Playwright
   * Incluye normalización de texto para manejar acentos y mayúsculas
   */
  export async function selectDropdownOptionRobust(
    page: any, 
    targetText: string, 
    dropdownType: string
  ): Promise<boolean> {
    console.log(`🔍 Buscando "${targetText}" en dropdown de ${dropdownType}...`);
  
    try {
      await page.waitForTimeout(1000);
  
      // Normalizar el texto objetivo
      const normalizedTarget = normalizeText(targetText);
      console.log(`🎯 Texto normalizado objetivo: "${normalizedTarget}"`);
  
      // Método 1: CSS selector
      try {
        const options = await page.$$("mat-option");
        console.log(`📝 Encontradas ${options.length} opciones`);
  
        for (let i = 0; i < options.length; i++) {
          try {
            const optionText = await options[i].textContent();
            const cleanText = optionText?.trim() || "";
            const normalizedOption = normalizeText(cleanText);
            
            console.log(`   ${i + 1}. "${cleanText}" → normalizado: "${normalizedOption}"`);
  
            // Comparación normalizada (sin acentos ni mayúsculas)
            if (normalizedOption === normalizedTarget) {
              console.log(`✅ ¡Encontrado! Seleccionando: "${cleanText}"`);
              await options[i].click();
              await page.waitForTimeout(500);
              return true;
            }
          } catch (e) {
            continue;
          }
        }
      } catch (e) {
        console.log("❌ Método CSS falló");
      }
  
      // Método 2: Búsqueda por coincidencia parcial (fallback)
      try {
        const options = await page.$$("mat-option");
        
        for (let i = 0; i < options.length; i++) {
          try {
            const optionText = await options[i].textContent();
            const cleanText = optionText?.trim() || "";
            const normalizedOption = normalizeText(cleanText);
            
            // Verificar si el texto objetivo está contenido en la opción
            if (normalizedOption.includes(normalizedTarget) || normalizedTarget.includes(normalizedOption)) {
              console.log(`✅ ¡Coincidencia parcial! Seleccionando: "${cleanText}"`);
              await options[i].click();
              await page.waitForTimeout(500);
              return true;
            }
          } catch (e) {
            continue;
          }
        }
      } catch (e) {
        console.log("❌ Método de coincidencia parcial falló");
      }
  
      console.log(`❌ No se encontró "${targetText}" (normalizado: "${normalizedTarget}") en dropdown de ${dropdownType}`);
      return false;
    } catch (error) {
      console.error(`💥 Error en selectDropdownOptionRobust:`, error);
      return false;
    }
  }
  
  // Ejemplos de uso:
  // normalizeText("Vicente López") → "vicente lopez"
  // normalizeText("CABA") → "caba"
  // normalizeText("San Martín") → "san martin"
  // compareNormalized("Vicente López", "vicente lopez") → true
  // findNormalizedMatch("Vicente López", ["vicente lopez", "CABA", "San Martin"]) → "vicente lopez"