import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			// Vite 8 exige rutas absolutas: un alias relativo se resuelve contra el
			// importador y rompe `$lib/...` (500 en dev).
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	},
	build: {
		sourcemap: false
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				ws: true // ← Ahora está dentro de la configuración de '/api'
			},
			'/ws': {
				target: 'ws://localhost:3000',
				ws: true,
				changeOrigin: true
			}
		}
	}
});
