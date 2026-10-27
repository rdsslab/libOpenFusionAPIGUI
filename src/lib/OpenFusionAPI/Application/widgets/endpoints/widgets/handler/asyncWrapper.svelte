<script>
	import { Input, PredictiveInput } from '@rdsslab/svelte-components';
	import { createEndpoint } from '#lib/OpenFusionAPI/Application/utils/utils.js';
	/**
	 * @type {{endpoint: any, onchange: Function, app: any}}
	 */
	let { endpoint = $bindable({}), onchange = () => {}, app = $bindable({}) } = $props();

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

	function ensureAsyncConfig() {
		if (!endpoint.custom_data) endpoint.custom_data = {};
		if (!endpoint.custom_data.async) {
			endpoint.custom_data.async = { ttl_ms: 3600000, max_consumes: 5, notify_ws: false };
		}
	}

	function createEndpointUrl(method, appName, resource, environment) {
		try {
			return `${method == 'WS' ? '/ws/' : '/api/'}${appName || ''}${resource || ''}/${environment || ''}`;
		} catch (e) {
			return '';
		}
	}

	function getFullRoute(e) {
		if (!e) return '';
		const method = e.method || '';
		const appName = app?.app || e.app || '';
		const resource = e.resource || e.endpoint || '';
		const env = e.environment || '';
		const full = createEndpointUrl(method, appName, resource, env);
		return `[${method}] ${full}`.trim();
	}

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
		bind:options={endpointOptions}
		bind:selectedValue={endpoint.code}
		optionValueKey="value"
		optionLabelKey="name"
		displayValue={(val) => {
			if (!val) return '';
			const found = endpointOptions.find((o) => o.value === val);
			if (found) return found.name;
			// Fallback directo a app.endpoints por si las opciones aún no se han propagado
			const list = app?.endpoints || [];
			const e = list.find((x) => x && x.idendpoint === val);
			if (e) {
				const method = e.method || '';
				const appName = app?.app || e.app || '';
				const resource = e.resource || e.endpoint || '';
				const env = e.environment || '';
				const full = `${method == 'WS' ? '/ws/' : '/api/'}${appName}${resource}/${env}`;
				return `[${method}] ${full}`.trim();
			}
			return val;
		}}
		onselect={(val) => {
			applyBaseEndpoint(val);
		}}
		onchange={(val) => {
			applyBaseEndpoint(val);
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
				bind:value={endpoint.custom_data.async.ttl_ms}
				min="1000"
				step="1000"
				onchange={update}
			/>
		</div>
		<div class="column">
			<Input
				label="Max consumes"
				type="number"
				bind:value={endpoint.custom_data.async.max_consumes}
				min="1"
				step="1"
				onchange={update}
			/>
		</div>
		<div class="column" style="display: flex; align-items: flex-end; padding-bottom: 0.75rem;">
			<label class="checkbox">
				<input
					type="checkbox"
					bind:checked={endpoint.custom_data.async.notify_ws}
					onchange={update}
				/>
				<span>Notify via WebSocket</span>
			</label>
		</div>
	</div>
</div>
