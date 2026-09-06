<script>
	import { onDestroy, onMount, untrack } from 'svelte';
	import { Table, ColumnTypes, Input, BasicSelect } from '@rdsslab/svelte-components';
	import {
		userStore,
		storeEndpointOnComplete
	} from '../../utils/stores.js';
	import {
		getLogs,
		getListApps,
		GetEndpointsByIdapp
	} from '../../utils/request.js';
	import CellStatusCode from './cellStatusCode.svelte';
	import CellTraceId from './cellTraceId.svelte';
	import RequestDetail from './request_detail.svelte';
	import TraceView from './trace_view.svelte';

	let { idapp = $bindable() } = $props();

	// === Filtros ===
	let includeAllApps = $state(false);
	let environment = $state('prd');
	let timeMode = $state('preset');
	let presetHours = $state(24);
	let startDate = $state('');
	let endDate = $state('');
	let statusClasses = $state([]);
	let exactCodes = $state('');
	let method = $state('');
	let logLevel = $state('');
	let idendpoint = $state('');
	let traceId = $state('');
	let eventName = $state('');
	let limit = $state(500);
	let fullDetail = $state(true);
	let realtime = $state(false);

	// === Datos ===
	let logsRaw = $state([]);
	let logs = $state([]);
	let loading = $state(false);
	let endpointsOptions = $state([]);
	let appNameById = $state({});

	// === Modales ===
	let showDetail = $state(false);
	let selectedRow = $state(null);
	let selectedAppName = $state('');
	let showTrace = $state(false);
	let traceToInspect = $state('');

	const ENVIRONMENTS = [
		{ id: 'prd', value: 'Production' },
		{ id: 'qa', value: 'QA' },
		{ id: 'dev', value: 'Development' }
	];
	const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
	const LOG_LEVELS = [
		{ id: '', value: 'All levels' },
		{ id: '1', value: '1 — Basic' },
		{ id: '2', value: '2 — Normal' },
		{ id: '3', value: '3 — Full' }
	];
	const STATUS_CODE_RANGES = {
		'1xx': [100, 199],
		'2xx': [200, 299],
		'3xx': [300, 399],
		'4xx': [400, 499],
		'5xx': [500, 599]
	};

	let activeStatusFilter = $derived.by(() => {
		const tokens = String(exactCodes || '')
			.split(',')
			.map((s) => s.trim())
			.filter((s) => /^(\d{3}|[1-5]xx)$/i.test(s));
		return [...statusClasses, ...tokens];
	});

	function isValidRange() {
		const s = String(startDate || '');
		const e = String(endDate || '');
		if (!s || !e) return false;
		const ds = new Date(s);
		const de = new Date(e);
		return !isNaN(ds.getTime()) && !isNaN(de.getTime()) && ds < de;
	}

	function buildQuery() {
		const q = {
			order: 'timestamp',
			orderDirection: 'DESC',
			lightweight: fullDetail ? false : true
		};

		const parsedLimit = Number(limit);
		q.limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 1000;

		if (!includeAllApps && idapp) q.idapp = idapp;
		if (environment) q.environment = environment;

		if (timeMode === 'range') {
			if (isValidRange()) {
				q.start_date = startDate;
				q.end_date = endDate;
			}
		} else {
			const hours = Math.floor(Number(presetHours));
			if (Number.isFinite(hours) && hours > 0) q.last_hours = hours;
		}

		if (activeStatusFilter.length > 0) q.status_code = activeStatusFilter.join(',');
		if (method) q.method = method;
		if (logLevel) q.log_level = logLevel;
		if (idendpoint) q.idendpoint = idendpoint;
		const tr = String(traceId || '').trim();
		if (tr) q.trace_id = tr;
		const ev = String(eventName || '').trim();
		if (ev) q.event = ev;

		return q;
	}

	function statusMatchesFilter(code, parts) {
		return parts.some((p) => {
			if (/^[1-5]xx$/i.test(p)) {
				const first = Number(p[0]);
				return code >= first * 100 && code < (first + 1) * 100;
			}
			return code === Number(p);
		});
	}

	// Normaliza la fila para que el Table siempre tenga todos los campos (con light weight
	// algunos faltan y el Auto los renderizaría como 'undefined'/'null').
	function decorateRow(log) {
		return {
			...log,
			trace_id: log.trace_id ?? '',
			url: log.url ?? '',
			method: log.method ?? '',
			status_code: log.status_code ?? '',
			log_level: log.log_level ?? '',
			response_time: log.response_time ?? '',
			client: log.client ?? '',
			app_name: appNameById[log.idapp] ?? log.idapp ?? ''
		};
	}

	let logs_guard = 0;

	async function loadLogs() {
		const rid = ++logs_guard;
		loading = true;
		try {
			const res = await getLogs(buildQuery(), $userStore.token);
			if (rid !== logs_guard) return;
			const arr = Array.isArray(res) ? res : [];
			logsRaw = arr;
			logs = arr.map(decorateRow);
		} catch (e) {
			console.error(e);
			if (rid === logs_guard) {
				logsRaw = [];
				logs = [];
			}
		} finally {
			if (rid === logs_guard) loading = false;
		}
	}

	let reloadTimer = null;

	function scheduleReload() {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(loadLogs, 350);
	}

	$effect(() => {
		includeAllApps;
		environment;
		timeMode;
		presetHours;
		startDate;
		endDate;
		statusClasses;
		exactCodes;
		method;
		logLevel;
		idendpoint;
		traceId;
		eventName;
		limit;
		fullDetail;
		idapp;
		scheduleReload();
	});

	let endpoints_guard = 0;

	async function loadEndpointOptions() {
		const rid = ++endpoints_guard;
		endpointsOptions = [];
		if (includeAllApps || !idapp) return;
		try {
			const app = await GetEndpointsByIdapp(idapp);
			if (rid !== endpoints_guard) return;
			if (app?.endpoints && Array.isArray(app.endpoints)) {
				endpointsOptions = app.endpoints
					.filter(
						(e) =>
							e?.idendpoint && (!environment || !e.environment || e.environment === environment)
					)
					.map((e) => ({ id: e.idendpoint, value: e.endpoint }));
			}
		} catch (e) {
			console.error(e);
			endpointsOptions = [];
		}
	}

	$effect(() => {
		idapp;
		includeAllApps;
		environment;
		idendpoint = '';
		loadEndpointOptions();
	});

	// Cuando llega la lista de apps (nombres), remapea las filas ya cargadas para mostrar
	// el nombre de la aplicación en vez del idapp (tarea única cuando el mapa se llena).
	$effect(() => {
		if (Object.keys(appNameById).length > 0) {
			untrack(() => {
				if (logsRaw.length) {
					logs = logsRaw.map(decorateRow);
				}
			});
		}
	});

	// === Tiempo real (websocket) ===
	function eventMatchesFilters(evt) {
		if (!includeAllApps && idapp && evt?.idapp && evt.idapp !== idapp) return false;
		if (environment && evt?.environment && evt.environment !== environment) return false;
		if (idendpoint && evt?.idendpoint && evt.idendpoint !== idendpoint) return false;
		if (method && evt?.method && evt.method !== method) return false;
		if (activeStatusFilter.length > 0 && evt?.statusCode != null) {
			if (!statusMatchesFilter(Number(evt.statusCode), activeStatusFilter)) return false;
		}
		return true;
	}

	let realtimeTimer = null;

	function scheduleRealtimeRefresh() {
		if (!realtimeTimer) {
			realtimeTimer = setTimeout(() => {
				realtimeTimer = null;
				loadLogs();
			}, 2500);
		}
	}

	let unsubscribe_com;

	onMount(() => {
		loadApps();
		unsubscribe_com = storeEndpointOnComplete.subscribe((event) => {
			if (!realtime) return;
			if (eventMatchesFilters(event)) scheduleRealtimeRefresh();
		});
	});

	onDestroy(() => {
		clearTimeout(reloadTimer);
		if (realtimeTimer) clearTimeout(realtimeTimer);
		unsubscribe_com?.();
	});

	async function loadApps() {
		try {
			const apps = await getListApps($userStore.token);
			const map = {};
			if (Array.isArray(apps)) {
				for (const a of apps) {
					if (a?.idapp) map[a.idapp] = a.app ?? a.idapp;
				}
			}
			appNameById = map;
		} catch (e) {
			console.error(e);
		}
	}

	async function refreshAll() {
		await loadLogs();
	}

	function onRowClick({ row }) {
		selectedRow = row;
		selectedAppName = appNameById[row?.idapp] ?? row?.idapp ?? '';
		showDetail = true;
	}

	function openTrace({ row }) {
		traceToInspect = row?.trace_id || '';
		if (traceToInspect) showTrace = true;
	}

	function handleHoursChange(e) {
		const value = Math.floor(Number(e.target.value));
		presetHours = Number.isFinite(value) && value > 0 ? value : 24;
	}

	function handleLimitChange(e) {
		const value = Math.floor(Number(e.target.value));
		limit = Number.isFinite(value) && value > 0 && value <= 999999 ? value : 1000;
	}

	function handleExactCodesInput(e) {
		exactCodes = e.currentTarget.value;
	}

	let columns = $state({
		timestamp: {
			label: 'Date/Time',
			decorator: { component: ColumnTypes.DateTime, props: { format: 'yyyy-MM-dd HH:mm:ss' } }
		},
		status_code: { label: 'Status', decorator: { component: CellStatusCode } },
		method: { label: 'Method' },
		url: { label: 'Resource' },
		app_name: { label: 'App' },
		client: { label: 'Client IP' },
		response_time: { label: 'Time (ms)' },
		trace_id: {
			label: 'Trace ID',
			decorator: { component: CellTraceId, props: { onOpenTrace: openTrace } }
		},
		log_level: { label: 'Level' },
		id: { hidden: true },
		idapp: { hidden: true },
		idendpoint: { hidden: true },
		user_agent: { hidden: true },
		req_headers: { hidden: true },
		res_headers: { hidden: true },
		response_data: { hidden: true },
		message: { hidden: true }
	});
</script>

<div class="box p-3 mb-3">
	<div class="field is-grouped is-grouped-multiline">
		<div class="control">
			<label class="checkbox">
				<input type="checkbox" bind:checked={includeAllApps} />
				All apps
			</label>
		</div>
		<div class="control">
			<BasicSelect label="Environment" options={ENVIRONMENTS} bind:option={environment} />
		</div>
		<div class="control">
			<BasicSelect
				label="Endpoint"
				options={[{ id: '', value: 'All endpoints' }, ...endpointsOptions]}
				bind:option={idendpoint}
			/>
		</div>
		<div class="control">
			<BasicSelect
				label="Method"
				options={[{ id: '', value: 'All methods' }, ...METHODS.map((m) => ({ id: m, value: m }))]}
				bind:option={method}
			/>
		</div>
		<div class="control">
			<BasicSelect label="Log level" options={LOG_LEVELS} bind:option={logLevel} />
		</div>
		<div class="control">
			<Input
				label="Trace ID"
				type="text"
				placeholder="Search by trace_id"
				bind:value={traceId}
				isExpanded={false}
			/>
		</div>
		<div class="control">
			<Input
				label="Event"
				type="text"
				placeholder="message.event (e.g. bot_running)"
				bind:value={eventName}
				isExpanded={false}
			/>
		</div>
	</div>

	<div class="field is-grouped is-grouped-multiline">
		<div class="control">
			<BasicSelect
				label="Window"
				options={[
					{ id: 'preset', value: 'Last hours' },
					{ id: 'range', value: 'Date range' }
				]}
				bind:option={timeMode}
			/>
		</div>
		{#if timeMode === 'preset'}
			<div class="control">
				<Input
					label="Hours"
					type="number"
					min="1"
					step="1"
					bind:value={presetHours}
					onchange={handleHoursChange}
				/>
			</div>
			<div class="control is-flex is-align-items-center" style="gap: 0.25rem;">
				{#each [1, 6, 12, 24, 48, 72, 168] as h}
					<button
						class="button is-small {presetHours === h ? 'is-info' : 'is-light'}"
						onclick={() => (presetHours = h)}
					>
						{h < 24 ? `${h}h` : h === 24 ? '24h' : h === 48 ? '2d' : h === 72 ? '3d' : '7d'}
					</button>
				{/each}
			</div>
		{:else}
			<div class="control">
				<Input label="Start" type="datetime-local" bind:value={startDate} />
			</div>
			<div class="control">
				<Input label="End" type="datetime-local" bind:value={endDate} />
			</div>
		{/if}
	</div>

	<div class="field is-grouped is-grouped-multiline mb-1">
		<span class="mr-2 is-align-self-center">Status codes:</span>
		{#each Object.keys(STATUS_CODE_RANGES) as cls}
			<label class="checkbox mr-2 is-align-self-center">
				<input
					type="checkbox"
					checked={statusClasses.includes(cls)}
					onchange={(e) => {
						statusClasses = e.target.checked
							? [...statusClasses, cls]
							: statusClasses.filter((c) => c !== cls);
					}}
				/>
				{cls}
			</label>
		{/each}
		<div class="control">
			<Input
				label="Exact codes"
				type="text"
				placeholder="404, 5xx, 502,429"
				oninput={handleExactCodesInput}
				isExpanded={false}
			/>
		</div>
		<div class="control">
			<label
				class="checkbox is-align-self-center"
				title="Load the full request/response payload so the attack badge, client IP, headers and message column are available"
			>
				<input type="checkbox" bind:checked={fullDetail} />
				Full detail
			</label>
		</div>
		<div class="control">
			<Input
				label="Limit"
				type="number"
				min="1"
				max="999999"
				step="100"
				bind:value={limit}
				onchange={handleLimitChange}
			/>
		</div>
		<div class="control">
			<button class="button is-small" onclick={refreshAll} disabled={loading}>
				<span class="icon is-small">
					<i class="fa-solid fa-rotate"></i>
				</span>
				<span>Refresh</span>
			</button>
		</div>
	</div>
	<p class="help">
		Requests ending on 401/429 (or any status selected above) are marked by the API with
		<code>message.type = "posible_ataque"</code>; the shield badge shows up when the full payload is
		loaded. Click a row for the request/response detail, or the trace icon to follow a trace end to
		end.
	</p>
</div>

{#snippet tableStatus()}
	<span class="is-size-7 has-text-grey">
		{loading ? 'Loading…' : `${logs.length} records`}
	</span>
	{#if loading}
		<span class="icon is-small has-text-info">
			<i class="fas fa-spinner fa-pulse"></i>
		</span>
	{/if}
{/snippet}

{#snippet realtimeToggle()}
	<button
		class="button is-small {realtime ? 'is-success' : 'is-link is-outlined'}"
		title="Auto-reload this table when new requests matching the current filters arrive (websocket)"
		onclick={() => (realtime = !realtime)}
	>
		<span class="icon is-small">
			<i class="fa-solid {realtime ? 'fa-circle-dot' : 'fa-circle'}"></i>
		</span>
		<span>{realtime ? 'Realtime ON' : 'Realtime OFF'}</span>
	</button>
{/snippet}

<Table
	bind:RawDataTable={logs}
	{columns}
	left_items={[tableStatus]}
	right_items={[realtimeToggle]}
	showSelectionButton={false}
	showNewButton={false}
	showEditButton={false}
	showDeleteButton={false}
	showExportButton={true}
	fileNameExport="openfusion_logs"
	onclickrow={onRowClick}
></Table>

<p class="help has-text-centered mt-2">
	Newest first, filtered by the criteria above (up to the most recent {limit} records).
</p>

<RequestDetail bind:show={showDetail} bind:row={selectedRow} bind:appName={selectedAppName} />

<TraceView bind:show={showTrace} bind:trace_id={traceToInspect} />
