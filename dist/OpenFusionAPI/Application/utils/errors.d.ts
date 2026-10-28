/**
 * Normaliza los errores capturados en `catch` (que TypeScript tipa como `unknown`).
 */
/**
 * Devuelve un mensaje legible para cualquier valor lanzado.
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error: unknown): string;
/**
 * `true` si el valor es un error de tipo `Error`.
 * @param {unknown} error
 * @returns {error is Error}
 */
export function isError(error: unknown): error is Error;
