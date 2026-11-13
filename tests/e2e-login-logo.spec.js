import { test, expect } from '@playwright/test';

/**
 * Regresión: el logo del login debe ser la marca original de OpenFusionAPI
 * (la llama/triángulo naranja), no el icono cuadrado "OF" del branding de
 * runtime que se coló en img/favicon.png el 13-Nov-2026 y se veía recortado
 * por el aro circular del login.
 *
 * Verificación por píxeles: la llama es una marca abierta (~35% de píxeles
 * opacos); el cuadrado "OF" es sólido (~98%). Umbral 0.6 separa ambos.
 */
const FLAME_OPAQUE_MAX = 0.6;

test('e2e LOGIN: logo es la marca llama (no el cuadrado OF)', async ({ page }) => {
	test.setTimeout(60000);

	await page.goto('http://localhost:5173/');
	await page.waitForSelector('#login-username', { timeout: 15000 });

	const logo = page.locator('.logo-img');
	await logo.waitFor({ state: 'visible', timeout: 10000 });

	// 1) El asset correcto y cargado
	const metrics = await logo.evaluate((img) => ({
		src: img.getAttribute('src'),
		complete: img.complete,
		naturalWidth: img.naturalWidth,
		naturalHeight: img.naturalHeight
	}));
	expect(metrics.complete, 'el logo debe cargarse').toBe(true);
	expect(metrics.naturalWidth, 'el logo debe tener resolución >= 128').toBeGreaterThanOrEqual(128);
	expect(metrics.src, 'el logo debe venir de img/logo.png').toContain('img/logo.png');

	// 2) La forma es la llama: mayoría de píxeles transparentes
	const opaqueRatio = await logo.evaluate(
		(img, max) =>
			new Promise((resolve, reject) => {
				const canvas = document.createElement('canvas');
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
				const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
				let opaque = 0;
				for (let i = 3; i < data.length; i += 4) if (data[i] > 40) opaque++;
				const total = data.length / 4;
				resolve(total > 0 ? opaque / total : 1);
			}),
		FLAME_OPAQUE_MAX
	);
	expect(opaqueRatio, `proporción de opacos ${opaqueRatio.toFixed(3)}`).toBeLessThan(
		FLAME_OPAQUE_MAX
	);

	// 3) El login sigue funcional
	await page.fill('#login-username', 'superopenfusionapi');
	await page.fill('#login-password', 'Caracol@1234');
	await page.click('button:has-text("Sign In")');
	await page.waitForSelector('.login-card', { state: 'detached', timeout: 15000 }).catch(() => {});
	expect(await page.locator('#login-username').count()).toBe(0);
});
