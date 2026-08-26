<script>
	import { onMount } from 'svelte';
	import {
		Table,
		ColumnTypes,
		SlideFullScreen,
		Level,
		PredictiveInput,
		Input,
		TextArea,
		Notifications
	} from '@rdsslab/svelte-components';

	import { url_paths } from '$lib/OpenFusionAPI/Application/utils/paths.js';
	import uFetch from '@rdsslab/uFetch';
	import CellMethod from '$lib/OpenFusionAPI/Application/widgets/endpoints/columns/cellMethod.svelte';
	import {
		userStore,
		statusSystemEndpointsStore
	} from '$lib/OpenFusionAPI/Application/utils/stores.js';
	import {
		GetAPIKeys,
		GetAPIClients
	} from '$lib/OpenFusionAPI/Application/utils/request.js';
	import CellToken from './cellToken.svelte';

	let { idapp = $bindable(), onchange = () => {} } = $props();

	const uF = new uFetch();
	let showEditor = $state(false);
	let selectedRow = $state({
		idclient: '',
		enabled: true,
		startAt: '',
		endAt: '',
		description: '',
		token: '',
		idapp: idapp
	});
	const todayISO = () => new Date().toISOString().split('T')[0];
	const nextMonthISO = () => {
		const d = new Date();
		d.setMonth(d.getMonth() + 1);
		return d.toISOString().split('T')[0];
	};
	let notify = new Notifications();
	let optionsClients = $state([{ name: 'dsdf', value: 'dsdf' }]);
	let DataTableAPIs = $state([]);
	let columns = $state({
		idkey: { hidden: true },
		idclient: { hidden: true },
		idapp: { hidden: true },
		enabled: {
			label: 'Enabled',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					ontrue: { label: 'Enabled' },
					onfalse: { label: 'Unabled' },
					editInline: false
				}
			}
		},
		startAt: {
			label: 'datestart',
			decorator: {
				component: ColumnTypes.DateTime
			}
		},
		endAt: {
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
		token: {
			label: 'Token',
			decorator: {
				component: CellToken
			}
		},
		params: {},
		exec_time_limit: {},
		failed_attempts: {},
		status: {},
		last_exec_time: {},
		last_response: {},
		app: { hidden: true },
		resource: { hidden: true },
		environment: { hidden: true },
		app_enabled: { hidden: true }
	});

	$effect(async () => {
		idapp;
		await loadAPIKeys();
	});

	async function loadAPIKeys() {
		if (idapp) {
			let jresp = await GetAPIKeys(idapp, $userStore.token);

			if (Array.isArray(jresp)) {
				//console.log(jresp);
				DataTableAPIs = jresp;
				//	console.log('DataTableAPIs', DataTableAPIs);
			} else {
				DataTableAPIs = [];
			}

			let clients = await GetAPIClients();
			if (Array.isArray(clients)) {
				//console.log(jresp);
				optionsClients = clients.map((c) => {
					return {
						name: `${c.username} - ${c.first_name} ${c.last_name} - ${c.email} - ${c.document_id}`,
						value: c.idclient
					};
				});
				//	console.log('DataTableAPIs', DataTableAPIs);
			} else {
				optionsClients = [];
			}
		} else {
			console.log('idapp not found');
		}
	}

	async function saveAPIKey() {
		if (idapp) {
			let row = $state.snapshot(selectedRow);
			console.log('saveAPIKey >>>>>>>>>>>>>', row);
			let resp = await uF.post({ url: url_paths.APIKeys, data: row });
			let jresp = await resp.json();
			console.log('saveAPIKey >>>>>>>>>>>>>', selectedRow, jresp);
			await loadAPIKeys();
		}
	}

	async function deleteTasks(tasks) {
		let idtasks = tasks.map((t) => {
			return t.idtask;
		});

		console.log('deleteTasks >>>>>>>>>>>>>', idtasks, url_paths.deleteIntervalTasksByIdTask);
		let resp = await uF.DELETE({ url: url_paths.deleteIntervalTasksByIdTask, data: idtasks });
		let jresp = await resp.json();
		//console.log('saveAPIKey >>>>>>>>>>>>>', selectedRow, jresp);
		await loadAPIKeys();
	}

	function fnDefaulValues() {
		selectedRow = {
			idclient: '',
			enabled: true,
			startAt: todayISO(),
			endAt: nextMonthISO(),
			description: '',
			token: '',
			idapp: idapp
		};
	}

	onMount(() => {
		//
		//selectedRow = fnDefaulValues(defaultApp, selectedRow);
		//loadAPIKeys();
		fnDefaulValues();
	});
</script>

<Table
	bind:RawDataTable={DataTableAPIs}
	bind:columns
	left_items={[lt01]}
	showEditRow={true}
	showNewButton={true}
	showDeleteButton={true}
	showEditButton={true}
	oneditrow={(r) => {
		selectedRow.enabled = r.task_enabled;
		selectedRow.startAt = r.datestart || '';
		selectedRow.endAt = r.dateend || '';
		selectedRow.idclient = r.idclient || '';
		selectedRow.token = r.token || '';
		selectedRow.description = r.description || '';
		selectedRow.idapp = idapp;
		showEditor = true;
	}}
	onnewrow={() => {
		fnDefaulValues();
		console.log('TABLE > NEW ', selectedRow);
		showEditor = true;
	}}
	ondeleterow={async (r) => {
		console.log('TABLE > DELETE ', r);
		if (r.rows.length > 0 && confirm('Are you sure you want to delete this task?')) {
			await deleteTasks(r.rows);
		}
	}}
>
	{#snippet lt01()}
		<div class="buttons are-small">
		</div>
	{/snippet}
</Table>

{#if idapp && selectedRow}
	<SlideFullScreen bind:show={showEditor}>
		<Level left={[]} right={[r01]}>
			{#snippet r01()}
				<div class="field has-addons">
					<p class="control">
						<button
							class="button is-small is-link"
							onclick={async () => {
								//	confirmSaveApp();
								await saveAPIKey();
								showEditor = false;
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
								//console.log('app Actual', app, app_vars);

								if (
									confirm(
										'If you cancel, you will lose absolutely all changes made to the app. Do you want to continue?'
									)
								) {
									//	getApp();
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
			<PredictiveInput
				label="API Client"
				classLabel="is-small"
				classInput="is-small"
				bind:options={optionsClients}
				bind:selectedValue={selectedRow.idclient}
				onselect={(e) => {
					console.log(e, selectedRow);
				}}
			/>

			<div class="columns">
				<div class="column is-one-third">
					<Input type="boolean" label="Enabled" bind:value={selectedRow.enabled}></Input>
				</div>
				<div class="column is-one-third">
					<Input type="date" label="Date Start: " bind:value={selectedRow.startAt}></Input>
				</div>
				<div class="column is-one-third">
					<Input type="date" label="Date End: " bind:value={selectedRow.endAt}></Input>
				</div>
			</div>
			<div class="columns">
				<div class="column is-full">
					<TextArea label="Description" bind:value={selectedRow.description}></TextArea>
				</div>
			</div>
		</div>
	</SlideFullScreen>
{/if}


