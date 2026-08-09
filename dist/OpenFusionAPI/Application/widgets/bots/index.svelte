<script>
	import { onMount } from 'svelte';
	import {
		Table,
		ColumnTypes,
		SlideFullScreen,
		Level,
		PredictiveInput,
		Input,
		EditorCode,
		Notifications
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
	import TextArea from '../common/textArea.svelte';
	import { userStore, statusSystemEndpointsStore } from '../../utils/stores.js';
	import { restoreSystemEndpoints } from '../../utils/request.js';

	let { idapp = $bindable(), onchange = () => {} } = $props();

	let notify = new Notifications();
	const uF = new uFetch();
	let showEditor = $state(false);
	let selectedRow = $state(defaultValuesBot({}));
	let paramsString = $state('{}');
	let DataTableBots = $state([]);

	let optionsEnvironment = $state(
		Environment.map((e) => {
			return { name: e.value, value: e.id };
		})
	);

	/** Salud del bot abierto en el editor, tal como la reportó el servidor al cargarlo. */
	let health = $state(null);

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

		let params = {};
		try {
			params = paramsString ? JSON.parse(paramsString) : {};
		} catch (error) {
			notify.push({ message: 'Invalid JSON in Params field: ' + error.message, color: 'warning' });
			return;
		}

		let row = $state.snapshot(selectedRow);
		row.idapp = idapp;
		row.params = params;

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

	onMount(() => {
		selectedRow = defaultValuesBot({});
		health = null;
		paramsString = '{}';
	});
</script>

<Table
	bind:RawDataTable={DataTableBots}
	bind:columns
	showEditRow={true}
	showNewButton={true}
	showDeleteButton={true}
	showEditButton={true}
	oneditrow={async (r) => {
		// console.log('TABLE > EDIT ', r);
		let fullBot = await getBot(r.idbot);
		selectedRow = defaultValuesBot(fullBot || r);
		health = fullBot || r;
		paramsString = JSON.stringify(selectedRow.params || {}, null, 2);

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
		selectedRow = defaultValuesBot({ idapp });
		health = null;
		paramsString = '{}';
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

			<div class="columns">
				<div class="column is-one-third">
					<Input label="Name: " bind:value={selectedRow.name}></Input>
				</div>
				<div class="column is-one-third">
					<Input label="Token: " type="password" bind:value={selectedRow.token}></Input>
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
				<div class="column is-one-third">
					<Input type="boolean" label="Enabled" bind:value={selectedRow.enabled}></Input>
				</div>
				<div class="column is-two-thirds">
					<Input label="Description: " bind:value={selectedRow.description}></Input>
				</div>
			</div>

			<div class="columns">
				<div class="column">
					<TextArea label="Params (JSON)" bind:value={paramsString}></TextArea>
				</div>
			</div>

			<div class="columns">
				<div class="column">
					<p class="help">The constant $BOT is an instance of Grammy.</p>
					<EditorCode
						lang="js"
						showFormat={true}
						bind:code={selectedRow.code}
					></EditorCode>
				</div>
			</div>
		</div>
	</SlideFullScreen>
{/if}
