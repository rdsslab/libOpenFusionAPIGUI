export const listAccessMethod: {
    value: string;
    id: number;
}[];
export namespace listHTTPMethods {
    namespace GET {
        let color: string;
        let icon: string;
    }
    namespace POST {
        let color_1: string;
        export { color_1 as color };
        let icon_1: string;
        export { icon_1 as icon };
    }
    namespace DELETE {
        let color_2: string;
        export { color_2 as color };
        let icon_2: string;
        export { icon_2 as icon };
    }
    namespace PUT {
        let color_3: string;
        export { color_3 as color };
        let icon_3: string;
        export { icon_3 as icon };
    }
    namespace WS {
        let color_4: string;
        export { color_4 as color };
        let icon_4: string;
        export { icon_4 as icon };
    }
}
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
    let idapp: any;
    let app: string;
    let rowkey: number;
    let iduser: any;
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
        let users: any[];
        let log: {};
    }
    export let resource: string;
    export let code: string;
    let idapp_1: number;
    export { idapp_1 as idapp };
    let description_1: string;
    export { description_1 as description };
    export let idendpoint: number;
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
        let headers: {};
        namespace auth {
            let selection_1: number;
            export { selection_1 as selection };
        }
    }
    export let latest_updater: any;
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
    }
}
export function defaultValuesIntervalTask(task: any): any;
export function defaultValuesBot(bot: any): any;
export namespace BotRuntimeStatus {
    namespace STOPPED {
        export let label: string;
        let color_5: string;
        export { color_5 as color };
        export let background: string;
        let icon_5: string;
        export { icon_5 as icon };
        export let needsAction: boolean;
        let description_2: string;
        export { description_2 as description };
    }
    namespace STARTING {
        let label_1: string;
        export { label_1 as label };
        let color_6: string;
        export { color_6 as color };
        let background_1: string;
        export { background_1 as background };
        let icon_6: string;
        export { icon_6 as icon };
        let needsAction_1: boolean;
        export { needsAction_1 as needsAction };
        let description_3: string;
        export { description_3 as description };
    }
    namespace RUNNING {
        let label_2: string;
        export { label_2 as label };
        let color_7: string;
        export { color_7 as color };
        let background_2: string;
        export { background_2 as background };
        let icon_7: string;
        export { icon_7 as icon };
        let needsAction_2: boolean;
        export { needsAction_2 as needsAction };
        let description_4: string;
        export { description_4 as description };
    }
    namespace BACKOFF {
        let label_3: string;
        export { label_3 as label };
        let color_8: string;
        export { color_8 as color };
        let background_3: string;
        export { background_3 as background };
        let icon_8: string;
        export { icon_8 as icon };
        let needsAction_3: boolean;
        export { needsAction_3 as needsAction };
        let description_5: string;
        export { description_5 as description };
    }
    namespace QUARANTINED {
        let label_4: string;
        export { label_4 as label };
        let color_9: string;
        export { color_9 as color };
        let background_4: string;
        export { background_4 as background };
        let icon_9: string;
        export { icon_9 as icon };
        let needsAction_4: boolean;
        export { needsAction_4 as needsAction };
        let description_6: string;
        export { description_6 as description };
    }
    namespace DISABLED_ERROR {
        let label_5: string;
        export { label_5 as label };
        let color_10: string;
        export { color_10 as color };
        let background_5: string;
        export { background_5 as background };
        let icon_10: string;
        export { icon_10 as icon };
        let needsAction_5: boolean;
        export { needsAction_5 as needsAction };
        let description_7: string;
        export { description_7 as description };
    }
}
export namespace BotRuntimeStatusFallback { }
/**
 * Campos de `ofapi_bot` que escribe el runtime, no el usuario. La interfaz los muestra
 * pero nunca los reenvía al guardar: hacerlo sobrescribiría el estado observado con una
 * copia vieja tomada al abrir el editor.
 */
export const BOT_RUNTIME_FIELDS: string[];
