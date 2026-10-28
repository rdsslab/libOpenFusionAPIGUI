<script>
	import { Input, PredictiveInput } from '@rdsslab/svelte-components';
	import { createEndpoint } from '../../../../utils/utils.js';

	/**
	 * @typedef {import('../../../../../types/models.js').EndpointRow} EndpointRow
	 * @typedef {import('../../../../../types/models.js').AsyncWrapperConfig} AsyncWrapperConfig
	 * @typedef {import('../../../../../types/models.js').HandlerChangePayload} HandlerChangePayload
	 */

	/**
	 * @type {{
	 *   endpoint: EndpointRow,
	 *   onchange: (data: HandlerChangePayload) => void,
	 *   app: {app?: string, endpoints?: Array<EndpointRow>}
	 * }}
	 */
	let {
		endpoint = $bindable(/** @type {EndpointRow} */ ({})),
		onchange = () => {},
		app = $bindable(/** @type {{app?: string, endpoints?: Array<EndpointRow>}} */ ({}))
	} = $props();

	/** Configuración async del endpoint, creada por `ensureAsyncConfig`. */
	const asyncConfig = $derived(endpoint.custom_data?.async);

	let endpointOptions = $derived.by(() => {
		const list = app?.endpoints || [];
		return list
			.filter((e) => {
				if (!e || !e.idendpoint) return false;
				if (e.handler === 'MCP') return false;
				if (e.handler === 'ASYNC_WRAPPER') return false;
				if (e.handler === 'TELEGRAM_BOT') return false;
				return true;
			})
			.map((e) => ({
				name:
					(() => {
						const method = e.method || '';
						const appName = app?.app || e.app || '';
						const resource = e.resource || e.endpoint || '';
						const env = e.environment || '';
						return `[${method}] ${method == 'WS' ? '/ws/' : '/api/'}${appName}${resource}/${env}`.trim();
					})() || `[${e.method || ''}] ${e.idendpoint}`,
				value: e.idendpoint
			}));
	});

	/**
	 * Garantiza que exista `custom_data.async` y la devuelve.
	 * @returns {AsyncWrapperConfig}
	 */
	function ensureAsyncConfig() {
		if (!endpoint.custom_data) endpoint.custom_data = {};
		const custom_data = endpoint.custom_data;
		if (!custom_data.async) {
			custom_data.async = { ttl_ms: 3600000, max_consumes: 5, notify_ws: false };
		}
		return custom_data.async;
	}

	/**
	 * @param {string} method
	 * @param {string} appName
	 * @param {string} resource
	 * @param {string} environment
	 * @returns {string}
	 */
	function createEndpointUrl(method, appName, resource, environment) {
		try {
			return `${method == 'WS' ? '/ws/' : '/api/'}${appName || ''}${resource || ''}/${environment || ''}`;
		} catch (e) {
			return '';
		}
	}

	/**
	 * @param {EndpointRow|null|undefined} e
	 * @returns {string}
	 */
	function getFullRoute(e) {
		if (!e) return '';
		const method = e.method || '';
		const appName = app?.app || e.app || '';
		const resource = e.resource || e.endpoint || '';
		const env = e.environment || '';
		const full = createEndpointUrl(method, appName, resource, env);
		return `[${method}] ${full}`.trim();
	}

	/**
	 * @param {unknown} baseId
	 */
	function applyBaseEndpoint(baseId) {
		if (!baseId) return;
		const list = app?.endpoints || [];
		const base = list.find((x) => x && x.idendpoint === baseId);
		if (base) {
			endpoint.code = base.idendpoint;
			if (base.method) endpoint.method = base.method;
			const baseResource = base.resource || '';
			const env = base.environment || endpoint.environment || base.environment;
			if (env) endpoint.environment = env;
			if (baseResource.endsWith('/async')) {
				endpoint.resource = baseResource;
			} else if (baseResource) {
				if (env && baseResource.endsWith('/' + env)) {
					const beforeEnv = baseResource.slice(0, -env.length - 1);
					if (beforeEnv.endsWith('/async')) {
						endpoint.resource = baseResource;
					} else {
						endpoint.resource = baseResource.replace('/' + env, '/async/' + env);
					}
				} else {
					endpoint.resource = baseResource + '/async';
				}
			}
			// Refrescar la URL completa (encabezado) inmediatamente
			endpoint.endpoint = createEndpoint(
				endpoint.method || '',
				app?.app || '',
				endpoint.resource || '',
				endpoint.environment || ''
			);
		}
		update();
	}

	$effect(() => {
		ensureAsyncConfig();
		if (endpoint?.code) {
			const list = app?.endpoints || [];
			const base = list.find((x) => x && x.idendpoint === endpoint.code);
			if (base) {
				if (base.method && endpoint.method !== base.method) endpoint.method = base.method;
				const baseResource = base.resource || '';
				const env = base.environment || endpoint.environment;
				if (env && !endpoint.environment) endpoint.environment = env;
				if (baseResource) {
					if (baseResource.endsWith('/async')) {
						if (endpoint.resource !== baseResource) endpoint.resource = baseResource;
					} else if (env && baseResource.endsWith('/' + env)) {
						const beforeEnv = baseResource.slice(0, -env.length - 1);
						if (beforeEnv.endsWith('/async')) {
							if (endpoint.resource !== baseResource) endpoint.resource = baseResource;
						} else {
							const expected = baseResource.replace('/' + env, '/async/' + env);
							if (endpoint.resource !== expected) endpoint.resource = expected;
						}
					} else if (endpoint.resource !== baseResource + '/async') {
						endpoint.resource = baseResource + '/async';
					}
				}
				// Refrescar la URL completa (encabezado) inmediatamente
				endpoint.endpoint = createEndpoint(
					endpoint.method || '',
					app?.app || '',
					endpoint.resource || '',
					endpoint.environment || ''
				);
				update();
			}
		}
	});

	function update() {
		onchange({
			code: endpoint.code,
			custom_data: endpoint.custom_data,
			data_test: endpoint.data_test,
			resource: endpoint.resource,
			method: endpoint.method,
			environment: endpoint.environment,
			endpoint: endpoint.endpoint
		});
	}
</script>

<div class="block">
	<PredictiveInput
		label="Base endpoint"
		placeholder="Select the base endpoint this async wrapper will call"
		classLabel="is-small"
		classInput="is-small"
		options={endpointOptions}
		bind:selectedValue={endpoint.code}
		onselect={(/** @type {{value?: unknown}} */ option) => {
			// Predictive entrega el objeto { name, value }: applyBaseEndpoint espera el id.
			applyBaseEndpoint(option?.value ?? option);
		}}
	/>

	<Input
		label="Base endpoint ID (code)"
		bind:value={endpoint.code}
		placeholder="e.g. c80415fa-1d7b-48c2-93aa-2607fd0f3804"
		readonly
		disabled
	/>

	<div class="columns">
		<div class="column">
			<Input
				label="TTL (ms)"
				type="number"
				value={asyncConfig?.ttl_ms ?? 3600000}
				min="1000"
				step="1000"
				onchange={(/** @type {string} */ value) => {
					ensureAsyncConfig().ttl_ms = Number(value);
					update();
				}}
			/>
		</div>
		<div class="column">
			<Input
				label="Max consumes"
				type="number"
				value={asyncConfig?.max_consumes ?? 5}
				min="1"
				step="1"
				onchange={(/** @type {string} */ value) => {
					ensureAsyncConfig().max_consumes = Number(value);
					update();
				}}
			/>
		</div>
		<div class="column" style="display: flex; align-items: flex-end; padding-bottom: 0.75rem;">
			<label class="checkbox">
				<input
					type="checkbox"
					checked={asyncConfig?.notify_ws ?? false}
					onchange={(event) => {
						ensureAsyncConfig().notify_ws = event.currentTarget.checked;
						update();
					}}
				/>
				<span>Notify via WebSocket</span>
			</label>
		</div>
	</div>
</div>
