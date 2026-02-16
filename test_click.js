const { chromium } = require('playwright');

(async () => {
    const userDataDir = `C:/Users/${process.env.USERNAME}/AppData/Local/Google/Chrome/User Data/Default`;

    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        viewport: null,
        args: ['--start-maximized', '--profile-directory=Default']
    });

    const page = await context.newPage();

    try {
        await page.goto('https://calendar.google.com', { waitUntil: 'networkidle' });

        // ESTRATEGIA A: Selector por Texto (La más recomendada para Google)
        console.log('Buscando por texto directo...');
        const porTexto = page.locator('div:has-text("Obtener complementos")').last();

        // ESTRATEGIA B: Salto profundo (Cualquier div con esa clase dentro del body)
        console.log('Buscando por clase profunda...');
        const porClase = page.locator('body .Kk7lMc-suEOdc');

        // ESTRATEGIA C: XPath (Ruta absoluta si sabes que no cambia)
        // Esto busca el div en cualquier parte del documento
        const porXPath = page.locator('//div[contains(text(), "Obtener complementos")]');

        // INTENTO DE LOCALIZACIÓN
        // Usamos waitFor con 'attached' porque si es 'hidden', 'visible' fallará.
        await porTexto.waitFor({ state: 'attached', timeout: 5000 });
        
        console.log('✅ ¡Elemento encontrado!');
        
        // Hacemos scroll por si acaso
        await porTexto.scrollIntoViewIfNeeded();
        
        // Clic forzado
        await porTexto.click({ force: true });
        console.log('🚀 Clic ejecutado.');

    } catch (error) {
        console.error('❌ No se pudo encontrar el componente. Posibles razones:');
        console.log('- El elemento está dentro de un <iframe> (muy común en barras laterales).');
        console.log('- Las clases cambiaron (Google las genera dinámicamente).');
    } finally {
        await page.waitForTimeout(5000);
        await context.close();
    }
})();