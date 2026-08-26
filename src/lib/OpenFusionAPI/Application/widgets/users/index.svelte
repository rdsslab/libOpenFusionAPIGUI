<script>
	import { onMount } from 'svelte';
	import {
		Table,
		ColumnTypes,
		SlideFullScreen,
		Level,
		Input,
		BasicSelect,
		DialogModal,
		Notifications
	} from '@rdsslab/svelte-components';
	import { userStore } from '$lib/OpenFusionAPI/Application/utils/stores.js';
	import {
		GetAPIClientsList,
		CreateAPIClient,
		ChangeAPIClientPassword
	} from '$lib/OpenFusionAPI/Application/utils/request.js';

	let notify = new Notifications();
	let showEditor = $state(false);
	let showChangePassword = $state(false);
	let isEditing = $state(false);
	let DataTableUsers = $state([]);
	let selectedRow = $state(getDefaultValues());
	let passwordData = $state({ newPassword: '', repeatNewPassword: '' });

	const optionsDocumentType = [
		{ name: 'Passport', value: 'passport' },
		{ name: 'ID Card', value: 'id_card' },
		{ name: 'Driver License', value: 'driver_license' },
		{ name: 'Social Security', value: 'social_security' },
		{ name: 'Tax ID', value: 'tax_id' },
		{ name: 'Other', value: 'other' },
		{ name: 'Unknown', value: 'unknown' }
	];

	const optionsStatus = [
		{ name: 'Initial', value: 'initial' },
		{ name: 'Active', value: 'active' },
		{ name: 'Suspended', value: 'suspended' },
		{ name: 'Inactive', value: 'inactive' }
	];

	let columns = $state({
		idclient: { hidden: true },
		username: { label: 'Username' },
		name: { label: 'Name' },
		email: { label: 'Email' },
		status: { label: 'Status' },
		enabled: {
			label: 'Enabled',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					custom: {
						ontrue: { label: 'Enabled' },
						onfalse: { label: 'Disabled' },
						editInline: false
					}
				}
			}
		},
		document_type: { hidden: true },
		document_id: { hidden: true },
		phone: { hidden: true },
		startAt: { hidden: true },
		endAt: { hidden: true },
		last_login: { hidden: true },
		exp_time: { hidden: true },
		custom_data: { hidden: true },
		change_password: { hidden: true },
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
		}
	});

	function getDefaultValues() {
		return {
			idclient: '',
			username: '',
			first_name: '',
			last_name: '',
			email: '',
			document_type: 'unknown',
			document_id: '',
			phone: '',
			password: '',
			repeatPassword: '',
			startAt: new Date().toISOString().split('T')[0],
			endAt: '',
			enabled: true,
			exp_time: 3600,
			status: 'initial'
		};
	}

	let passwordMatch = $derived(passwordData.newPassword === passwordData.repeatNewPassword);

	$effect(async () => {
		await loadUsers();
	});

	async function loadUsers() {
		try {
			let clients = await GetAPIClientsList();

			if (Array.isArray(clients)) {
				DataTableUsers = clients.map((c) => ({
					...c,
					name: `${c.first_name || ''} ${c.last_name || ''}`.trim()
				}));
			} else {
				DataTableUsers = [];
			}
		} catch (error) {
			console.error('loadUsers error:', error);
			notify.push({ message: error.message || 'Failed to load users', color: 'danger' });
			DataTableUsers = [];
		}
	}

	async function saveUser() {
		try {
			let row = $state.snapshot(selectedRow);

			if (isEditing) {
				delete row.password;
				delete row.repeatPassword;
			} else {
				if (!row.password || row.password.length === 0) {
					notify.push({ message: 'Password is required for new users', color: 'warning' });
					return;
				}
				if (row.password !== row.repeatPassword) {
					notify.push({ message: 'Passwords do not match', color: 'warning' });
					return;
				}
			}

			let result = await CreateAPIClient(row);

			if (result && result.client) {
				notify.push({ message: 'User saved successfully', color: 'success' });
				showEditor = false;
				await loadUsers();
			} else {
				let msg = result?.error || result?.message || 'Failed to save user';
				notify.push({ message: msg, color: 'danger' });
			}
		} catch (error) {
			console.error('saveUser error:', error);
			notify.push({ message: error.message || 'Failed to save user', color: 'danger' });
		}
	}

	async function changePassword() {
		if (!passwordData.newPassword || !passwordData.repeatNewPassword) {
			notify.push({ message: 'Please fill in both password fields', color: 'warning' });
			return;
		}

		if (passwordData.newPassword !== passwordData.repeatNewPassword) {
			notify.push({ message: 'Passwords do not match', color: 'warning' });
			return;
		}

		try {
			let result = await ChangeAPIClientPassword({
				username: selectedRow.username,
				newPassword: passwordData.newPassword
			});

			if (result && result.success) {
				notify.push({ message: 'Password changed successfully', color: 'success' });
				showChangePassword = false;
				passwordData = { newPassword: '', repeatNewPassword: '' };
			} else {
				let msg = result?.error || result?.message || 'Failed to change password';
				notify.push({ message: msg, color: 'danger' });
			}
		} catch (error) {
			console.error('changePassword error:', error);
			notify.push({ message: error.message || 'Failed to change password', color: 'danger' });
		}
	}

	function openEditor(row = null) {
		if (row) {
			isEditing = true;
			selectedRow = {
				idclient: row.idclient || '',
				username: row.username || '',
				first_name: row.first_name || '',
				last_name: row.last_name || '',
				email: row.email || '',
				document_type: row.document_type || 'unknown',
				document_id: row.document_id || '',
				phone: row.phone || '',
				password: '',
				repeatPassword: '',
				startAt: row.startAt ? new Date(row.startAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
				endAt: row.endAt ? new Date(row.endAt).toISOString().split('T')[0] : '',
				enabled: row.enabled !== false,
				exp_time: row.exp_time || 3600,
				status: row.status || 'initial'
			};
		} else {
			isEditing = false;
			selectedRow = getDefaultValues();
		}
		showEditor = true;
	}

	function openChangePassword(row) {
		selectedRow = { ...row };
		passwordData = { newPassword: '', repeatNewPassword: '' };
		showChangePassword = true;
	}
</script>

<Table
	bind:RawDataTable={DataTableUsers}
	bind:columns
	showEditRow={true}
	showNewButton={true}
	showDeleteButton={false}
	showEditButton={true}
	oneditrow={(r) => {
		openEditor(r);
	}}
	onnewrow={() => {
		openEditor(null);
	}}
></Table>

{#if showEditor}
	<SlideFullScreen bind:show={showEditor}>
		<Level left={[]} right={[r01]}>
			{#snippet r01()}
				<div class="field has-addons">
					<p class="control">
						<button
							class="button is-small is-link"
							onclick={async () => {
								await saveUser();
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
										'If you cancel, you will lose absolutely all changes. Do you want to continue?'
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
					<Input label="Username:" bind:value={selectedRow.username} disabled={isEditing}></Input>
				</div>
				<div class="column is-one-third">
					<Input type="boolean" label="Enabled" bind:value={selectedRow.enabled}></Input>
				</div>
				<div class="column is-one-third">
					<BasicSelect
						label="Status"
						bind:value={selectedRow.status}
						options={optionsStatus}
					></BasicSelect>
				</div>
			</div>

			<div class="columns">
				<div class="column is-one-half">
					<Input label="First Name:" bind:value={selectedRow.first_name}></Input>
				</div>
				<div class="column is-one-half">
					<Input label="Last Name:" bind:value={selectedRow.last_name}></Input>
				</div>
			</div>

			<div class="columns">
				<div class="column is-full">
					<Input label="Email:" type="email" bind:value={selectedRow.email}></Input>
				</div>
			</div>

			<div class="columns">
				<div class="column is-one-third">
					<BasicSelect
						label="Document Type"
						bind:value={selectedRow.document_type}
						options={optionsDocumentType}
					></BasicSelect>
				</div>
				<div class="column is-one-third">
					<Input label="Document ID:" bind:value={selectedRow.document_id}></Input>
				</div>
				<div class="column is-one-third">
					<Input label="Phone:" bind:value={selectedRow.phone}></Input>
				</div>
			</div>

			<div class="columns">
				<div class="column is-one-third">
					<Input type="date" label="Start Date:" bind:value={selectedRow.startAt}></Input>
				</div>
				<div class="column is-one-third">
					<Input type="date" label="End Date:" bind:value={selectedRow.endAt}></Input>
				</div>
				<div class="column is-one-third">
					<Input type="number" label="Exp Time (seconds):" bind:value={selectedRow.exp_time}></Input>
				</div>
			</div>

			{#if !isEditing}
				<div class="columns">
					<div class="column is-one-half">
						<Input type="password" label="Password:" bind:value={selectedRow.password}></Input>
					</div>
					<div class="column is-one-half">
						<Input type="password" label="Repeat Password:" bind:value={selectedRow.repeatPassword}></Input>
					</div>
				</div>
			{/if}

			{#if !isEditing && selectedRow.password && selectedRow.repeatPassword && selectedRow.password !== selectedRow.repeatPassword}
				<div class="notification is-warning is-light py-2 px-3 mb-3">
					<span class="icon-text">
						<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
						<span>Passwords do not match.</span>
					</span>
				</div>
			{/if}

			{#if isEditing}
				<div class="buttons are-small mt-4">
					<button
						class="button is-warning is-outlined"
						onclick={() => {
							openChangePassword(selectedRow);
						}}
					>
						<span class="icon is-small">
							<i class="fa-solid fa-key"></i>
						</span>
						<span>Change Password</span>
					</button>
				</div>
			{/if}
		</div>
	</SlideFullScreen>
{/if}

<DialogModal
	title={titleModal}
	body={bodyDialogModal}
	onaccept={async () => {
		await changePassword();
	}}
	oncancel={() => {
		showChangePassword = false;
		passwordData = { newPassword: '', repeatNewPassword: '' };
	}}
	bind:show={showChangePassword}
>
	{#snippet titleModal()}
		<span>Change Password: {selectedRow.username}</span>
	{/snippet}

	{#snippet bodyDialogModal()}
		<Input type="password" label="New Password" bind:value={passwordData.newPassword}></Input>
		<Input type="password" label="Repeat New Password" bind:value={passwordData.repeatNewPassword}></Input>
		{#if !passwordMatch && passwordData.newPassword && passwordData.repeatNewPassword}
			<div class="notification is-warning is-light py-2 px-3">
				<span class="icon-text">
					<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
					<span>You must repeat the new password twice.</span>
				</span>
			</div>
		{/if}
	{/snippet}
</DialogModal>
