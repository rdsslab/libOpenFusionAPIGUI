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
		GetSystemUsersList,
		CreateSystemUser,
		UpdateSystemUser,
		DeleteSystemUser,
		ChangeSystemUserPassword
	} from '$lib/OpenFusionAPI/Application/utils/request.js';
	import { currentUserHasPermission, getDefaultEnvironment } from '$lib/OpenFusionAPI/Application/utils/permissions.js';
	import PermissionEditor from './PermissionEditor.svelte';

	let notify = new Notifications();
	let showEditor = $state(false);
	let showChangePassword = $state(false);
	let isEditing = $state(false);
	let DataTableUsers = $state([]);
	let selectedRow = $state(getDefaultValues());
	let passwordData = $state({ oldPassword: '', newPassword: '', repeatNewPassword: '' });

	const environment = getDefaultEnvironment();
	const currentUser = $derived($userStore?.user);
	const canCreate = $derived(currentUserHasPermission(currentUser, environment, 'users', 'create'));
	const canEdit = $derived(currentUserHasPermission(currentUser, environment, 'users', 'edit'));
	const canDelete = $derived(currentUserHasPermission(currentUser, environment, 'users', 'delete'));

	let columns = $state({
		iduser: { hidden: true },
		username: { label: 'Username' },
		fullname: { label: 'Name' },
		email: { label: 'Email' },
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
		ctrl: { hidden: true },
		start_date: { hidden: true },
		end_date: { hidden: true },
		exp_time: { hidden: true },
		last_login: {
			label: 'Last Login',
			decorator: { component: ColumnTypes.DateTime }
		},
		createdAt: {
			label: 'Created',
			decorator: { component: ColumnTypes.DateTime }
		}
	});

	function getDefaultValues() {
		return {
			iduser: 0,
			username: '',
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			repeatPassword: '',
			enabled: true,
			start_date: new Date().toISOString().split('T')[0],
			end_date: '',
			exp_time: 3600,
			ctrl: { as_admin: false, env: {} }
		};
	}

	let passwordMatch = $derived(
		passwordData.newPassword === passwordData.repeatNewPassword
	);

	$effect(async () => {
		await loadUsers();
	});

	async function loadUsers() {
		try {
			let users = await GetSystemUsersList();
			if (Array.isArray(users)) {
				DataTableUsers = users.map((u) => ({
					...u,
					fullname: `${u.first_name || ''} ${u.last_name || ''}`.trim()
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
				let result = await UpdateSystemUser(row);
				if (result && (result.success !== false || result.iduser)) {
					notify.push({ message: 'User updated successfully', color: 'success' });
					showEditor = false;
					await loadUsers();
				} else {
					let msg = result?.error || result?.message || 'Failed to update user';
					notify.push({ message: msg, color: 'danger' });
				}
			} else {
				if (!row.password || row.password.length === 0) {
					notify.push({ message: 'Password is required for new users', color: 'warning' });
					return;
				}
				if (row.password !== row.repeatPassword) {
					notify.push({ message: 'Passwords do not match', color: 'warning' });
					return;
				}
				let result = await CreateSystemUser(row);
				if (result && result.iduser) {
					notify.push({ message: 'User created successfully', color: 'success' });
					showEditor = false;
					await loadUsers();
				} else {
					let msg = result?.error || result?.message || 'Failed to create user';
					notify.push({ message: msg, color: 'danger' });
				}
			}
		} catch (error) {
			console.error('saveUser error:', error);
			notify.push({ message: error.message || 'Failed to save user', color: 'danger' });
		}
	}

	async function deleteUser() {
		if (!selectedRow?.iduser) return;
		if (!confirm(`Permanently delete user "${selectedRow.username}"? This cannot be undone.`)) return;

		try {
			let result = await DeleteSystemUser({ iduser: selectedRow.iduser });
			if (result && result.success !== false) {
				notify.push({ message: 'User deleted', color: 'success' });
				showEditor = false;
				await loadUsers();
			} else {
				let msg = result?.error || result?.message || 'Failed to delete user';
				notify.push({ message: msg, color: 'danger' });
			}
		} catch (error) {
			console.error('deleteUser error:', error);
			notify.push({ message: error.message || 'Failed to delete user', color: 'danger' });
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
			let result = await ChangeSystemUserPassword({
				username: selectedRow.username,
				oldPassword: passwordData.oldPassword,
				newPassword: passwordData.newPassword
			});
			if (result && result.success) {
				notify.push({ message: 'Password changed successfully', color: 'success' });
				showChangePassword = false;
				passwordData = { oldPassword: '', newPassword: '', repeatNewPassword: '' };
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
				iduser: row.iduser || 0,
				username: row.username || '',
				first_name: row.first_name || '',
				last_name: row.last_name || '',
				email: row.email || '',
				password: '',
				repeatPassword: '',
				enabled: row.enabled !== false,
				start_date: row.start_date ? new Date(row.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
				end_date: row.end_date ? new Date(row.end_date).toISOString().split('T')[0] : '',
				exp_time: row.exp_time || 3600,
				ctrl: row.ctrl ? JSON.parse(JSON.stringify(row.ctrl)) : { as_admin: false, env: {} }
			};
		} else {
			isEditing = false;
			selectedRow = getDefaultValues();
		}
		showEditor = true;
	}

	function openChangePassword(row) {
		selectedRow = { ...row };
		passwordData = { oldPassword: '', newPassword: '', repeatNewPassword: '' };
		showChangePassword = true;
	}
</script>

<Table
	bind:RawDataTable={DataTableUsers}
	bind:columns
	showEditRow={true}
	showNewButton={canCreate}
	showDeleteButton={false}
	showEditButton={canEdit}
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
					{#if canCreate || canEdit}
						<p class="control">
							<button class="button is-small is-link" onclick={async () => { await saveUser(); }}>
								<span class="icon is-small"><i class="fa-solid fa-rocket"></i></span>
								<span>Save & Deploy</span>
							</button>
						</p>
					{/if}
					{#if isEditing && canDelete}
						<p class="control">
							<button class="button is-small is-danger is-outlined" onclick={deleteUser}>
								<span class="icon is-small"><i class="fa-solid fa-trash"></i></span>
								<span>Delete</span>
							</button>
						</p>
					{/if}
					<p class="control">
						<button
							class="button is-small"
							onclick={() => {
								if (confirm('If you cancel, you will lose absolutely all changes. Do you want to continue?')) {
									showEditor = false;
								}
							}}
						>
							<span class="icon is-small"><i class="fa-solid fa-xmark"></i></span>
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
					<Input type="number" label="Exp Time (seconds):" bind:value={selectedRow.exp_time}></Input>
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
				<div class="column is-one-half">
					<Input type="date" label="Start Date:" bind:value={selectedRow.start_date}></Input>
				</div>
				<div class="column is-one-half">
					<Input type="date" label="End Date:" bind:value={selectedRow.end_date}></Input>
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
				{#if selectedRow.password && selectedRow.repeatPassword && selectedRow.password !== selectedRow.repeatPassword}
					<div class="notification is-warning is-light py-2 px-3 mb-3">
						<span class="icon-text">
							<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
							<span>Passwords do not match.</span>
						</span>
					</div>
				{/if}
			{/if}

			{#if isEditing}
				<div class="buttons are-small mt-4">
					<button class="button is-warning is-outlined" onclick={() => { openChangePassword(selectedRow); }}>
						<span class="icon is-small"><i class="fa-solid fa-key"></i></span>
						<span>Change Password</span>
					</button>
				</div>
			{/if}

			<hr />
			<h6 class="title is-6">Permissions</h6>
			<PermissionEditor bind:ctrl={selectedRow.ctrl} />
		</div>
	</SlideFullScreen>
{/if}

<DialogModal
	title={titleModal}
	body={bodyDialogModal}
	onaccept={async () => { await changePassword(); }}
	oncancel={() => {
		showChangePassword = false;
		passwordData = { oldPassword: '', newPassword: '', repeatNewPassword: '' };
	}}
	bind:show={showChangePassword}
>
	{#snippet titleModal()}
		<span>Change Password: {selectedRow.username}</span>
	{/snippet}

	{#snippet bodyDialogModal()}
		<Input type="password" label="Current Password" bind:value={passwordData.oldPassword}></Input>
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
