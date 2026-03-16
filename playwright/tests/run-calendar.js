require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { chromium } = require('playwright');
const path = require('path');
const { supabase, login } = require('../supabase');

// Capturar argumentos: YYYY MM DD "Nombre de la Cita"
const [,, year, month, day, appointmentTitle] = process.argv;

if (!year || !month || !day || !appointmentTitle) {
  console.error('❌ Uso: node calendar_extractor.js YYYY MM DD "Nombre de la Cita"');
  process.exit(1);
}

(async () => {
  const userDataDir = path.join(__dirname, '../.auth-chrome');
  
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true, // Optimizado para VPS
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ]
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  // 1. Construcción dinámica de la URL (Vista de día)
  const targetUrl = `https://calendar.google.com/calendar/u/0/r/day/${year}/${month}/${day}`;
  console.log(`📅 Navegando a: ${targetUrl}`);

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle' });

    // 2. Buscar el evento por su título
    // Usamos una expresión regular para que coincida con el título sin importar la hora exacta
    console.log(`🔍 Buscando evento: "${appointmentTitle}"...`);
    const eventSelector = page.getByRole('button', { name: new RegExp(appointmentTitle, 'i') });
    
    await eventSelector.waitFor({ timeout: 10000 });
    await eventSelector.click();

    // 3. Abrir el diálogo de invitación
    console.log('📂 Abriendo detalles...');
    // Google a veces cambia el nombre del botón según el idioma del perfil
    const inviteButton = page.getByRole('button', { name: /Invitar con un vínculo|Compartir/i });
    
    // Si el botón de invitar no es visible directamente, es que ya estamos en el modal
    await page.waitForTimeout(1000); 

    // 4. Extraer el enlace de invitación
    console.log('🔗 Extrayendo enlace...');
    // Buscamos el link que contiene el dominio de calendar.app
    const enlaceLocator = page.locator('a[href*="calendar.app.google"]');
    
    await enlaceLocator.waitFor({ timeout: 5000 });
    const urlInvitacion = await enlaceLocator.getAttribute('href');

    console.log('\n--------------------------------------------');
    console.log('✅ CITA ENCONTRADA');
    console.log('Título:', appointmentTitle);
    console.log('Enlace:', urlInvitacion);
    console.log('--------------------------------------------\n');

    // Registrar en Supabase (si hay sesión activa o RLS permite anon inserts)
    try {
      // Login opcional: set SUPABASE_USER y SUPABASE_PASS en .env para autenticar
      if (process.env.SUPABASE_USER && process.env.SUPABASE_PASS) {
        await login(process.env.SUPABASE_USER, process.env.SUPABASE_PASS);
      }

      const { error: dbError } = await supabase
        .from('citas')
        .insert({
          titulo: appointmentTitle,
          fecha: `${year}-${month}-${day}`,
          enlace: urlInvitacion,
          creado_en: new Date().toISOString(),
        });

      if (dbError) {
        console.warn('⚠️  Supabase insert error:', dbError.message);
      } else {
        console.log('💾 Cita guardada en Supabase (tabla: citas)');
      }
    } catch (supaErr) {
      console.warn('⚠️  Supabase:', supaErr.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: `error-calendar-${day}-${month}.png` });
    console.log('📸 Screenshot de error guardado.');
  } finally {
    await context.close();
  }
})();