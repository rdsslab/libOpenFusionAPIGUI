import { writable } from 'svelte/store';

/**
 * @typedef {import('#lib/OpenFusionAPI/types/models.js').SessionState} SessionState
 * @typedef {import('#lib/OpenFusionAPI/types/models.js').SystemEndpointsStatus} SystemEndpointsStatus
 * @typedef {import('#lib/OpenFusionAPI/types/models.js').ServerModelChangedEvent} ServerModelChangedEvent
 * @typedef {import('#lib/OpenFusionAPI/types/models.js').IntervalTaskEvent} IntervalTaskEvent
 * @typedef {import('#lib/OpenFusionAPI/types/models.js').BotStatusChangedEvent} BotStatusChangedEvent
 * @typedef {import('#lib/OpenFusionAPI/types/models.js').BotChangedEvent} BotChangedEvent
 * @typedef {import('#lib/OpenFusionAPI/types/models.js').SelectOption} SelectOption
 * @typedef {import('#lib/OpenFusionAPI/types/models.js').AppVarRow} AppVarRow
 */

/**
 * Emite eventos de autenticación globales.
 * Valores posibles:
 *   null
 *   { type: 'unauthorized' }
 *   { type: 'token_expiring', minutesLeft: number }
 * @type {import('svelte/store').Writable<{type: string, minutesLeft?: number}|null>}
 */
export const authEventStore = writable(null);

/** @type {import('svelte/store').Writable<SessionState>} */
export const userStore = writable({});

/** @type {import('svelte/store').Writable<SystemEndpointsStatus>} */
export const statusSystemEndpointsStore = writable({});

/** @type {import('svelte/store').Writable<Array<{id: string, value: string, enabled?: boolean, description?: string}>>} */
export const listMethodStore = writable([]);

/** @type {import('svelte/store').Writable<Array<{id: string, value: string|number, enabled?: boolean, description?: string, css_class?: string, css_icon?: string, modules?: unknown}>>} */
export const listHandlerStore = writable([]);

/** @type {import('svelte/store').Writable<Array<{id: string, value: string|number}>>} */
export const listFunctionStoreDev = writable([]);

/** @type {import('svelte/store').Writable<Array<{id: string, value: string|number}>>} */
export const listFunctionStoreQA = writable([]);

/** @type {import('svelte/store').Writable<Array<{id: string, value: string|number}>>} */
export const listFunctionStorePRD = writable([]);

/** @type {import('svelte/store').Writable<Array<AppVarRow>>} */
export const listAppVars = writable([]);

/** @type {import('svelte/store').Writable<Record<string, number>>} */
export const storeCacheSize = writable({});

/** @type {import('svelte/store').Writable<Array<Record<string, unknown>>>} */
export const storeUsersList = writable([]);

/** @type {import('svelte/store').Writable<Record<string, Record<string, number>>>} */
export const storeCountResponseStatusCode = writable({});

/** @type {import('svelte/store').Writable<Record<string, unknown>>} */
export const storeEndpointOnStart = writable({});

/** @type {import('svelte/store').Writable<Record<string, unknown>>} */
export const storeEndpointOnComplete = writable({});

/** @type {import('svelte/store').Writable<Record<string, unknown>>} */
export const storeServerDynamicInformation = writable({});

/** @type {import('svelte/store').Writable<ServerModelChangedEvent>} */
export const storeServerModelChanged = writable({});

/**
 * Última novedad publicada por el planificador de tareas: se emite al iniciar y al
 * terminar cada ejecución, para que la tabla de interval tasks refleje el estado sin
 * necesidad de recargar.
 * @type {import('svelte/store').Writable<IntervalTaskEvent|null>}
 */
export const storeIntervalTaskEvent = writable(null);

/**
 * Cambio de estado runtime de un bot (bot_status_changed).
 * Contiene { idbot, idapp, runtime_status, failure_count, ... } para que la tabla
 * y el editor de bots actualicen sin recarga.
 * @type {import('svelte/store').Writable<BotStatusChangedEvent|null>}
 */
export const storeBotStatusChanged = writable(null);

/**
 * Cambio estructural en la tabla de bots (bot_changed): alta, edición o borrado.
 * Contiene { idbot, idapp, action } para que la lista se recargue.
 * @type {import('svelte/store').Writable<BotChangedEvent|null>}
 */
export const storeBotChanged = writable(null);

/**
 * Lista de usuarios internos del sistema (System Users).
 * @type {import('svelte/store').Writable<Array<import('#lib/OpenFusionAPI/types/models.js').SystemUserRow>>}
 */
export const storeSystemUsersList = writable([]);

/**
 * Actualiza el `ctrl` del usuario en sesión con el valor vigente en la BD.
 * Crea un nuevo objeto `user` para disparar la reactividad de los `$derived`
 * (menús y permisos) sin cambiar el token ni la sesión.
 *
 * @param {Array<{username?: string, ctrl?: object}>} users - Lista de System Users.
 */
export function syncCurrentUserCtrl(users) {
	if (!Array.isArray(users) || users.length === 0) return;

	userStore.update((state) => {
		const curr = state.user;
		if (!curr?.username) return state;

		const row = users.find((u) => u.username === curr.username);
		if (!row || row.ctrl == null || typeof row.ctrl !== 'object') return state;

		return {
			...state,
			user: {
				...curr,
				ctrl: /** @type {import('#lib/OpenFusionAPI/types/models.js').UserCtrl} */ (
					JSON.parse(JSON.stringify(row.ctrl))
				)
			}
		};
	});
}
