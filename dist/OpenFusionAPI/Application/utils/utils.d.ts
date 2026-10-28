/**
 * @param {string} method
 * @param {string} app
 * @param {string} resource
 * @param {string} environment
 * @returns {string}
 */
export function createEndpoint(method: string, app: string, resource: string, environment: string): string;
/**
 * @param {string} string_url
 */
/**
 * @param {string} string_url
 * @returns {boolean}
 */
export function validateURL(string_url: string): boolean;
export function ensureDataTestShape(data_test: Partial<DataTest> | null | undefined): DataTest;
export function getHandlerParams(handler: string): HandlerParam | undefined;
export function isNewApp(idapp: unknown): boolean;
export function equalObjs(value: unknown, new_value: unknown): boolean;
export function jsonToHtmlString(obj: unknown): string;
export function TimeOutChangeValue(idTimeout: ReturnType<typeof setTimeout> | undefined, fn_handler: () => void, timeout?: number): ReturnType<typeof setTimeout>;
export function defaultValuesEndpointRow(row?: EndpointRow | null): EndpointRow;
export function mergeSourceOverwrite<T extends object>(target: T, source: unknown): T;
export type DataTest = import("../../types/models.js").DataTest;
export type EndpointRow = import("../../types/models.js").EndpointRow;
export type HandlerParam = {
    id?: string | undefined;
    label?: string | undefined;
    value?: string | number | undefined;
    enabled?: boolean | undefined;
    description?: string | undefined;
    css_class?: string | undefined;
    css_icon?: string | undefined;
    modules?: unknown;
};
