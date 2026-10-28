<script>
	import { untrack } from 'svelte';
	import {
		SlideFullScreen,
		Tab,
		EditorCode,
		Input,
		MarkdownViewer,
		RESTTester,
		Notifications
	} from '@rdsslab/svelte-components';
	import FetchCode from './handler/fetch.svelte';
	import JsCode from './handler/js.svelte';
	import SoapCode from './handler/soap.svelte';
	import SqlCode from './handler/sql.svelte';
	import SqlBulkInsert from './handler/sqlBulkInsert.svelte';
	import SqlHana from './handler/sqlHana.svelte';
	import HiveDriver from './handler/hiveDriver.svelte';
	import AsyncWrapper from './handler/asyncWrapper.svelte';
	import TextCode from './handler/text.svelte';
	import MongoDB from './handler/mongodb.svelte';
	import CustomFn from './handler/customFunction.svelte';
	import Endpoint from './endpoint.svelte';
	import Authorizations from './authorizations.svelte';
	import Logs from './logs.svelte';
	import Backups from './endpoint_bkp.svelte';
	import TelegramBot from './handler/telegramBot.svelte';
	import MCP from './mcp.svelte';
	import EndpointLabel from './endpoint_label.svelte';
	import { getErrorMessage } from '../../../utils/errors.js';
	import { userStore } from '../../../utils/stores.js';
	import AppVars from '../../application_variables/variables.svelte';
	import { defaultEndpoint } from '../../../utils/static_values.js';
	import {
		mergeSourceOverwrite,
		ensureDataTestShape
	} from '../../../utils/utils.js';
	import { getHandlerDocs, EndpointSave } from '../../../utils/request.js';
	import SaveDeploy from '../../common/saveDeploy.svelte';

	/**
	 * @typedef {import('../../../../types/models.js').EndpointRow} EndpointRow
	 * @typedef {import('../../../../types/models.js').AppRow} AppRow
	 * @typedef {import('../../../../types/models.js').HandlerChangePayload} HandlerChangePayload
	 * @typedef {import('../../../../types/models.js').DataTest} DataTest
	 */

	/**
	 * @type {{showEditor?: boolean, onsave?: (d: HandlerChangePayload) => void, oncopy?: (ep: EndpointRow) => void}}
	 */
	let { showEditor = $bindable(false), onsave = (d) => {}, oncopy = () => {} } = $props();

	let noty = new Notifications();
	/** @type {EndpointRow} */
	let endpoint = $state(structuredClone(defaultEndpoint));
	/** @type {AppRow} */
	let app = $state({});
	/** @type {number|string|undefined} */
	let idendpoint = $state();

	/** @type {number} */
	let idappNumber = $derived(Number(endpoint.idapp || 0));
	/** @type {string} */
	let customDataJson = $derived(JSON.stringify(endpoint.custom_data || {}));
	/** @type {string} */
	let corsJson = $derived(JSON.stringify(endpoint.cors || {}));

	let markdown_docs = $state('');

	let deploying = $state({ show: false, message: '', error: false });
	let dirty = $state(false);

	// Cache del último handler consultado para evitar re-fetch innecesarios
	// NOTA: getHandlerDocsRequest() se llama directamente desde setValuesEndpoint().
	// Este efecto sólo actúa cuando el handler cambia manualmente en el editor,
	// sin recargar el endpoint completo, para no duplicar la llamada inicial.
	let lastHandlerDocs = '';
	$effect(() => {
		const h = endpoint.handler;
		untrack(() => {
			if (h && h !== lastHandlerDocs) {
				lastHandlerDocs = h;
				// Solo disparar si el endpoint ya está cargado (idendpoint definido)
				if (idendpoint) {
					getHandlerDocsRequest().catch((e) => console.error('getHandlerDocs:', e));
				}
			}
		});
	});

	/**
	 * @param {any} data
	 */
	export function setData(data) {
		app = data.app || {};
		idendpoint = data.idendpoint || undefined;
		setValuesEndpoint();
	}

	/**
	 * Rescata un `data_test` que una versión anterior guardó envuelto:
	 *   { body: { selection, json: { code: <data_test real> } } }
	 *
	 * Ese envoltorio nació de confundir la config vacía del Tester con un body
	 * crudo (ver `normalizeDataTest` en libOpenFusionAPI): al reabrir el endpoint
	 * la config aparecía como JSON dentro de la pestaña Body. Se devuelve el
	 * `data_test` interno cuando es reconocible y el envoltorio no aporta datos
	 * propios, para que la config vuelva a sus pestañas y quede corregida al
	 * guardar.
	 */
	function unwrapNestedDataTest(/** @type {any} */ data_test) {
		if (!data_test || typeof data_test !== 'object' || Array.isArray(data_test)) return data_test;

		const TESTER_KEYS = ['query', 'headers', 'body', 'auth', 'last_response'];
		if (!Object.keys(data_test).every((k) => TESTER_KEYS.includes(k))) return data_test;

		const body = data_test.body;
		if (!body || typeof body !== 'object' || Array.isArray(body)) return data_test;
		// El body externo debe ser solo el envoltorio (selection + json).
		if (Object.keys(body).some((k) => k !== 'selection' && k !== 'json')) return data_test;
		const json = body.json;
		if (!json || typeof json !== 'object' || Array.isArray(json)) return data_test;
		const code = json.code;
		if (!code || typeof code !== 'object' || Array.isArray(code)) return data_test;
		if (Object.keys(code).length === 0) return data_test;
		if (!Object.keys(code).every((k) => TESTER_KEYS.includes(k))) return data_test;

		// El `code` interno debe traer señales de config del Tester.
		const esObj = (/** @type {any} */ v) => v && typeof v === 'object' && !Array.isArray(v);
		const senal =
			Array.isArray(code.query) ||
			Array.isArray(code.headers) ||
			esObj(code.body) ||
			esObj(code.auth);
		if (!senal) return data_test;

		// No pisar datos reales que ya vengan en el contenedor.
		const filaConDatos = (/** @type {any} */ rows) =>
			Array.isArray(rows) &&
			rows.some(
				(r) =>
					r &&
					typeof r === 'object' &&
					(String(r.key ?? '').length > 0 || String(r.value ?? '').length > 0)
			);
		const authConDatos =
			esObj(data_test.auth) &&
			((data_test.auth.basic && String(data_test.auth.basic.username ?? '').length > 0) ||
				(data_test.auth.bearer && String(data_test.auth.bearer.token ?? '').length > 0));
		if (filaConDatos(data_test.query) || filaConDatos(data_test.headers) || authConDatos) {
			return data_test;
		}

		return code;
	}

	/**
	 * @param {EndpointRow} ep
	 * @returns {EndpointRow}
	 */
	function normalizeEndpoint(/** @type {EndpointRow} */ ep) {
		if (!ep) return ep;

		const jsonFields = ['json_schema', 'mcp', 'ctrl', 'data_test', 'cors', 'headers_test'];
		const epRec = /** @type {Record<string, unknown>} */ (ep);
		for (const field of jsonFields) {
			if (typeof epRec[field] === 'string') {
				const val = /** @type {string} */ (epRec[field]).trim();
				if (val === '' || val === 'null' || val === 'undefined') {
					epRec[field] = {};
				} else {
					try {
						epRec[field] = JSON.parse(val);
					} catch (/** @type {any} */ e) {
						console.error(`Error parsing ${field}:`, e);
						try {
							noty.push({
								message: `Field '${field}' has invalid JSON format in database: ${/** @type {any} */ (e).message}`,
								color: 'warning'
							});
						} catch (err) {
							console.error('Failed to show notification:', err);
						}
						epRec[field] = {};
					}
				}
			}
		}

		// Ensure structures exist
		const js = /** @type {any} */ (epRec.json_schema);
		js.in ??= {};
		js.in.enabled ??= false;
		js.in.schema ??= {};
		js.out ??= {};
		js.out.enabled ??= false;
		js.out.schema ??= {};

		/** @type {any} */ (epRec.custom_data) ??= {};
		/** @type {any} */ (epRec.mcp) ??= {};
		let ctrl = /** @type {any} */ (epRec.ctrl);
		ctrl ??= {};
		ctrl.users ??= [];
		ctrl.log ??= {};
		epRec.data_test = ensureDataTestShape(unwrapNestedDataTest(epRec.data_test));

		return /** @type {EndpointRow} */ (epRec);
	}

	async function setValuesEndpoint() {
		//console.warn($state.snapshot(endpoint), defaultEndpoint);
		if (app && app.endpoints && idendpoint) {
			let ep_found = app.endpoints.find((ep) => ep.idendpoint == idendpoint);

			if (ep_found) {
				// Se hace una copia del default porque se estaba sobreescribiendo
				let merged = mergeSourceOverwrite(structuredClone(defaultEndpoint), ep_found);
				endpoint = normalizeEndpoint(merged);

				// Get Handler Docs (actualizar cache para evitar re-fetch del $effect)
				lastHandlerDocs = /** @type {string} */ (endpoint.handler || '');
				await getHandlerDocsRequest();
			} else {
				//Notification.error('Endpoint not found');
				clearValues();
			}
		} else {
			//Notification.error('Application not found');
			clearValues();
		}
	}

	async function saveEndpoint() {
		deploying.show = true;
		deploying.message = 'Saving Endpoint...';
		deploying.error = false;
		try {
			// $state.snapshot() ya produce un objeto plano con todas las propiedades;
			// no se requieren asignaciones adicionales.
			let endpoint_out = /** @type {EndpointRow} */ ($state.snapshot(endpoint));
			let resp = await EndpointSave(endpoint_out);
			let response = resp.result;

			if (response && response.idapp == app.idapp) {
				deploying.show = false;
				noty.push({
					message: 'Endpoint saved and deployed successfully.',
					color: 'success'
				});
				/** @type {any} */ (onsave)();
			} else {
				deploying.error = true;
				deploying.message = `Error: ${resp.message}`;
			}
		} catch (error) {
			console.error(error);
			deploying.error = true;
			deploying.message = `Error: ${getErrorMessage(error)}`;
		}
	}

	let validateResource = $state(false);
	let availableURL = $state(false);

	let tabList = $state([
		{
			name: 'endpoint',
			label: 'Endpoint',
			component: tab_endpoint,
			classIcon: ' fa-solid fa-network-wired '
		},
		{ name: 'docs', label: 'Documentation', component: tab_docs, classIcon: ' fa-solid fa-book ' },
		{
			name: 'config',
			label: 'Configuration',
			component: tab_config,
			classIcon: ' fa-solid fa-screwdriver-wrench ',
			keepAlive: true
		},
		{
			name: 'app_vars',
			label: 'Application Variables',
			component: tab_app_vars,
			classIcon: ' fa-solid fa-square-root-variable '
		},
		{ name: 'json_schema', label: 'JSON Schema', component: tab_json_schema },
		{ name: 'auth', label: 'Authorizations', component: tab_auth, classIcon: ' fa-solid fa-key ' },
		{ name: 'cors', label: 'CORS', component: tab_cors, classIcon: ' fa-solid fa-earth-americas ' },
		{ name: 'mcp', label: 'MCP', component: tab_mcp, classIcon: ' fa-solid fa-robot ' },
		{
			name: 'custom_data',
			label: 'Custom Data',
			component: tab_custom_data,
			classIcon: ' fa-regular fa-hand '
		},
		{ name: 'price', label: 'Price', component: tab_price, classIcon: ' fa-solid fa-tag ' },
		{
			name: 'tester',
			label: 'Tester',
			component: tab_tester,
			classIcon: ' fa-solid fa-microscope ',
			// El Tester mantiene en su propio estado la petición en vuelo y el
			// resultado; sin keepAlive el Tab lo desmonta al cambiar de pestaña.
			keepAlive: true
		},
		{
			name: 'backups',
			label: 'Backups',
			component: tab_backups,
			classIcon: ' fa-solid fa-list-check '
		},
		{ name: 'logs', label: 'Logs', component: tab_log }
	]);

	/** Mapa de handler → tabs permitidas. Sin entrada = todas las tabs. */
	/** @type {Record<string, Set<string>>} */
	const HANDLER_TABS = {
		MCP: new Set(['endpoint', 'docs', 'tester', 'backups', 'logs']),
		NOAPPLY: new Set(['endpoint']),
		'No Handler': new Set(['endpoint']),
		NA: new Set(['endpoint']),
		TELEGRAM_BOT: new Set([
			'endpoint',
			'config',
			'docs',
			'app_vars',
			'auth',
			'price',
			'tester',
			'backups',
			'logs'
		]),
		FUNCTION: new Set([
			'endpoint',
			'config',
			'docs',
			'auth',
			'cors',
			'mcp',
			'price',
			'tester',
			'backups',
			'logs',
			'json_schema'
		]),
		SOAP: new Set([
			'endpoint',
			'config',
			'docs',
			'auth',
			'cors',
			'price',
			'tester',
			'backups',
			'logs',
			'json_schema',
			'app_vars',
			'mcp'
		]),
		SQL_BULK_I: new Set([
			'endpoint',
			'config',
			'docs',
			'auth',
			'cors',
			'price',
			'tester',
			'backups',
			'logs',
			'json_schema',
			'app_vars',
			'mcp'
		]),
		SQL: new Set([
			'endpoint',
			'config',
			'docs',
			'auth',
			'cors',
			'price',
			'tester',
			'backups',
			'logs',
			'json_schema',
			'app_vars',
			'mcp'
		]),
		HANA: new Set([
			'endpoint',
			'config',
			'docs',
			'auth',
			'cors',
			'price',
			'tester',
			'backups',
			'logs',
			'json_schema',
			'app_vars',
			'mcp'
		]),
		HIVE_DRIVER: new Set([
			'endpoint',
			'config',
			'docs',
			'auth',
			'cors',
			'price',
			'tester',
			'backups',
			'logs',
			'json_schema',
			'app_vars',
			'mcp'
		]),
		ASYNC_WRAPPER: new Set([
			'endpoint',
			'config',
			'docs',
			'auth',
			'cors',
			'price',
			'tester',
			'backups',
			'logs',
			'json_schema',
			'app_vars',
			'mcp'
		])
	};

	let derivedtabList = $derived.by(() => {
		if (!app.app) return [];
		const allowed = HANDLER_TABS[endpoint?.handler ?? ''];
		if (!allowed) return tabList;
		return tabList.filter((tab) => allowed.has(tab.name));
	});

	function clearValues() {
		let ep = structuredClone(defaultEndpoint);
		ep.idapp = /** @type {string} */ (app.idapp || '');
		endpoint = normalizeEndpoint(/** @type {EndpointRow} */ (ep));
	}

	/**
	 * @param {HandlerChangePayload} [v]
	 */
	function onChangeValueHandler(v = undefined) {
		console.trace('onChangeValueHandler', v);
		if (v) {
			dirty = true;
			endpoint.data_test = v.data_test;
			endpoint.code = v.code;
			endpoint.docs = v.docs;
			endpoint.File = v.File;

			if (v.custom_data) {
				endpoint.custom_data = v.custom_data;
			}
			if (v.resource !== undefined) endpoint.resource = v.resource;
			if (v.method !== undefined) endpoint.method = v.method;
			if (v.environment !== undefined) endpoint.environment = v.environment;
			if (v.endpoint !== undefined) endpoint.endpoint = v.endpoint;
		}
	}

	/**
	 * Convierte un valor a string y retorna los primeros 1000 caracteres.
	 * Versión con manejo robusto de errores y opciones de configuración.
	 * @param {*} valor - El valor a procesar.
	 * @param {number} maxLength - Cantidad máxima de caracteres (por defecto 1000).
	 * @returns {string} Los primeros N caracteres del string.
	 */
	function getResultLimited(valor, maxLength = 1000) {
		let cadena;

		try {
			// Si ya es un string, usarlo directamente
			if (typeof valor === 'string') {
				cadena = valor;
			}
			// Si es null o undefined
			else if (valor === null) {
				cadena = 'null';
			} else if (valor === undefined) {
				cadena = 'undefined';
			}
			// Si es una función
			else if (typeof valor === 'function') {
				cadena = valor.toString();
			}
			// Si es un objeto o array
			else if (typeof valor === 'object') {
				// Intentar JSON.stringify
				try {
					cadena = JSON.stringify(valor, null, 2);
				} catch {
					// Si falla (referencias circulares, etc.), usar toString()
					cadena = Object.prototype.toString.call(valor);
				}
			}
			// Para número, boolean, symbol, bigint
			else {
				cadena = String(valor);
			}
		} catch {
			// En caso de cualquier error inesperado
			cadena = '[Error al convertir valor]';
		}

		// Retornar los primeros N caracteres
		return cadena.substring(0, maxLength);
	}

	async function getHandlerDocsRequest() {
		if (endpoint?.handler) {
			try {
				let res = await getHandlerDocs(endpoint.handler);
				//	console.log(res);

				if (res && res.markdown) {
					markdown_docs = res.markdown;
				}
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>

{#snippet tab_docs()}
	<MarkdownViewer content_class=" is-small " bind:markdown={markdown_docs}></MarkdownViewer>
{/snippet}

{#snippet tab_endpoint()}
	{#if endpoint && app}
		<Endpoint
			bind:endpoint
			bind:app
			bind:validateResource
			bind:availableURL
			oncopy={(/** @type {unknown} */ ep) => {
				oncopy(/** @type {EndpointRow} */ (ep));
			}}
		></Endpoint>
	{/if}
{/snippet}

{#snippet tab_app_vars()}
	{#if endpoint && endpoint.idapp}
		<AppVars bind:idapp={idappNumber} environment={endpoint.environment} isReadOnly={true}
		></AppVars>
	{/if}
{/snippet}

{#snippet tab_json_schema()}
	{#snippet json_schema_in()}
		<Input
			label="Enabled"
			type="checkbox"
			bind:value={(/** @type {any} */ (endpoint.json_schema)).in.enabled}
			placeholder="Enabled"
		/>

		<EditorCode
			lang="json"
			showFormat={true}
			bind:code={/** @type {any} */ ((/** @type {any} */ (endpoint.json_schema)).in.schema)}
			onchange={(/** @type {any} */ datajs) => {
				//	json_schema_in = datajs.code;
			}}
		></EditorCode>
	{/snippet}

	{#snippet json_schema_out()}
		<Input
			label="Enabled"
			type="checkbox"
			bind:value={(/** @type {any} */ (endpoint.json_schema)).out.enabled}
			placeholder="Enabled"
		/>

		<EditorCode
			lang="json"
			showFormat={true}
			bind:code={/** @type {any} */ ((/** @type {any} */ (endpoint.json_schema)).out.schema)}
			onchange={(/** @type {any} */ datajs) => {
				//	json_schema_out = datajs.code;
			}}
		></EditorCode>
	{/snippet}

	<Tab
		tabs={[
			{
				label: 'In',
				component: json_schema_in,
				classIcon: ' fa-solid fa-arrow-right-to-bracket '
			},
			{
				label: 'Out',
				component: json_schema_out,
				classIcon: ' fa-solid fa-arrow-right-from-bracket '
			}
		]}
	></Tab>

	<div class="block">
		<div class="content is-small">
			<div class="icon-text">
				<span class="icon has-text-info">
					<i class="fas fa-info-circle"></i>
				</span>
				<span>Info</span>
			</div>

			While JSON is probably the most popular format for exchanging data, JSON Schema is the
			vocabulary that enables JSON data consistency, validity, and interoperability at scale.

			<p>
				More information about <a href="https://json-schema.org/">JSON Schema</a> can be found in the
				official documentation.
			</p>
		</div>
	</div>
{/snippet}

{#snippet tab_custom_data()}
	{#if endpoint?.custom_data}
		<EditorCode
			lang="json"
			showFormat={true}
			bind:code={customDataJson}
			onchange={(/** @type {any} */ datajs) => {
				//	json_schema_in = datajs.code;
			}}
		></EditorCode>
	{/if}
{/snippet}

{#snippet tab_price()}
	<Input
		label="Price by Request (in credits)"
		type="number"
		bind:value={endpoint.price_by_request}
		step="1"
		min="0"
		placeholder="Price by Request"
	/>
	<Input
		label="Price by KB on request (in credits)"
		type="number"
		bind:value={endpoint.price_kb_request}
		step="1"
		min="0"
		placeholder="Price by Request"
	/>
	<Input
		label="Price by KB on response (in credits)"
		type="number"
		bind:value={endpoint.price_kb_response}
		step="1"
		min="0"
		placeholder="Price by Request"
	/>
{/snippet}

{#snippet tab_config()}
	{#if endpoint}
		<div>
			{#if endpoint?.handler == 'JS'}
				<JsCode bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'TELEGRAM_BOT'}
				<TelegramBot bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'SOAP'}
				<SoapCode bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'SQL'}
				<SqlCode bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'HANA'}
				<SqlHana bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'HIVE_DRIVER'}
				<HiveDriver bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'ASYNC_WRAPPER'}
				<AsyncWrapper bind:endpoint bind:app onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'SQL_BULK_I'}
				<SqlBulkInsert bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'FETCH'}
				<FetchCode bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'FUNCTION'}
				<CustomFn bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'TEXT'}
				<TextCode bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'MONGODB'}
				<MongoDB bind:endpoint onchange={onChangeValueHandler} />
			{:else if endpoint?.handler == 'NOAPPLY' || endpoint?.handler == 'No Handler' || endpoint?.handler == 'NA'}
				<div>No Handler</div>
			{:else}
				<div>No Handler</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet tab_auth()}
	{#if endpoint && endpoint.ctrl}
		<Authorizations bind:users={endpoint.ctrl.users}></Authorizations>
	{/if}
{/snippet}

{#snippet tab_log()}
	{#if endpoint?.ctrl?.log}
		<Logs bind:log={endpoint.ctrl.log} bind:endpoint></Logs>
	{/if}
{/snippet}

{#snippet tab_mcp()}
	{#if endpoint?.mcp}
		<MCP bind:mcp={endpoint.mcp}></MCP>
	{/if}
{/snippet}

{#snippet tab_cors()}
	{#if endpoint}
		<div>
			<div class="block">
				<div class="buttons is-small">
					<button
						class="button is-small"
						title="Remove per-endpoint CORS: use the deployment-wide default policy"
						onclick={() => {
							endpoint.cors = {};
							onChangeValueHandler();
						}}
					>
						<span class="icon is-small"><i class="fas fa-times"></i></span>
						<span>Default (deployment-wide)</span>
					</button>
					<button
						class="button is-small"
						title="Allow any cross-origin request"
						onclick={() => {
							endpoint.cors = { origin: ['*'] };
							onChangeValueHandler();
						}}
					>
						<span class="icon is-small"><i class="fas fa-globe"></i></span>
						<span>Allow all origins</span>
					</button>
				</div>
			</div>

			<EditorCode
				lang="json"
				showFormat={true}
				bind:code={corsJson}
				onchange={() => {
					onChangeValueHandler();
				}}
			></EditorCode>

			<div class="block">
				<div class="content is-small">
					<div class="icon-text">
						<span class="icon has-text-info">
							<i class="fas fa-info-circle"></i>
						</span>
						<span>Info</span>
					</div>
					<p>
						Set a list of allowed origins
						<code>["https://app.example.com"]</code> or an object like
						<code>&#123;"origin": ["https://app.example.com"], "credentials": true&#125;</code>
						to restrict cross-origin browser access. Empty
						<code>&#123;&#125;</code> uses the deployment-wide default policy. Requests from an
						Origin outside the allowlist are denied and receive no
						<code>Access-Control-Allow-Origin</code> header.
					</p>
				</div>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet endpoint_path()}
	<EndpointLabel
		bind:endpoint={endpoint.endpoint}
		bind:environment={endpoint.environment}
		bind:method={endpoint.method}
		bind:handler={endpoint.handler}
	></EndpointLabel>
{/snippet}

{#snippet tab_backups()}
	{#if endpoint && endpoint.idendpoint}
		<Backups
			bind:idendpoint={endpoint.idendpoint}
			onselect={(/** @type {any} */ backup) => {
				//console.log('Selected backup', backup);
				if (backup && backup.idendpoint == endpoint.idendpoint) {
					let snap = $state.snapshot(backup);
					endpoint = normalizeEndpoint(snap);
					noty.push({
						message: `Endpoint ${backup.name} loaded from backup. Save to persist.`,
						color: 'success'
					});
				}
			}}
		></Backups>
	{/if}
{/snippet}

{#snippet tab_tester()}
	<div>
		<RESTTester
			bind:data={endpoint.data_test}
			method={endpoint.method}
			url={endpoint.endpoint}
			methodDisabled={true}
			onchange={(/** @type {any} */ d) => {
				endpoint.data_test = ensureDataTestShape(d.data);

				// Limita el tamaño de la respuesta (guard para evitar TypeError si last_response es null)
				if (d.last_response) {
					const last = d.last_response;
					endpoint.data_test.last_response = {
						data: getResultLimited(last.data),
						sizeKBResponse: last.sizeKBResponse,
						// RESTTester emite `contentType`; el formato histórico guardado
						// por el editor usa `MimeType`. Aceptamos ambos.
						MimeType: last.MimeType ?? last.contentType ?? '',
						status: last.status ?? null,
						statusText: last.statusText ?? '',
						fileName: last.fileName ?? null
					};
				}
			}}
		></RESTTester>
	</div>
{/snippet}

<SlideFullScreen bind:show={showEditor}>
	<SaveDeploy
		bind:deploying
		bind:dirty
		left={[endpoint_path]}
		onsavedeploy={async () => {
			dirty = false;
			if (!validateResource) {
				deploying.show = true;
				deploying.error = true;
				deploying.message = 'URL is invalid.';
			} else if (!availableURL) {
				deploying.show = true;
				deploying.error = true;
				deploying.message = 'URL already exists.';
			} else if (endpoint.handler == 'FUNCTION' && (!endpoint.code || endpoint.code.length < 1)) {
				deploying.show = true;
				deploying.error = true;
				deploying.message = 'You have not selected a function.';
			} else {
				await saveEndpoint();
			}
		}}
		oncancel={() => {
			dirty = false;
			idendpoint = undefined;
			showEditor = false;
		}}
	></SaveDeploy>

	<Tab
		bind:tabs={derivedtabList}
		onselect={() => {
			//	defaultValues();
		}}
	></Tab>
</SlideFullScreen>
