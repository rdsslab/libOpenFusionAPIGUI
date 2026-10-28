/**
 * `status` conserva el resultado de la última corrida cuando esta termina. Para mostrar
 * el estado operativo actual, toda tarea que no esté ejecutándose vuelve a Waiting.
 */
/**
 * @param {number|string|null|undefined} value
 * @returns {StatusMeta}
 */
export function getIntervalTaskRuntimeStatus(value: number | string | null | undefined): StatusMeta;
/**
 * Resultado de la última ejecución, separado del estado operativo actual. El payload
 * permite corregir corridas antiguas que se guardaron como OK pese a `success: false`.
 */
/**
 * @param {number|string|null|undefined} value
 * @param {unknown} response
 * @returns {StatusMeta|null}
 */
export function getIntervalTaskLastResultStatus(value: number | string | null | undefined, response: unknown): StatusMeta | null;
/** Devuelve el estado de suspensión, o `null` si el planificador no la suspendió. */
/**
 * @param {Partial<IntervalTaskRow>|null|undefined} task
 * @returns {StatusMeta|null}
 */
export function getIntervalTaskSuspensionStatus(task: Partial<IntervalTaskRow> | null | undefined): StatusMeta | null;
/** `true` cuando la tarea está suspendida por el planificador (no por el usuario). */
/**
 * @param {Partial<IntervalTaskRow>|null|undefined} task
 * @returns {boolean}
 */
export function isIntervalTaskSuspended(task: Partial<IntervalTaskRow> | null | undefined): boolean;
/**
 * @typedef {import('../../types/models.js').IntervalTaskRow} IntervalTaskRow
 * @typedef {import('../../types/models.js').BotRow} BotRow
 * @typedef {{label: string, background: string, icon: string, description: string}} StatusMeta
 */
/** @type {Array<{value: string, id: number}>} */
export const listAccessMethod: Array<{
    value: string;
    id: number;
}>;
/** @type {Record<string, {color: string, icon: string}>} */
export const listHTTPMethods: Record<string, {
    color: string;
    icon: string;
}>;
export const Environment: {
    id: string;
    value: string;
    color: string;
    background: string;
    icon: string;
}[];
export namespace defaultApp {
    namespace vars {
        let dev: {};
        let qa: {};
        let prd: {};
    }
    let params: {};
    let idapp: undefined;
    let app: string;
    let rowkey: number;
    let iduser: null;
    let enabled: boolean;
    let description: string;
}
export namespace defaultEndpoint {
    let enabled_1: boolean;
    export { enabled_1 as enabled };
    export let endpoint: string;
    export let access: number;
    export let method: string;
    export let handler: string;
    export let mcp: {};
    export let cache_time: number;
    export namespace ctrl {
        let admin: boolean;
        let users: never[];
        let log: {};
    }
    export let resource: string;
    export let code: string;
    let idapp_1: string;
    export { idapp_1 as idapp };
    let description_1: string;
    export { description_1 as description };
    export let idendpoint: string;
    export let cors: {};
    export let headers_test: {};
    export namespace data_test {
        let query: {
            enabled: boolean;
            key: string;
            value: string;
        }[];
        namespace body {
            let selection: number;
        }
        let headers: never[];
        namespace auth {
            let selection_1: number;
            export { selection_1 as selection };
        }
    }
    export let latest_updater: null;
    export let environment: string;
    export namespace json_schema {
        export namespace _in {
            let enabled_2: boolean;
            export { enabled_2 as enabled };
            export namespace schema {
                let type: string;
                let properties: {};
                let additionalProperties: boolean;
            }
        }
        export { _in as in };
        export namespace out {
            let enabled_3: boolean;
            export { enabled_3 as enabled };
            export namespace schema_1 {
                let type_1: string;
                export { type_1 as type };
                let properties_1: {};
                export { properties_1 as properties };
                let additionalProperties_1: boolean;
                export { additionalProperties_1 as additionalProperties };
            }
            export { schema_1 as schema };
        }
        export let custom_data: {};
        export let docs: string;
        export let title: string;
        export let keywords: string;
        export let timeout: number;
        export let price_by_request: number;
        export let price_kb_request: number;
        export let price_kb_response: number;
    }
}
export function defaultValuesIntervalTask(task: Partial<IntervalTaskRow> | null | undefined): IntervalTaskRow;
/**
 * Estados que el planificador escribe en `status`. La tabla y el editor muestran la
 * etiqueta, nunca el número: un "3" no le dice nada a quien administra las tareas.
 */
/** @type {Record<number, StatusMeta>} */
export const IntervalTaskStatus: Record<number, StatusMeta>;
/** @type {StatusMeta} */
export const IntervalTaskStatusFallback: StatusMeta;
/**
 * Suspensión del planificador. Cuando una tarea agota `max_failed_attempts` el servidor
 * deja de programarla SIN apagar `enabled`: esa bandera es la intención del usuario y se
 * conserva. Lo que cambia es `disabled_by`, que pasa a `'system'`. Por eso es un estado
 * distinto de "Unabled" y merece su propia etiqueta: el usuario quiere que corra, pero
 * no correrá hasta que se corrija la causa y se reinicien los intentos.
 */
/** @type {StatusMeta} */
export const IntervalTaskSuspendedStatus: StatusMeta;
/**
 * Campos de `ofapi_intervaltask` que escribe el planificador, no el usuario. El editor
 * los muestra como solo lectura y no los reenvía al guardar.
 */
export const INTERVAL_TASK_RUNTIME_FIELDS: string[];
export function defaultValuesBot(bot: Partial<BotRow> | null | undefined): BotRow;
/**
 * Estado observado del runtime de un bot (columna `runtime_status` de `ofapi_bot`).
 *
 * Es distinto de `enabled`: `enabled` es la INTENCIÓN del usuario ("este bot debe correr")
 * y `runtime_status` es lo que realmente está pasando. El servidor nunca apaga un bot por
 * un fallo recuperable —red, DNS, 429 o 5xx del proveedor—: lo reintenta con backoff y
 * luego lo pone en cuarentena sondeando indefinidamente, así que un bot en BACKOFF o
 * QUARANTINED se recupera solo y NO requiere que nadie lo toque. Por eso cada estado
 * declara `needsAction`: es lo que decide si la interfaz debe alarmar o tranquilizar.
 */
/** @type {Record<string, StatusMeta & {color: string, needsAction: boolean}>} */
export const BotRuntimeStatus: Record<string, StatusMeta & {
    color: string;
    needsAction: boolean;
}>;
/** Estado a mostrar cuando el servidor todavía no reportó ninguno. */
export const BotRuntimeStatusFallback: StatusMeta & {
    color: string;
    needsAction: boolean;
};
/**
 * Campos de `ofapi_bot` que escribe el runtime, no el usuario. La interfaz los muestra
 * pero nunca los reenvía al guardar: hacerlo sobrescribiría el estado observado con una
 * copia vieja tomada al abrir el editor.
 */
export const BOT_RUNTIME_FIELDS: string[];
export type IntervalTaskRow = import("../../types/models.js").IntervalTaskRow;
export type BotRow = import("../../types/models.js").BotRow;
export type StatusMeta = {
    label: string;
    background: string;
    icon: string;
    description: string;
};
