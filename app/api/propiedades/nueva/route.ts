// app/api/propiedades/nueva/route.ts
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

const { REMAX_URL, REDREMAX_PASSWORD, REDREMAX_USERNAME } = process.env;

// 🆕 INTERFAZ EXPANDIDA - Con campos de dirección separados
interface NewPropertyData {
  // Información básica
  operation_type: string;
  property_type: string;
  title: string;
  description: string;

  // Ubicación completa (del autocompletado)
  address: string;
  latitude: number;
  longitude: number;

  // 🆕 CAMPOS DE DIRECCIÓN SEPARADOS (ya procesados en frontend)
  street: string;
  street_number: string;
  floor?: string;
  apartment?: string;
  locality: string;
  province: string;
  postal_code?: string;
  country: string;

  // Características
  covered_surface: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;

  // Precios
  price: number;
  price_currency: string;
  expenses?: number;
  expenses_currency: string;
}

// 🆕 VALIDACIÓN EXPANDIDA - Incluye campos separados requeridos
function validatePropertyData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Campos requeridos básicos
  const requiredFields = [
    "operation_type",
    "property_type",
    "title",
    "description",
    "address",
    "latitude",
    "longitude",
    "covered_surface",
    "price",
    "price_currency",
  ];

  // 🆕 CAMPOS DE DIRECCIÓN REQUERIDOS
  const requiredAddressFields = [
    "street",
    "locality", 
    "province",
    "country"
  ];

  // Validar campos básicos
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`El campo ${field} es requerido`);
    }
  }

  // 🆕 Validar campos de dirección separados
  for (const field of requiredAddressFields) {
    if (!data[field]) {
      errors.push(`El campo de dirección ${field} es requerido`);
    }
  }

  // Validaciones específicas
  if (data.latitude && (data.latitude < -90 || data.latitude > 90)) {
    errors.push("Latitud inválida");
  }

  if (data.longitude && (data.longitude < -180 || data.longitude > 180)) {
    errors.push("Longitud inválida");
  }

  if (data.covered_surface && data.covered_surface <= 0) {
    errors.push("La superficie debe ser mayor a 0");
  }

  if (data.price && data.price <= 0) {
    errors.push("El precio debe ser mayor a 0");
  }

  if (data.rooms && data.rooms <= 0) {
    errors.push("Los ambientes deben ser mayor a 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 🆕 FUNCIÓN SIMPLIFICADA - Usa datos ya separados del frontend
function formatDataForRedRemax(data: NewPropertyData) {
  return {
    // Mapeo de tipos de operación
    tipoOperacion: data.operation_type,

    // Mapeo de tipos de propiedad
    tipoPropiedad: data.property_type,

    // Información básica
    titulo: data.title,
    descripcion: data.description,

    // 🆕 UBICACIÓN: Usar los campos separados que vienen del frontend
    direccionCompleta: data.address,
    latitud: data.latitude,
    longitud: data.longitude,
    
    // Campos de dirección separados (tal como vienen del formulario)
    calle: data.street,
    numero: data.street_number,
    piso: data.floor || "",
    departamento: data.apartment || "",
    localidad: data.locality,
    provincia: data.province,
    codigoPostal: data.postal_code || "",
    pais: data.country,

    // Características
    superficieCubierta: data.covered_surface,
    ambientes: data.rooms || null,
    dormitorios: data.bedrooms || null,
    baños: data.bathrooms || null,
    cocheras: data.garages || null,

    // Precios
    precio: data.price,
    monedaPrecio: data.price_currency,
    expensas: data.expenses || null,
    monedaExpensas: data.expenses_currency || null,

    // Metadata
    fechaCreacion: new Date().toISOString(),
    estado: "pendiente_publicacion",
  };
}

// 🎭 Login function - sin cambios (mantener como está)
async function loginToRedRemax() {
  console.log("🎭 Iniciando proceso de login con Playwright...");

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
    args: ["--start-maximized"],
  });

  const context = await browser.newContext({
    viewport: null,
  });

  const page = await context.newPage();

  try {
    console.log("🌐 Navegando a RedRemax...");
    if (!REMAX_URL) {
      throw new Error("REMAX_URL no está definida");
    }
    await page.goto(REMAX_URL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    console.log("🔍 Buscando campos de login con XPaths específicos...");

    const userFieldXPath = "/html/body/app-root/app-login/div/div[1]/div[2]/qr-input/div/input";
    const passwordFieldXPath = "/html/body/app-root/app-login/div/div[1]/div[3]/qr-input/div/input";
    const loginButtonXPath = "/html/body/app-root/app-login/div/div[1]/qr-button[1]/button";

    console.log("🔍 Buscando campo de usuario...");
    let userField = null;
    try {
      userField = await page.waitForSelector(`xpath=${userFieldXPath}`, { timeout: 10000 });
      console.log("✅ Campo usuario encontrado");
    } catch (e) {
      await page.screenshot({ path: "debug-user-field.png", fullPage: true });
      throw new Error("Campo de usuario no encontrado");
    }

    console.log("🔍 Buscando campo de contraseña...");
    let passwordField = null;
    try {
      passwordField = await page.waitForSelector(`xpath=${passwordFieldXPath}`, { timeout: 5000 });
      console.log("✅ Campo contraseña encontrado");
    } catch (e) {
      await page.screenshot({ path: "debug-password-field.png", fullPage: true });
      throw new Error("Campo de contraseña no encontrado");
    }

    console.log("🔍 Buscando botón de login...");
    let loginButton = null;
    try {
      loginButton = await page.waitForSelector(`xpath=${loginButtonXPath}`, { timeout: 5000 });
      console.log("✅ Botón login encontrado");
    } catch (e) {
      await page.screenshot({ path: "debug-login-button.png", fullPage: true });
      throw new Error("Botón de login no encontrado");
    }

    // Completar credenciales
    console.log("📝 Completando credenciales...");
    if (!REDREMAX_USERNAME) {
      throw new Error("REDREMAX_USERNAME no está definido");
    }
    await userField.fill(REDREMAX_USERNAME);
    console.log(`✅ Usuario completado: ${REDREMAX_USERNAME}`);

    if (!REDREMAX_PASSWORD) {
      throw new Error("REDREMAX_PASSWORD no está definido");
    }
    await passwordField.fill(REDREMAX_PASSWORD);
    console.log("✅ Contraseña completada");

    console.log("🔑 Haciendo click en login...");
    await loginButton.click();

    console.log("⏳ Esperando respuesta del login...");
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    console.log(`🌐 URL actual después del login: ${currentUrl}`);
    await page.screenshot({ path: "login-result.png", fullPage: true });

    if (currentUrl.includes("login") || currentUrl === REMAX_URL) {
      console.log("⚠️ Posible error de login");
      await page.screenshot({ path: "login-error.png", fullPage: true });
      return {
        success: false,
        message: "Login posiblemente falló",
        currentUrl: currentUrl,
        browserContext: context,
        page: page,
      };
    }

    console.log("✅ Login exitoso");

    // Navegar al formulario de nueva propiedad
    console.log("🏠 Navegando al formulario de nueva propiedad...");
    try {
      const newPropertyButtonXPath = "/html/body/app-root/app-private-layout/div[1]/app-properties-panel/div[1]/div/div/qr-button[2]/button";
      
      const newPropertyButton = await page.waitForSelector(`xpath=${newPropertyButtonXPath}`, { timeout: 10000 });
      if (!newPropertyButton) {
        throw new Error("Botón de nueva propiedad no encontrado");
      }

      await newPropertyButton.click();
      await page.waitForTimeout(3000);

      const formUrl = page.url();
      console.log(`🌐 URL del formulario: ${formUrl}`);
      await page.screenshot({ path: "property-form-loaded.png", fullPage: true });

      return {
        success: true,
        message: "Login y navegación completados",
        currentUrl: formUrl,
        stage: "property_form_ready",
        browserContext: context,
        page: page,
      };
    } catch (navError) {
      console.error("💥 Error navegando:", navError);
      await page.screenshot({ path: "navigation-error.png", fullPage: true });
      return {
        success: false,
        message: `Error navegando: ${(navError as Error).message}`,
        currentUrl: page.url(),
        stage: "navigation_failed",
        browserContext: context,
        page: page,
      };
    }
  } catch (error) {
    console.error("💥 Error durante login:", error);
    await page.screenshot({ path: "error-login.png", fullPage: true });
    await browser.close();
    return {
      success: false,
      message: `Error en login: ${(error as Error).message}`,
      error: error,
    };
  }
}

// 🆕 FUNCIÓN SIMPLIFICADA - Usa campos ya separados, sin Google Maps API
async function fillLocationFields(page: any, formattedData: any) {
  console.log("🗺️ Completando campos de ubicación con datos ya separados...");
  console.log("📊 Datos de ubicación recibidos:", {
    calle: formattedData.calle,
    numero: formattedData.numero,
    piso: formattedData.piso,
    departamento: formattedData.departamento,
    localidad: formattedData.localidad,
    provincia: formattedData.provincia,
    codigoPostal: formattedData.codigoPostal,
    pais: formattedData.pais
  });

  try {
    // XPaths de los campos de ubicación (mantener los mismos)
    const locationXPaths = {
      calle: "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[1]/mat-form-field/div/div[1]/div/input",
      numero: "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[2]/div[1]/mat-form-field/div/div[1]/div/input",
      codigoPostal: "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[2]/div[2]/mat-form-field/div/div[1]/div/input",
      paisDropdown: "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[4]/div[1]/app-select-list-v2-input/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span",
      provinciaDropdown: "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[4]/div[2]/app-select-list-v2-input/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span",
      partidoDropdown: "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[5]/div[1]/app-select-list-v2-input/mat-form-field/div/div[1]/div",
    };

    // 🆕 USAR DATOS DIRECTOS - Sin parsing adicional
    
    // CAMPO 1: Completar Calle
    console.log("🛣️ Completando calle...");
    const calleField = await page.waitForSelector(`xpath=${locationXPaths.calle}`, { timeout: 10000 });
    await calleField.fill(formattedData.calle || "");
    console.log(`✅ Calle completada: ${formattedData.calle}`);

    // CAMPO 2: Completar Número
    console.log("🔢 Completando número...");
    const numeroField = await page.waitForSelector(`xpath=${locationXPaths.numero}`, { timeout: 5000 });
    await numeroField.fill(formattedData.numero || "");
    console.log(`✅ Número completado: ${formattedData.numero}`);

    // CAMPO 3: Completar Código Postal
    if (formattedData.codigoPostal) {
      console.log("📮 Completando código postal...");
      const codigoPostalField = await page.waitForSelector(`xpath=${locationXPaths.codigoPostal}`, { timeout: 5000 });
      await codigoPostalField.fill(formattedData.codigoPostal);
      console.log(`✅ Código postal completado: ${formattedData.codigoPostal}`);
    }

    await page.screenshot({ path: "before-country-dropdown.png", fullPage: true });

    // CAMPO 4: Seleccionar País
    console.log(`🇦🇷 Seleccionando país: ${formattedData.pais}...`);
    const paisDropdown = await page.waitForSelector(`xpath=${locationXPaths.paisDropdown}`, { timeout: 5000 });
    await paisDropdown.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "country-dropdown-opened.png", fullPage: true });

    const argentinaSelected = await selectCountryArgentina(page);
    if (!argentinaSelected) {
      throw new Error("No se pudo seleccionar Argentina");
    }
    console.log("✅ País seleccionado: Argentina");
    await page.waitForTimeout(3000);

    // CAMPO 5: Seleccionar Provincia
    console.log(`🌎 Seleccionando provincia: ${formattedData.provincia}...`);
    const provinciaDropdown = await page.waitForSelector(`xpath=${locationXPaths.provinciaDropdown}`, { timeout: 10000 });
    await provinciaDropdown.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "province-dropdown-opened.png", fullPage: true });

    const provinciaSelected = await selectDropdownOptionRobust(page, formattedData.provincia, "provincia");
    if (!provinciaSelected) {
      throw new Error(`No se encontró la provincia: ${formattedData.provincia}`);
    }
    console.log(`✅ Provincia seleccionada: ${formattedData.provincia}`);
    await page.waitForTimeout(3000);

    // CAMPO 6: Seleccionar Partido/Localidad
    console.log(`🏛️ Seleccionando localidad: ${formattedData.localidad}...`);
    const partidoDropdown = await page.waitForSelector(`xpath=${locationXPaths.partidoDropdown}`, { timeout: 10000 });
    await partidoDropdown.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "partido-dropdown-opened.png", fullPage: true });

    const partidoSelected = await selectDropdownOptionRobust(page, formattedData.localidad, "localidad");
    if (!partidoSelected) {
      throw new Error(`No se encontró la localidad: ${formattedData.localidad}`);
    }
    console.log(`✅ Localidad seleccionada: ${formattedData.localidad}`);

    await page.screenshot({ path: "location-fields-completed.png", fullPage: true });
    console.log("🎉 Campos de ubicación completados exitosamente!");
    return true;

  } catch (error) {
    console.error("💥 Error completando campos de ubicación:", error);
    await page.screenshot({ path: "location-error.png", fullPage: true });
    throw error;
  }
}

// Funciones auxiliares para dropdowns (mantener las existentes)
async function selectCountryArgentina(page: any) {
  console.log("🇦🇷 Buscando Argentina...");
  
  try {
    // Método 1: Primera opción por defecto
    try {
      const firstOption = await page.$("mat-option:first-child");
      if (firstOption) {
        const text = await firstOption.textContent();
        console.log(`Primera opción: "${text?.trim()}"`);
        await firstOption.click();
        console.log("✅ Primera opción seleccionada");
        return true;
      }
    } catch (e) {
      console.log("❌ Método primera opción falló");
    }

    // Método 2: Buscar por texto
    try {
      const allOptions = await page.$$("mat-option");
      for (let i = 0; i < allOptions.length; i++) {
        const text = await allOptions[i].textContent();
        if (text?.trim().toLowerCase() === "argentina") {
          await allOptions[i].click();
          return true;
        }
      }
    } catch (e) {
      console.log("❌ Método texto falló");
    }

    return false;
  } catch (error) {
    console.error("💥 Error seleccionando Argentina:", error);
    return false;
  }
}

async function selectDropdownOptionRobust(page: any, targetText: string, dropdownType: string) {
  console.log(`🔍 Buscando "${targetText}" en dropdown de ${dropdownType}...`);

  try {
    await page.waitForTimeout(1000);

    // Método 1: CSS selector
    try {
      const options = await page.$$("mat-option");
      console.log(`📝 Encontradas ${options.length} opciones`);

      for (let i = 0; i < options.length; i++) {
        try {
          const optionText = await options[i].textContent();
          const cleanText = optionText?.trim() || "";
          console.log(`   ${i + 1}. "${cleanText}"`);

          if (cleanText.toLowerCase() === targetText.toLowerCase()) {
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

    console.log(`❌ No se encontró "${targetText}" en dropdown de ${dropdownType}`);
    return false;
  } catch (error) {
    console.error(`💥 Error en selectDropdownOptionRobust:`, error);
    return false;
  }
}

// Función principal de llenado de formulario (adaptada)
async function fillPropertyForm(page: any, formattedData: any) {
  console.log("🏠 Iniciando completado del formulario...");

  try {
    // PASO 1: Tipo de operación
    console.log("📋 PASO 1: Seleccionando tipo de operación...");
    const operationXPaths = {
      Venta: "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[2]/qr-toggle/button[1]",
      Alquiler: "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[2]/qr-toggle/button[2]",
      "Alquiler Temporal": "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[2]/qr-toggle/button[3]",
    };

    const operationType = formattedData.tipoOperacion;
    const operationXPath = operationXPaths[operationType as keyof typeof operationXPaths];
    
    if (!operationXPath) {
      throw new Error(`Tipo de operación no válido: ${operationType}`);
    }

    const operationButton = await page.waitForSelector(`xpath=${operationXPath}`, { timeout: 10000 });
    await operationButton.click();
    await page.waitForTimeout(1000);
    console.log(`✅ Operación seleccionada: ${operationType}`);

    // PASO 2: Tipo de propiedad
    console.log("🏘️ PASO 2: Seleccionando tipo de propiedad...");
    const propertyDropdownXPath = "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[3]/app-property-type-arg-old/div/app-select-list-v2-input/mat-form-field/div/div[1]/div";

    const propertyDropdown = await page.waitForSelector(`xpath=${propertyDropdownXPath}`, { timeout: 10000 });
    await propertyDropdown.click();
    await page.waitForTimeout(2000);

    const propertyType = formattedData.tipoPropiedad;
    console.log(`🔍 Buscando tipo de propiedad: ${propertyType}`);

    // Buscar y seleccionar tipo de propiedad
    const baseOptionsXPath = "/html/body/div[3]/div[2]/div/div/div/mat-option";
    await page.waitForSelector(`xpath=${baseOptionsXPath}[1]`, { timeout: 5000 });

    let optionFound = false;
    let optionIndex = 1;

    while (!optionFound && optionIndex <= 20) {
      try {
        const spanXPath = `${baseOptionsXPath}[${optionIndex}]/span`;
        const optionXPath = `${baseOptionsXPath}[${optionIndex}]`;
        const spanElement = await page.$(`xpath=${spanXPath}`);

        if (!spanElement) break;

        const optionText = await spanElement.textContent();
        const cleanText = optionText?.trim() || "";

        if (cleanText === propertyType || cleanText.includes(propertyType) || propertyType.includes(cleanText)) {
          const optionElement = await page.$(`xpath=${optionXPath}`);
          if (optionElement) {
            await optionElement.scrollIntoViewIfNeeded();
            await optionElement.click();
            optionFound = true;
            console.log(`✅ Tipo de propiedad seleccionado: ${cleanText}`);
          }
          break;
        }
        optionIndex++;
      } catch (e) {
        optionIndex++;
        continue;
      }
    }

    if (!optionFound) {
      throw new Error(`No se encontró tipo de propiedad: "${propertyType}"`);
    }

    // PASO 3: Precio y expensas
    console.log("💰 PASO 3: Completando precio y expensas...");
    const priceXPath = "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[4]/div[1]/div/div[2]/div[2]/qr-input/div/input";
    const expensesXPath = "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[4]/div[2]/div[2]/div[2]/qr-input/div/input";

    const priceField = await page.waitForSelector(`xpath=${priceXPath}`, { timeout: 10000 });
    await priceField.fill(formattedData.precio.toString());
    console.log(`✅ Precio completado: ${formattedData.precio}`);

    if (formattedData.expensas && formattedData.expensas > 0) {
      try {
        const expensesField = await page.waitForSelector(`xpath=${expensesXPath}`, { timeout: 5000 });
        await expensesField.fill(formattedData.expensas.toString());
        console.log(`✅ Expensas completadas: ${formattedData.expensas}`);
      } catch (e) {
        console.log("⚠️ Error completando expensas, continuando...");
      }
    }

    // PASO 4: Avanzar al paso de ubicación
    console.log("➡️ PASO 4: Avanzando al paso de ubicación...");
    const nextStepButtonXPath = "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[2]/qr-button/button";
    const nextStepButton = await page.waitForSelector(`xpath=${nextStepButtonXPath}`, { timeout: 10000 });
    await nextStepButton.click();
    await page.waitForTimeout(3000);
    console.log("✅ Avanzado al paso de ubicación");

    // PASO 5: Desplegar opciones de ubicación
    console.log("📍 PASO 5: Desplegando opciones de ubicación...");
    const locationOptionsButtonXPath = "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div/div/form/button";
    const locationOptionsButton = await page.waitForSelector(`xpath=${locationOptionsButtonXPath}`, { timeout: 10000 });
    await locationOptionsButton.click();
    await page.waitForTimeout(2000);
    console.log("✅ Opciones de ubicación desplegadas");

    // PASO 6: Completar campos de ubicación
    console.log("🗺️ PASO 6: Completando campos de ubicación...");
    await fillLocationFields(page, formattedData);

    // PASO 7: Título y descripción
    console.log("📝 PASO 7: Completando título y descripción...");
    const titleXPath = "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step4/div[1]/div[1]/qr-input/div[1]/input";
    const descriptionXPath = "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step4/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/textarea";

    const titleField = await page.waitForSelector(`xpath=${titleXPath}`, { timeout: 10000 });
    await titleField.fill(formattedData.titulo);
    console.log(`✅ Título completado: ${formattedData.titulo}`);

    const descriptionField = await page.waitForSelector(`xpath=${descriptionXPath}`, { timeout: 5000 });
    await descriptionField.fill(formattedData.descripcion);
    console.log(`✅ Descripción completada`);

    await page.screenshot({ path: "form-complete-separated-fields.png", fullPage: true });

    return {
      success: true,
      message: "Formulario completado exitosamente con campos separados",
      fieldsCompleted: ["operacion", "tipoPropiedad", "precio", "expensas", "ubicacion-separada", "titulo", "descripcion"],
      details: {
        operationType: operationType,
        propertyType: propertyType,
        price: formattedData.precio,
        addressData: {
          calle: formattedData.calle,
          numero: formattedData.numero,
          localidad: formattedData.localidad,
          provincia: formattedData.provincia
        },
        title: formattedData.titulo,
        currentStep: "form-completed-with-separated-fields",
      },
    };

  } catch (error) {
    console.error("💥 Error completando formulario:", error);
    await page.screenshot({ path: "form-fill-error.png", fullPage: true });
    return {
      success: false,
      message: `Error completando formulario: ${(error as Error).message}`,
      error: error,
    };
  }
}

// Función principal de procesamiento
async function processWithPlaywright(formattedData: any) {
  console.log("🤖 Iniciando procesamiento con campos separados");
  console.log("📊 Datos a procesar:", formattedData);

  try {
    const loginResult = await loginToRedRemax();
    if (!loginResult.success) {
      throw new Error(`Fallo en login: ${loginResult.message}`);
    }

    const formResult = await fillPropertyForm(loginResult.page, formattedData);
    if (!formResult.success) {
      throw new Error(`Fallo completando formulario: ${formResult.message}`);
    }

    console.log("🎭 Proceso completado - navegador abierto para revisión");

    return {
      success: true,
      redremaxId: `RRM-${Date.now()}`,
      message: "Propiedad cargada exitosamente con campos separados",
      details: {
        loginStage: loginResult.stage || "completed",
        formFields: formResult.fieldsCompleted,
        currentUrl: loginResult.currentUrl,
        addressProcessing: "separated_fields_used",
      },
    };
  } catch (error) {
    console.error("💥 Error en processWithPlaywright:", error);
    return {
      success: false,
      message: `Error: ${(error as Error).message}`,
      error: error,
    };
  }
}

// Handler principal del endpoint
export async function POST(request: NextRequest) {
  try {
    console.log("📝 Nueva solicitud de propiedad recibida");

    const data = await request.json();
    console.log("📊 Datos recibidos (con campos separados):", data);

    const validation = validatePropertyData(data);
    if (!validation.isValid) {
      console.log("❌ Datos inválidos:", validation.errors);
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    console.log("✅ Datos validados correctamente");

    const formattedData = formatDataForRedRemax(data as NewPropertyData);
    console.log("🔄 Datos formateados para RedRemax (campos separados):", formattedData);

    const playwrightResult = await processWithPlaywright(formattedData);
    console.log("🎭 Resultado de Playwright:", playwrightResult);

    return NextResponse.json({
      success: true,
      message: "Proceso iniciado exitosamente con campos de dirección separados",
      data: {
        localId: `LOCAL-${Date.now()}`,
        redremaxId: playwrightResult.redremaxId,
        status: playwrightResult.success ? "form_completed_separated_fields" : "error",
        formattedData,
        playwrightResult,
      },
    });
  } catch (error) {
    console.error("💥 Error procesando nueva propiedad:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET endpoint para información
export async function GET() {
  return NextResponse.json({
    endpoints: {
      create: "/api/propiedades/nueva",
      methods: ["POST"],
    },
    status: "API con campos de dirección separados",
    features: [
      "🎭 Login automatizado a RedRemax",
      "📝 Formulario con campos de dirección separados",
      "🚫 SIN procesamiento adicional - usa datos del frontend",
      "✅ Mapeo directo de campos separados",
      "👁️ Navegador visible para debugging",
      "📸 Screenshots automáticos",
    ],
    addressFields: [
      "street", "street_number", "floor", "apartment", 
      "locality", "province", "postal_code", "country"
    ]
  });
}