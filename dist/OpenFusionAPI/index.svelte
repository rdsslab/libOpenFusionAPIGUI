<script>
	import { onMount } from 'svelte';
	import Login from './login/index.svelte';
	import Application from './Application/index.svelte';
	import { Notify } from '@rdsslab/svelte-components';
	import { get } from 'svelte/store';
	import { userStore, authEventStore } from './Application/utils/stores.js';
	import {
		isJwtExpiringSoon,
		getJwtExpiresInMinutes,
		logJwtExpiration
	} from './Application/utils/jwtUtils.js';

	let page = $state('login');
	let sessionExpired = $state(false);
	let failedLogins = $state(0);

	// Flag para evitar mostrar el aviso de expiración múltiples veces seguidas
	let tokenExpiryWarningShown = false;
	/** @type {ReturnType<typeof setInterval> | null} */
	let jwtWatcherInterval = null;

	/**
	 * Suscripción reactiva al store de eventos de autenticación.
	 * Detecta errores 401 y muestra la notificación correspondiente.
	 */
	$effect(() => {
		const unsubscribe = authEventStore.subscribe((event) => {
			if (!event) return;

			if (event.type === 'unauthorized') {
				// Reset del store para no repetir el mensaje
				authEventStore.set(null);

				if (page === 'main') {
					sessionExpired = true;
					failedLogins = 0;
				} else {
					// Volver a la pantalla de login
					page = 'login';
				}
			}
		});

		return () => unsubscribe();
	});

	/**
	 * Inicia el watcher periódico que revisa si el JWT está próximo a expirar.
	 * Se ejecuta cada 30 segundos. Muestra alerta si quedan ≤5 minutos, y la cierra
	 * automáticamente después de 2 minutos (duration: 120000 ms).
	 */
	function startJwtWatcher() {
		stopJwtWatcher();
		tokenExpiryWarningShown = false;

		jwtWatcherInterval = setInterval(() => {
			const userData = /** @type {any} */ (get(userStore));
			const token = userData?.token;

			if (!token) return;

			logJwtExpiration(token);

			const minutesLeft = getJwtExpiresInMinutes(token);

			if (minutesLeft <= 0) {
				if (page === 'main' && !sessionExpired) {
					sessionExpired = true;
					failedLogins = 0;
				}
			} else if (isJwtExpiringSoon(token, 5) && !tokenExpiryWarningShown) {
				tokenExpiryWarningShown = true;

				Notify.push({
					message: `⚠️ Tu sesión expirará en aproximadamente ${Math.floor(minutesLeft)} minuto${Math.floor(minutesLeft) !== 1 ? 's' : ''}. Guarda tu trabajo.`,
					color: 'warning',
					duration: 120000 // 2 minutos
				});
			}

			// Resetear el flag cuando el token ya expiró o queda más de 5 min
			if (!isJwtExpiringSoon(token, 5)) {
				tokenExpiryWarningShown = false;
			}
		}, 30000); // Revisa cada 30 segundos
	}

	function stopJwtWatcher() {
		if (jwtWatcherInterval !== null) {
			clearInterval(jwtWatcherInterval);
			jwtWatcherInterval = null;
		}
	}

	onMount(() => {
		return () => stopJwtWatcher();
	});
</script>

<Notify></Notify>

{#if page === 'main'}
	<Application
		onexit={() => {
			stopJwtWatcher();
			page = 'login';
		}}
	/>
	{#if sessionExpired}
		<div class="overlay-container">
			<Login
				isOverlay={true}
				onlogin={(login) => {
					if (login && login.login) {
						sessionExpired = false;
						failedLogins = 0;
						startJwtWatcher();
					}
				}}
				onfail={() => {
					failedLogins++;
					if (failedLogins >= 3) {
						sessionExpired = false;
						page = 'login';
						failedLogins = 0;
					}
				}}
			/>
		</div>
	{/if}
{:else}
	<Login
		onlogin={(login) => {
			console.log('LOGIN', login);
			if (login && login.login) {
				page = 'main';
				startJwtWatcher();
			} else {
				page = 'login';
			}
		}}
	/>
{/if}

<style>
	.overlay-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
	}
</style>
