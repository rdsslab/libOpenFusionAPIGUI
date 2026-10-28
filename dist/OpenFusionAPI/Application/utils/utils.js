import { get } from 'svelte/store';
import { listHandlerStore } from './stores.js';

/**
 * @typedef {import('../../types/models.js').DataTest} DataTest
 * @typedef {import('../../types/models.js').EndpointRow} EndpointRow
 * @typedef {object} HandlerParam
 * @property {string} [id]
 * @property {string} [label]
 * @property {string|number} [value]
 * @property {boolean} [enabled]
 * @property {string} [description]
 * @property {string} [css_class]
 * @property {string} [css_icon]
 * @property {unknown} [modules]
 */

/**
 * Normaliza un `data_test` a la forma canónica que espera el `RESTTester` y que
 * el backend reconoce como suya: `query`/`headers` como arrays y `body`/`auth`
 * como objetos con `selection` numérico.
 *
 * El `selection` no es cosmético: el backend (`normalizeDataTest` en
 * libOpenFusionAPI) envuelve en `body.json.code` cualquier `data_test` que no
 * traiga ninguna señal del Tester, y un `body`/`auth` vacío sin `selection` era
 * justo el disparador de que la configuración de query/headers acabara dentro
 * del Body como JSON.
 * @param {Partial<DataTest>|null|undefined} data_test
 * @returns {DataTest}
 */
export const ensureDataTestShape = (data_test) => {
	const dt =
		data_test && typeof data_test === 'object' && !Array.isArray(data_test) ? data_test : {};

	if (!Array.isArray(dt.query)) dt.query = [];
	if (!Array.isArray(dt.headers)) dt.headers = [];
	if (dt.body == null || typeof dt.body !== 'object' || Array.isArray(dt.body)) dt.body = {};
	if (typeof dt.body.selection !== 'number') dt.body.selection = 0;
	if (dt.auth == null || typeof dt.auth !== 'object' || Array.isArray(dt.auth)) dt.auth = {};
	if (typeof dt.auth.selection !== 'number') dt.auth.selection = 0;

	return /** @type {DataTest} */ (dt);
};

/**
 * @param {string} handler
 * @returns {HandlerParam|undefined}
 */
export const getHandlerParams = (handler) => {
	const list = get(listHandlerStore); // ← obtiene el valor actual del store
	return Array.isArray(list) ? list.find((item) => item.id == handler) : {};
};

/**
 * @param {unknown} idapp
 * @returns {boolean}
 */
export const isNewApp = (idapp) => {
	if (typeof idapp === 'string' && idapp.trim().length > 5) {
		console.log('Basic cargar idapp: ', idapp);
		return false;
	} else {
		console.log('Basic nueva idapp:', idapp);
		return true;
	}
};

/**
 * @param {unknown} value
 * @param {unknown} new_value
 * @returns {boolean}
 */
export const equalObjs = (value, new_value) => {
	let new_value_str = typeof new_value == 'object' ? JSON.stringify(new_value) : new_value;
	let currect_value_str = typeof value == 'object' ? JSON.stringify(value) : value;
	return new_value_str == currect_value_str;
};

/**
 * @param {unknown} obj
 * @returns {string}
 */
export const jsonToHtmlString = (obj) => {
	// Convierte el objeto en JSON con identación (2 espacios)
	let jsonString = JSON.stringify(obj, null, 2);

	// Escapa caracteres HTML antes de inyectarlo (se usa con {@html} en la UI)
	// para evitar XSS en caso de que el contenido provenga de datos externos.
	return jsonString
		.split('\n')
		.map((line) =>
			line
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/ /g, '&nbsp;')
		) // espacios → &nbsp;
		.join('<br>'); // saltos → <br>
};

/**
 * @param {ReturnType<typeof setTimeout>|undefined} idTimeout
 * @param {() => void} fn_handler
 * @param {number} [timeout]
 * @returns {ReturnType<typeof setTimeout>}
 */
export const TimeOutChangeValue = (idTimeout, fn_handler, timeout = 600) => {
	clearTimeout(idTimeout);
	return setTimeout(() => {
		fn_handler();
	}, timeout);
};

/**
 * @param {EndpointRow|null} [row]
 * @returns {EndpointRow}
 */
export const defaultValuesEndpointRow = (row) => {
	if (row == null) {
		row = {};
	}

	if (row && row.idendpoint == null) {
		row.idendpoint = undefined;
	}

	if (row && row.enabled == null) {
		row.enabled = false;
	}

	if (row && row.access == null) {
		row.access = 0;
	}

	if (row && row.environment == null) {
		row.environment = 'dev';
	}

	if (row && row.resource == null) {
		row.resource = '';
	}

	if (row && row.method == null) {
		row.method = 'GET';
	}

	if (row && row.handler == null) {
		row.handler = 'NA';
	}

	if (row && row.cors == null) {
		row.cors = {};
	}

	if (row && row.code == null) {
		row.code = '';
	}

	if (row && row.description == null) {
		row.description = '';
	}

	if (row && row.description == null) {
		row.description = '';
	}

	if (row && row.headers_test == null) {
		row.headers_test = {};
	}

	if (row && row.data_test == null) {
		row.data_test = ensureDataTestShape({});
	}

	if (row && row.rowkey == null) {
		row.rowkey = 0;
	}

	if (row && row.cache_time == null) {
		row.cache_time = 0;
	}

	if (row && !row.environment) {
		row.environment = '?';
	}

	if (row && !row.endpoint) {
		row.endpoint = '';
	}

	if (row && !row.method) {
		row.method = '';
	}

	if (row && !row.handler) {
		row.handler = '';
	}
	if (row && row.ctrl == null) {
		row.ctrl = {};
	}

	if (row?.ctrl) {
		if (row.ctrl.users == null) {
			row.ctrl.users = [];
		}

		if (row.ctrl.log == null) {
			row.ctrl.log = {};
		}
	}

	if (row && row.data_test == null) {
		row.data_test = ensureDataTestShape({});
	}

	if (row?.data_test) {
		const data_test = row.data_test;

		if (data_test.query == null) {
			data_test.query = [];
		} else if (!Array.isArray(data_test.query)) {
			data_test.query = [];
		}

		if (data_test.body == null) {
			data_test.body = {};
		}

		if (data_test.headers == null) {
			data_test.headers = [];
		} else if (!Array.isArray(data_test.headers)) {
			data_test.headers = [];
		}

		if (data_test.auth == null) {
			data_test.auth = {};
		}

		// Forma canónica que espera el Tester y acepta el backend: query/headers
		// como arrays y body/auth con `selection` numérico.
		row.data_test = ensureDataTestShape(data_test);
	}

	return row;
};

/**
 * @param {string} method
 * @param {string} app
 * @param {string} resource
 * @param {string} environment
 * @returns {string}
 */
export function createEndpoint(method, app, resource, environment) {
	return `${method == 'WS' ? '/ws/' : '/api/'}${app}${resource}/${environment}`;
}

/**
 * @param {string} string_url
 */
/**
 * @param {string} string_url
 * @returns {boolean}
 */
export function validateURL(string_url) {
	const patron = /^\/[a-zA-Z0-9\-._~%]+(\/[a-zA-Z0-9\-._~%]+)*\/?$/;
	// ^ Inicio de la cadena
	// \/ Barra inicial
	// [a-zA-Z0-9\-._~%]+ Uno o más caracteres permitidos en la ruta
	// (\/[a-zA-Z0-9\-._~%]+)* Cero o más grupos adicionales de barra seguido de caracteres permitidos
	// \/? Barra opcional al final
	// $ Fin de la cadena

	if (patron.test(string_url)) {
		return true;
	} else {
		return false;
	}
}

/**
 * @template {object} T
 * @param {T} target
 * @param {unknown} source
 * @returns {T}
 */
export const mergeSourceOverwrite = (target, source) => {
	// Early return para casos triviales
	if (target === source) return target;
	if (source == null || typeof source !== 'object') return target;
	if (target == null || typeof target !== 'object') return /** @type {T} */ (source);

	/**
	 * @param {unknown} val
	 * @returns {val is Record<string, unknown>}
	 */
	const isPlainObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

	// Clon superficial del target (NO se muta el original)
	/** @type {Record<string, unknown>} */
	const result = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ ({ ...target }));
	const targetRecord = /** @type {Record<string, unknown>} */ (target);
	const sourceRecord = /** @type {Record<string, unknown>} */ (source);

	for (const key of Object.keys(sourceRecord)) {
		const srcVal = sourceRecord[key];
		const tarVal = targetRecord[key];

		// data_test se une aparte para no perder los tipos del Tester
		// (query/headers arrays; body/auth con `selection`).
		if (key === 'data_test' && isPlainObject(srcVal)) {
			result[key] = ensureDataTestShape(mergeSourceOverwrite(tarVal || {}, srcVal));
		} else if (isPlainObject(tarVal) && isPlainObject(srcVal)) {
			// Merge profundo inmutable
			result[key] = mergeSourceOverwrite(tarVal, srcVal);
		} else {
			// Overwrite directo
			result[key] = srcVal;
		}
	}

	return /** @type {T} */ (result);
};

// NOTA: Para copiar texto al portapapeles (clipboard), no defina una función local ni use copyToClipboard.
// En su lugar, importe y utilice la función copyTextToClipboard de la librería @rdsslab/svelte-components.
// Ejemplo:
// import { copyTextToClipboard } from '@rdsslab/svelte-components';
// ...
// const { result, error } = await copyTextToClipboard(texto);
