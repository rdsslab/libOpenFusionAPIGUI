<script>
	import { Tab } from '@rdsslab/svelte-components';

	let { ctrl = $bindable({}) } = $props();

	const environments = ['dev', 'qa', 'prd'];

	const resources = [
		{ key: 'users', label: 'Users', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'apiclients', label: 'API Clients', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'endpoints', label: 'Endpoints', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'apps', label: 'Applications', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'appvars', label: 'App Variables', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'bots', label: 'Bots', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'interval_tasks', label: 'Interval Tasks', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'logs', label: 'Logs', actions: ['read'] },
		{ key: 'settings', label: 'Settings', actions: ['read', 'edit'] }
	];

	let activeTab = $state('prd');

	function ensureCtrl() {
		if (!ctrl || typeof ctrl !== 'object') ctrl = {};
		if (!ctrl.env || typeof ctrl.env !== 'object') ctrl.env = {};
	}

	function toggleAsAdmin() {
		ensureCtrl();
		ctrl.as_admin = ctrl.as_admin === true ? false : true;
		ctrl = { ...ctrl };
	}

	function togglePermission(environment, resource, action) {
		ensureCtrl();
		if (!ctrl.env[environment]) ctrl.env[environment] = {};
		if (!ctrl.env[environment][resource]) ctrl.env[environment][resource] = {};

		const current = ctrl.env[environment][resource][action] === true;
		ctrl.env[environment][resource][action] = !current;

		if (Object.keys(ctrl.env[environment][resource]).length === 0) {
			delete ctrl.env[environment][resource];
		}
		if (Object.keys(ctrl.env[environment]).length === 0) {
			delete ctrl.env[environment];
		}
		ctrl = { ...ctrl };
	}

	function getPermission(environment, resource, action) {
		return ctrl?.env?.[environment]?.[resource]?.[action] === true;
	}
</script>

<div class="permission-editor">
	<div class="field mb-4">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<label class="checkbox" onclick={toggleAsAdmin}>
			<input type="checkbox" checked={ctrl.as_admin === true} onchange={(e) => { e.preventDefault(); }} />
			<strong>Super Admin</strong>
			<span class="tag is-info is-light ml-2">Bypass all permissions</span>
		</label>
	</div>

	{#if ctrl.as_admin !== true}
		<Tab
			tabs={environments.map((e) => ({ id: e, label: e.toUpperCase() }))}
			bind:selected={activeTab}
		/>

		<div class="permission-grid mt-3">
			<table class="table is-fullwidth is-bordered is-narrow">
				<thead>
					<tr>
						<th>Resource</th>
						<th class="has-text-centered">Read</th>
						<th class="has-text-centered">Create</th>
						<th class="has-text-centered">Edit</th>
						<th class="has-text-centered">Delete</th>
					</tr>
				</thead>
				<tbody>
					{#each resources as res}
						<tr>
							<td><strong>{res.label}</strong></td>
							{#each ['read', 'create', 'edit', 'delete'] as act}
								<td class="has-text-centered">
									{#if res.actions.includes(act)}
										<input
											type="checkbox"
											checked={getPermission(activeTab, res.key, act)}
											onchange={() => togglePermission(activeTab, res.key, act)}
										/>
									{:else}
										<span class="has-text-grey-light">—</span>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.permission-editor :global(.tabs) {
		margin-bottom: 0.5rem;
	}
	table {
		font-size: 0.85rem;
	}
	table th {
		background-color: #f5f5f5;
	}
</style>
