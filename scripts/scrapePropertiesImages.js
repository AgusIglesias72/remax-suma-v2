#!/usr/bin/env node

/**
 * RE/MAX SUMA - Scraper v6.0 (Selectores Específicos)
 * ===================================================
 * 
 * Versión con selectores específicos de RE/MAX y manejo mejorado de errores
 * 
 * Instalación: npm install puppeteer
 * Uso: node scraper-remax.mjs
 */

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

// ==========================================
// LISTA DE MLS IDs
// ==========================================

const MLS_IDS = [

  '371336-168', '371159-272', '371194-149', '371194-150', '371269-252',
  '371296-59', '371473-22', '371340-39', '371449-12', '371298-70',
  '371190-234', '371561-3', '371364-20', '371280-77', '371318-48',
  '371357-164', '371357-166', '371411-115', '371420-105', '371249-120',
  '371195-251', '371412-178', '371558-2', '371334-262', '371517-16',
  '371366-26', '371519-2', '371412-179', '371524-104', '371159-274',
  '371298-72', '371265-160', '371377-136', '371462-19', '371269-276',
  '371550-8', '371419-282', '371160-192', '371264-189', '371496-9',
  '371269-272', '371357-174', '371472-114', '371519-3', '371187-301',
  '371340-42', '371351-117', '371557-17', '371541-2', '371169-172',
  '371351-118', '371587-353', '371587-358', '371587-363', '371587-369',
  '371587-371', '371587-374', '371449-15', '371425-47', '371555-3',
  '371278-234', '371159-278', '371362-74', '371547-59', '371361-78',
  '371327-117', '371590-266', '371590-281', '371315-118', '371420-107',
  '371327-118', '371413-158', '371424-44', '371194-151', '371469-11',
  '371543-12', '371327-121'
];

// ==========================================
// CONFIGURACIÓN
// ==========================================

const CONFIG = {
  outputFile: 'propiedades_con_imagenes.json',
  maxConcurrent: 1,
  timeout: 45000, // 45 segundos
  retryAttempts: 2,
  headless: true,
  delayBetweenRequests: 3000, // 3 segundos
  delayBetweenRetries: 8000, // 8 segundos entre reintentos
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// ==========================================
// SELECTORES ESPECÍFICOS DE RE/MAX
// ==========================================

const REMAX_SELECTORS = {
  // Selectores basados en tu estructura específica
  mainSlider: 'app-listing-detail qr-photos-detail app-slider',
  sliderImages: 'app-listing-detail qr-photos-detail app-slider picture img',
  
  // Selectores alternativos más específicos
  specificImages: [
    'body app-root public-layout mat-sidenav-container mat-sidenav-content app-listing-detail qr-photos-detail app-slider div div div picture img',
    'app-listing-detail section qr-photos-detail app-slider picture img',
    'qr-photos-detail app-slider div div div picture img',
    'app-slider div div div picture img'
  ],
  
  // Fallbacks
  fallbacks: [
    'qr-photos-detail img',
    'app-slider img',
    'app-listing-detail img',
    'picture img',
    'img[src*="cloudfront"]',
    'img[src*="amazonaws"]'
  ]
};

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function logWithTimestamp(emoji, message, color = '') {
  const timestamp = new Date().toLocaleTimeString();
  const colorCodes = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
  };
  
  const colorCode = colorCodes[color] || '';
  const resetCode = color ? colorCodes.reset : '';
  
  console.log(`[${timestamp}] ${emoji} ${colorCode}${message}${resetCode}`);
}

function formatElapsedTime(startTime) {
  const elapsed = Date.now() - startTime;
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// ==========================================
// CLASE PRINCIPAL
// ==========================================

class RemaxSpecificScraper {
  constructor() {
    this.browser = null;
    this.results = new Map();
    this.errors = [];
    this.processed = 0;
    this.total = MLS_IDS.length;
    this.startTime = Date.now();
    this.stats = {
      totalImages: 0,
      successfulPages: 0,
      redirects: 0,
      selectorStats: {}
    };
  }

  async init() {
    logWithTimestamp('🚀', 'Iniciando navegador Puppeteer...', 'blue');
    
    try {
      this.browser = await puppeteer.launch({
        headless: CONFIG.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--no-first-run',
          '--disable-default-apps',
          '--disable-extensions'
        ],
        defaultViewport: { width: 1366, height: 768 },
        timeout: 60000
      });
      
      logWithTimestamp('✅', 'Navegador iniciado correctamente', 'green');
      return true;
    } catch (error) {
      logWithTimestamp('❌', `Error iniciando navegador: ${error.message}`, 'red');
      throw error;
    }
  }

  async createPage() {
    try {
      const page = await this.browser.newPage();
      
      await page.setUserAgent(CONFIG.userAgent);
      await page.setViewport({ width: 1366, height: 768 });
      
      // Configurar timeouts
      page.setDefaultTimeout(CONFIG.timeout);
      page.setDefaultNavigationTimeout(CONFIG.timeout);
      
      // Manejar errores de página de manera más silenciosa
      page.on('error', () => {
        // Error ya manejado, no hacer nada
      });
      
      page.on('pageerror', () => {
        // Error ya manejado, no hacer nada
      });
      
      // Interceptar requests
      await page.setRequestInterception(true);
      
      page.on('request', (request) => {
        const resourceType = request.resourceType();
        
        // Permitir solo recursos esenciales
        if (resourceType === 'document' || 
            resourceType === 'script' ||
            resourceType === 'image' ||
            resourceType === 'xhr' ||
            resourceType === 'fetch') {
          request.continue();
        } else {
          request.abort();
        }
      });
      
      return page;
    } catch (error) {
      logWithTimestamp('❌', `Error creando página: ${error.message}`, 'red');
      throw error;
    }
  }

  async extractImagesSpecific(page, mslId) {
    try {
      logWithTimestamp('🔍', `Extrayendo imágenes para MLS: ${mslId}`, 'blue');
      
      // Esperar a que Angular/la página cargue
      try {
        await page.waitForSelector('body', { timeout: 15000 });
        logWithTimestamp('📄', 'Página cargada', 'green');
      } catch (error) {
        logWithTimestamp('⚠️', 'Timeout esperando body, continuando...', 'yellow');
      }
      
      // Esperar elementos específicos de RE/MAX
      try {
        await page.waitForSelector('app-root', { timeout: 10000 });
        logWithTimestamp('🎯', 'App Angular detectada', 'green');
      } catch (error) {
        logWithTimestamp('⚠️', 'No se detectó app Angular, continuando...', 'yellow');
      }
      
      // Esperar un tiempo fijo para que cargue el contenido dinámico
      await delay(5000);
      logWithTimestamp('⏳', 'Esperando contenido dinámico...', 'yellow');
      
      let images = [];
      let usedSelector = null;
      
      // 1. Intentar con el selector principal específico
      logWithTimestamp('🎯', 'Probando selector principal específico...', 'blue');
      try {
        const specificImages = await page.$$eval(REMAX_SELECTORS.sliderImages, imgs => 
          imgs.map(img => ({
            src: img.src || img.getAttribute('src'),
            alt: img.alt || '',
            width: img.naturalWidth || img.width || 0,
            height: img.naturalHeight || img.height || 0
          }))
          .filter(img => img.src && img.src.startsWith('http'))
        );
        
        if (specificImages.length > 0) {
          images = specificImages;
          usedSelector = REMAX_SELECTORS.sliderImages;
          logWithTimestamp('✅', `${specificImages.length} imágenes con selector principal`, 'green');
        }
      } catch (error) {
        logWithTimestamp('⚠️', 'Selector principal falló, probando alternativas...', 'yellow');
      }
      
      // 2. Intentar con selectores específicos alternativos
      if (images.length === 0) {
        for (const selector of REMAX_SELECTORS.specificImages) {
          try {
            logWithTimestamp('🔄', `Probando: ${selector}`, 'blue');
            const foundImages = await page.$$eval(selector, imgs => 
              imgs.map(img => ({
                src: img.src || img.getAttribute('src'),
                alt: img.alt || '',
                width: img.naturalWidth || img.width || 0,
                height: img.naturalHeight || img.height || 0
              }))
              .filter(img => img.src && img.src.startsWith('http'))
            );
            
            if (foundImages.length > 0) {
              images = foundImages;
              usedSelector = selector;
              logWithTimestamp('✅', `${foundImages.length} imágenes con selector: ${selector}`, 'green');
              break;
            }
          } catch (error) {
            // Continuar con el siguiente selector
            continue;
          }
        }
      }
      
      // 3. Fallbacks más generales
      if (images.length === 0) {
        logWithTimestamp('🔄', 'Probando selectores fallback...', 'yellow');
        for (const selector of REMAX_SELECTORS.fallbacks) {
          try {
            const foundImages = await page.$$eval(selector, imgs => 
              imgs.map(img => ({
                src: img.src || img.getAttribute('src'),
                alt: img.alt || '',
                width: img.naturalWidth || img.width || 0,
                height: img.naturalHeight || img.height || 0
              }))
              .filter(img => 
                img.src && 
                img.src.startsWith('http') &&
                img.width > 200 && 
                img.height > 150 &&
                !img.src.toLowerCase().includes('logo') &&
                !img.src.toLowerCase().includes('avatar')
              )
            );
            
            if (foundImages.length > 0) {
              images = foundImages;
              usedSelector = selector;
              logWithTimestamp('✅', `${foundImages.length} imágenes con fallback: ${selector}`, 'green');
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }
      
      // 4. Último recurso: todas las imágenes
      if (images.length === 0) {
        logWithTimestamp('🔄', 'Último recurso: todas las imágenes...', 'yellow');
        try {
          images = await page.$$eval('img', imgs => 
            imgs.map(img => ({
              src: img.src || img.getAttribute('src'),
              alt: img.alt || '',
              width: img.naturalWidth || img.width || 0,
              height: img.naturalHeight || img.height || 0
            }))
            .filter(img => {
              if (!img.src || !img.src.startsWith('http')) return false;
              
              const srcLower = img.src.toLowerCase();
              if (srcLower.includes('logo') || 
                  srcLower.includes('avatar') || 
                  srcLower.includes('icon')) return false;
              
              return img.width > 300 && img.height > 200;
            })
            .sort((a, b) => (b.width * b.height) - (a.width * a.height))
          );
          
          usedSelector = 'img (último recurso)';
          logWithTimestamp('📸', `${images.length} imágenes con último recurso`, 'yellow');
        } catch (error) {
          logWithTimestamp('❌', `Error en último recurso: ${error.message}`, 'red');
        }
      }
      
      // Procesar y limpiar imágenes
      const uniqueImages = images
        .filter((img, index, self) => 
          index === self.findIndex(i => i.src === img.src)
        )
        .slice(0, 10)
        .map((img, index) => ({
          url: img.src,
          alt: img.alt || `Imagen ${index + 1} - MLS ${mslId}`,
          order: index + 1,
          width: img.width,
          height: img.height
        }));
      
      logWithTimestamp('📊', `Resultado final: ${uniqueImages.length} imágenes únicas`, 'green');
      
      // Actualizar estadísticas de selectores
      if (usedSelector) {
        this.stats.selectorStats[usedSelector] = (this.stats.selectorStats[usedSelector] || 0) + 1;
      }
      
      return {
        images: uniqueImages,
        selector: usedSelector,
        totalFound: images.length
      };
      
    } catch (error) {
      logWithTimestamp('❌', `Error extrayendo imágenes: ${error.message}`, 'red');
      return { images: [], selector: null, totalFound: 0 };
    }
  }

  async processProperty(mslId, attempt = 1) {
    const url = `https://remax.com.ar/${mslId}`;
    
    logWithTimestamp('🏠', `[${this.processed + 1}/${this.total}] MLS: ${mslId}`, 'blue');
    logWithTimestamp('🔗', url, 'blue');
    
    if (attempt > 1) {
      logWithTimestamp('🔄', `Intento ${attempt}/${CONFIG.retryAttempts + 1}`, 'yellow');
    }

    let page = null;
    try {
      page = await this.createPage();
      
      logWithTimestamp('🌐', 'Navegando...', 'blue');
      const response = await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: CONFIG.timeout 
      });

      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const status = response.status();
      const finalUrl = response.url();
      
      logWithTimestamp('📊', `HTTP ${status} | URL final: ${finalUrl}`, 'blue');

      if (status === 301 || status === 302) {
        this.stats.redirects++;
        logWithTimestamp('🔄', `Redirección ${status} detectada`, 'yellow');
      }

      if (status < 200 || status >= 400) {
        throw new Error(`HTTP ${status}`);
      }

      const extractResult = await this.extractImagesSpecific(page, mslId);
      
      const result = {
        mslId,
        originalUrl: url,
        finalUrl,
        httpStatus: status,
        images: extractResult.images,
        totalImages: extractResult.images.length,
        totalFound: extractResult.totalFound,
        selector: extractResult.selector,
        scrapedAt: new Date().toISOString(),
        status: 'success',
        attempts: attempt
      };

      this.results.set(mslId, result);
      this.stats.totalImages += extractResult.images.length;
      this.stats.successfulPages++;
      this.processed++;
      
      logWithTimestamp('✅', `Completado (${extractResult.images.length} imágenes)`, 'green');

    } catch (error) {
      logWithTimestamp('❌', `Error: ${error.message}`, 'red');
      
      if (attempt <= CONFIG.retryAttempts) {
        if (page) {
          try {
            await page.close();
          } catch (closeError) {
            // Ignorar errores al cerrar
          }
        }
        logWithTimestamp('⏳', `Esperando ${CONFIG.delayBetweenRetries}ms antes del reintento...`, 'yellow');
        await delay(CONFIG.delayBetweenRetries);
        return this.processProperty(mslId, attempt + 1);
      }

      const errorInfo = {
        mslId,
        url,
        error: error.message,
        attempts: attempt,
        timestamp: new Date().toISOString()
      };
      
      this.errors.push(errorInfo);

      this.results.set(mslId, {
        mslId,
        originalUrl: url,
        finalUrl: null,
        httpStatus: null,
        images: [],
        totalImages: 0,
        scrapedAt: new Date().toISOString(),
        status: 'error',
        error: error.message,
        attempts: attempt
      });

      this.processed++;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (closeError) {
          // Ignorar errores al cerrar página
        }
      }
    }
  }

  async processAllProperties() {
    logWithTimestamp('🎯', `Procesando ${this.total} propiedades...`, 'blue');
    logWithTimestamp('⚙️', `Configuración: procesamiento secuencial, ${CONFIG.delayBetweenRequests}ms delay`, 'blue');
    
    const startTime = Date.now();
    
    for (let i = 0; i < MLS_IDS.length; i++) {
      const mslId = MLS_IDS[i];
      
      await this.processProperty(mslId);
      
      // Pausa entre propiedades (excepto la última)
      if (i < MLS_IDS.length - 1) {
        logWithTimestamp('⏳', `Pausa de ${CONFIG.delayBetweenRequests}ms...`, 'yellow');
        await delay(CONFIG.delayBetweenRequests);
      }
      
      // Mostrar progreso cada 10 propiedades
      if ((i + 1) % 10 === 0 || i === MLS_IDS.length - 1) {
        const progress = (((i + 1) / this.total) * 100).toFixed(1);
        const elapsed = formatElapsedTime(startTime);
        const rate = (i + 1) > 0 ? ((i + 1) / ((Date.now() - startTime) / 1000)).toFixed(2) : 0;
        const successful = this.stats.successfulPages;
        const errors = this.errors.length;
        
        logWithTimestamp('📊', `Progreso: ${i + 1}/${this.total} (${progress}%) | ✅ ${successful} | ❌ ${errors} | ⏱️ ${elapsed} | 🚀 ${rate}/s`, 'blue');
      }
    }
  }

  async saveResults() {
    logWithTimestamp('💾', 'Guardando resultados...', 'blue');
    
    const successful = this.stats.successfulPages;
    const elapsedTime = formatElapsedTime(this.startTime);
    
    const resultsObject = Object.fromEntries(this.results);
    
    const output = {
      metadata: {
        scraper: 'RE/MAX SUMA Specific Scraper v6.0',
        scrapedAt: new Date().toISOString(),
        elapsedTime,
        totalProperties: this.total,
        successfullyProcessed: successful,
        errors: this.errors.length,
        successRate: `${((successful / this.total) * 100).toFixed(1)}%`,
        totalImages: this.stats.totalImages,
        averageImagesPerProperty: successful > 0 ? (this.stats.totalImages / successful).toFixed(2) : 0,
        source: 'Lista directa de MLS IDs',
        configuration: CONFIG,
        selectorStats: this.stats.selectorStats,
        remaxSelectors: REMAX_SELECTORS
      },
      properties: resultsObject,
      errors: this.errors.length > 0 ? this.errors : undefined,
      mslIdsList: MLS_IDS
    };

    writeFileSync(CONFIG.outputFile, JSON.stringify(output, null, 2), 'utf8');
    logWithTimestamp('✅', `Datos completos: ${CONFIG.outputFile}`, 'green');
    
    const summary = {
      timestamp: new Date().toISOString(),
      total: this.total,
      successful,
      errors: this.errors.length,
      successRate: output.metadata.successRate,
      totalImages: this.stats.totalImages,
      averageImagesPerProperty: output.metadata.averageImagesPerProperty,
      elapsedTime,
      selectorStats: this.stats.selectorStats,
      topErrors: this.errors.slice(0, 5).map(e => ({ 
        mslId: e.mslId, 
        error: e.error.substring(0, 100)
      }))
    };
    
    writeFileSync('scraping_summary.json', JSON.stringify(summary, null, 2), 'utf8');
    logWithTimestamp('✅', 'Resumen ejecutivo: scraping_summary.json', 'green');
    
    return summary;
  }

  async run() {
    try {
      logWithTimestamp('🏢', 'RE/MAX SUMA - Scraper Específico v6.0', 'blue');
      logWithTimestamp('📅', `Iniciado: ${new Date().toLocaleString()}`, 'blue');
      logWithTimestamp('📋', `MLS IDs a procesar: ${MLS_IDS.length}`, 'blue');

      await this.init();
      await this.processAllProperties();
      const summary = await this.saveResults();

      logWithTimestamp('🎉', '¡Scraping completado exitosamente!', 'green');
      logWithTimestamp('✅', `Procesadas: ${summary.successful}/${summary.total}`, 'green');
      logWithTimestamp('📸', `Imágenes totales: ${summary.totalImages}`, 'green');
      logWithTimestamp('📊', `Promedio por propiedad: ${summary.averageImagesPerProperty}`, 'green');
      logWithTimestamp('⏱️', `Tiempo total: ${summary.elapsedTime}`, 'green');
      logWithTimestamp('📈', `Tasa de éxito: ${summary.successRate}`, 'green');
      
      // Mostrar estadísticas de selectores
      if (Object.keys(this.stats.selectorStats).length > 0) {
        logWithTimestamp('📊', 'Estadísticas de selectores:', 'blue');
        Object.entries(this.stats.selectorStats).forEach(([selector, count]) => {
          logWithTimestamp('  ', `${selector}: ${count} veces`, 'blue');
        });
      }
      
      if (this.errors.length > 0) {
        logWithTimestamp('❌', `Errores: ${this.errors.length}`, 'red');
        logWithTimestamp('🔍', 'Ver detalles en: scraping_summary.json', 'yellow');
      }

    } catch (error) {
      logWithTimestamp('💥', `Error fatal: ${error.message}`, 'red');
      process.exit(1);
    } finally {
      if (this.browser) {
        try {
          await this.browser.close();
          logWithTimestamp('🔒', 'Navegador cerrado correctamente', 'green');
        } catch (closeError) {
          logWithTimestamp('⚠️', `Error cerrando navegador: ${closeError.message}`, 'yellow');
        }
      }
    }
  }
}

// ==========================================
// EJECUCIÓN
// ==========================================

async function main() {
  try {
    await import('puppeteer');
    logWithTimestamp('✅', 'Puppeteer disponible', 'green');
  } catch (error) {
    logWithTimestamp('❌', 'Puppeteer no está instalado', 'red');
    logWithTimestamp('💡', 'Ejecuta: npm install puppeteer', 'yellow');
    process.exit(1);
  }
  
  process.on('unhandledRejection', (reason, promise) => {
    logWithTimestamp('❌', `Error no manejado: ${reason}`, 'red');
    process.exit(1);
  });

  process.on('SIGINT', () => {
    logWithTimestamp('🛑', 'Proceso interrumpido por el usuario', 'yellow');
    process.exit(0);
  });
  
  const scraper = new RemaxSpecificScraper();
  await scraper.run();
}

  main().catch(console.error);
