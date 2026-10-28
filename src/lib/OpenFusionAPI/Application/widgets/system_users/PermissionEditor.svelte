<script>
	import { Tab } from '@rdsslab/svelte-components';

	/** @type {{ctrl: import('#lib/OpenFusionAPI/types/models.js').UserCtrl}} */
	let { ctrl = $bindable({}) } = $props();

	const environments = ['dev', 'qa', 'prd'];

	const resources = [
		{ key: 'users', label: 'Users', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'apiclients', label: 'API Clients', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'endpoints', label: 'Endpoints', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'apps', label: 'Applications', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'appvars', label: 'App Variables', actions: ['read', 'create', 'edit', 'delete'] },
		{ key: 'bots', label: 'Bots', actions: ['read', 'create', 'edit', 'delete'] },
		{
			key: 'interval_tasks',
			label: 'Interval Tasks',
			actions: ['read', 'create', 'edit', 'delete']
		},
		{ key: 'logs', label: 'Logs', actions: ['read'] },
		{ key: 'settings', label: 'Settings', actions: ['read', 'edit'] }
	];

	/**
	 * `Tab` trabaja con el indice del tab activo, no con su id. El default es
	 * `prd` (ultimo elemento de `environments`).
	 */
	let activeTab = $state(environments.indexOf('prd'));
	const activeEnvironment = $derived(environments[activeTab] ?? 'prd');

	/**
	 * Garantiza que `ctrl.env` exista y lo devuelve ya tipado.
	 * @returns {Record<string, import('#lib/OpenFusionAPI/types/models.js').EnvPermissions>}
	 */
	function ensureEnv() {
		if (!ctrl || typeof ctrl !== 'object') ctrl = {};
		if (!ctrl.env || typeof ctrl.env !== 'object') ctrl.env = {};
		return ctrl.env;
	}

	function toggleAsAdmin() {
		ensureEnv();
		ctrl.as_admin = ctrl.as_admin === true ? false : true;
		ctrl = { ...ctrl };
	}

	/**
	 * @param {string} environment
	 * @param {string} resource
	 * @param {string} action
	 */
	function togglePermission(environment, resource, action) {
		const env = ensureEnv();
		if (!env[environment]) env[environment] = {};
		if (!env[environment][resource]) env[environment][resource] = {};

		const current = env[environment][resource][action] === true;
		env[environment][resource][action] = !current;

		if (Object.keys(env[environment][resource]).length === 0) {
			delete env[environment][resource];
		}
		if (Object.keys(env[environment]).length === 0) {
			delete env[environment];
		}
		ctrl = { ...ctrl };
	}

	/**
	 * @param {string} environment
	 * @param {string} resource
	 * @param {string} action
	 * @returns {boolean}
	 */
	function getPermission(environment, resource, action) {
		return ctrl?.env?.[environment]?.[resource]?.[action] === true;
	}
</script>

<div class="permission-editor">
	<div class="field mb-4">
		<!-- El checkbox de Bulma envuelve al <input>: el click en toda la fila lo
		     alterna. Los avisos reales son los de elemento no interactivo, no los
		     que se silenciaban antes, asi que el codigo de a11y va corregido. -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<label class="checkbox" onclick={toggleAsAdmin}>
			<input
				type="checkbox"
				checked={ctrl.as_admin === true}
				onchange={(e) => {
					e.preventDefault();
				}}
			/>
			<strong>Super Admin</strong>
			<span class="tag is-info is-light ml-2">Bypass all permissions</span>
		</label>
	</div>

	{#if ctrl.as_admin !== true}
		<Tab
			tabs={environments.map((e) => ({ id: e, label: e.toUpperCase() }))}
			bind:active={activeTab}
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
											checked={getPermission(activeEnvironment, res.key, act)}
											onchange={() => togglePermission(activeEnvironment, res.key, act)}
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
