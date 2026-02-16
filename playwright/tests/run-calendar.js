const { chromium } = require('playwright');
const path = require('path');

(async () => {
  // Usamos la misma carpeta donde guardaste la sesión
  const userDataDir = path.join(__dirname, '../.auth-chrome');

  console.log('Iniciando navegador con sesión guardada...');
  
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    channel: 'chrome',
    viewport: null,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-infobars',
    ]
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  // Vamos directo al calendario
  await page.goto('https://calendar.google.com/calendar/u/0/r/week/2026/2/22');

  try {
    // Esperamos un poco a que cargue la interacción
    // Nota: Como es una semana futura (2026), asegúrate de que el evento exista en esa fecha real
    
    // Abre el evento en el calendario
    console.log('Buscando evento...');
    await page.getByRole('button', { name: 'De 3:30pm a 4:30pm, Chequeo' }).click();

    // Abre el diálogo de invitación
    console.log('Abriendo invitación...');
    await page.getByRole('button', { name: 'Invitar con un vínculo' }).click();

    // --- EXTRACCIÓN DEL LINK ---
    const enlaceLocator = page.getByRole('link', { name: 'https://calendar.app.google/' });
    
    // Esperamos explicitamente
    await enlaceLocator.waitFor();
    
    const urlInvitacion = await enlaceLocator.getAttribute('href');

    console.log('\n🎉 ¡ÉXITO! -----------------------------------');
    console.log('Enlace capturado:', urlInvitacion);
    console.log('---------------------------------------------\n');


  } catch (error) {
    console.error('❌ Ocurrió un error (¿Quizás no estás logueado o el evento no existe?):', error.message);
  } finally {
    console.log('Cerrando navegador...');
    await context.close();
  }
})();