/**
 * Emite eventos de autenticación globales.
 * Valores posibles:
 *   null
 *   { type: 'unauthorized' }
 *   { type: 'token_expiring', minutesLeft: number }
 */
export const authEventStore: import("svelte/store").Writable<any>;
export const userStore: import("svelte/store").Writable<{}>;
export const statusSystemEndpointsStore: import("svelte/store").Writable<{}>;
export const listMethodStore: import("svelte/store").Writable<{}>;
export const listHandlerStore: import("svelte/store").Writable<any[]>;
export const listFunctionStoreDev: import("svelte/store").Writable<{}>;
export const listFunctionStoreQA: import("svelte/store").Writable<{}>;
export const listFunctionStorePRD: import("svelte/store").Writable<{}>;
export const listAppVars: import("svelte/store").Writable<{}>;
export const storeCacheSize: import("svelte/store").Writable<{}>;
export const storeUsersList: import("svelte/store").Writable<{}>;
export const storeCountResponseStatusCode: import("svelte/store").Writable<{}>;
export const storeEndpointOnStart: import("svelte/store").Writable<{}>;
export const storeEndpointOnComplete: import("svelte/store").Writable<{}>;
export const storeServerDynamicInformation: import("svelte/store").Writable<{}>;
export const storeServerModelChanged: import("svelte/store").Writable<{}>;
/**
 * Última novedad publicada por el planificador de tareas: se emite al iniciar y al
 * terminar cada ejecución, para que la tabla de interval tasks refleje el estado sin
 * necesidad de recargar.
 */
export const storeIntervalTaskEvent: import("svelte/store").Writable<any>;
/**
 * Cambio de estado runtime de un bot (bot_status_changed).
 * Contiene { idbot, idapp, runtime_status, failure_count, ... } para que la tabla
 * y el editor de bots actualicen sin recarga.
 */
export const storeBotStatusChanged: import("svelte/store").Writable<any>;
/**
 * Cambio estructural en la tabla de bots (bot_changed): alta, edición o borrado.
 * Contiene { idbot, idapp, action } para que la lista se recargue.
 */
export const storeBotChanged: import("svelte/store").Writable<any>;
