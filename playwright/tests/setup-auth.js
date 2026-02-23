const { chromium } = require('playwright');
const path = require('path');

// Capturar argumentos de la terminal
const [,, email, password] = process.argv;

if (!email || !password) {
  console.error('❌ Error: Debes proporcionar correo y contraseña.');
  console.log('Uso: node script.js correo@gmail.com contraseña');
  process.exit(1);
}

(async () => {
  const userDataDir = path.join(__dirname, '../.auth-chrome');

  console.log(`🚀 Iniciando sesión headless para: ${email}`);

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true, // Cambiado a Headless para el VPS
    viewport: { width: 1280, height: 720 },
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--lang=es-ES,es',
    ]
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  // Cambiar el User-Agent para parecer un navegador real y no un bot
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    await page.goto('https://accounts.google.com/signin/v2/identifier', { waitUntil: 'networkidle' });

    // 1. Ingresar Correo
    console.log('📧 Ingresando correo...');
    await page.fill('input[type="email"]', email);
    await page.click('#identifierNext');

    // Esperar a que el campo de contraseña aparezca
    await page.waitForSelector('input[type="password"]', { visible: true, timeout: 10000 });
    
    // Pequeña pausa para simular comportamiento humano
    await page.waitForTimeout(2000);

    // 2. Ingresar Contraseña
    console.log('🔑 Ingresando contraseña...');
    await page.fill('input[type="password"]', password);
    await page.click('#passwordNext');

    // 3. Verificación de éxito
    // Esperamos a que la URL cambie o aparezca el avatar de la cuenta
    await page.waitForNavigation({ waitUntil: 'networkidle' });

    if (page.url().includes('myaccount.google.com') || page.url().includes('accounts.google.com/websetter')) {
      console.log('✅ ¡Inicio de sesión exitoso! Sesión guardada.');
    } else {
      console.log('⚠️  Estado incierto. Es posible que Google pida verificación 2FA.');
      console.log('URL Actual:', page.url());
      // Guardar screenshot para debugear en el VPS
      await page.screenshot({ path: 'login-status.png' });
      console.log('📸 Screenshot guardado como login-status.png');
    }

  } catch (error) {
    console.error('❌ Error durante el proceso:', error.message);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await context.close();
  }
})();