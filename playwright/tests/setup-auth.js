const { chromium } = require('playwright');
const path = require('path');

(async () => {
  // Carpeta dedicada para guardar la sesión del robot (se creará en la raíz del proyecto)
  const userDataDir = path.join(__dirname, '../.auth-chrome');

  console.log('Iniciando navegador para autenticación...');
  console.log(`Perfil de usuario temporal en: ${userDataDir}`);
  console.log('NOTA: Se abrirá un Chrome independiente. No afectará tu Chrome personal.');

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'chrome', // Usa tu instalación real de Chrome
    viewport: null,    // Sin tamaño fijo de ventana
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-infobars',
    ]
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  await page.goto('https://accounts.google.com/');

  console.log('\n---------------------------------------------------------');
  console.log('🔴 ACCIÓN REQUERIDA:');
  console.log('1. Inicia sesión en Google manualmente en la ventana que se abrió.');
  console.log('2. Si te pide verificación de 2 pasos, complétala.');
  console.log('3. Una vez veas tu cuenta ("Bienvenido..."), CIERRA ESE NAVEGADOR.');
  console.log('---------------------------------------------------------\n');

  // Esperar hasta que el usuario cierre el navegador manualmente
  await new Promise(resolve => context.on('close', resolve));
  
  console.log('✅ Sesión guardada en la carpeta .auth-chrome');
})();