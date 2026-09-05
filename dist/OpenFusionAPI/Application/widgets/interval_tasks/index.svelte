<script>
	import { untrack } from 'svelte';
	import {
		Table,
		ColumnTypes,
		SlideFullScreen,
		Level,
		Tab,
		PredictiveInput,
		BasicSelect,
		Input,
		EditorCode,
		Notifications
	} from '@rdsslab/svelte-components';
	import {
		defaultValuesIntervalTask,
		getIntervalTaskLastResultStatus,
		getIntervalTaskRuntimeStatus,
		INTERVAL_TASK_RUNTIME_FIELDS,
		IntervalTaskStatus
	} from '../../utils/static_values.js';
	import { url_paths } from '../../utils/paths.js';
	import uFetch from '@rdsslab/uFetch';
	import CellMethod from '../endpoints/columns/cellMethod.svelte';
	import CellTaskStatus from './cellTaskStatus.svelte';
	import CellTaskSchedule from './cellTaskSchedule.svelte';
	import TaskHistory from './history.svelte';
	import {
		userStore,
		statusSystemEndpointsStore,
		storeIntervalTaskEvent
	} from '../../utils/stores.js';
	import { currentUserHasPermission, getDefaultEnvironment } from '../../utils/permissions.js';
	import {
		GetEndpointsByIdapp,
		GetAPIKeys,
		restoreSystemEndpoints
	} from '../../utils/request.js';

	let { idapp = $bindable(), onchange = () => {} } = $props();

	const uF = new uFetch();
	const notify = new Notifications();
	const permEnv = getDefaultEnvironment();
	const currentUser = $derived($userStore?.user);
	const canCreate = $derived(currentUserHasPermission(currentUser, permEnv, 'interval_tasks', 'create'));
	const canEdit = $derived(currentUserHasPermission(currentUser, permEnv, 'interval_tasks', 'edit'));
	const canDelete = $derived(currentUserHasPermission(currentUser, permEnv, 'interval_tasks', 'delete'));
	let showEditor = $state(false);
	let runNowPending = $state(false);
	let historyTask = $state({});
	// Debe arrancar con la forma completa: los `bind:option` de BasicSelect fallan si el
	// campo llega `undefined` en el primer render (SlideFullScreen monta su contenido
	// aunque esté cerrado).
	let selectedRow = $state(defaultValuesIntervalTask({}));
	let optionsEndpoints = $state([]);
	let endpoints = $state([]);
	let optionsApiKeys = $state([]);

	let activeTab = $state(0);
	const TAB_HISTORY = 2;
	let tabList = $state([
		{
			name: 'config',
			label: 'Configuration',
			component: tab_config,
			classIcon: 'fa-solid fa-sliders'
		},
		{
			name: 'params',
			label: 'Parameters',
			component: tab_params,
			classIcon: 'fa-solid fa-code'
		},
		{
			name: 'history',
			label: 'History',
			component: tab_history,
			classIcon: 'fa-solid fa-clock-rotate-left',
			disabled: true
		},
		{
			name: 'guide',
			label: 'Guide',
			component: tab_guide,
			classIcon: 'fa-solid fa-book'
		}
	]);

	/** Abre siempre en Configuration; History solo existe si la tarea ya está guardada. */
	function resetTabs() {
		activeTab = 0;
		tabList[TAB_HISTORY].disabled = !selectedRow.idtask;
	}

	// BasicSelect espera {id, value}: `id` es el valor guardado y `value` la etiqueta.
	const scheduleModes = [
		{ id: 'interval', value: 'Interval (every N seconds)' },
		{ id: 'cron', value: 'Cron (time expression)' }
	];

	// Selección simple: las acciones por fila (Run now, Reset attempts) operan sobre una.
	let selectionType = $state(1);

	let DataTableTasks = $state([]);
	// Un GET iniciado antes de un evento websocket puede terminar después y pisar
	// `Running` con su snapshot viejo. Se conserva el último evento por tarea para
	// reaplicarlo únicamente sobre respuestas que ya nacieron desactualizadas.
	const latestRuntimeEvents = new Map();
	let runtimeEventGeneration = 0;
	const runtimeEventFields = [
		'status',
		'last_run',
		'next_run',
		'last_exec_time',
		'last_response',
		'failed_attempts',
		'task_enabled'
	];

	function applyRuntimeEvent(task, ev) {
		const updated = { ...task };
		for (const field of runtimeEventFields) {
			if (ev[field] !== undefined) updated[field] = ev[field];
		}
		if (ev.enabled !== undefined) updated.task_enabled = ev.enabled;
		if (ev.started_at && ev.last_run === undefined) updated.last_run = ev.started_at;
		if (ev.duration_ms !== undefined && ev.duration_ms !== null) {
			updated.last_exec_time = Math.round(ev.duration_ms);
		}
		return updated;
	}
	// Toda clave que devuelva la API y no esté declarada aquí se renderiza cruda, así que
	// los campos nuevos deben aparecer todos, aunque sea para ocultarlos.
	let columns = $state({
		idtask: { hidden: true },
		idendpoint: { hidden: true },
		iduser: { hidden: true },
		idapp: { hidden: true },
		idkey: { hidden: true },
		task_enabled: {
			label: 'Enabled Task',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					ontrue: { label: 'Enabled' },
					onfalse: { label: 'Unabled' },
					editInline: false
				}
			}
		},
		endpoint_enabled: {
			label: 'Enabled Endpoint',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					ontrue: { label: 'Enabled' },
					onfalse: { label: 'Unabled' },
					editInline: false
				}
			}
		},
		method: { label: 'method', decorator: { component: CellMethod } },
		url: { label: 'url' },
		status: {
			label: 'Status',
			decorator: { component: CellTaskStatus, props: { currentState: true } }
		},
		schedule_mode: { label: 'Schedule', decorator: { component: CellTaskSchedule } },
		interval: { hidden: true },
		cron: { hidden: true },
		allow_concurrent: {
			label: 'Concurrent',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					ontrue: { label: 'Allowed' },
					onfalse: { label: 'Blocked' },
					editInline: false
				}
			}
		},
		datestart: {
			label: 'datestart',
			decorator: {
				component: ColumnTypes.DateTime
			}
		},
		dateend: {
			label: 'dateend',
			decorator: {
				component: ColumnTypes.DateTime
			}
		},
		last_run: {
			label: 'last_run',
			decorator: {
				component: ColumnTypes.DateTime
			}
		},
		next_run: {
			label: 'next_run',
			decorator: {
				component: ColumnTypes.DateTime
			}
		},

		params: {},
		exec_time_limit: {},
		failed_attempts: {},
		max_failed_attempts: { label: 'Max fails' },
		last_exec_time: {},
		last_response: {},
		timezone: { hidden: true },
		window_start: { label: 'Window from' },
		window_end: { label: 'Window to' },
		window_days: { label: 'Days' },
		history_limit: { hidden: true },
		note: { hidden: true },
		access: { hidden: true },
		app: { hidden: true },
		resource: { hidden: true },
		environment: { hidden: true },
		app_enabled: { hidden: true }
	});

	// El panel de runtime se deriva de la fila de la tabla, no de `selectedRow`: ese es el
	// borrador editable y refrescarlo pisaría los cambios sin guardar. `DataTableTasks` ya
	// lo mantiene al día el efecto de websocket de más abajo, así que el estado en vivo no
	// cuesta ninguna suscripción extra.
	let runtime = $derived(
		selectedRow.idtask
			? DataTableTasks.find((t) => String(t.idtask) === String(selectedRow.idtask)) || null
			: null
	);
	let runtimeStatus = $derived(runtime ? getIntervalTaskRuntimeStatus(runtime.status) : null);
	let lastResultStatus = $derived(
		runtime ? getIntervalTaskLastResultStatus(runtime.status, runtime.last_response) : null
	);

	let nextIn = $derived.by(() => {
		if (!runtime?.next_run) return '';

		const seconds = Math.round((new Date(runtime.next_run).getTime() - Date.now()) / 1000);
		if (!Number.isFinite(seconds)) return '';
		if (seconds <= 0) return 'now';
		if (seconds < 60) return `${seconds}s`;
		if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
		return `${Math.round(seconds / 3600)}h`;
	});

	// `last_response` puede venir como objeto o como texto plano según lo que devolviera
	// el endpoint; en el panel siempre se muestra legible.
	let lastResponse = $derived.by(() => {
		const value = runtime?.last_response;
		if (value === null || value === undefined || value === '') return '';
		if (typeof value === 'string') return value;

		try {
			return JSON.stringify(value, null, 2);
		} catch (error) {
			return String(value);
		}
	});

	/** Formatea una fecha del servidor; devuelve '—' si no hay valor. */
	function formatMoment(value) {
		if (!value) return '—';

		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
	}

	$effect(async () => {
		idapp;
		await loadTasks();
		let app = await GetEndpointsByIdapp(idapp, $userStore.token);
		if (app.endpoints) {
			endpoints = app.endpoints;
			//console.log(ep);
			if (endpoints && endpoints.length > 0) {
				optionsEndpoints = endpoints.map((e) => {
					return { name: `[${e.method}] ${e.endpoint}`, value: e.idendpoint };
				});
			}
		}

		await loadApiKeys();
	});

	// El planificador publica el inicio y el final de cada ejecución: se refleja en la
	// fila sin recargar toda la tabla. El efecto sólo debe depender del evento: leer
	// `DataTableTasks` aquí sin `untrack` lo reactiva con su propia escritura.
	$effect(() => {
		const ev = $storeIntervalTaskEvent;
		if (!ev?.idtask) return;

		untrack(() => {
			latestRuntimeEvents.set(String(ev.idtask), {
				...ev,
				generation: ++runtimeEventGeneration
			});

			DataTableTasks = DataTableTasks.map((t) => {
				if (String(t.idtask) !== String(ev.idtask)) return t;

				return applyRuntimeEvent(t, ev);
			});

			// El evento no trae next_run, failed_attempts ni last_response, así que el panel
			// del editor se quedaría con valores viejos. Recargar solo con el editor abierto
			// sobre esta misma tarea y en el evento de fin: como mucho una recarga por
			// ejecución de la tarea que se está viendo.
			if (
				showEditor &&
				Number(ev.status) !== 1 &&
				String(ev.idtask) === String(selectedRow.idtask)
			) {
				loadTasks();
			}
		});
	});

	async function loadApiKeys() {
		if (!idapp) {
			optionsApiKeys = [];
			return;
		}

		try {
			const keys = await GetAPIKeys(idapp);
			optionsApiKeys = [
				{ id: null, value: '— Sin API Key —' },
				...(Array.isArray(keys) ? keys : []).map((k) => ({
					id: k.idkey,
					value: `#${k.idkey} ${k.description || ''} ${k.enabled ? '' : '(disabled)'}`.trim()
				}))
			];
		} catch (error) {
			console.error('Error loading api keys:', error);
			optionsApiKeys = [{ id: null, value: '— Sin API Key —' }];
		}
	}

	async function loadTasks() {
		if (idapp) {
			const requestedGeneration = runtimeEventGeneration;
			let resp = await uF.get({ url: url_paths.getListIntervalTasksByIdApp, data: { idapp } });
			let jresp = await resp.json();
			let status_sys_endp = await restoreSystemEndpoints(false, $userStore.token);
			statusSystemEndpointsStore.set(status_sys_endp);

			if (Array.isArray(jresp)) {
				DataTableTasks = jresp.map((task) => {
					const ev = latestRuntimeEvents.get(String(task.idtask));
					if (!ev || ev.generation <= requestedGeneration) return task;

					return applyRuntimeEvent(task, ev);
				});
			} else {
				DataTableTasks = [];
			}
		} else {
			console.log('idapp not found');
		}
	}

	/** `params` llega como objeto desde la API, pero se normaliza por si viniera serializado. */
	function normalizeParams(row) {
		if (typeof row.params === 'string') {
			try {
				row.params = JSON.parse(row.params || '{}');
			} catch (error) {
				row.params = {};
			}
		} else if (!row.params || typeof row.params !== 'object') {
			row.params = {};
		}
		return row;
	}

	async function saveInterval() {
		if (idapp) {
			let row = $state.snapshot(selectedRow);
			row.params = row.params ?? {};

			// El estado y las marcas de tiempo los escribe el planificador: reenviarlos
			// sobrescribiría el estado real con la copia tomada al abrir el editor.
			for (const field of INTERVAL_TASK_RUNTIME_FIELDS) delete row[field];

			if (row.schedule_mode === 'cron') {
				delete row.interval;
			} else {
				row.cron = null;
			}
			if (row.idkey === '' || row.idkey === undefined) row.idkey = null;

			let resp = await uF.post({ url: url_paths.upsertIntervalTasksByIdTask, data: row });
			let jresp = await resp.json();

			if (!resp.ok) {
				notify.push({
					message: `No se pudo guardar la tarea: ${jresp?.error || resp.statusText}`,
					color: 'danger'
				});
				return false;
			}

			await loadTasks();
			notify.push({ message: 'Tarea guardada correctamente', color: 'success' });
			return true;
		}

		return false;
	}

	async function deleteTasks(tasks) {
		let idtasks = tasks.map((t) => {
			return t.idtask;
		});

		let resp = await uF.DELETE({ url: url_paths.deleteIntervalTasksByIdTask, data: idtasks });
		await resp.json();
		await loadTasks();
	}

	async function runNow(task) {
		if (!task?.idtask || runNowPending) return false;

		runNowPending = true;
		try {
			const resp = await uF.post({
				url: url_paths.runNowIntervalTask,
				data: { idtask: task.idtask }
			});
			const jresp = await resp.json();

			if (!jresp?.success) {
				alert(jresp?.message || 'No se pudo programar la ejecución.');
				return false;
			}

			await loadTasks();
			return true;
		} catch (error) {
			alert(error?.message || 'No se pudo programar la ejecución.');
			return false;
		} finally {
			runNowPending = false;
		}
	}

	async function resetAttempts(task) {
		if (!task?.idtask) return;

		const resp = await uF.post({
			url: url_paths.resetIntervalTaskAttempts,
			data: { idtask: task.idtask }
		});
		const jresp = await resp.json();

		if (!jresp?.success) alert(jresp?.message || 'No se pudo reiniciar el contador.');
		await loadTasks();
	}
</script>

<Table
	bind:RawDataTable={DataTableTasks}
	bind:columns
	bind:selectionType
	showEditRow={true}
	showNewButton={canCreate}
	showDeleteButton={canDelete}
	showEditButton={canEdit}
	right_items={[taskActions]}
	oneditrow={(r) => {
		selectedRow = normalizeParams(defaultValuesIntervalTask(r));
		// La lista devuelve el flag como `task_enabled` y como TINYINT(1): sin `!!` el
		// botón booleano mostraría "1" en lugar de "true".
		selectedRow.enabled = !!r.task_enabled;
		resetTabs();
		showEditor = true;
	}}
	onnewrow={() => {
		selectedRow = normalizeParams(defaultValuesIntervalTask({}));
		resetTabs();
		showEditor = true;
	}}
	onselectrows={(selected) => {
		historyTask = selected?.rows?.length === 1 ? selected.rows[0] : {};
	}}
	ondeleterow={async (r) => {
		if (r.rows.length > 0 && confirm('Are you sure you want to delete this task?')) {
			await deleteTasks(r.rows);
		}
	}}
>
	{#snippet taskActions()}
		<div class="field has-addons">
			<p class="control">
				<button
					class="button is-small"
					disabled={!historyTask?.idtask}
					title="Despierta el planificador y ejecuta la tarea inmediatamente"
					onclick={() => runNow(historyTask)}
				>
					<span class="icon is-small"><i class="fa-solid fa-bolt"></i></span>
					<span>Run now</span>
				</button>
			</p>
			<p class="control">
				<button
					class="button is-small"
					disabled={!historyTask?.idtask}
					title="Reinicia el contador de fallos y reactiva la tarea si el backoff la deshabilitó"
					onclick={() => resetAttempts(historyTask)}
				>
					<span class="icon is-small"><i class="fa-solid fa-rotate-left"></i></span>
					<span>Reset attempts</span>
				</button>
			</p>
		</div>
	{/snippet}
</Table>

{#if idapp}
	<SlideFullScreen bind:show={showEditor}>
		<Level left={[]} right={[r01]}>
			{#snippet r01()}
				<div class="field has-addons">
					{#if selectedRow.idtask}
						<p class="control">
							<button
								class="button is-small is-warning"
								class:is-loading={runNowPending}
								disabled={runNowPending ||
									!runtime?.task_enabled ||
									(Number(runtime?.status) === 1 && !runtime?.allow_concurrent)}
								title={!runtime?.task_enabled
									? 'Enable and save the task before running it'
									: Number(runtime?.status) === 1 && !runtime?.allow_concurrent
										? 'The task is already running and does not allow concurrency'
										: 'Runs the last saved configuration immediately'}
								onclick={() => runNow(runtime)}
							>
								<span class="icon is-small"><i class="fa-solid fa-bolt"></i></span>
								<span>Run now</span>
							</button>
						</p>
					{/if}
					<p class="control">
						<button
							class="button is-small is-link"
							onclick={async () => {
								if (!confirm('Are you sure you want to save and deploy this task?')) return;
								// saveInterval() notifica el resultado; el editor permanece abierto
								// tanto si el guardado tuvo éxito como si falló.
								await saveInterval();
							}}
						>
							<span class="icon is-small">
								<i class="fa-solid fa-rocket"></i>
							</span>
							<span>Save & Deploy</span>
						</button>
					</p>
					<p class="control">
						<button
							class="button is-small"
							onclick={() => {
								showEditor = false;
							}}
						>
							<span class="icon is-small">
								<i class="fa-solid fa-xmark"></i>
							</span>
							<span>Cancel</span>
						</button>
					</p>
				</div>
			{/snippet}
		</Level>

		{#if runtime && runtimeStatus}
			<!-- Solo lectura: lo escribe el planificador. Se actualiza solo porque
			     `DataTableTasks` se parchea con cada evento de websocket. -->
			<div class="box py-3">
				<div class="level is-mobile mb-2">
					<div class="level-left">
						<span class="icon-text">
							<span class="icon"><i class={runtimeStatus.icon}></i></span>
							<span class="has-text-weight-semibold">Runtime status</span>
						</span>
					</div>
					<div class="level-right">
						<div class="tags">
							<span class="tag is-{runtimeStatus.background}">{runtimeStatus.label}</span>
							{#if lastResultStatus}
								<span class="tag is-{lastResultStatus.background}">
									Last result: {lastResultStatus.label}
								</span>
							{/if}
						</div>
					</div>
				</div>
				<p class="help mb-3">{runtimeStatus.description}</p>

				<div class="columns is-multiline is-mobile mb-0">
					<div class="column is-one-quarter">
						<p class="heading">Last run</p>
						<p>{formatMoment(runtime.last_run)}</p>
					</div>
					<div class="column is-one-quarter">
						<p class="heading">Next run</p>
						<p>{formatMoment(runtime.next_run)}{nextIn ? ` (in ${nextIn})` : ''}</p>
					</div>
					<div class="column is-one-quarter">
						<p class="heading">Last duration</p>
						<p>{runtime.last_exec_time ? `${runtime.last_exec_time} ms` : '—'}</p>
					</div>
					<div class="column is-one-quarter">
						<p class="heading">Failed attempts</p>
						<p
							class:has-text-danger={Number(runtime.max_failed_attempts ?? 0) > 0 &&
								Number(runtime.failed_attempts ?? 0) >= Number(runtime.max_failed_attempts)}
						>
							{runtime.failed_attempts ?? 0} / {runtime.max_failed_attempts ?? 0}
						</p>
					</div>
				</div>

				{#if lastResponse}
					<p class="heading">Last response</p>
					<pre class="is-size-7 last-response">{lastResponse}</pre>
				{/if}
			</div>
		{/if}

		<div>
			<Tab bind:tabs={tabList} bind:active={activeTab}></Tab>
		</div>
	</SlideFullScreen>
{/if}

{#snippet tab_config()}
	<div>
		<PredictiveInput
			label="Url"
			placeholder="Select the endpoint this task will call"
			classLabel="is-small"
			classInput="is-small"
			bind:options={optionsEndpoints}
			bind:selectedValue={selectedRow.idendpoint}
		/>

		<div class="columns">
			<div class="column is-one-third">
				<Input type="boolean" label="Enabled" bind:value={selectedRow.enabled}></Input>
			</div>
			<div class="column is-one-third">
				<!-- Con esto en false el planificador salta el ciclo mientras la ejecución
				     anterior siga en curso, que es el comportamiento seguro por defecto. -->
				<Input type="boolean" label="Allow concurrent" bind:value={selectedRow.allow_concurrent}
				></Input>
			</div>
			<div class="column is-one-third">
				<BasicSelect
					label="API Key (auth)"
					bind:options={optionsApiKeys}
					bind:option={selectedRow.idkey}
				/>
			</div>
		</div>

		<div class="columns">
			<div class="column is-one-third">
				<BasicSelect
					label="Schedule mode"
					options={scheduleModes}
					bind:option={selectedRow.schedule_mode}
				/>
			</div>
			{#if selectedRow.schedule_mode === 'cron'}
				<div class="column is-one-third">
					<Input type="text" label="Cron: " placeholder="0 7 * * 1-5" bind:value={selectedRow.cron}
					></Input>
				</div>
			{:else}
				<div class="column is-one-third">
					<Input
						type="number"
						label="Interval (s): "
						placeholder="300"
						min={1}
						step={1}
						bind:value={selectedRow.interval}
					></Input>
				</div>
			{/if}
			<div class="column is-one-third">
				<Input
					type="number"
					label="Exec time limit (s): "
					placeholder="30"
					min={1}
					step={1}
					bind:value={selectedRow.exec_time_limit}
				></Input>
			</div>
		</div>

		<!-- La ventana la aplica el planificador en los dos modos (interval y cron), no
		     solo en cron, así que se muestra siempre. -->
		<p class="label is-small mb-2">Execution window (optional)</p>
		<div class="columns">
			<div class="column is-one-quarter">
				<Input
					type="text"
					label="Timezone (IANA): "
					placeholder="America/Guayaquil"
					bind:value={selectedRow.timezone}
				></Input>
			</div>
			<div class="column is-one-quarter">
				<Input
					type="text"
					label="Window start (HH:MM): "
					placeholder="08:00"
					pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$"
					bind:value={selectedRow.window_start}
				></Input>
			</div>
			<div class="column is-one-quarter">
				<Input
					type="text"
					label="Window end (HH:MM): "
					placeholder="18:00"
					pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$"
					bind:value={selectedRow.window_end}
				></Input>
			</div>
			<div class="column is-one-quarter">
				<Input
					type="text"
					label="Days (1=Mon .. 7=Sun): "
					placeholder="1,2,3,4,5"
					pattern="^[1-7](,[1-7])*$"
					bind:value={selectedRow.window_days}
				></Input>
			</div>
		</div>

		<div class="columns">
			<div class="column is-one-third">
				<Input
					type="datetime-local"
					label="Date Start: "
					placeholder="Optional start date"
					bind:value={selectedRow.datestart}
				></Input>
			</div>
			<div class="column is-one-third">
				<Input
					type="datetime-local"
					label="Date End: "
					placeholder="Optional end date"
					bind:value={selectedRow.dateend}
				></Input>
			</div>
			<div class="column is-one-third">
				<Input
					type="text"
					label="Note: "
					placeholder="Daily customer synchronization"
					bind:value={selectedRow.note}
				></Input>
			</div>
		</div>

		<p class="label is-small mb-2">Failure handling</p>
		<div class="columns">
			<div class="column is-one-third">
				<Input
					type="number"
					label="Max failed attempts: "
					placeholder="10"
					min={1}
					step={1}
					bind:value={selectedRow.max_failed_attempts}
				></Input>
			</div>
			<div class="column is-one-third">
				<Input
					type="number"
					label="History limit: "
					placeholder="50"
					min={0}
					step={1}
					bind:value={selectedRow.history_limit}
				></Input>
			</div>
			<div class="column is-one-third"></div>
		</div>
	</div>
{/snippet}

{#snippet tab_params()}
	<!-- El planificador espera { data: {...}, headers: {...} }; con lang="json"
	     EditorCode trabaja sobre el objeto y no propaga JSON inválido. -->
	<EditorCode lang="json" showFormat={true} bind:code={selectedRow.params}></EditorCode>
{/snippet}

{#snippet tab_history()}
	<!-- Tab monta todos los contenidos a la vez y solo los oculta con display:none, así
	     que sin esta guarda el historial se montaría con la tarea vacía y no se
	     recargaría al cambiar de tarea. -->
	{#if activeTab === TAB_HISTORY && selectedRow.idtask}
		<TaskHistory task={selectedRow} />
	{/if}
{/snippet}

{#snippet tab_guide()}
	<div class="content is-small">
		<h4>How to schedule an endpoint</h4>
		<ol>
			<li>Select an existing endpoint and keep the new task disabled.</li>
			<li>
				Choose <strong>Interval</strong> for every N seconds or <strong>Cron</strong> for calendar times.
			</li>
			<li>Set an API Key when the endpoint is private and does not belong to the system app.</li>
			<li>
				Save, select the task, run it once with <strong>Run now</strong>, and inspect History.
			</li>
			<li>Enable it only after the test succeeds.</li>
		</ol>

		<h4>Schedule fields</h4>
		<p>
			A cron example for weekdays at 07:00 is <code>0 7 * * 1-5</code>. Timezone and execution
			window are optional. Date Start and Date End restrict the task's lifetime; they do not change
			its frequency.
		</p>

		<h4>Parameters and failures</h4>
		<p>
			Use <code>{JSON.stringify({ data: { id: 42 }, headers: { 'x-source': 'scheduler' } })}</code>
			in Parameters. Failed executions use exponential backoff and the task is disabled after Max failed
			attempts. Reset attempts only after correcting the cause.
		</p>
	</div>
{/snippet}

<style>
	/* Una respuesta larga no debe empujar el formulario fuera de la pantalla. */
	.last-response {
		max-height: 12rem;
		overflow: auto;
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>
