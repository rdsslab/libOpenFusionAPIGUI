import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	plugins: [
		sveltekit({
			// Kit 3 toma la config del plugin (svelte.config.js ya no existe).
			// El alias DEBE vivir aquí: svelte-package lee config.alias para
			// reescribir `$lib/...` a rutas relativas en dist/. Si se declara
			// solo en resolve.alias, svelte-package no lo ve y deja los imports
			// `$lib/...` en dist, rompiendo a los consumidores del paquete.
			// Vite 8 exige ruta absoluta.
			alias: {
				$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
			}
		})
	],
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
