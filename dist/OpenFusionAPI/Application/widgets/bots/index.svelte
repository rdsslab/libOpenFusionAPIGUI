<script>
	import { onMount, onDestroy } from 'svelte';
	import {
		Table,
		ColumnTypes,
		SlideFullScreen,
		Level,
		PredictiveInput,
		Input,
		EditorCode,
		Tab,
		Notifications,
		TextArea
	} from '@rdsslab/svelte-components';
	import {
		defaultValuesBot,
		Environment,
		BotRuntimeStatus,
		BotRuntimeStatusFallback,
		BOT_RUNTIME_FIELDS
	} from '../../utils/static_values.js';
	import { url_paths } from '../../utils/paths.js';
	import uFetch from '@rdsslab/uFetch';
	import CellBotStatus from './cellBotStatus.svelte';
	import Backups from './bot_bkp.svelte';
	import BotLogs from './bot_logs.svelte';
	import { userStore, statusSystemEndpointsStore, storeBotStatusChanged, storeBotChanged } from '../../utils/stores.js';
	import { currentUserHasPermission, getDefaultEnvironment } from '../../utils/permissions.js';
	import { restoreSystemEndpoints } from '../../utils/request.js';
	import AppVarsSelector from '../endpoints/widgets/params_json_selector.svelte';

	let { idapp = $bindable(), onchange = () => {} } = $props();

	let notify = new Notifications();
	const uF = new uFetch();
	const permEnv = getDefaultEnvironment();
	const currentUser = $derived($userStore?.user);
	const canCreate = $derived(currentUserHasPermission(currentUser, permEnv, 'bots', 'create'));
	const canEdit = $derived(currentUserHasPermission(currentUser, permEnv, 'bots', 'edit'));
	const canDelete = $derived(currentUserHasPermission(currentUser, permEnv, 'bots', 'delete'));
	let showEditor = $state(false);
	let selectedRow = $state(defaultValuesBot({}));
	let DataTableBots = $state([]);
	let customToken = $state('');

	let optionsEnvironment = $state(
		Environment.map((e) => {
			return { name: e.value, value: e.id };
		})
	);

	/** Salud del bot abierto en el editor, tal como la reportó el servidor al cargarlo. */
	let health = $state(null);

	/**
	 * Pestañas del editor. `component` apunta a los snippets declarados en el marcado, y el
	 * índice de Backups se deshabilita mientras el bot no exista todavía en la base.
	 */
	let activeTab = $state(0);
	const TAB_BACKUPS = 3;
	const TAB_LOGS = 4;
	let tabList = $state([
		{ name: 'general', label: 'General', component: tab_general, classIcon: 'fa-solid fa-sliders' },
		{ name: 'params', label: 'Params (JSON)', component: tab_params, classIcon: 'fa-solid fa-code' },
		{ name: 'code', label: 'Code', component: tab_code, classIcon: 'fa-solid fa-file-code' },
		{
			name: 'backups',
			label: 'Backups',
			component: tab_backups,
			classIcon: 'fa-solid fa-list-check',
			disabled: true
		},
		{
			name: 'logs',
			label: 'Logs',
			component: tab_logs,
			classIcon: 'fa-solid fa-scroll',
			disabled: true
		}
	]);

	/** Deja el editor abierto en General y habilita Backups solo si el bot ya está guardado. */
	function resetTabs() {
		activeTab = 0;
		tabList[TAB_BACKUPS].disabled = !selectedRow.idbot;
		tabList[TAB_LOGS].disabled = !selectedRow.idbot;
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

	let healthStatus = $derived(
		health ? BotRuntimeStatus[health.runtime_status] || BotRuntimeStatusFallback : null
	);

	/** Formatea una fecha del servidor; devuelve '—' si no hay valor. */
	function formatMoment(value) {
		if (!value) return '—';
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
	}

	// Toda clave que devuelva la API y no esté declarada aquí se renderiza igual, con la
	// etiqueta recortada a 15 caracteres (ver SetColumns en Table.svelte). Por eso los
	// campos de estado del runtime deben declararse todos, aunque sea para ocultarlos.
	let columns = $state({
		idbot: { hidden: true },
		idapp: { hidden: true },
		name: { label: 'Name' },
		description: { label: 'Description' },
		enabled: {
			label: 'Enabled',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					// El decorador solo dibuja el icono con etiqueta si recibe `custom`;
					// sin ese envoltorio cae al checkbox mudo.
					custom: {
						ontrue: { label: 'Enabled' },
						onfalse: { label: 'Disabled' },
						editInline: false
					}
				}
			}
		},
		runtime_status: {
			label: 'Status',
			decorator: {
				component: CellBotStatus
			}
		},
		last_error_type: { label: 'Last error' },
		environment: { label: 'Environment' },
		createdAt: {
			label: 'Created',
			decorator: {
				component: ColumnTypes.DateTime
			}
		},
		updatedAt: {
			label: 'Updated',
			decorator: {
				component: ColumnTypes.DateTime
			}
		},
		// El detalle de la salud vive en el editor; en la lista solo estorbaría.
		provider: { hidden: true },
		params: { hidden: true },
		failure_count: { hidden: true },
		last_error_message: { hidden: true },
		last_failure_at: { hidden: true },
		next_retry_at: { hidden: true },
		last_started_at: { hidden: true },
		last_healthy_at: { hidden: true },
		disabled_by: { hidden: true },
		disabled_reason: { hidden: true }
	});

	$effect(async () => {
		idapp;
		await loadBots();
	});

	async function loadBots() {
		if (idapp) {
			try {
				let resp = await uF.get({ url: `${url_paths.bots}/prd`, data: { idapp } });
				let jresp = await resp.json();
				// console.log('loadBots >>>>>>>>>>>>>', jresp);

				let status_sys_endp = await restoreSystemEndpoints(false, $userStore.token);
				statusSystemEndpointsStore.set(status_sys_endp);

				if (jresp && jresp.success && Array.isArray(jresp.data)) {
					DataTableBots = jresp.data;
				} else {
					DataTableBots = [];
					if (jresp && jresp.error) {
						notify.push({ message: jresp.error, color: 'danger' });
					}
				}
			} catch (error) {
				console.error('loadBots error >>>>>>>>>>>>>', error);
				notify.push({ message: error.message || 'Failed to load bots', color: 'danger' });
				DataTableBots = [];
			}
		} else {
			console.log('idapp not found');
		}
	}

	async function getBot(idbot) {
		try {
			let resp = await uF.get({
				url: `${url_paths.bots}/prd`,
				data: { idbot, include_code: true, include_token: true }
			});
			let jresp = await resp.json();
			// console.log('getBot >>>>>>>>>>>>>', jresp);

			if (jresp && jresp.success && jresp.data) {
				if (Array.isArray(jresp.data)) {
					return jresp.data.length > 0 ? jresp.data[0] : null;
				}
				return jresp.data;
			}
			if (jresp && jresp.error) {
				notify.push({ message: jresp.error, color: 'danger' });
			}
			return null;
		} catch (error) {
			console.error('getBot error >>>>>>>>>>>>>', error);
			notify.push({ message: error.message || 'Failed to load bot details', color: 'danger' });
			return null;
		}
	}

	async function saveBot() {
		if (!idapp) return;

		let row = $state.snapshot(selectedRow);
		row.idapp = idapp;
		// El editor de Params ya entrega un objeto: EditorCode con lang="json" solo escribe en
		// `code` cuando el texto parsea, así que aquí nunca llega JSON inválido.
		row.params = row.params ?? {};

		// El estado del runtime lo escribe el servidor. Reenviar la copia que se leyó al
		// abrir el editor lo sobrescribiría con datos ya viejos: un bot que entretanto se
		// recuperó volvería a figurar como QUARANTINED.
		for (const field of BOT_RUNTIME_FIELDS) delete row[field];

		try {
			// console.log('saveBot >>>>>>>>>>>>>', row);
			let resp = await uF.post({ url: `${url_paths.bots}/prd`, data: row });
			let jresp = await resp.json();
			// console.log('saveBot response >>>>>>>>>>>>>', jresp);

			if (jresp && jresp.success) {
				notify.push({ message: 'Bot saved successfully', color: 'success' });
				await loadBots();
			} else {
				let msg = (jresp && jresp.error) ? jresp.error : 'Failed to save bot';
				notify.push({ message: msg, color: 'danger' });
				throw new Error(msg);
			}
		} catch (error) {
			console.error('saveBot error >>>>>>>>>>>>>', error);
			if (error.message !== 'Failed to save bot' && !error.message.startsWith('URL:')) {
				notify.push({ message: error.message || 'Failed to save bot', color: 'danger' });
			}
			throw error;
		}
	}

	async function deleteBots(bots) {
		try {
			for (let bot of bots) {
				// console.log('deleteBots >>>>>>>>>>>>>', bot.idbot, url_paths.bots);
				let resp = await uF.DELETE({ url: `${url_paths.bots}/${bot.idbot}/prd` });
				let jresp = await resp.json();
				if (jresp && !jresp.success && jresp.error) {
					notify.push({ message: jresp.error, color: 'danger' });
				}
			}
			notify.push({ message: 'Bot(s) deleted successfully', color: 'success' });
			await loadBots();
		} catch (error) {
			console.error('deleteBots error >>>>>>>>>>>>>', error);
			notify.push({ message: error.message || 'Failed to delete bot(s)', color: 'danger' });
		}
	}

	// ── Real-time updates via WebSocket stores ──────────────────────────────

	/**
	 * bot_status_changed: runtime status transitions (STARTING → RUNNING → STOPPED, etc.)
	 * arrive every ~10 s per bot. Patch the table row in-place; if the editor is open
	 * for that bot, also refresh the health panel so the operator sees changes immediately.
	 */
	const unsubBotStatus = storeBotStatusChanged.subscribe((evt) => {
		if (!evt || !evt.idbot) return;
		const idx = DataTableBots.findIndex((r) => r.idbot === evt.idbot);
		if (idx !== -1) {
			// Shallow merge: only overwrite fields present in the patch.
			const row = { ...DataTableBots[idx] };
			for (const key of Object.keys(evt)) {
				if (key === 'ts' || key === 'idbot' || key === 'idapp') continue;
				row[key] = evt[key];
			}
			DataTableBots[idx] = row;
		}
		// If the editor is open for this bot, update health snapshot too.
		if (showEditor && selectedRow.idbot === evt.idbot) {
			health = { ...health, ...evt };
		}
	});

	/**
	 * bot_changed: structural change (create / edit / delete). The safest action is a
	 * full reload; these events are infrequent (only on user action) so the traffic
	 * cost is negligible.
	 */
	const unsubBotChanged = storeBotChanged.subscribe((evt) => {
		if (!evt) return;
		// Only reload if the changed bot belongs to the current app context.
		if (evt.idapp && evt.idapp !== idapp) return;
		loadBots();
	});

	onDestroy(() => {
		unsubBotStatus();
		unsubBotChanged();
	});

	onMount(() => {
		selectedRow = normalizeParams(defaultValuesBot({}));
		health = null;
		resetTabs();
	});
</script>

<Table
	bind:RawDataTable={DataTableBots}
	bind:columns
	showEditRow={true}
	showNewButton={canCreate}
	showDeleteButton={canDelete}
	showEditButton={canEdit}
	oneditrow={async (r) => {
		// console.log('TABLE > EDIT ', r);
		let fullBot = await getBot(r.idbot);
		selectedRow = normalizeParams(defaultValuesBot(fullBot || r));
		health = fullBot || r;
		resetTabs();

		// El servidor re-habilita solo un bot que él mismo apagó cuando cambia el token o
		// el código, pero solo si el guardado no manda `enabled` explícito — y este editor
		// siempre lo manda. Se deja el interruptor en verde para que corregir la causa y
		// guardar tenga el mismo efecto aquí que por MCP, y el panel de salud explica por qué.
		if (health?.disabled_by === 'system' && selectedRow.enabled === false) {
			selectedRow.enabled = true;
		}

		showEditor = true;
	}}
	onnewrow={() => {
		// console.log('TABLE > NEW ', idapp);
		selectedRow = normalizeParams(defaultValuesBot({ idapp }));
		health = null;
		resetTabs();
		showEditor = true;
	}}
	ondeleterow={async (r) => {
		// console.log('TABLE > DELETE ', r);
		if (r.rows.length > 0 && confirm('Are you sure you want to delete the selected bot(s)?')) {
			await deleteBots(r.rows);
		}
	}}
></Table>

{#if idapp}
	<SlideFullScreen bind:show={showEditor}>
		<Level left={[]} right={[r01]}>
			{#snippet r01()}
				<div class="field has-addons">
					<p class="control">
						<button
							class="button is-small is-link"
							onclick={async () => {
								try {
									await saveBot();
									showEditor = false;
								} catch (error) {
									// Error already notified; keep editor open for correction
								}
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
								if (
									confirm(
										'If you cancel, you will lose absolutely all changes made to the bot. Do you want to continue?'
									)
								) {
									showEditor = false;
								}
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

		<div>
			{#if health && healthStatus}
				<!-- Estado observado del runtime. Va arriba porque responde antes que nada a
				     "¿está corriendo y tengo que hacer algo?", que es lo que trae al usuario
				     a abrir el bot. -->
				<div class="box">
					<div class="level is-mobile mb-2">
						<div class="level-left">
							<div class="level-item">
								<span class="icon-text">
									<span class="icon {healthStatus.color}">
										<i class={healthStatus.icon}></i>
									</span>
									<span class="has-text-weight-semibold">Runtime status: {healthStatus.label}</span>
								</span>
							</div>
						</div>
						<div class="level-right">
							<div class="level-item">
								{#if healthStatus.needsAction}
									<span class="tag is-danger">Needs attention</span>
								{:else}
									<span class="tag is-light">No action needed</span>
								{/if}
							</div>
						</div>
					</div>

					<p class="help mb-3">{healthStatus.description}</p>

					{#if health.disabled_by === 'system'}
						<div class="notification is-warning is-light py-2 px-3 mb-3">
							<span class="icon-text">
								<span class="icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
								<span>
									The system disabled this bot{health.disabled_reason
										? ` (${health.disabled_reason})`
										: ''}. Fix the token or the code and save: it has already been switched back
									to <strong>Enabled</strong> for you.
								</span>
							</span>
						</div>
					{:else if health.disabled_by === 'user'}
						<p class="help mb-3">
							This bot was disabled manually. It will not start again until you enable it.
						</p>
					{/if}

					<div class="columns is-multiline is-mobile mb-0">
						<div class="column is-one-quarter">
							<p class="heading">Consecutive failures</p>
							<p>{health.failure_count ?? 0}</p>
						</div>
						<div class="column is-one-quarter">
							<p class="heading">Last error type</p>
							<p>{health.last_error_type || '—'}</p>
						</div>
						<div class="column is-one-quarter">
							<p class="heading">Last failure</p>
							<p>{formatMoment(health.last_failure_at)}</p>
						</div>
						<div class="column is-one-quarter">
							<p class="heading">Next retry</p>
							<p>{formatMoment(health.next_retry_at)}</p>
						</div>
						<div class="column is-one-quarter">
							<p class="heading">Last started</p>
							<p>{formatMoment(health.last_started_at)}</p>
						</div>
						<div class="column is-one-quarter">
							<p class="heading">Last healthy</p>
							<p>{formatMoment(health.last_healthy_at)}</p>
						</div>
						<div class="column is-one-quarter">
							<p class="heading">Disabled by</p>
							<p>{health.disabled_by || '—'}</p>
						</div>
						<div class="column is-one-quarter">
							<p class="heading">Provider</p>
							<p>{health.provider || '—'}</p>
						</div>
					</div>

					{#if health.last_error_message}
						<div>
							<p class="heading">Last error message</p>
							<pre class="is-size-7">{health.last_error_message}</pre>
						</div>
					{/if}
				</div>
			{/if}

			<Tab bind:tabs={tabList} bind:active={activeTab}></Tab>
		</div>
	</SlideFullScreen>
{/if}

{#snippet tab_general()}
	<div class="columns">
		<div class="column is-one-third">
			<Input label="Name:" bind:value={selectedRow.name}></Input>
		</div>
		<div class="column is-one-third">
			<Input type="boolean" label="Enabled" bind:value={selectedRow.enabled}></Input>
		</div>
		<div class="column is-one-third">
			<PredictiveInput
				label="Environment"
				classLabel="is-small"
				classInput="is-small"
				bind:options={optionsEnvironment}
				bind:selectedValue={selectedRow.environment}
			></PredictiveInput>
		</div>
	</div>

	<div class="columns">
		<div class="column is-full">
			<AppVarsSelector
				label="Token:"
				freeTyping={true}
				placeholder="Bot Token or $_VAR_NAME"
				bind:environment={selectedRow.environment}
				bind:custom={customToken}
				bind:appvar={selectedRow.token}
				onselect={(selected) => {
					if (selected.appvar) {
						selectedRow.token = selected.appvar;
					} else {
						selectedRow.token = selected.custom;
					}
				}}
			></AppVarsSelector>
		</div>
	</div>

	<div class="columns">
		<div class="column is-full">
			<TextArea label="Description:" bind:value={selectedRow.description}></TextArea>
		</div>
	</div>
{/snippet}

{#snippet tab_params()}
	<p class="help">Parameters passed to the bot at runtime.</p>
	<EditorCode lang="json" showFormat={true} bind:code={selectedRow.params}></EditorCode>
{/snippet}

{#snippet tab_code()}
	<p class="help">The constant $BOT is an instance of Grammy.</p>
	<EditorCode lang="js" showFormat={true} bind:code={selectedRow.code}></EditorCode>
{/snippet}

{#snippet tab_backups()}
	<!-- La consulta se dispara al entrar a la pestaña: montar `Backups` con el editor pediría
	     el historial de todos los bots que se abran, y solo interesa cuando hay que deshacer algo. -->
	{#if activeTab === TAB_BACKUPS && selectedRow.idbot}
		<p class="help mb-3">
			Every save and every deletion stores a version. Restoring one loads it into this form;
			nothing changes until you press <strong>Save &amp; Deploy</strong>.
		</p>
		<Backups
			bind:idbot={selectedRow.idbot}
			onselect={(backup) => {
				if (backup && backup.idbot == selectedRow.idbot) {
					// El snapshot es solo configuración: `health` es estado observado del
					// runtime y se deja como está.
					selectedRow = normalizeParams(defaultValuesBot($state.snapshot(backup)));
					notify.push({
						message: `Bot ${selectedRow.name} loaded from backup. Save to persist.`,
						color: 'success'
					});
				}
			}}
		></Backups>
	{/if}
{/snippet}

{#snippet tab_logs()}
	{#if activeTab === TAB_LOGS && selectedRow.idbot}
		<p class="help mb-3">
			Lifecycle events (starts, stops, errors, retries) for this bot. Default window is 24 hours.
		</p>
		<BotLogs bind:idbot={selectedRow.idbot}></BotLogs>
	{/if}
{/snippet}
