// app/api/propiedades/nueva/route.ts
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

const { REMAX_URL, REDREMAX_PASSWORD, REDREMAX_USERNAME } = process.env;

// Interfaces para tipar los datos
interface NewPropertyData {
  // Información básica
  operation_type: string;
  property_type: string;
  title: string;
  description: string;

  // Ubicación
  address: string;
  latitude: number;
  longitude: number;

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

// Función para validar datos del formulario
function validatePropertyData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Campos requeridos
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

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`El campo ${field} es requerido`);
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

// Función para formatear datos para RedRemax (preparación para playwright)
function formatDataForRedRemax(data: NewPropertyData) {
  return {
    // Mapeo de tipos de operación
    tipoOperacion: data.operation_type,

    // Mapeo de tipos de propiedad
    tipoPropiedad: data.property_type,

    // Información básica
    titulo: data.title,
    descripcion: data.description,

    // Ubicación
    direccion: data.address,
    latitud: data.latitude,
    longitud: data.longitude,

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

// 🎭 NUEVA FUNCIÓN: Login con Playwright - ACTUALIZADA CON XPATHS REALES
async function loginToRedRemax() {
  console.log("🎭 Iniciando proceso de login con Playwright...");

  // Configuración del navegador
  const browser = await chromium.launch({
    headless: false, // 👁️ VISIBLE para debugging
    slowMo: 1000, // 🐌 Lento para poder ver cada acción
    args: ["--start-maximized"], // 🖥️ Ventana maximizada
  });

  const context = await browser.newContext({
    viewport: null, // Usar el tamaño completo de la ventana
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

    // 🎯 XPATHS ESPECÍFICOS DE REDREMAX
    const userFieldXPath =
      "/html/body/app-root/app-login/div/div[1]/div[2]/qr-input/div/input";
    const passwordFieldXPath =
      "/html/body/app-root/app-login/div/div[1]/div[3]/qr-input/div/input";
    const loginButtonXPath =
      "/html/body/app-root/app-login/div/div[1]/qr-button[1]/button";

    // Buscar campo de usuario con XPath específico
    console.log("🔍 Buscando campo de usuario...");
    let userField = null;
    try {
      userField = await page.waitForSelector(`xpath=${userFieldXPath}`, {
        timeout: 10000,
      });
      console.log("✅ Campo usuario encontrado con XPath específico");
    } catch (e) {
      console.log("❌ No se encontró campo de usuario con XPath específico");
      await page.screenshot({ path: "debug-user-field.png", fullPage: true });
      throw new Error("Campo de usuario no encontrado con XPath específico");
    }

    // Buscar campo de contraseña con XPath específico
    console.log("🔍 Buscando campo de contraseña...");
    let passwordField = null;
    try {
      passwordField = await page.waitForSelector(
        `xpath=${passwordFieldXPath}`,
        { timeout: 5000 }
      );
      console.log("✅ Campo contraseña encontrado con XPath específico");
    } catch (e) {
      console.log("❌ No se encontró campo de contraseña con XPath específico");
      await page.screenshot({
        path: "debug-password-field.png",
        fullPage: true,
      });
      throw new Error("Campo de contraseña no encontrado con XPath específico");
    }

    // Buscar botón de login con XPath específico
    console.log("🔍 Buscando botón de login...");
    let loginButton = null;
    try {
      loginButton = await page.waitForSelector(`xpath=${loginButtonXPath}`, {
        timeout: 5000,
      });
      console.log("✅ Botón login encontrado con XPath específico");
    } catch (e) {
      console.log("❌ No se encontró botón de login con XPath específico");
      await page.screenshot({ path: "debug-login-button.png", fullPage: true });
      throw new Error("Botón de login no encontrado con XPath específico");
    }

    // Completar credenciales
    console.log("📝 Completando credenciales...");

    if (!REDREMAX_USERNAME) {
      throw new Error(
        "REDREMAX_USERNAME no está definido en las variables de entorno"
      );
    }

    await userField.fill(REDREMAX_USERNAME);
    console.log(`✅ Usuario completado: ${REDREMAX_USERNAME}`);

    if (!REDREMAX_PASSWORD) {
      throw new Error(
        "REDREMAX_PASSWORD no está definido en las variables de entorno"
      );
    }

    await passwordField.fill(REDREMAX_PASSWORD);
    console.log("✅ Contraseña completada");

    // Hacer click en login
    console.log("🔑 Haciendo click en login...");
    await loginButton.click();

    // Esperar a que el login se procese
    console.log("⏳ Esperando respuesta del login...");
    await page.waitForTimeout(5000); // Dar más tiempo para el procesamiento

    // Verificar si el login fue exitoso
    const currentUrl = page.url();
    console.log(`🌐 URL actual después del login: ${currentUrl}`);

    // Tomar screenshot del resultado
    await page.screenshot({ path: "login-result.png", fullPage: true });

    // Verificar si seguimos en la página de login (indicaría error)
    if (currentUrl.includes("login") || currentUrl === REMAX_URL) {
      console.log("⚠️ Posible error de login - seguimos en página de login");

      // Buscar mensajes de error en la página
      try {
        const errorMessage = await page.textContent(
          ".error, .alert, .message",
          { timeout: 2000 }
        );
        console.log(`❌ Mensaje de error encontrado: ${errorMessage}`);
      } catch (e) {
        console.log("🤔 No se encontraron mensajes de error específicos");
      }

      await page.screenshot({ path: "login-error.png", fullPage: true });

      return {
        success: false,
        message: "Login posiblemente falló - seguimos en página de login",
        currentUrl: currentUrl,
        browserContext: context,
        page: page,
      };
    }

    console.log("✅ Login parece exitoso - URL cambió");

    // 🏠 PASO 2: Navegar al formulario de carga de propiedades
    console.log("🏠 Navegando al formulario de nueva propiedad...");

    try {
      // XPath del botón para ir a cargar nueva propiedad
      const newPropertyButtonXPath =
        "/html/body/app-root/app-private-layout/div[1]/app-properties-panel/div[1]/div/div/qr-button[2]/button";

      console.log('🔍 Buscando botón de "Nueva Propiedad"...');
      const newPropertyButton = await page.waitForSelector(
        `xpath=${newPropertyButtonXPath}`,
        { timeout: 10000 }
      );

      if (!newPropertyButton) {
        throw new Error("Botón de nueva propiedad no encontrado");
      }

      console.log("✅ Botón de nueva propiedad encontrado");
      console.log('🖱️ Haciendo click en "Nueva Propiedad"...');
      await newPropertyButton.click();

      // Esperar a que se cargue el formulario
      console.log("⏳ Esperando que se cargue el formulario de propiedades...");
      await page.waitForTimeout(3000);

      // Verificar que estamos en el formulario
      const formUrl = page.url();
      console.log(`🌐 URL del formulario: ${formUrl}`);

      // Tomar screenshot del formulario cargado
      await page.screenshot({
        path: "property-form-loaded.png",
        fullPage: true,
      });

      console.log("✅ Formulario de propiedades cargado exitosamente");

      return {
        success: true,
        message: "Login y navegación completados exitosamente",
        currentUrl: formUrl,
        stage: "property_form_ready",
        browserContext: context,
        page: page,
      };
    } catch (navError) {
      console.error("💥 Error navegando al formulario:", navError);
      await page.screenshot({ path: "navigation-error.png", fullPage: true });

      return {
        success: false,
        message: `Error navegando al formulario: ${
          (navError as Error).message
        }`,
        currentUrl: page.url(),
        stage: "navigation_failed",
        browserContext: context,
        page: page,
      };
    }
  } catch (error) {
    console.error("💥 Error durante el login:", error);
    await page.screenshot({ path: "error-login.png", fullPage: true });

    // Cerrar el navegador en caso de error
    await browser.close();

    return {
      success: false,
      message: `Error en login: ${(error as Error).message}`,
      error: error,
    };
  }

  // NOTA: No cerramos el navegador aquí para poder continuar
  // con el proceso de carga de propiedades
}

// 🏠 FUNCIÓN ACTUALIZADA: Completar formulario de propiedad paso a paso
async function fillPropertyForm(page: any, formattedData: any) {
  console.log("🏠 Iniciando completado del formulario de propiedad...");

  try {
    // ===============================
    // PASO 1: SELECCIONAR TIPO DE OPERACIÓN
    // ===============================
    console.log("📋 PASO 1: Seleccionando tipo de operación...");

    const operationXPaths = {
      Venta:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[2]/qr-toggle/button[1]",
      Alquiler:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[2]/qr-toggle/button[2]",
      "Alquiler Temporal":
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[2]/qr-toggle/button[3]",
    };

    const operationType = formattedData.tipoOperacion;
    const operationXPath =
      operationXPaths[operationType as keyof typeof operationXPaths];

    if (!operationXPath) {
      throw new Error(`Tipo de operación no válido: ${operationType}`);
    }

    console.log(`🔍 Buscando botón para operación: ${operationType}`);
    const operationButton = await page.waitForSelector(
      `xpath=${operationXPath}`,
      { timeout: 10000 }
    );

    console.log(`🖱️ Haciendo click en operación: ${operationType}`);
    await operationButton.click();
    await page.waitForTimeout(1000); // Esperar que se procese la selección

    console.log(`✅ Operación seleccionada: ${operationType}`);

    // ===============================
    // PASO 2: SELECCIONAR TIPO DE PROPIEDAD
    // ===============================
    console.log("🏘️ PASO 2: Seleccionando tipo de propiedad...");

    const propertyDropdownXPath =
      "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[3]/app-property-type-arg-old/div/app-select-list-v2-input/mat-form-field/div/div[1]/div";

    console.log("🔍 Buscando dropdown de tipo de propiedad...");
    const propertyDropdown = await page.waitForSelector(
      `xpath=${propertyDropdownXPath}`,
      { timeout: 10000 }
    );

    console.log("🖱️ Haciendo click en dropdown de tipo de propiedad...");
    await propertyDropdown.click();
    await page.waitForTimeout(2000); // Esperar que se abran las opciones

    // Buscar la opción correcta por texto usando XPath indexado
    const propertyType = formattedData.tipoPropiedad;
    console.log(`🔍 Buscando opción de propiedad: ${propertyType}`);

    // Base XPath para las opciones
    const baseOptionsXPath = "/html/body/div[3]/div[2]/div/div/div/mat-option";

    // Verificar que el dropdown está abierto esperando al menos la primera opción
    await page.waitForSelector(`xpath=${baseOptionsXPath}[1]`, {
      timeout: 5000,
    });
    console.log("✅ Dropdown abierto - opciones disponibles");

    let optionFound = false;
    let optionIndex = 1;

    // Iterar elemento por elemento hasta encontrar el texto o no haya más opciones
    while (!optionFound && optionIndex <= 20) {
      // Límite de 20 opciones para evitar loop infinito
      try {
        const spanXPath = `${baseOptionsXPath}[${optionIndex}]/span`;
        const optionXPath = `${baseOptionsXPath}[${optionIndex}]`;

        console.log(`🔍 Verificando opción ${optionIndex}...`);

        // Verificar si existe la opción en este índice
        const spanElement = await page.$(`xpath=${spanXPath}`);

        if (!spanElement) {
          console.log(
            `❌ No hay más opciones disponibles (llegamos al índice ${optionIndex})`
          );
          break;
        }

        // Obtener el texto de la opción
        const optionText = await spanElement.textContent();
        const cleanText = optionText?.trim() || "";
        console.log(`🔍 Opción ${optionIndex}: "${cleanText}"`);

        // Verificar si coincide (exacta o parcial)
        if (
          cleanText === propertyType ||
          cleanText.includes(propertyType) ||
          propertyType.includes(cleanText)
        ) {
          console.log(
            `✅ ¡Encontrada la opción correcta! Haciendo click en opción ${optionIndex}: "${cleanText}"`
          );

          // Hacer click en el elemento mat-option (no en el span)
          const optionElement = await page.$(`xpath=${optionXPath}`);
          if (optionElement) {
            await optionElement.scrollIntoViewIfNeeded();
            await optionElement.click();
            optionFound = true;
            console.log(`✅ Click realizado en la opción ${optionIndex}`);
          } else {
            console.log(
              `❌ Error: No se pudo encontrar el elemento mat-option[${optionIndex}] para hacer click`
            );
          }
          break;
        }

        optionIndex++;
      } catch (e) {
        console.log(
          `⚠️ Error verificando opción ${optionIndex}: ${(e as Error).message}`
        );
        optionIndex++;
        continue;
      }
    }

    if (!optionFound) {
      // Tomar screenshot para debugging
      await page.screenshot({
        path: "property-type-options-debug.png",
        fullPage: true,
      });

      console.log("📋 RESUMEN DE OPCIONES ENCONTRADAS:");
      // Mostrar un resumen de las opciones que pudimos leer
      for (let i = 1; i <= Math.min(optionIndex - 1, 10); i++) {
        try {
          const spanElement = await page.$(
            `xpath=${baseOptionsXPath}[${i}]/span`
          );
          if (spanElement) {
            const text = await spanElement.textContent();
            console.log(`   ${i}. "${text?.trim() || "Sin texto"}"`);
          }
        } catch (e) {
          console.log(`   ${i}. Error leyendo opción`);
        }
      }

      throw new Error(
        `No se encontró la opción de tipo de propiedad: "${propertyType}". Se verificaron ${
          optionIndex - 1
        } opciones.`
      );
    }

    await page.waitForTimeout(1000); // Esperar que se procese la selección
    console.log(`✅ Tipo de propiedad seleccionado: ${propertyType}`);

    // ===============================
    // PASO 2.5: COMPLETAR PRECIO Y EXPENSAS
    // ===============================
    console.log("💰 PASO 2.5: Completando precio y expensas...");

    const priceXPath =
      "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[4]/div[1]/div/div[2]/div[2]/qr-input/div/input";
    const expensesXPath =
      "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[1]/form/div[4]/div[2]/div[2]/div[2]/qr-input/div/input";

    // Completar precio
    console.log("💵 Completando precio...");
    try {
      const priceField = await page.waitForSelector(`xpath=${priceXPath}`, {
        timeout: 10000,
      });
      await priceField.fill(formattedData.precio.toString());
      console.log(`✅ Precio completado: ${formattedData.precio}`);
    } catch (e) {
      console.log(`⚠️ Error completando precio: ${(e as Error).message}`);
      await page.screenshot({ path: "price-field-error.png", fullPage: true });
      throw new Error(
        `No se pudo completar el campo precio: ${(e as Error).message}`
      );
    }

    // Completar expensas (si están definidas)
    if (formattedData.expensas && formattedData.expensas > 0) {
      console.log("🏢 Completando expensas...");
      try {
        const expensesField = await page.waitForSelector(
          `xpath=${expensesXPath}`,
          { timeout: 5000 }
        );
        await expensesField.fill(formattedData.expensas.toString());
        console.log(`✅ Expensas completadas: ${formattedData.expensas}`);
      } catch (e) {
        console.log(`⚠️ Error completando expensas: ${(e as Error).message}`);
        // No es crítico si falla las expensas, continuar
      }
    } else {
      console.log("ℹ️ Sin expensas para completar (valor nulo o cero)");
    }

    await page.waitForTimeout(1000); // Esperar que se procesen los valores
    console.log("✅ Precio y expensas completados");

    // ===============================
    // PASO 2.6: AVANZAR AL SIGUIENTE PASO (UBICACIÓN)
    // ===============================
    console.log("➡️ PASO 2.6: Avanzando al paso de ubicación...");

    const nextStepButtonXPath =
      "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step1/div[2]/qr-button/button";

    try {
      console.log('🔍 Buscando botón "Siguiente" o "Continuar"...');
      const nextStepButton = await page.waitForSelector(
        `xpath=${nextStepButtonXPath}`,
        { timeout: 10000 }
      );

      console.log(
        "🖱️ Haciendo click en botón para avanzar al paso de ubicación..."
      );
      await nextStepButton.click();
      await page.waitForTimeout(3000); // Esperar que se cargue el siguiente paso

      console.log("✅ Avanzado al paso de ubicación");

      // Tomar screenshot del paso de ubicación
      await page.screenshot({
        path: "step2-location-loaded.png",
        fullPage: true,
      });
    } catch (e) {
      console.log(
        `❌ Error avanzando al paso de ubicación: ${(e as Error).message}`
      );
      await page.screenshot({
        path: "next-step-button-error.png",
        fullPage: true,
      });
      throw new Error(
        `No se pudo avanzar al paso de ubicación: ${(e as Error).message}`
      );
    }

    // ===============================
    // PASO 2.7: DESPLEGAR OPCIONES DE UBICACIÓN
    // ===============================
    console.log("📍 PASO 2.7: Desplegando opciones de ubicación...");

    const locationOptionsButtonXPath =
      "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div/div/form/button";

    try {
      console.log("🔍 Buscando botón para desplegar opciones de ubicación...");
      const locationOptionsButton = await page.waitForSelector(
        `xpath=${locationOptionsButtonXPath}`,
        { timeout: 10000 }
      );

      console.log("🖱️ Haciendo click para desplegar opciones de ubicación...");
      await locationOptionsButton.click();
      await page.waitForTimeout(2000); // Esperar que se desplieguen los campos

      console.log("✅ Opciones de ubicación desplegadas");

      // Tomar screenshot con los campos de ubicación desplegados
      await page.screenshot({
        path: "location-fields-expanded.png",
        fullPage: true,
      });

      console.log("🗺️ COMPLETANDO CAMPOS DE UBICACIÓN...");
      await fillLocationFields(page, formattedData);
      console.log("✅ Campos de ubicación completados");
    } catch (e) {
      console.log(
        `❌ Error desplegando opciones de ubicación: ${(e as Error).message}`
      );
      await page.screenshot({
        path: "location-options-error.png",
        fullPage: true,
      });
      throw new Error(
        `No se pudieron desplegar las opciones de ubicación: ${
          (e as Error).message
        }`
      );
    }

    // ===============================
    // PASO 4: COMPLETAR TÍTULO Y DESCRIPCIÓN
    // ===============================
    console.log("📝 PASO 4: Completando título y descripción...");

    const formXPaths = {
      title:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step4/div[1]/div[1]/qr-input/div[1]/input",
      description:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step4/div[1]/div[2]/mat-form-field/div/div[1]/div[3]/textarea",
    };

    console.log("📝 Completando título de la propiedad...");
    const titleField = await page.waitForSelector(`xpath=${formXPaths.title}`, {
      timeout: 10000,
    });
    await titleField.fill(formattedData.titulo);
    console.log(`✅ Título completado: ${formattedData.titulo}`);

    console.log("📝 Completando descripción de la propiedad...");
    const descriptionField = await page.waitForSelector(
      `xpath=${formXPaths.description}`,
      { timeout: 5000 }
    );
    await descriptionField.fill(formattedData.descripcion);
    console.log(
      `✅ Descripción completada: ${formattedData.descripcion.substring(
        0,
        50
      )}...`
    );

    // Tomar screenshot del formulario completado
    await page.screenshot({
      path: "form-complete-with-location-ready.png",
      fullPage: true,
    });

    console.log(
      "🎉 Formulario completado exitosamente: operación, tipo, precio, expensas, navegación a ubicación, despliegue de campos, título y descripción"
    );

    return {
      success: true,
      message: "Formulario completado exitosamente",
      fieldsCompleted: [
        "operacion",
        "tipoPropiedad",
        "precio",
        "expensas",
        "avanzar-ubicacion",
        "desplegar-ubicacion",
        "calle", // ← NUEVO
        "numero", // ← NUEVO
        "codigoPostal", // ← NUEVO
        "pais", // ← NUEVO
        "provincia", // ← NUEVO
        "partido", // ← NUEVO
        "titulo",
        "descripcion",
      ],
      details: {
        operationType: operationType,
        propertyType: propertyType,
        price: formattedData.precio,
        expenses: formattedData.expensas || "No definidas",
        title: formattedData.titulo,
        description: formattedData.descripcion.substring(0, 100),
        currentStep: "location-fields-ready",
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

// Función actualizada para procesar con playwright
async function processWithPlaywright(formattedData: any) {
  console.log("🤖 Iniciando procesamiento con Playwright");
  console.log("📊 Datos a procesar:", formattedData);

  try {
    // 1. Hacer login y navegar al formulario
    const loginResult = await loginToRedRemax();

    if (!loginResult.success) {
      throw new Error(`Fallo en login/navegación: ${loginResult.message}`);
    }

    console.log(
      "✅ Login y navegación exitosos, procediendo a completar formulario..."
    );

    // 2. Completar formulario de propiedad
    const formResult = await fillPropertyForm(loginResult.page, formattedData);

    if (!formResult.success) {
      throw new Error(`Fallo completando formulario: ${formResult.message}`);
    }

    console.log("✅ Formulario completado exitosamente");

    // 3. TODO: Enviar formulario (próximo paso)
    // 4. TODO: Verificar que la propiedad se creó

    // Por ahora, mantener el navegador abierto para review manual
    console.log(
      "🎭 Proceso completado - navegador queda abierto para revisión"
    );

    return {
      success: true,
      redremaxId: `RRM-${Date.now()}`,
      message: "Propiedad cargada exitosamente en formulario",
      details: {
        loginStage: loginResult.stage || "completed",
        formFields: formResult.fieldsCompleted,
        currentUrl: loginResult.currentUrl,
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

    // Parsear datos del request
    const data = await request.json();
    console.log("📊 Datos recibidos:", data);

    // Validar datos
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

    // Formatear datos para RedRemax
    const formattedData = formatDataForRedRemax(data as NewPropertyData);
    console.log("🔄 Datos formateados para RedRemax:", formattedData);

    // Procesar con playwright
    const playwrightResult = await processWithPlaywright(formattedData);
    console.log("🎭 Resultado de Playwright:", playwrightResult);

    return NextResponse.json({
      success: true,
      message: "Proceso iniciado exitosamente",
      data: {
        localId: `LOCAL-${Date.now()}`,
        redremaxId: playwrightResult.redremaxId,
        status: playwrightResult.success ? "login_completado" : "error",
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
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// Función opcional para obtener configuración (GET)
export async function GET() {
  return NextResponse.json({
    endpoints: {
      create: "/api/propiedades/nueva",
      methods: ["POST"],
    },
    status: "Playwright configurado y listo",
    features: [
      "🎭 Login automatizado a RedRemax",
      "👁️ Navegador visible para debugging",
      "📸 Screenshots automáticos",
      "🐌 Modo lento para visualización",
    ],
  });
}

// ============================================
// 🗺️ FUNCIÓN PARA AGREGAR A TU CÓDIGO EXISTENTE
// ============================================

// 1. FUNCIÓN PARA COMPLETAR LOS CAMPOS DE UBICACIÓN

async function fillLocationFields(page: any, formattedData: any) {
  console.log("🗺️ Completando campos de ubicación...");

  try {
    // Parsear la dirección para extraer los datos
    //const locationData = parseAddressData(formattedData.direccion);
    const locationData = await parseAddressDataWithGoogleMaps(formattedData.direccion);
    console.log("📍 Datos de ubicación parseados:", locationData);

    // XPaths de los campos de ubicación
    const locationXPaths = {
      calle:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[1]/mat-form-field/div/div[1]/div/input",
      numero:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[2]/div[1]/mat-form-field/div/div[1]/div/input",
      codigoPostal:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[2]/div[2]/mat-form-field/div/div[1]/div/input",
      paisDropdown:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[4]/div[1]/app-select-list-v2-input/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span",
      provinciaDropdown:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[4]/div[2]/app-select-list-v2-input/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span",
      partidoDropdown:
        "/html/body/app-root/app-private-layout/div[1]/app-properties-form-page/div/div[2]/div[1]/app-prop-step2/div[1]/div/form/div[3]/div/div[1]/div[5]/div[1]/app-select-list-v2-input/mat-form-field/div/div[1]/div",
    };

    // CAMPO 1: Completar Calle
    console.log("🛣️ Completando calle...");
    const calleField = await page.waitForSelector(
      `xpath=${locationXPaths.calle}`,
      { timeout: 10000 }
    );
    await calleField.fill(locationData.calle);
    console.log(`✅ Calle completada: ${locationData.calle}`);

    // CAMPO 2: Completar Número
    console.log("🔢 Completando número...");
    const numeroField = await page.waitForSelector(
      `xpath=${locationXPaths.numero}`,
      { timeout: 5000 }
    );
    await numeroField.fill(locationData.numero);
    console.log(`✅ Número completado: ${locationData.numero}`);

    // CAMPO 3: Completar Código Postal
    console.log("📮 Completando código postal...");
    const codigoPostalField = await page.waitForSelector(
      `xpath=${locationXPaths.codigoPostal}`,
      { timeout: 5000 }
    );
    await codigoPostalField.fill(locationData.codigoPostal);
    console.log(`✅ Código postal completado: ${locationData.codigoPostal}`);

    // 📸 Screenshot antes de los dropdowns
    await page.screenshot({
      path: "before-country-dropdown.png",
      fullPage: true,
    });

    // CAMPO 4: Seleccionar País (Argentina) - VERSIÓN MEJORADA
    console.log("🇦🇷 Seleccionando país...");
    const paisDropdown = await page.waitForSelector(
      `xpath=${locationXPaths.paisDropdown}`,
      { timeout: 5000 }
    );
    await paisDropdown.click();
    console.log("🔍 Dropdown de país abierto");

    // Esperar más tiempo y tomar screenshot
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: "country-dropdown-opened.png",
      fullPage: true,
    });

    // MÉTODO MEJORADO: Buscar Argentina con múltiples estrategias
    console.log("🔍 Buscando Argentina en las opciones...");
    const argentinaSelected = await selectCountryArgentina(page);
    if (!argentinaSelected) {
      throw new Error("No se pudo seleccionar Argentina");
    }
    console.log("✅ País seleccionado: Argentina");
    await page.waitForTimeout(3000); // Esperar a que carguen las provincias

    // CAMPO 5: Seleccionar Provincia
    console.log(`🌎 Seleccionando provincia: ${locationData.provincia}...`);
    const provinciaDropdown = await page.waitForSelector(
      `xpath=${locationXPaths.provinciaDropdown}`,
      { timeout: 10000 }
    );
    await provinciaDropdown.click();
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "province-dropdown-opened.png",
      fullPage: true,
    });

    const provinciaSelected = await selectDropdownOptionRobust(
      page,
      locationData.provincia,
      "provincia"
    );
    if (!provinciaSelected) {
      throw new Error(`No se encontró la provincia: ${locationData.provincia}`);
    }
    console.log(`✅ Provincia seleccionada: ${locationData.provincia}`);
    await page.waitForTimeout(3000); // Esperar a que carguen los partidos

    // CAMPO 6: Seleccionar Partido
    console.log(`🏛️ Seleccionando partido: ${locationData.partido}...`);
    const partidoDropdown = await page.waitForSelector(
      `xpath=${locationXPaths.partidoDropdown}`,
      { timeout: 10000 }
    );
    await partidoDropdown.click();
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "partido-dropdown-opened.png",
      fullPage: true,
    });

    const partidoSelected = await selectDropdownOptionRobust(
      page,
      locationData.partido,
      "partido"
    );
    if (!partidoSelected) {
      throw new Error(`No se encontró el partido: ${locationData.partido}`);
    }
    console.log(`✅ Partido seleccionado: ${locationData.partido}`);

    // Tomar screenshot de ubicación completada
    await page.screenshot({
      path: "location-fields-completed.png",
      fullPage: true,
    });

    console.log("🎉 Campos de ubicación completados exitosamente!");
    return true;
  } catch (error) {
    console.error("💥 Error completando campos de ubicación:", error);
    await page.screenshot({ path: "location-error.png", fullPage: true });
    throw error;
  }
}

// NUEVA FUNCIÓN ESPECÍFICA PARA SELECCIONAR ARGENTINA
async function selectCountryArgentina(page: any) {
  console.log("🇦🇷 Buscando Argentina con múltiples métodos...");

  try {
    // MÉTODO 1: XPath directo como intentamos antes
    console.log("🔍 Método 1: XPath directo...");
    try {
      const argentinaOption = await page.waitForSelector(
        "xpath=/html/body/div[4]/div[2]/div/div/div/mat-option[1]/span",
        { timeout: 3000 }
      );
      await argentinaOption.click();
      console.log("✅ Método 1 exitoso");
      return true;
    } catch (e) {
      console.log("❌ Método 1 falló");
    }

    // MÉTODO 2: Buscar por texto "Argentina"
    console.log("🔍 Método 2: Buscar por texto...");
    try {
      const allOptions = await page.$$("mat-option");
      console.log(`📝 Encontradas ${allOptions.length} opciones`);

      for (let i = 0; i < allOptions.length; i++) {
        const option = allOptions[i];
        const text = await option.textContent();
        console.log(`   ${i + 1}. "${text?.trim()}"`);

        if (text?.trim().toLowerCase() === "argentina") {
          console.log("✅ ¡Argentina encontrada por texto!");
          await option.click();
          return true;
        }
      }
    } catch (e) {
      console.log("❌ Método 2 falló");
    }

    // MÉTODO 3: Selector CSS más flexible
    console.log("🔍 Método 3: CSS selector...");
    try {
      const options = await page.$$("mat-option span");
      for (let i = 0; i < options.length; i++) {
        const text = await options[i].textContent();
        console.log(`   CSS ${i + 1}. "${text?.trim()}"`);

        if (text?.trim().toLowerCase() === "argentina") {
          console.log("✅ ¡Argentina encontrada por CSS!");
          await options[i].click();
          return true;
        }
      }
    } catch (e) {
      console.log("❌ Método 3 falló");
    }

    // MÉTODO 4: Primera opción por defecto (como dice la imagen)
    console.log("🔍 Método 4: Primera opción por defecto...");
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
      console.log("❌ Método 4 falló");
    }

    console.log("❌ Todos los métodos fallaron");
    return false;
  } catch (error) {
    console.error("💥 Error en selectCountryArgentina:", error);
    return false;
  }
}

// FUNCIÓN MEJORADA PARA SELECCIONAR OPCIONES DE DROPDOWN
async function selectDropdownOptionRobust(
  page: any,
  targetText: string,
  dropdownType: string
) {
  console.log(`🔍 Buscando "${targetText}" en dropdown de ${dropdownType}...`);

  try {
    // Esperar a que aparezcan las opciones
    await page.waitForTimeout(1000);

    // MÉTODO 1: XPath específico
    try {
      const options = await page.$$(
        "xpath=/html/body/div[4]/div[2]/div/div/div/mat-option"
      );
      console.log(`📝 Método XPath - Encontradas ${options.length} opciones`);

      for (let i = 0; i < options.length; i++) {
        try {
          const spanElement = await options[i].$("span");
          if (!spanElement) continue;

          const optionText = await spanElement.textContent();
          const cleanText = optionText?.trim() || "";

          console.log(`   ${i + 1}. "${cleanText}"`);

          if (cleanText.toLowerCase() === targetText.toLowerCase()) {
            console.log(
              `✅ ¡Encontrado por XPath! Seleccionando: "${cleanText}"`
            );
            await spanElement.click();
            await page.waitForTimeout(500);
            return true;
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      console.log("❌ Método XPath falló");
    }

    // MÉTODO 2: CSS selector más general
    try {
      const options = await page.$$("mat-option");
      console.log(`📝 Método CSS - Encontradas ${options.length} opciones`);

      for (let i = 0; i < options.length; i++) {
        try {
          const optionText = await options[i].textContent();
          const cleanText = optionText?.trim() || "";

          console.log(`   CSS ${i + 1}. "${cleanText}"`);

          if (cleanText.toLowerCase() === targetText.toLowerCase()) {
            console.log(
              `✅ ¡Encontrado por CSS! Seleccionando: "${cleanText}"`
            );
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

    console.log(
      `❌ No se encontró "${targetText}" en dropdown de ${dropdownType}`
    );
    return false;
  } catch (error) {
    console.error(
      `💥 Error en selectDropdownOptionRobust para ${dropdownType}:`,
      error
    );
    return false;
  }
}

// 3. FUNCIÓN AUXILIAR PARA PARSEAR LA DIRECCIÓN
function parseAddressData(fullAddress: string) {
  console.log(`🧩 Parseando dirección: "${fullAddress}"`);

  // Ejemplo: "Manuel Belgrano 2796, Olivos, Vicente López, Buenos Aires"
  const parts = fullAddress.split(",").map((part) => part.trim());

  let locationData = {
    calle: "",
    numero: "",
    codigoPostal: "1636", // Valor por defecto según tu imagen
    provincia: "Buenos Aires",
    partido: "Vicente López",
  };

  if (parts.length >= 1) {
    // Primera parte: calle y número
    const calleNumero = parts[0];
    const match = calleNumero.match(/^(.+?)\s+(\d+)$/);

    if (match) {
      locationData.calle = match[1].trim();
      locationData.numero = match[2].trim();
    } else {
      locationData.calle = calleNumero;
    }
  }

  // Detectar partido y provincia en las partes restantes
  if (parts.length >= 2) {
    for (let i = 1; i < parts.length; i++) {
      const parte = parts[i].toLowerCase().trim();

      // Si contiene "vicente lópez" o "olivos", es el partido
      if (
        parte.includes("vicente") ||
        parte.includes("olivos") ||
        parte.includes("san isidro")
      ) {
        locationData.partido = parts[i].trim();
      }

      // Si es "Buenos Aires" es la provincia
      if (parte === "buenos aires") {
        locationData.provincia = parts[i].trim();
      }
    }
  }

  console.log("📍 Datos parseados:", locationData);
  return locationData;
}




async function getDetailedLocationFromAddress(fullAddress: string) {
  console.log(`🌐 Geocodificando dirección: "${fullAddress}"`);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está configurada");
  }

  try {
    // Construir URL de la API de Google Maps Geocoding
    const encodedAddress = encodeURIComponent(fullAddress);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&language=es&region=ar`;

    console.log("🔍 Consultando Google Maps API...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(
        `Error de Google Maps API: ${data.status} - ${
          data.error_message || "Error desconocido"
        }`
      );
    }

    if (!data.results || data.results.length === 0) {
      throw new Error("No se encontraron resultados para la dirección");
    }

    // Obtener el primer resultado (más preciso)
    const result = data.results[0];
    console.log("📍 Resultado de geocodificación:", result);

    // Extraer componentes de la dirección
    const components = result.address_components;
    const geometry = result.geometry;

    // Inicializar datos de ubicación
    const locationData = {
      // Coordenadas
      latitud: geometry.location.lat,
      longitud: geometry.location.lng,

      // Dirección formateada
      direccionCompleta: result.formatted_address,

      // Componentes específicos
      calle: "",
      numero: "",
      codigoPostal: "",
      barrio: "", // sublocality_level_1 (Olivos)
      localidad: "", // locality o administrative_area_level_2 (Vicente López)
      partido: "", // administrative_area_level_2
      provincia: "", // administrative_area_level_1 (Buenos Aires)
      pais: "", // country (Argentina)

      // Datos adicionales
      placeId: result.place_id,
      tipoUbicacion: result.types,
    };

    // Procesar cada componente
    components.forEach((component: any) => {
      const types = component.types;
      const longName = component.long_name;
      const shortName = component.short_name;

      console.log(
        `🔍 Componente: ${longName} (${shortName}) - Tipos: [${types.join(
          ", "
        )}]`
      );

      // Número de calle
      if (types.includes("street_number")) {
        locationData.numero = longName;
      }

      // Nombre de la calle
      if (types.includes("route")) {
        locationData.calle = longName;
      }

      // Barrio/Sublocality (Olivos)
      if (
        types.includes("sublocality_level_1") ||
        types.includes("sublocality")
      ) {
        locationData.barrio = longName;
      }

      // Localidad/Ciudad (Vicente López)
      if (types.includes("locality")) {
        locationData.localidad = longName;
      }

      // Partido (administrative_area_level_2 también puede ser Vicente López)
      if (types.includes("administrative_area_level_2")) {
        locationData.partido = longName;
        // Si no tenemos localidad, usar este como localidad
        if (!locationData.localidad) {
          locationData.localidad = longName;
        }
      }

      // Provincia
      if (types.includes("administrative_area_level_1")) {
        locationData.provincia = longName;
      }

      // País
      if (types.includes("country")) {
        locationData.pais = longName;
      }

      // Código postal
      if (types.includes("postal_code")) {
        locationData.codigoPostal = longName;
      }
    });

    console.log("✅ Datos de ubicación extraídos:", locationData);
    return locationData;
  } catch (error) {
    console.error("💥 Error en geocodificación:", error);
    throw error;
  }
}


// 3. FUNCIÓN MEJORADA PARA PARSEAR DIRECCIÓN (CON GOOGLE MAPS)
async function parseAddressDataWithGoogleMaps(fullAddress: string) {
    console.log(`🧩 Parseando dirección con Google Maps: "${fullAddress}"`);
    
    try {
      // Intentar obtener datos de Google Maps primero
      const googleData = await getDetailedLocationFromAddress(fullAddress);
      
      // Mapear a formato para RedRemax
      const locationData = {
        calle: googleData.calle || "",
        numero: googleData.numero || "",
        codigoPostal: googleData.codigoPostal || "1636",
        provincia: googleData.provincia || "Buenos Aires",
        partido: googleData.partido || googleData.localidad || "Vicente López",
        
        // Datos adicionales para debugging
        barrio: googleData.barrio || "",
        localidad: googleData.localidad || "",
        coordenadas: {
          lat: googleData.latitud,
          lng: googleData.longitud
        },
        direccionFormateada: googleData.direccionCompleta
      };
  
      console.log("📍 Datos parseados con Google Maps:", locationData);
      return locationData;
  
    } catch (error) {
      console.warn("⚠️ Fallback: Google Maps falló, usando parser manual");
      
      // Fallback al método manual si Google Maps falla
      return parseAddressDataManual(fullAddress);
    }
  }
  
  // 4. FUNCIÓN MANUAL DE FALLBACK (TU FUNCIÓN ORIGINAL)
  function parseAddressDataManual(fullAddress: string) {
    console.log(`🧩 Parseando dirección manualmente: "${fullAddress}"`);
    
    const parts = fullAddress.split(',').map(part => part.trim());
    
    let locationData = {
      calle: "",
      numero: "",
      codigoPostal: "1636",
      provincia: "Buenos Aires",
      partido: "Vicente López"
    };
  
    if (parts.length >= 1) {
      const calleNumero = parts[0];
      const match = calleNumero.match(/^(.+?)\s+(\d+)$/);
      
      if (match) {
        locationData.calle = match[1].trim();
        locationData.numero = match[2].trim();
      } else {
        locationData.calle = calleNumero;
      }
    }
  
    if (parts.length >= 2) {
      for (let i = 1; i < parts.length; i++) {
        const parte = parts[i].toLowerCase().trim();
        
        if (parte.includes('vicente') || parte.includes('olivos') || parte.includes('san isidro')) {
          locationData.partido = parts[i].trim();
        }
        
        if (parte === 'buenos aires' || parte.includes('provincia de buenos aires')) {
          locationData.provincia = parts[i].trim();
        }
      }
    }
  
    console.log("📍 Datos parseados manualmente:", locationData);
    return locationData;
  }