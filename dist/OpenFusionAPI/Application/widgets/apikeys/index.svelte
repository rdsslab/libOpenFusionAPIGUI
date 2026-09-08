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
		Notifications,
		copyTextToClipboard
	} from '@rdsslab/svelte-components';

	import { url_paths } from '../../utils/paths.js';
	import uFetch from '@rdsslab/uFetch';
	import CellMethod from '../endpoints/columns/cellMethod.svelte';
	import {
		userStore,
		statusSystemEndpointsStore
	} from '../../utils/stores.js';
	import {
		currentUserHasPermission,
		getDefaultEnvironment
	} from '../../utils/permissions.js';
	import { GetAPIKeys, GetAPIClients } from '../../utils/request.js';
	import CellToken from './cellToken.svelte';

	let { idapp = $bindable(), onchange = () => {} } = $props();

	const uF = new uFetch();
	const permEnv = getDefaultEnvironment();
	const currentUser = $derived($userStore?.user);
	const canCreate = $derived(
		currentUserHasPermission(currentUser, permEnv, 'apiclients', 'create')
	);
	const canEdit = $derived(currentUserHasPermission(currentUser, permEnv, 'apiclients', 'edit'));
	const canDelete = $derived(
		currentUserHasPermission(currentUser, permEnv, 'apiclients', 'delete')
	);
	let showEditor = $state(false);
	let selectedRow = $state({
		idkey: '',
		idclient: '',
		enabled: true,
		startAt: '',
		endAt: '',
		description: '',
		token: '',
		idapp: idapp
	});
	let originalForm = $state({
		idkey: '',
		idclient: '',
		enabled: true,
		startAt: '',
		endAt: '',
		description: '',
		token: ''
	});
	let jwtCopied = $state(false);
	const isEditing = $derived(!!selectedRow.idkey);
	const todayISO = () => new Date().toISOString().split('T')[0];
	const nextMonthISO = () => {
		const d = new Date();
		d.setMonth(d.getMonth() + 1);
		return d.toISOString().split('T')[0];
	};
	let notify = new Notifications();
	let optionsClients = $state([{ name: 'dsdf', value: 'dsdf' }]);
	const clientLabel = $derived(
		(optionsClients || []).find((c) => String(c.value) === String(selectedRow?.idclient))?.name ||
			selectedRow?.idclient ||
			''
	);
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
			try {
				let resp = await uF.post({ url: url_paths.APIKeys, data: row });
				let text = await resp.text();
				let jresp = null;
				if (text) {
					try {
						jresp = JSON.parse(text);
					} catch (e) {
						jresp = null;
					}
				}

				if (!resp.ok) {
					notify.push({
						message: (jresp && jresp.error) || `Error saving API key (HTTP ${resp.status})`,
						color: 'danger'
					});
					return false;
				}

				if (jresp && jresp.error) {
					notify.push({ message: jresp.error, color: 'danger' });
					return false;
				}

				if (jresp && typeof jresp === 'object') {
					if (jresp.idkey) selectedRow.idkey = jresp.idkey;
					if (jresp.token) selectedRow.token = jresp.token;
				}

				await loadAPIKeys();

				if (selectedRow.idkey && !selectedRow.token) {
					const found = (DataTableAPIs || []).find(
						(r) => String(r.idkey) === String(selectedRow.idkey)
					);
					if (found && found.token) selectedRow.token = found.token;
				} else if (!selectedRow.idkey && selectedRow.token) {
					const found = (DataTableAPIs || []).find((r) => r.token && r.token === selectedRow.token);
					if (found && found.idkey) selectedRow.idkey = found.idkey;
				}

				originalForm = $state.snapshot(selectedRow);
				notify.push({ message: 'API key saved successfully', color: 'success' });
				return true;
			} catch (error) {
				console.error('saveAPIKey error >>>>>>>>>>>>>', error);
				notify.push({
					message: error.message || 'Failed to save API key',
					color: 'danger'
				});
				return false;
			}
		}
		return false;
	}

	async function onSaveClick() {
		if (isEditing && selectedRow.enabled === false && originalForm.enabled === true) {
			if (
				!confirm(
					'Disabling this API key means it will no longer be accepted by the API and its token will stop working. Do you want to continue?'
				)
			) {
				return;
			}
		}
		await saveAPIKey();
	}

	async function regenerateToken() {
		if (
			!confirm(
				'Regenerating the JWT will replace the current API key token. Any consumer using the current token will stop working and must be updated to the new token. This is required when the application signing key (JWT Key) was regenerated. Do you want to continue?'
			)
		) {
			return;
		}

		await saveAPIKey();
	}

	function hasChanges() {
		if (!selectedRow.idkey) {
			return (
				String(selectedRow.idclient || '') !== String(originalForm.idclient || '') ||
				selectedRow.enabled !== originalForm.enabled ||
				String(selectedRow.startAt || '') !== String(originalForm.startAt || '') ||
				String(selectedRow.endAt || '') !== String(originalForm.endAt || '') ||
				String(selectedRow.description || '') !== String(originalForm.description || '')
			);
		}
		return (
			selectedRow.enabled !== originalForm.enabled ||
			String(selectedRow.description || '') !== String(originalForm.description || '')
		);
	}

	function closeEditor() {
		if (
			hasChanges() &&
			!confirm('You have unsaved changes. Do you really want to close without saving?')
		) {
			return;
		}
		showEditor = false;
	}

	async function copyJwt() {
		const { result } = await copyTextToClipboard(selectedRow.token || '');
		jwtCopied = result;
		if (result) {
			setTimeout(() => {
				jwtCopied = false;
			}, 2000);
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
			idkey: '',
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
	showNewButton={canCreate}
	showDeleteButton={canDelete}
	showEditButton={canEdit}
	oneditrow={(r) => {
		selectedRow.idkey = r.idkey || '';
		selectedRow.enabled = Boolean(r.enabled);
		selectedRow.startAt = r.startAt || '';
		selectedRow.endAt = r.endAt || '';
		selectedRow.idclient = r.idclient || '';
		selectedRow.token = r.token || '';
		selectedRow.description = r.description || '';
		selectedRow.idapp = idapp;
		originalForm = $state.snapshot(selectedRow);
		jwtCopied = false;
		showEditor = true;
	}}
	onnewrow={() => {
		fnDefaulValues();
		originalForm = $state.snapshot(selectedRow);
		jwtCopied = false;
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
		<div class="buttons are-small"></div>
	{/snippet}
</Table>

{#if idapp && selectedRow}
	<SlideFullScreen bind:show={showEditor}>
		<Level left={[]} right={[r01]}>
			{#snippet r01()}
				<div class="field has-addons">
					{#if isEditing}
						<p class="control">
							<button
								class="button is-small is-warning is-light"
								title="Re-sign the token with the current application JWT key"
								onclick={regenerateToken}
							>
								<span class="icon is-small">
									<i class="fa-solid fa-rotate"></i>
								</span>
								<span>Regenerate JWT</span>
							</button>
						</p>
						<p class="control">
							<button class="button is-small is-link" onclick={onSaveClick}>
								<span class="icon is-small">
									<i class="fa-solid fa-save"></i>
								</span>
								<span>Save</span>
							</button>
						</p>
					{:else}
						<p class="control">
							<button class="button is-small is-link" onclick={onSaveClick}>
								<span class="icon is-small">
									<i class="fa-solid fa-rocket"></i>
								</span>
								<span>Save & Deploy</span>
							</button>
						</p>
					{/if}
					<p class="control">
						<button class="button is-small" onclick={closeEditor}>
							<span class="icon is-small">
								<i class="fa-solid fa-xmark"></i>
							</span>
							<span>{isEditing ? 'Close' : 'Cancel'}</span>
						</button>
					</p>
				</div>
			{/snippet}
		</Level>

		<div>
			{#if isEditing}
				<div class="field has-addons">
					<p class="control">
						<span class="button is-static is-small"> API Client </span>
					</p>
					<p class="control is-expanded">
						<input class="input is-small" type="text" readonly value={clientLabel} />
					</p>
				</div>
			{:else}
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
			{/if}

			<div class="columns">
				<div class="column is-one-third">
					<Input type="boolean" label="Enabled" bind:value={selectedRow.enabled}></Input>
				</div>
				<div class="column is-one-third">
					{#if isEditing}
						<Input type="date" label="Date Start: " value={selectedRow.startAt} readonly></Input>
					{:else}
						<Input type="date" label="Date Start: " bind:value={selectedRow.startAt}></Input>
					{/if}
				</div>
				<div class="column is-one-third">
					{#if isEditing}
						<Input type="date" label="Date End: " value={selectedRow.endAt} readonly></Input>
					{:else}
						<Input type="date" label="Date End: " bind:value={selectedRow.endAt}></Input>
					{/if}
				</div>
			</div>

			{#if selectedRow.token}
				<div class="columns">
					<div class="column is-full">
						<div class="field has-addons">
							<p class="control">
								<span class="button is-static is-small"> JWT Token </span>
							</p>
							<p class="control is-expanded">
								<input class="input is-small" type="text" readonly value={selectedRow.token} />
							</p>
							<p class="control">
								<button class="button is-small" title="Copy token" onclick={copyJwt}>
									<span class="icon is-small">
										<i class={jwtCopied ? 'fa-solid fa-check' : 'fa-regular fa-copy'}></i>
									</span>
									<span>{jwtCopied ? 'Copied' : 'Copy'}</span>
								</button>
							</p>
						</div>
					</div>
				</div>
			{/if}

			<div class="columns">
				<div class="column is-full">
					<TextArea label="Description" bind:value={selectedRow.description}></TextArea>
				</div>
			</div>
		</div>
	</SlideFullScreen>
{/if}
