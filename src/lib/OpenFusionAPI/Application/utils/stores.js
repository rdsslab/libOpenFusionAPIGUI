import { writable } from 'svelte/store';

/**
 * Emite eventos de autenticación globales.
 * Valores posibles:
 *   null
 *   { type: 'unauthorized' }
 *   { type: 'token_expiring', minutesLeft: number }
 */
export const authEventStore = writable(null);

export const userStore = writable({});
export const statusSystemEndpointsStore = writable({});
export const listMethodStore = writable({});
export const listHandlerStore = writable([]);
export const listFunctionStoreDev = writable({});
export const listFunctionStoreQA = writable({});
export const listFunctionStorePRD = writable({});
export const listAppVars = writable({});
export const storeCacheSize = writable({});
export const storeUsersList = writable({});
export const storeCountResponseStatusCode = writable({});
export const storeEndpointOnStart = writable({});
export const storeEndpointOnComplete = writable({});
export const storeServerDynamicInformation = writable({});
export const storeServerModelChanged = writable({});

/**
 * Última novedad publicada por el planificador de tareas: se emite al iniciar y al
 * terminar cada ejecución, para que la tabla de interval tasks refleje el estado sin
 * necesidad de recargar.
 */
export const storeIntervalTaskEvent = writable(null);

/**
 * Cambio de estado runtime de un bot (bot_status_changed).
 * Contiene { idbot, idapp, runtime_status, failure_count, ... } para que la tabla
 * y el editor de bots actualicen sin recarga.
 */
export const storeBotStatusChanged = writable(null);

/**
 * Cambio estructural en la tabla de bots (bot_changed): alta, edición o borrado.
 * Contiene { idbot, idapp, action } para que la lista se recargue.
 */
export const storeBotChanged = writable(null);

/**
 * Lista de usuarios internos del sistema (System Users).
 */
export const storeSystemUsersList = writable([]);

/**
 * Actualiza el `ctrl` del usuario en sesión con el valor vigente en la BD.
 * Crea un nuevo objeto `user` para disparar la reactividad de los `$derived`
 * (menús y permisos) sin cambiar el token ni la sesión.
 *
 * @param {Array<{username: string, ctrl?: object}>} users - Lista de System Users.
 */
export function syncCurrentUserCtrl(users) {
	if (!Array.isArray(users) || users.length === 0) return;

	userStore.update((state) => {
		const curr = state?.user;
		if (!curr?.username) return state;

		const row = users.find((u) => u.username === curr.username);
		if (!row || row.ctrl == null || typeof row.ctrl !== 'object') return state;

		return {
			...state,
			user: { ...curr, ctrl: JSON.parse(JSON.stringify(row.ctrl)) }
		};
	});
}
