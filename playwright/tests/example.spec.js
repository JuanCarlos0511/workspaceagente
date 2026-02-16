// @ts-check
const { chromium } = require('playwright');

(async () => {
  // INTENTO DE CONEXIÓN A CHROME YA ABIERTO (Puerto 9222)
  // Para que esto funcione, cierra Chrome y ejecútalo desde terminal con:
  // & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
  
  let browser;
  try {
      // Intentamos conectar usando 127.0.0.1 para evitar problemas de resolución de localhost
      browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
      console.log('Conectado exitosamente a Chrome existente.');
  } catch (error) {
      console.error('No se pudo conectar a Chrome. Asegúrate de haberlo iniciado con --remote-debugging-port=9222');
      console.error('Comando sugerido en PowerShell: & "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222');
      process.exit(1);
  }
  
  // Usamos el contexto por defecto del navegador abierto
  const context = browser.contexts()[0];
  // Usamos la primera página activa o creamos una nueva si no hay
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  await page.goto('https://calendar.google.com/calendar/u/0/r/week/2026/2/22');

  // Abre el evento en el calendario
    // Abre el evento en el calendario
  await page.getByRole('button', { name: 'De 3:30pm a 4:30pm, Chequeo' }).click();

  // Abre el diálogo de invitación
  await page.getByRole('button', { name: 'Invitar con un vínculo' }).click();

  // --- CAMBIO AQUÍ ---
  // 1. Definimos el locator del enlace sin hacer clic
  const enlaceLocator = page.getByRole('link', { name: 'https://calendar.app.google/' });

  // 2. Esperamos a que el enlace sea visible (opcional pero recomendado)
  await enlaceLocator.waitFor();

  // 3. Obtenemos el atributo 'href' (la dirección URL real)
  const urlInvitacion = await enlaceLocator.getAttribute('href');

  console.log('Enlace capturado exitosamente:', urlInvitacion);
  // -------------------

  // ---------------------
  console.log('Script finalizado. Desconectando...');
  // Desconectamos la sesión pero NO cerramos el navegador
  await browser.close();
})();
