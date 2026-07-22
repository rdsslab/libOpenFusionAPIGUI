/**
 * Decodifica el payload de un JWT (sin verificar firma) y calcula
 * cuántos minutos faltan para que expire.
 *
 * @param {string} token
 * @returns {number} Minutos restantes hasta expiración (negativo si ya expiró)
 */
export function getJwtExpiresInMinutes(token) {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return -1;

		const payload = JSON.parse(atob(parts[1]));
		if (!payload.exp) return Infinity; // Sin campo exp: no expira

		const nowSeconds = Date.now() / 1000;
		return (payload.exp - nowSeconds) / 60;
	} catch {
		return -1;
	}
}

/**
 * Retorna true si el token está a `thresholdMinutes` minutos o menos de expirar.
 *
 * @param {string} token
 * @param {number} thresholdMinutes - Default: 5 minutos
 * @returns {boolean}
 */
export function isJwtExpiringSoon(token, thresholdMinutes = 5) {
	const minutesLeft = getJwtExpiresInMinutes(token);
	return minutesLeft >= 0 && minutesLeft <= thresholdMinutes;
}

/**
 * Formatea una cantidad de minutos en texto legible para el usuario.
 * Muestra minutos y segundos cuando el tiempo es menor a 2 minutos.
 *
 * @param {number} minutes
 * @returns {string}
 */
export function formatJwtTimeLeft(minutes) {
	if (!Number.isFinite(minutes) || minutes <= 0) {
		return 'menos de 1 minuto';
	}

	const wholeMinutes = Math.floor(minutes);
	const seconds = Math.floor((minutes - wholeMinutes) * 60);

	if (wholeMinutes === 0) {
		return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
	}

	if (wholeMinutes < 2 && seconds > 0) {
		return `${wholeMinutes} minuto y ${seconds} segundo${seconds !== 1 ? 's' : ''}`;
	}

	return `${wholeMinutes} minuto${wholeMinutes !== 1 ? 's' : ''}`;
}

/**
 * Escribe en consola los datos de expiración del JWT para diagnóstico.
 * No muestra notificaciones visibles al usuario.
 *
 * @param {string} token
 */
export function logJwtExpiration(token) {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return;

		const payload = JSON.parse(atob(parts[1]));
		if (!payload.exp) return;

		const nowSeconds = Date.now() / 1000;
		const diffSeconds = payload.exp - nowSeconds;

		console.debug('[JWT] expiración:', {
			exp: payload.exp,
			now: Math.floor(nowSeconds),
			secondsLeft: Math.floor(diffSeconds),
			minutesLeft: Number((diffSeconds / 60).toFixed(2))
		});
	} catch {
		// Silencioso en producción
	}
}
