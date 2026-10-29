import { test, expect } from '@playwright/test';

/**
 * Reproduce la secuencia reportada por el usuario enfocada en el caso
 * persistente: abrir un editor con cambios y cerrarlo sin guardar, y
 * después abrir OTRO endpoint sin cambios — el Close no debe preguntar.
 *
 *  1) Editor #1: sin cambios, Close                          -> NO preguntar
 *  2) Editor #2: cambiar Description, Close                  -> SÍ preguntar
 *  3) Editor #3: SIN cambios, Close                          -> NO preguntar
 *     (equivale al caso #4 del usuario; NO debe preguntar ni tener
 *      memoria del "dirty" del editor anterior)
 *  4) Editor #4: cambiar Description, Close                  -> SÍ preguntar
 */
test('e2e SECUENCIA REAL: dirty no persiste entre editores', async ({ page }) => {
  test.setTimeout(240000);
  const dialogEvents = [];
  page.on('dialog', (d) => {
    dialogEvents.push(d.message());
    d.accept();
  });

  // ═══ LOGIN ═══
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('#login-username', { timeout: 10000 });
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
  console.log('✓ App demo');

  // ═══ ENDPOINTS ═══
  await page.locator('aside.sidebar a[title="Endpoints"]').click();
  await page.waitForTimeout(3000);
  const rowCount = await page.locator('table tbody tr').count();
  console.log(`✓ Endpoints: ${rowCount}`);
  expect(rowCount).toBeGreaterThanOrEqual(4);

  const closeBtn = page.locator('button:has-text("Close")');

  const openEditor = async (rowIdx) => {
    await page.locator('table tbody tr').nth(rowIdx).locator('td').nth(1).click();
    // Esperar el reposo completo de la inicialización del editor
    await page.waitForTimeout(1500);
  };

  const closeAndWatchDialogs = async () => {
    const before = dialogEvents.length;
    await closeBtn.click();
    const deadline = Date.now() + 4000;
    while (dialogEvents.length === before && Date.now() < deadline) {
      await page.waitForTimeout(200);
    }
    return dialogEvents.length - before;
  };

  const cambiarDescription = async () => {
    const desc = page.locator('textarea:visible').first();
    await desc.waitFor({ state: 'visible', timeout: 5000 });
    const v = await desc.inputValue();
    await desc.fill(v + ' [e2e-' + Date.now() + ']');
    await page.waitForTimeout(600);
  };

  // ───── 1) Editor #1: sin cambios ─────
  await openEditor(0);
  const d1 = await closeAndWatchDialogs();
  console.log(`#1 sin cambios        -> dialogs=${d1}  ${d1 === 0 ? '✓' : '✗ BUG'}`);
  await page.waitForTimeout(1200);

  // ───── 2) Editor #2: descripción cambiada ─────
  await openEditor(1);
  await cambiarDescription();
  const d2 = await closeAndWatchDialogs();
  console.log(`#2 desc cambiada      -> dialogs=${d2}  ${d2 > 0 ? '✓' : '✗ BUG'}`);
  await page.waitForTimeout(1200);

  // ───── 3) Editor #3: OTRO endpoint, sin cambios (caso usuario) ─────
  await openEditor(2);
  const d3 = await closeAndWatchDialogs();
  console.log(`#3 sin cambios        -> dialogs=${d3}  ${d3 === 0 ? '✓' : '✗ BUG (caso usuario)'}`);
  await page.waitForTimeout(1200);

  // ───── 4) Editor #4: descripción cambiada en otro endpoint ─────
  await openEditor(3);
  await cambiarDescription();
  const d4 = await closeAndWatchDialogs();
  console.log(`#4 desc cambiada      -> dialogs=${d4}  ${d4 > 0 ? '✓' : '✗ BUG'}`);

  // ═══ DIAGNÓSTICO ═══
  console.log('\n═══════════ DIAGNÓSTICO FINAL ═══════════');
  const ok1 = d1 === 0, ok2 = d2 > 0, ok3 = d3 === 0, ok4 = d4 > 0;
  console.log(`1) sin cambios          -> ${ok1 ? '✓ no pregunta' : '✗ preguntó (BUG)'}`);
  console.log(`2) desc cambiada        -> ${ok2 ? '✓ pregunta' : '✗ no preguntó (BUG)'}`);
  console.log(`3) otro endpoint sin c. -> ${ok3 ? '✓ no pregunta' : '✗ preguntó (CASO USUARIO)'}`);
  console.log(`4) desc cambiada        -> ${ok4 ? '✓ pregunta' : '✗ no preguntó (BUG)'}`);
  const allOk = ok1 && ok2 && ok3 && ok4;
  console.log(allOk ? '\n✓✓✓ TODOS LOS CASOS CORRECTOS — bug resuelto' : '\n✗✗✗ PERSISTEN CASOS FALLIDOS');

  expect(d1).toBe(0);
  expect(d2).toBeGreaterThan(0);
  expect(d3).toBe(0);
  expect(d4).toBeGreaterThan(0);
});
