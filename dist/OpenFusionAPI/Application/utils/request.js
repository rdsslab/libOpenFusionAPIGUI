import { url_paths } from './paths.js';
import uFetch from '@rdsslab/uFetch';
import { createEndpoint } from './utils.js';
import { getErrorMessage } from './errors.js';
import {
	listHandlerStore,
	listMethodStore,
	listFunctionStoreDev,
	listFunctionStorePRD,
	listFunctionStoreQA,
	listAppVars,
	authEventStore
} from './stores.js';

/**
 * @typedef {import('../../types/models.js').EndpointRow} EndpointRow
 */

/**
 * Cuerpo/consulta JSON que la GUI reenvía tal cual al backend.
 * @typedef {Record<string, unknown>|Array<unknown>} JsonBody
 */

/**
 * Verifica el status HTTP de una respuesta.
 * Si es 401, emite el evento `unauthorized` al authEventStore y lanza un error.
 * @param {Response} response
 * @returns {Response} La misma respuesta si no hay error
 */
function checkStatus(response) {
	if (response && response.status === 401) {
		authEventStore.set({ type: 'unauthorized' });
		throw new Error('Session expired or unauthorized (401)');
	}
	return response;
}

/**
 * @param {string} [token]
 */
export const getEnvironmentList = async (token) => {
	let uf = new uFetch();
	let environment_list = [];

	try {
		let env_list_resp = checkStatus(await uf.get({ url: url_paths.environment }));
		environment_list = await env_list_resp.json();

		if (!environment_list || !Array.isArray(environment_list)) {
			environment_list = [];
		}
	} catch (error) {
		console.error(getErrorMessage(error));
	}
	return environment_list;
};

/**
 * @param {number|string} idapp
 * @param {string} [token]
 */
export const GetApp = async (idapp, token) => {
	if (idapp) {
		let uf = new uFetch();

		let request = checkStatus(
			await uf.get({
				url: url_paths.app,
				data: { idapp: idapp }
			})
		);

		let response = await request.json();

		return response;
	} else {
		return [];
	}
};

/**
 * @param {string} username
 * @param {string} password
 */
export const LoginRequest = async (username, password) => {
	let uf = new uFetch();
	uf.SetBasicAuthorization(username, password);
	let user = await uf.post({
		url: url_paths.login
	});
	let data = await user.json();
	return data;
};

export const GetServerAPIVersion = async () => {
	// Lógica de autenticación aquí
	let uf = new uFetch();

	let version_req = await uf.get({ url: url_paths.serverAPIVersion });
	let version_res = await version_req.json();

	return version_res;
};

// ── Recuperación de contraseña (endpoints públicos de la app system) ──────

/**
 * Canales de recuperación habilitados globalmente para el environment.
 * @param {string} environment
 */
export const GetRecoveryOptions = async (environment = 'prd') => {
	let uf = new uFetch();
	let res = await uf.get({ url: url_paths.userRecoveryOptions, data: { environment } });
	return await res.json();
};

/**
 * Solicita un OTP de 6 dígitos (email o Telegram).
 * @param {{ username: string, channel?: string, environment?: string }} data
 */
export const ForgotPassword = async (data) => {
	let uf = new uFetch();
	let res = await uf.post({ url: url_paths.userForgotPassword, data });
	return await res.json();
};

/**
 * Canjea el OTP y actualiza la clave.
 * @param {{ username: string, otp: string, newPassword: string }} data
 */
export const ConfirmResetPassword = async (data) => {
	let uf = new uFetch();
	let res = await uf.post({ url: url_paths.userResetPasswordConfirm, data });
	return await res.json();
};

/**
 * @param {number|string} idapp
 * @param {string} [token]
 */
export const GetAppBackup = async (idapp, token) => {
	if (idapp) {
		let uf = new uFetch();

		let request = checkStatus(
			await uf.get({
				url: url_paths.appBackup,
				data: { idapp: idapp }
			})
		);

		let response = await request.json();

		return response;
	} else {
		return [];
	}
};

/**
 * @param {unknown} app
 */
export const RestoreAppBackup = async (app) => {
	if (app) {
		let uf = new uFetch();

		let request = checkStatus(
			await uf.post({
				url: url_paths.appBackup,
				data: app
			})
		);

		let response = await request.json();

		return response;
	} else {
		return [];
	}
};

/**
 * @param {string} [token]
 */
export const GetAllAppsBackup = async (token) => {
	let uf = new uFetch();

	let request = checkStatus(await uf.get({ url: url_paths.appsBackup }));

	let response = await request.json();

	return response;
};

/**
 * @param {unknown} backup
 */
export const RestoreAllAppsBackup = async (backup) => {
	if (backup) {
		let uf = new uFetch();

		let request = checkStatus(
			await uf.post({
				url: url_paths.appsBackup,
				data: backup
			})
		);

		let response = await request.json();

		return response;
	} else {
		return [];
	}
};

/**
 * @param {number|string} idapp
 * @returns {Promise<import('../../types/models.js').AppDetail>}
 */
export const GetEndpointsByIdapp = async (idapp) => {
	if (idapp) {
		let app = await GetApp(idapp);

		if (app.idapp == idapp) {
			app.endpoints = [];
			let uf = new uFetch();

			let request = checkStatus(
				await uf.get({
					url: url_paths.endpoints_get_by_idapp,
					data: { idapp: idapp }
				})
			);

			let response = await request.json();

			if (Array.isArray(response)) {
				app.endpoints = response.map((ax) => {
					return {
						//endpoint: `${ax.method == 'WS' ? '/ws/' : '/api/'}${app.app}${ax.resource}/${ax.environment}`,
						endpoint: createEndpoint(ax.method, app.app, ax.resource, ax.environment),
						...ax
					};
				});

				//	console.log(app);
			}
		}
		return app;
	} else {
		return {};
	}
};

/**
 * @param {number|string} idapp
 */
export const GetAPIKeys = async (idapp) => {
	let apiKeys = [];
	let uf = new uFetch(url_paths.APIKeys);

	let request = checkStatus(
		await uf.get({
			data: { idapp: idapp }
		})
	);

	apiKeys = await request.json();

	return apiKeys;
};

/**
 * Lista las peticiones asíncronas del ASYNC_WRAPPER de una aplicación
 * (`ofapi_async_jobs`). Solo lectura: el endpoint del sistema excluye los
 * campos pesados (`result`, `response_headers`, `error_message`) y exige
 * sesión admin (access 2). El filtro de estado se aplica en cliente: la
 * vista necesita derivar EXPIRED a partir de `expires_at`, que el backend
 * nunca escribe en la tabla.
 * @param {number|string} idapp
 * @returns {Promise<Array<import('../../types/models.js').AsyncJobRow>>}
 */
export const GetAsyncJobs = async (idapp) => {
	if (!idapp) return [];

	let uf = new uFetch(url_paths.getAsyncJobs);

	let request = checkStatus(
		await uf.get({
			data: { idapp: idapp }
		})
	);

	const response = await request.json();
	return Array.isArray(response?.jobs) ? response.jobs : [];
};

/**
 * @param {JsonBody} data
 */
export const GetAPIClients = async (data) => {
	let apiKeys = [];
	let uf = new uFetch(url_paths.APIClients);

	let request = checkStatus(
		await uf.get({
			data: data
		})
	);

	apiKeys = await request.json();

	return apiKeys;
};

/**
 * @param {JsonBody} data
 */
export const saveAPIClient = async (data) => {
	let uf = new uFetch(url_paths.APIClient);

	let request = checkStatus(
		await uf.post({
			data: data
		})
	);

	let apiKeys = await request.json();

	return apiKeys;
};

/**
 * @param {Record<string, unknown>} [filters]
 */
export const GetAPIClientsList = async (filters = {}) => {
	let uf = new uFetch(url_paths.APIClients);

	let request = checkStatus(
		await uf.get({
			data: filters
		})
	);

	let clients = await request.json();

	return clients;
};

/**
 * @param {JsonBody} data
 */
export const CreateAPIClient = async (data) => {
	let uf = new uFetch(url_paths.APIClient);

	let request = checkStatus(
		await uf.post({
			data: data
		})
	);

	let result = await request.json();

	return result;
};

/**
 * @param {JsonBody} data
 */
export const UpdateAPIClient = async (data) => {
	let uf = new uFetch(url_paths.APIClientUpdate);

	let request = checkStatus(
		await uf.post({
			data: data
		})
	);

	let result = await request.json();

	return result;
};

/**
 * @param {JsonBody} data
 */
export const ChangeAPIClientPassword = async (data) => {
	let uf = new uFetch(url_paths.APIClientChangePassword);

	let request = checkStatus(
		await uf.post({
			data: data
		})
	);

	let result = await request.json();

	return result;
};

export const getListHandler = async (/** @type {string} */ token) => {
	let f = new uFetch();

	let fr = checkStatus(await f.get({ url: url_paths.getHandler }));
	let list = await fr.json();

	if (list && Array.isArray(list)) {
		let data = list.map((m) => {
			return {
				id: m.handler,
				value: m.label,
				enabled: m.enabled,
				description: m.description,
				css_class: m.css_class,
				css_icon: m.css_icon,
				modules: m.modules
			};
		});
		listHandlerStore.set(data);
	}
};

export const getListMethods = async (/** @type {string} */ token) => {
	let f = new uFetch();

	let fr = checkStatus(await f.get({ url: url_paths.Methods }));
	let list = await fr.json();

	if (list && Array.isArray(list)) {
		let data = list.map((m) => {
			return {
				id: m.method,
				value: m.label,
				enabled: m.enabled,
				description: ''
			};
		});
		listMethodStore.set(data);
	}
};

/**
 * @param {string} handler
 * @param {string} [token]
 */
export const getHandlerDocs = async (handler, token) => {
	if (handler) {
		//	console.log(url_paths.apiDoc);
		let uF = new uFetch();

		let req = checkStatus(await uF.get({ url: url_paths.apiDoc, data: { handler: handler } }));
		let res = await req.json();
		//		console.log(res);
		return res;
	} else {
		return {};
	}
};

export const getListFunction = async (/** @type {string} */ appName) => {
	// Los tres ambientes se cargan en paralelo; la tabla de endpoints no debe
	// esperar por estas listas que solo usan los editores (handler JS).
	/**
	 * @param {string} environment
	 * @param {import('svelte/store').Writable<Array<{id: string, value: string|number}>>} store
	 */
	const loadEnv = async (environment, store) => {
		let f = new uFetch();

		try {
			let fr = await f.get({
				url: url_paths.getfunctions,
				data: { appName: appName, environment: environment }
			});
			let list = await fr.json();

			if (list && Array.isArray(list)) {
				let data = list.map((fn) => {
					return { id: fn, value: fn };
				});
				store.set(data);
			}
		} catch (error) {
			console.error(error);
			store.set([]);
		}
	};

	await Promise.all([
		loadEnv('dev', listFunctionStoreDev),
		loadEnv('qa', listFunctionStoreQA),
		loadEnv('prd', listFunctionStorePRD)
	]);
};

/**
 * @param {string} token
 * @param {Array<string>} urls_clear
 */
export const clearCache = async (/** @type {string} */ token, urls_clear) => {
	let uf = new uFetch();

	let get_list_clear = checkStatus(
		await uf.post({
			url: url_paths.clearCache,
			data: urls_clear
		})
	);

	let get_list_clear_result = await get_list_clear.json();
	return get_list_clear_result;
};

/**
 * @param {string|undefined} token
 * @param {number|string} idapp
 * @param {Array<number|string>} idendpoints
 */
export const getAppDocumentation = async (token, idapp, idendpoints) => {
	let uf = new uFetch();

	let get_doc = checkStatus(
		await uf.post({
			url: url_paths.appDocumentation,
			data: { idapp: idapp, endpoints: idendpoints }
		})
	);

	let result = await get_doc.json();
	return result;
};

/**
 * @param {JsonBody} data
 */
export const migrateEndpoints = async (data) => {
	let uf = new uFetch();

	let request = checkStatus(
		await uf.post({
			url: url_paths.migrateEndpoints,
			data: data
		})
	);

	let response = await request.json();
	return response;
};

/**
 * @param {JsonBody} data
 */
export const migrateAppVars = async (data) => {
	let uf = new uFetch();

	let request = checkStatus(
		await uf.post({
			url: url_paths.migrateAppVars,
			data: data
		})
	);

	let response = await request.json();
	return response;
};

/**
 * @param {string} [token]
 */
export const getServerAPIVersion = async (token) => {
	let uf = new uFetch();

	let version_req = checkStatus(await uf.get({ url: url_paths.serverAPIVersion }));
	let version_res = await version_req.json();

	return version_res;
};

/**
 * Última versión publicada de libOpenFusionAPI.
 *
 * Es información accesoria: si no se puede obtener, la GUI debe seguir
 * funcionando. Se degrada devolviendo null en lugar de propagar el error,
 * igual que getEnvironmentList.
 *
 * El backend responde 200 incluso cuando no logra alcanzar GitHub; en ese
 * caso trae la última versión conocida con `stale: true` y `checked_at`.
 *
 * El backend consulta el repositorio en cada llamada, por lo que se cachea en
 * memoria durante MAX_CACHE_MS para no disparar una llamada por cada montaje
 * del widget de endpoints.
 *
 * @param {number} [maxCacheMs] Duración de la caché en milisegundos.
 * @returns {Promise<object|null>} null si no se pudo obtener
 */
/** @type {{ts: number, value: unknown}|null} */
let serverAPILastVersionCache = null;

export const getServerAPILastVersion = async (maxCacheMs = 600000) => {
	const now = Date.now();
	if (serverAPILastVersionCache && now - serverAPILastVersionCache.ts < maxCacheMs) {
		return serverAPILastVersionCache.value;
	}

	let uf = new uFetch();

	try {
		let version_req = checkStatus(await uf.get({ url: url_paths.serverAPIVersionLast }));
		const value = await version_req.json();
		serverAPILastVersionCache = { ts: now, value };
		return value;
	} catch (error) {
		console.error(getErrorMessage(error));
		return null;
	}
};

/**
 * @param {number|string} [idendpoint]
 */
export const DeleteEndpoint = async (idendpoint) => {
	if (!idendpoint) return {};
	let uf = new uFetch();
	let request = checkStatus(
		await uf.DELETE({
			url: url_paths.endpoint,
			data: { idendpoint: idendpoint }
		})
	);
	let response = await request.json();
	return response;
};

/**
 * @param {EndpointRow} endpoint
 */
export const EndpointSave = async (endpoint) => {
	// console.trace('EndpointSave >>>>>>>>>>>>>', endpoint);

	if (endpoint.handler == 'TEXT' && endpoint.File) {
		let uf = new uFetch();
		let formData = new FormData();

		// Agrega el archivo al formData
		formData.append('file', endpoint.File);

		// Agrega el resto de los parámetros de `endpoint`
		const fields = /** @type {Record<string, unknown>} */ (endpoint);
		for (const key in fields) {
			if (key !== 'File') {
				let value = fields[key];
				if (typeof value === 'object' && value !== null) {
					formData.append(key, JSON.stringify(value));
				} else {
					formData.append(key, String(value));
				}
			}
		}

		let req = checkStatus(await uf.post({ url: url_paths.endpoint, data: formData }));
		let es = await req.json();
		return es;
	} else {
		let uf = new uFetch();
		let req = checkStatus(await uf.post({ url: url_paths.endpoint, data: endpoint }));
		let es = await req.json();
		return es;
	}
};

/**
 * @param {Record<string, unknown>} options
 * @param {string} [token]
 */
export const getLogsRecordsPerMinute = async (options, token) => {
	let uf = new uFetch();

	if (options) {
		let get_list_metrics = checkStatus(
			await uf.get({
				url: url_paths.getLogsRecordsPerMinute,
				data: options
			})
		);

		let metrics_list = await get_list_metrics.json();
		return metrics_list;
	}
};

/**
 * @param {Record<string, unknown>} options
 * @param {string} [token]
 */
export const getLogsStatusClassPerMinute = async (options, token) => {
	let uf = new uFetch();

	if (options) {
		let get_list_metrics = checkStatus(
			await uf.get({
				url: url_paths.getLogsStatusClassPerMinute,
				data: options
			})
		);

		let metrics_list = await get_list_metrics.json();
		return metrics_list;
	}
};

/**
 * @param {Record<string, unknown>} options
 * @param {string} [token]
 */
export const getResponseTimePerMinute = async (options, token) => {
	let uf = new uFetch();

	if (options) {
		let get_list_metrics = checkStatus(
			await uf.get({
				url: url_paths.getResponseTimePerMinute,
				data: options
			})
		);

		let metrics_list = await get_list_metrics.json();
		return metrics_list;
	}
};

/**
 * @param {Record<string, unknown>} options
 * @param {string} [token]
 */
export const getLogs = async (options, token) => {
	let uf = new uFetch();

	if (options) {
		let get_list_logs = checkStatus(
			await uf.get({
				url: url_paths.getLogs,
				data: options
			})
		);

		let logs_list = await get_list_logs.json();
		return logs_list;
	}
};

/**
 * @param {Record<string, unknown>} options
 */
export const getTraceSummary = async (options) => {
	if (options) {
		let uf = new uFetch();
		let req = checkStatus(await uf.get({ url: url_paths.getTraceSummary, data: options }));
		return await req.json();
	}
};

/**
 * @param {Record<string, unknown>} options
 */
export const getTraceErrorsOnly = async (options) => {
	if (options) {
		let uf = new uFetch();
		let req = checkStatus(await uf.get({ url: url_paths.getTraceErrorsOnly, data: options }));
		return await req.json();
	}
};

/**
 * @param {Record<string, unknown>} options
 */
export const getTraceSlowestHops = async (options) => {
	if (options) {
		let uf = new uFetch();
		let req = checkStatus(await uf.get({ url: url_paths.getTraceSlowestHops, data: options }));
		return await req.json();
	}
};

/**
 * @param {number|string} idapp
 * @param {boolean} [setStoreListAppVars]
 */
export const GetAppVars = async (idapp, setStoreListAppVars = false) => {
	let uf = new uFetch();

	let req = checkStatus(
		await uf.get({
			url: url_paths.appvarsbyidapp,
			data: { idapp: idapp }
		})
	);

	let resp = await req.json();

	if (setStoreListAppVars && resp && Array.isArray(resp)) {
		//console.log('setStoreListAppVars', resp);
		listAppVars.set(resp);
	}

	return resp;
};

/**
 * @param {JsonBody} data
 * @param {string} [token]
 */
export const UpsertAppVar = async (data, token) => {
	if (data) {
		let uf = new uFetch();

		let request = checkStatus(
			await uf.post({
				url: url_paths.appvar,
				data: data
			})
		);

		let response = await request.json();

		return response;
	} else {
		return {};
	}
};

/**
 * @param {number|string} [idvar]
 * @param {string} [token]
 */
export const DeleteAppVar = async (idvar, token) => {
	if (idvar) {
		let uf = new uFetch();

		let request = checkStatus(
			await uf.DELETE({
				url: url_paths.appvar,
				data: { idvar: idvar }
			})
		);

		let response = await request.json();

		return response;
	} else {
		return [];
	}
};

export const getListApps = async () => {
	let uf = new uFetch();

	let apps_res = checkStatus(await uf.get({ url: url_paths.apps_get_list }));
	let apps = await apps_res.json();
	return apps;
};

/**
 * @param {JsonBody} data
 * @param {string} [token]
 */
export const changeUserPassword = async (data, token) => {
	let uf = new uFetch();

	let apps_res = checkStatus(await uf.post({ url: url_paths.changeUserPassword, data: data }));
	let apps = await apps_res.json();
	return apps;
};

/**
 * @param {boolean} restore
 * @returns {Promise<import('../../types/models.js').SystemEndpointsStatus>}
 */
export const restoreSystemEndpoints = async (restore) => {
	let uf = new uFetch();

	let sys_res = checkStatus(
		await uf.put({
			url: url_paths.restoreSystemEndpoints,
			data: { restore: restore }
		})
	);
	let r = await sys_res.json();
	return r;
};

/**
 * @param {Record<string, unknown>} options
 * @param {string} [token]
 */
export const getLogSummaryByAppStatusCode = async (options, token) => {
	let uf = new uFetch();

	let sys_res = checkStatus(
		await uf.get({
			url: url_paths.getLogSummaryByAppStatusCode,
			data: options
		})
	);
	let r = await sys_res.json();
	return r;
};

/**
 * @param {Record<string, unknown>} options
 * @param {string} [token]
 */
export const getAppEndpointUsageSummary = async (options, token) => {
	let uf = new uFetch();

	if (options) {
		let sys_res = checkStatus(
			await uf.get({
				url: url_paths.appEndpointUsageSummary,
				data: options
			})
		);
		let r = await sys_res.json();
		return r;
	}
};

/**
 * @param {Record<string, unknown>} options
 * @param {string} [token]
 */
export const getTopErrorEndpointsByTime = async (options, token) => {
	let uf = new uFetch();

	if (options) {
		let sys_res = checkStatus(
			await uf.get({
				url: url_paths.getTopErrorEndpointsByTime,
				data: options
			})
		);
		let r = await sys_res.json();
		return r;
	}
};

/**
 * @param {Record<string, unknown>} options
 * @param {string} [token]
 */
export const getTopErrorEndpoints = async (options, token) => {
	let uf = new uFetch();

	if (options) {
		let sys_res = checkStatus(
			await uf.get({
				url: url_paths.getTopErrorEndpoints,
				data: options
			})
		);
		let r = await sys_res.json();
		return r;
	}
};

// ── Internal System Users ──

export const GetSystemUsersList = async () => {
	let uf = new uFetch();
	let request = checkStatus(await uf.get({ url: url_paths.systemUsersList }));
	let users = await request.json();
	return Array.isArray(users) ? users : [];
};

/**
 * @param {JsonBody} data
 */
export const CreateSystemUser = async (data) => {
	let uf = new uFetch();
	let request = checkStatus(await uf.post({ url: url_paths.systemUserCreate, data: data }));
	let result = await request.json();
	return result;
};

/**
 * @param {JsonBody} data
 */
export const UpdateSystemUser = async (data) => {
	let uf = new uFetch();
	let request = checkStatus(await uf.post({ url: url_paths.systemUserUpdate, data: data }));
	let result = await request.json();
	return result;
};

/**
 * @param {JsonBody} data
 */
export const DeleteSystemUser = async (data) => {
	let uf = new uFetch();
	let request = checkStatus(await uf.post({ url: url_paths.systemUserDelete, data: data }));
	let result = await request.json();
	return result;
};

/**
 * @param {JsonBody} data
 * @param {string} [token]
 */
export const ChangeSystemUserPassword = async (data, token) => {
	let uf = new uFetch();
	if (token) uf.setBearerAuthorization(token);
	let request = checkStatus(await uf.post({ url: url_paths.systemUserChangePassword, data: data }));
	let result = await request.json();
	return result;
};

/**
 * @param {JsonBody} data
 */
export const ResetSystemUserPassword = async (data) => {
	let uf = new uFetch();
	let request = checkStatus(await uf.post({ url: url_paths.systemUserResetPassword, data: data }));
	let result = await request.json();
	return result;
};

// ── Audit log (ofapi_audit_log) ────────────────────────────────────────────

/**
 * Lista de eventos de auditoría (vista ligera, sin snapshots before/after).
 * El backend responde { rows, total, offset, limit }.
 * @param {object} options - Filtros: action, entity_type, actor_username, target_username,
 * environment, status, from, to, limit, offset...
 */
export const SearchAuditLogs = async (options = {}) => {
	let uf = new uFetch();
	let request = checkStatus(await uf.get({ url: url_paths.auditLog, data: options }));
	return await request.json();
};

/**
 * Detalle de un evento (incluye before_data/after_data parseados).
 * @param {string|number} id
 */
export const GetAuditLogDetail = async (id) => {
	if (id === undefined || id === null || id === '') return null;
	let uf = new uFetch();
	let request = checkStatus(await uf.get({ url: url_paths.auditLog, data: { id } }));
	return await request.json();
};

/**
 * Resumen de eventos en una ventana de tiempo.
 * @param {{ last_days?: number }} [options]
 */
export const GetAuditLogStats = async (options = {}) => {
	let uf = new uFetch();
	let request = checkStatus(await uf.get({ url: url_paths.auditLogStats, data: options }));
	return await request.json();
};

/**
 * Poda manual de eventos anteriores a la retención configurada.
 * Devuelve { retention_days, pruned, status, cutoff }.
 */
export const PruneAuditLogs = async () => {
	let uf = new uFetch();
	let request = checkStatus(await uf.post({ url: url_paths.auditLogPrune }));
	return await request.json();
};
