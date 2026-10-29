/**
 * Actualiza el `ctrl` del usuario en sesión con el valor vigente en la BD.
 * Crea un nuevo objeto `user` para disparar la reactividad de los `$derived`
 * (menús y permisos) sin cambiar el token ni la sesión.
 *
 * @param {Array<{username?: string, ctrl?: object}>} users - Lista de System Users.
 */
export function syncCurrentUserCtrl(users: Array<{
    username?: string;
    ctrl?: object;
}>): void;
/**
 * @typedef {import('../../types/models.js').SessionState} SessionState
 * @typedef {import('../../types/models.js').SystemEndpointsStatus} SystemEndpointsStatus
 * @typedef {import('../../types/models.js').ServerModelChangedEvent} ServerModelChangedEvent
 * @typedef {import('../../types/models.js').IntervalTaskEvent} IntervalTaskEvent
 * @typedef {import('../../types/models.js').AsyncJobChangedEvent} AsyncJobChangedEvent
 * @typedef {import('../../types/models.js').BotStatusChangedEvent} BotStatusChangedEvent
 * @typedef {import('../../types/models.js').BotChangedEvent} BotChangedEvent
 * @typedef {import('../../types/models.js').SelectOption} SelectOption
 * @typedef {import('../../types/models.js').AppVarRow} AppVarRow
 */
/**
 * Emite eventos de autenticación globales.
 * Valores posibles:
 *   null
 *   { type: 'unauthorized' }
 *   { type: 'token_expiring', minutesLeft: number }
 * @type {import('svelte/store').Writable<{type: string, minutesLeft?: number}|null>}
 */
export const authEventStore: import("svelte/store").Writable<{
    type: string;
    minutesLeft?: number;
} | null>;
/** @type {import('svelte/store').Writable<SessionState>} */
export const userStore: import("svelte/store").Writable<SessionState>;
/** @type {import('svelte/store').Writable<SystemEndpointsStatus>} */
export const statusSystemEndpointsStore: import("svelte/store").Writable<SystemEndpointsStatus>;
/** @type {import('svelte/store').Writable<Array<{id: string, value: string, enabled?: boolean, description?: string}>>} */
export const listMethodStore: import("svelte/store").Writable<Array<{
    id: string;
    value: string;
    enabled?: boolean;
    description?: string;
}>>;
/** @type {import('svelte/store').Writable<Array<{id: string, value: string|number, enabled?: boolean, description?: string, css_class?: string, css_icon?: string, modules?: unknown}>>} */
export const listHandlerStore: import("svelte/store").Writable<Array<{
    id: string;
    value: string | number;
    enabled?: boolean;
    description?: string;
    css_class?: string;
    css_icon?: string;
    modules?: unknown;
}>>;
/** @type {import('svelte/store').Writable<Array<{id: string, value: string|number}>>} */
export const listFunctionStoreDev: import("svelte/store").Writable<Array<{
    id: string;
    value: string | number;
}>>;
/** @type {import('svelte/store').Writable<Array<{id: string, value: string|number}>>} */
export const listFunctionStoreQA: import("svelte/store").Writable<Array<{
    id: string;
    value: string | number;
}>>;
/** @type {import('svelte/store').Writable<Array<{id: string, value: string|number}>>} */
export const listFunctionStorePRD: import("svelte/store").Writable<Array<{
    id: string;
    value: string | number;
}>>;
/** @type {import('svelte/store').Writable<Array<AppVarRow>>} */
export const listAppVars: import("svelte/store").Writable<Array<AppVarRow>>;
/** @type {import('svelte/store').Writable<Record<string, number>>} */
export const storeCacheSize: import("svelte/store").Writable<Record<string, number>>;
/** @type {import('svelte/store').Writable<Array<Record<string, unknown>>>} */
export const storeUsersList: import("svelte/store").Writable<Array<Record<string, unknown>>>;
/** @type {import('svelte/store').Writable<Record<string, Record<string, number>>>} */
export const storeCountResponseStatusCode: import("svelte/store").Writable<Record<string, Record<string, number>>>;
/** @type {import('svelte/store').Writable<Record<string, unknown>>} */
export const storeEndpointOnStart: import("svelte/store").Writable<Record<string, unknown>>;
/** @type {import('svelte/store').Writable<Record<string, unknown>>} */
export const storeEndpointOnComplete: import("svelte/store").Writable<Record<string, unknown>>;
/** @type {import('svelte/store').Writable<Record<string, unknown>>} */
export const storeServerDynamicInformation: import("svelte/store").Writable<Record<string, unknown>>;
/** @type {import('svelte/store').Writable<ServerModelChangedEvent>} */
export const storeServerModelChanged: import("svelte/store").Writable<ServerModelChangedEvent>;
/**
 * Última novedad publicada por el planificador de tareas: se emite al iniciar y al
 * terminar cada ejecución, para que la tabla de interval tasks refleje el estado sin
 * necesidad de recargar.
 * @type {import('svelte/store').Writable<IntervalTaskEvent|null>}
 */
export const storeIntervalTaskEvent: import("svelte/store").Writable<IntervalTaskEvent | null>;
/**
 * Cambio en la tabla `ofapi_async_jobs` (databaseHook): la GUI recibe un
 * evento por cada create/update/destroy que el ASYNC_WRAPPER hace sobre una
 * petición en segundo plano, para que Async Requests se actualice en vivo.
 * @type {import('svelte/store').Writable<AsyncJobChangedEvent|null>}
 */
export const storeAsyncJobChanged: import("svelte/store").Writable<AsyncJobChangedEvent | null>;
/**
 * Cambio de estado runtime de un bot (bot_status_changed).
 * Contiene { idbot, idapp, runtime_status, failure_count, ... } para que la tabla
 * y el editor de bots actualicen sin recarga.
 * @type {import('svelte/store').Writable<BotStatusChangedEvent|null>}
 */
export const storeBotStatusChanged: import("svelte/store").Writable<BotStatusChangedEvent | null>;
/**
 * Cambio estructural en la tabla de bots (bot_changed): alta, edición o borrado.
 * Contiene { idbot, idapp, action } para que la lista se recargue.
 * @type {import('svelte/store').Writable<BotChangedEvent|null>}
 */
export const storeBotChanged: import("svelte/store").Writable<BotChangedEvent | null>;
/**
 * Lista de usuarios internos del sistema (System Users).
 * @type {import('svelte/store').Writable<Array<import('../../types/models.js').SystemUserRow>>}
 */
export const storeSystemUsersList: import("svelte/store").Writable<Array<import("../../types/models.js").SystemUserRow>>;
export type SessionState = import("../../types/models.js").SessionState;
export type SystemEndpointsStatus = import("../../types/models.js").SystemEndpointsStatus;
export type ServerModelChangedEvent = import("../../types/models.js").ServerModelChangedEvent;
export type IntervalTaskEvent = import("../../types/models.js").IntervalTaskEvent;
export type AsyncJobChangedEvent = import("../../types/models.js").AsyncJobChangedEvent;
export type BotStatusChangedEvent = import("../../types/models.js").BotStatusChangedEvent;
export type BotChangedEvent = import("../../types/models.js").BotChangedEvent;
export type SelectOption = import("../../types/models.js").SelectOption;
export type AppVarRow = import("../../types/models.js").AppVarRow;
