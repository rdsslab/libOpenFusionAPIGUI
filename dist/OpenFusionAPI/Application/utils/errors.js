/**
 * Normaliza los errores capturados en `catch` (que TypeScript tipa como `unknown`).
 */

/**
 * Devuelve un mensaje legible para cualquier valor lanzado.
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error) {
	if (error instanceof Error) return error.message;
	if (typeof error === 'string') return error;
	if (error && typeof error === 'object' && 'message' in error) {
		const message = /** @type {{ message?: unknown }} */ (error).message;
		if (typeof message === 'string') return message;
		if (message != null) return String(message);
	}
	return String(error);
}

/**
 * `true` si el valor es un error de tipo `Error`.
 * @param {unknown} error
 * @returns {error is Error}
 */
export function isError(error) {
	return error instanceof Error;
}
