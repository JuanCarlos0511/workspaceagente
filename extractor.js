const { chromium } = require('playwright');

const eventDate = process.argv[2]; 
const eventId = process.argv[3];

(async () => {
    // Ruta del perfil de Chrome en Windows
    const userDataDir = `C:/Users/${process.env.USERNAME}/AppData/Local/Google/Chrome/User Data/Default`;

    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false, // Modo visible para monitorear los clics
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        viewport: null, 
        args: [
            '--start-maximized', 
            '--profile-directory=Default', // Cambia a tu perfil si es necesario
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await context.newPage();

    try {
        console.log(`--- Iniciando búsqueda del evento ---`);
        await page.goto(`https://calendar.google.com/calendar/u/0/r/week/${eventDate}`, { 
            waitUntil: 'networkidle' 
        });

        // 1. Definir el selector basado en el jslog que contiene el ID de Python
        const selectorEvento = `div[data-eventchip][jslog*="${eventId}"]`;
        const evento = page.locator(selectorEvento).first();

        // 2. Esperar a que el elemento esté listo para la interacción
        await evento.waitFor({ state: 'visible', timeout: 15000 });
        
        // --- LOG SOLICITADO ---
        console.log(`✅ ¡Botón del evento encontrado con éxito! (ID: ${eventId})`);
        console.log(`Procediendo a ejecutar el clic en el contenedor.`);
        // ----------------------

        // 3. Asegurar visibilidad y hacer clic
        await evento.scrollIntoViewIfNeeded();
        await evento.click({ force: true });

        // 4. Proceso de apertura de burbuja e invitación
        console.log('Buscando botón de "Invitar con un vínculo"...');
        const btnInvitar = page.getByRole('button', { name: /Invitar con un vínculo/i });
        await btnInvitar.waitFor({ state: 'visible', timeout: 7000 });
        await btnInvitar.click();

        // 5. Extracción del enlace corto oficial
        const linkSelector = 'span:has-text("https://calendar.app.google/")';
        await page.waitForSelector(linkSelector, { timeout: 5000 });
        
        const shortLink = await page.locator(linkSelector).innerText();
        
        console.log('--- ENLACE OFICIAL EXTRAÍDO ---');
        console.log(shortLink);
        console.log('--------------------------------');

    } catch (error) {
        console.error('❌ ERROR DURANTE LA AUTOMATIZACIÓN:', error.message);
        await page.screenshot({ path: 'error_localizacion_boton.png' });
    } finally {
        await page.waitForTimeout(3000);
        await context.close();
    }
})();