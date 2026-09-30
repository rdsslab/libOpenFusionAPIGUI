// eslint.config.js
// Configuracion flat de ESLint 9 (reemplaza a .eslintrc.cjs, que ESLint 9 ya no
// soporta). Los ignores van aqui adentro: .eslintignore dejo de ser soportado en
// flat config.
//
// El orden importa. Las reglas de formato se desactivan al final (prettier +
// svelte.configs.prettier) para que eslint y prettier no se peleen: `npm run
// lint` corre ambos y solo prettier debe decidir el formato.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
	// Salidas generadas: no se lintean. /dist se regenera en cada build
	// (svelte-package) y /.svelte-kit en cada sync, asi que Reformatearlas solo
	// genera churn.
	{
		ignores: ['.svelte-kit/', 'build/', 'dist/', 'package/']
	},
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				// Runes de Svelte 5. eslint-plugin-svelte 2.x todavia no las
				// declara, asi que sin esto cada uso de $state / $derived
				// dispara no-undef.
				$state: 'readonly',
				$derived: 'readonly',
				$effect: 'readonly',
				$props: 'readonly',
				$bindable: 'readonly',
				$inspect: 'readonly',
				$host: 'readonly'
			}
		},
		rules: {
			// Los parametros de funcion quedan fuera del chequeo a proposito.
			// Esta libreria mantiene firmas publicas estables: request.js expone
			// ~19 funciones con un `token` que ya no se usa (la autorizacion la
			// maneja uFetch), y varias funciones flecha reciben un parametro que
			// ignoran. Borrarlos cambia la API exportada y rompe los callers, que
			// es justo lo que `no-unused-vars` no debe decidir solo.
			// Las variables, imports y bindings de catch si se siguen chequeando.
			'no-unused-vars': ['error', { args: 'none' }]
		}
	}
];
