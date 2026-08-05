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
	import { defaultValuesBot, Environment } from '../../utils/static_values.js';
	import { url_paths } from '../../utils/paths.js';
	import uFetch from '@rdsslab/uFetch';
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
					ontrue: { label: 'Enabled' },
					onfalse: { label: 'Disabled' },
					editInline: false
				}
			}
		},
		environment: { label: 'Environment' },
		created_at: {
			label: 'Created',
			decorator: {
				component: ColumnTypes.DateTime
			}
		},
		updated_at: {
			label: 'Updated',
			decorator: {
				component: ColumnTypes.DateTime
			}
		}
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
		paramsString = JSON.stringify(selectedRow.params || {}, null, 2);
		showEditor = true;
	}}
	onnewrow={() => {
		// console.log('TABLE > NEW ', idapp);
		selectedRow = defaultValuesBot({ idapp });
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
