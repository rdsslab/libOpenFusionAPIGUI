import { test, expect } from '@playwright/test';

/**
 * E2E del menú "Async Requests" ( estado de ofapi_async_jobs de ASYNC_WRAPPER):
 *  1) login y selección de la app demo
 *  2) el ítem "Async Requests" aparece en el menú y abre la vista
 *  3) la tabla carga los jobs ya existentes
 *  4) el detalle (clic en fila) muestra params recibidos y ciclo de vida
 *  5) disparar un job async real vía HTTP crea una fila NUEVA en la tabla sin
 *     recargar (actualización en vivo por websocket database_hook)
 */
test('e2e Async Requests: carga, detalle y actualización en vivo', async ({ page }) => {
  test.setTimeout(240000);
  const BACKEND = 'http://localhost:3000';

  // ═══ LOGIN ═══
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('#login-username', { timeout: 15000 });
  await page.fill('#login-username', 'superopenfusionapi');
  await page.fill('#login-password', 'Caracol@1234');
  await page.click('button:has-text("Sign In")');
  await page.waitForTimeout(3500);
  console.log('✓ Login');

  // ═══ APP DEMO ═══
  const appInput = page.locator('input[placeholder="Type to see options"]').first();
  await appInput.waitFor({ state: 'visible', timeout: 10000 });
  await appInput.click();
  await appInput.type('demo');
  await page.locator('.menu_items ul li a', { hasText: 'demo' }).first().click();
  await page.waitForTimeout(2500);
  console.log('✓ App demo seleccionada');

  // ═══ MENÚ "Async Requests" ═══
  const menuLink = page.locator('aside.sidebar a[title="Async Requests"]');
  await menuLink.waitFor({ state: 'visible', timeout: 10000 });
  await menuLink.click();
  await page.waitForTimeout(2500);
  console.log('✓ Menú Async Requests abierto');

  // Encabezado de la vista
  await page.waitForSelector('text=Async Requests', { timeout: 5000 });

  // Filtros de estado visibles (chips): All + los 5 estados
  const chips = await page.locator('div.tags a.tag').allInnerTexts();
  console.log('Chips de filtro:', chips.join(' | '));
  expect(chips.map((c) => c.toLowerCase())).toContain('all');
  expect(chips.map((c) => c.toLowerCase())).toContain('failed');

  // ═══ TABLA: deben aparecer los jobs ya existentes ═══
  const countRowsBefore = await page.locator('table tbody tr').count();
  console.log(`Filas de jobs al abrir: ${countRowsBefore}`);
  expect(countRowsBefore).toBeGreaterThan(0);

  const bodyText = await page.locator('body').innerText();
  expect(bodyText.toUpperCase()).toMatch(/FAILED|PENDING|RUNNING|COMPLETED|EXPIRED/);
  await page.screenshot({ path: '/tmp/opencode/async-requests-table.png' });

  // ═══ DETALLE: clic en la primera fila ═══
  await page.locator('table tbody tr').first().locator('td').nth(1).click();
  await page.waitForTimeout(1500);
  const detailText = await page.locator('body').innerText();
  expect(detailText).toContain('Request ID');
  expect(detailText).toContain('Params received');
  console.log('✓ Modal de detalle abierto (Request ID + Params)');
  const modalShot = '/tmp/opencode/async-requests-detail.png';
  await page.screenshot({ path: modalShot });
  // Cerrar el modal (solo el activo: hay modales ocultos en otras vistas)
  const acceptBtn = page.locator('.modal.is-active button:has-text("Close")').first();
  await acceptBtn.waitFor({ state: 'visible', timeout: 5000 });
  await acceptBtn.click();
  await page.waitForTimeout(1000);
  console.log('✓ Cerrado el modal');

  // ═══ ACTUALIZACIÓN EN VIVO ═══
  // Dispara un job async real contra el backend (App demo, env dev). El
  // database_hook de ofapi_async_jobs debe repintar la tabla sin recargar.
  const base64Auth = Buffer.from('superopenfusionapi:Caracol@1234').toString('base64');
  const resp = await page.request.post(`${BACKEND}/api/demo/hive/async/dev/dev`, {
    headers: {
      Authorization: `Basic ${base64Auth}`,
      'Content-Type': 'application/json',
      'user-agent': 'playwright-e2e',
    },
    data: { categories: [`e2e-${Date.now()}`] },
  });
  console.log(`✓ Job disparado por HTTP: status ${resp.status()}`);
  expect([200, 202]).toContain(resp.status());

  // La fila nueva debe aparecer sola, vía websocket (máx ~15 s)
  let countRowsAfter = countRowsBefore;
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    countRowsAfter = await page.locator('table tbody tr').count();
    if (countRowsAfter > countRowsBefore) break;
    await page.waitForTimeout(500);
  }
  console.log(`Filas tras el disparo (sin recargar): ${countRowsAfter} (antes: ${countRowsBefore})`);
  await page.screenshot({ path: '/tmp/opencode/async-requests-live.png' });
  expect(countRowsAfter).toBeGreaterThan(countRowsBefore);
  console.log('✓✓✓ ACTUALIZACIÓN EN VIVO VERIFICADA: nueva fila sin recargar');
});
