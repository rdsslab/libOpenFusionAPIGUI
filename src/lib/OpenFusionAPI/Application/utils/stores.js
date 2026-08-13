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
