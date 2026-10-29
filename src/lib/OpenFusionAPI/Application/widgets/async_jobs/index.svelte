<script>
	// Vista de solo lectura de Async Requests: el estado persistido de cada
	// petición que el handler ASYNC_WRAPPER ejecutó (o está ejecutando) en
	// segundo plano. Cada fila es una entrada de `ofapi_async_jobs`; `id` es el
	// UUID que el endpoint devuelve como requestId con el 202.
	import { onMount } from 'svelte';
	import { Table, ColumnTypes, DialogModal } from '@rdsslab/svelte-components';
	import uFetch from '@rdsslab/uFetch';
	import { url_paths } from '#lib/OpenFusionAPI/Application/utils/paths.js';
	import {
		GetAsyncJobs,
		GetEndpointsByIdapp
	} from '#lib/OpenFusionAPI/Application/utils/request.js';
	import {
		AsyncJobStatus,
		getAsyncJobStatus
	} from '#lib/OpenFusionAPI/Application/utils/static_values.js';
	import CellMethod from '#lib/OpenFusionAPI/Application/widgets/endpoints/columns/cellMethod.svelte';
	import CellJobStatus from '#lib/OpenFusionAPI/Application/widgets/async_jobs/cellJobStatus.svelte';
	import { storeAsyncJobChanged } from '#lib/OpenFusionAPI/Application/utils/stores.js';

	let { idapp = $bindable() } = $props();

	const uF = new uFetch(url_paths.endpoints_get_by_idapp);

	/** @typedef {import('#lib/OpenFusionAPI/types/models.js').AsyncJobRow} AsyncJobRow */
	/** @typedef {import('#lib/OpenFusionAPI/types/models.js').EndpointRow} EndpointRow */

	/** @type {Array<AsyncJobRow>} */
	let dataJobs = $state([]);
	/** @type {Array<EndpointRow>} */
	let endpoints = $state([]);
	let loading = $state(false);
	let error = $state('');
	/** Estado seleccionado en el filtro (null = todos). */
	/** @type {string|null} */
	let statusFilter = $state(null);

	// Detalle de la fila (Modal no destruye contenido al cerrar: se reasigna
	// cada apertura para que nunca muestre datos de un job anterior).
	/** @type {AsyncJobRow} */
	let selectedRow = $state({});
	/** @type {string} */
	let selectedParamsJson = $state('{}');
	let showDetail = $state(false);

	/** Endpoint base de cada job, para mostrar method/url legibles. */
	let endpointById = $derived.by(() => {
		/** @type {Record<string, EndpointRow>} */
		const map = {};
		for (const ep of endpoints) {
			if (ep?.idendpoint) map[String(ep.idendpoint)] = ep;
		}
		return map;
	});

	/**
	 * Enriquece cada job con lo que la tabla muestra directamente: method/url
	 * del endpoint base, duración y el rendimiento consumido hasta ahora.
	 * @param {AsyncJobRow} r
	 * @returns {AsyncJobRow}
	 */
	function decorateJob(r) {
		const ep = endpointById[String(r.idendpoint_base)] ?? {};
		const created = r.created_at ? new Date(r.created_at).getTime() : null;
		const completed = r.completed_at ? new Date(r.completed_at).getTime() : null;
		return {
			...r,
			method: /** @type {string} */ (ep.method ?? ''),
			url: /** @type {string} */ (ep.endpoint ?? ep.resource ?? ''),
			resource: /** @type {string} */ (ep.resource ?? ''),
			duration_ms: created && completed && completed >= created ? completed - created : undefined,
			consume: `${r.consume_count ?? 0} / ${r.max_consumes ?? '∞'}`
		};
	}

	/** Filas visibles según el filtro de estado (EXPIRED incluido, se deriva). */
	let visibleJobs = $derived.by(() => {
		const filterKey = statusFilter && AsyncJobStatus[statusFilter] ? statusFilter : '';
		// decorateJob depende de endpointById vía closure: si los endpoints
		// llegan después del listado, las filas se redecoran solas.
		const rows = filterKey
			? dataJobs.filter((r) => getAsyncJobStatus(r) === AsyncJobStatus[filterKey])
			: dataJobs;
		return rows.map(decorateJob);
	});

	// Table escribe en RawDataTable (filtros/paginación), y no se puede vincular
	// a un $derived: se sincroniza con la vista filtrada en un estado propio.
	/** @type {Array<AsyncJobRow>} */
	let tableRows = $state([]);
	$effect(() => {
		tableRows = visibleJobs;
	});

	let columns = $state({
		id: { label: 'Request ID' },
		method: { label: 'Method', decorator: { component: CellMethod } },
		url: { label: 'Endpoint' },
		status: { label: 'Status', decorator: { component: CellJobStatus } },
		created_at: { label: 'Created', decorator: { component: ColumnTypes.DateTime } },
		completed_at: { label: 'Completed', decorator: { component: ColumnTypes.DateTime } },
		duration_ms: { label: 'Duration (ms)' },
		consume: { label: 'Consumes (used / max)' },
		environment: { label: 'Env' },
		// Campos que el detalle usa pero la tabla no debe mostrar:
		params: { hidden: true },
		idendpoint_base: { hidden: true },
		idendpoint_async: { hidden: true },
		expires_at: { hidden: true },
		fingerprint: { hidden: true },
		job_token: { hidden: true },
		ttl_ms: { hidden: true },
		updated_at: { hidden: true },
		result_is_binary: { hidden: true },
		content_type: { hidden: true },
		consume_count: { hidden: true },
		max_consumes: { hidden: true },
		idapp: { hidden: true },
		resource: { hidden: true }
	});

	async function fetchEndpoints() {
		if (!idapp) {
			endpoints = [];
			return;
		}
		try {
			const app = await GetEndpointsByIdapp(idapp);
			endpoints = Array.isArray(app?.endpoints) ? app.endpoints : [];
		} catch (e) {
			console.error('Error fetching endpoints for async jobs:', e);
			endpoints = [];
		}
	}

	async function fetchJobs() {
		if (!idapp) {
			dataJobs = [];
			return;
		}

		loading = true;
		error = '';
		try {
			dataJobs = await GetAsyncJobs(idapp);
		} catch (e) {
			console.error('Error fetching async jobs:', e);
			error = /** @type {Error} */ (e)?.message ?? String(e);
			dataJobs = [];
		} finally {
			loading = false;
		}
	}

	/**
	 * @param {{row: AsyncJobRow}} e
	 */
	function openDetail(e) {
		selectedRow = e?.row ?? {};
		selectedParamsJson = JSON.stringify(selectedRow.params ?? {}, null, 2);
		showDetail = true;
	}

	// El ASYNC_WRAPPER crea el job (PENDING), lo pasa a RUNNING y a
	// COMPLETED/FAILED: cada database_hook de la tabla repinta la vista. Se
	// agrega un pequeño debounce para agrupar las ráfagas de hooks consecutivos.
	/** @type {ReturnType<typeof setTimeout>|undefined} */
	let refreshTimer;
	$effect(() => {
		const ev = $storeAsyncJobChanged;
		if (!ev) return;
		if (String(ev.data?.idapp ?? '') !== String(idapp)) return;

		if (refreshTimer) clearTimeout(refreshTimer);
		refreshTimer = setTimeout(() => {
			fetchJobs();
		}, 500);
	});

	onMount(() => {
		fetchEndpoints();
		fetchJobs();
	});
</script>

<div class="box py-3">
	{#if !idapp}
		<p class="has-text-grey">Select an application to see its async requests.</p>
	{:else}
		<div class="level">
			<div class="level-left">
				<span class="icon-text">
					<span class="icon"><i class="fa-solid fa-clapperboard"></i></span>
					<span><strong>Async Requests</strong></span>
				</span>
				{#if loading}
					<span class="tag is-info is-light ml-2">Loading…</span>
				{/if}
				{#if error}
					<span class="tag is-danger is-light ml-2" title={error}>Error loading jobs</span>
				{/if}
			</div>
			<div class="level-right">
				<div class="tags has-addons">
					<a
						class="tag {statusFilter === null ? 'is-info' : 'is-light'}"
						href="#all"
						onclick={(e) => {
							e.preventDefault();
							statusFilter = null;
						}}>All</a
					>
					{#each Object.entries(AsyncJobStatus) as [key, meta] (key)}
						<a
							class="tag {statusFilter === key ? `is-${meta.background}` : 'is-light'}"
							href={'#' + key}
							onclick={(e) => {
								e.preventDefault();
								statusFilter = key;
							}}>{meta.label}</a
						>
					{/each}
					<button class="tag is-dark" onclick={fetchJobs} disabled={loading} title="Refresh">
						<span class="icon is-small">
							<i class="fa-solid fa-rotate-right"></i>
						</span>
					</button>
				</div>
			</div>
		</div>

		<Table bind:RawDataTable={tableRows} bind:columns onclickrow={openDetail} onsearch={fetchJobs}
		></Table>
	{/if}
</div>

{#snippet detailTitle()}
	<span>
		Async Request {selectedRow?.environment
			? `(${selectedRow.environment}) `
			: ''}{selectedRow?.method ?? ''}
		{selectedRow?.resource ?? ''}
		<code>{selectedRow?.id ?? ''}</code>
	</span>
{/snippet}

{#snippet detailBody()}
	{@const stMeta = getAsyncJobStatus(selectedRow)}
	<div class="tags has-addons">
		<span class="tag is-{stMeta.background}">
			<span class="icon is-small"><i class={stMeta.icon}></i></span>
			<span>{stMeta.label}</span>
		</span>
		<span class="tag is-light"
			>Consumes: {selectedRow?.consume_count ?? 0} / {selectedRow?.max_consumes ?? '∞'}</span
		>
		{#if selectedRow?.expires_at}
			<span class="tag is-light">Expires: {new Date(selectedRow.expires_at).toLocaleString()}</span>
		{/if}
	</div>
	<table class="table is-narrow is-fullwidth mb-3">
		<tbody>
			<tr><td>Request ID</td><td><code>{selectedRow?.id ?? '—'}</code></td></tr>
			<tr><td>Endpoint base</td><td><code>{selectedRow?.idendpoint_base ?? '—'}</code></td></tr>
			<tr><td>Endpoint async</td><td><code>{selectedRow?.idendpoint_async ?? '—'}</code></td></tr>
			<tr>
				<td>Created</td>
				<td>{selectedRow?.created_at ? new Date(selectedRow.created_at).toLocaleString() : '—'}</td>
			</tr>
			<tr>
				<td>Updated</td>
				<td>{selectedRow?.updated_at ? new Date(selectedRow.updated_at).toLocaleString() : '—'}</td>
			</tr>
			<tr>
				<td>Completed</td>
				<td
					>{selectedRow?.completed_at
						? new Date(selectedRow.completed_at).toLocaleString()
						: '—'}</td
				>
			</tr>
			<tr>
				<td>TTL</td>
				<td
					>{selectedRow?.ttl_ms ?? '∞'}{selectedRow?.expires_at
						? ` (expires at ${new Date(selectedRow.expires_at).toLocaleString()})`
						: ''}</td
				>
			</tr>
		</tbody>
	</table>
	<p class="is-size-7 has-text-grey mb-1">Params received (query + body):</p>
	<pre class="is-size-7">{selectedParamsJson}</pre>
{/snippet}

<DialogModal
	title={detailTitle}
	body={detailBody}
	label_accept="Close"
	onaccept={() => (showDetail = false)}
	oncancel={() => (showDetail = false)}
	bind:show={showDetail}
></DialogModal>
