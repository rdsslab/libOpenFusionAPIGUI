<script>
	//	import { env_params } from '../utils.js';
	import { Environment } from '$lib/OpenFusionAPI/Application/utils/static_values.js';

	let { value = $bindable(), row = $bindable() } = $props();
	let env_params = $derived.by(() => {
		return Environment && Array.isArray(Environment)
			? Environment.find((item) => {
					return row.environment == item.id;
				})
			: [];
	});
</script>

<td>
	{#if env_params}
		<span class="icon-text">
			<span class="icon {env_params.color}">
				<i class={env_params.icon}></i>
			</span>
		</span>
	{/if}
</td>
