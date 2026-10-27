<script>
	import { Tab } from '@rdsslab/svelte-components';
	import AppVarsSelector from '$lib/OpenFusionAPI/Application/widgets/endpoints/widgets/app_vars_selector.svelte';

	let { endpoint = $bindable({}), onchange = () => {} } = $props();

	let tabList = $state([{ label: 'Url', isActive: true, component: tab_url }]);

	let lastCode = $state('');

	function getData() {
		return {
			code: endpoint.code,
			custom_data: $state.snapshot(endpoint.custom_data),
			data_test: $state.snapshot(endpoint.data_test),
			resource: endpoint.resource,
			method: endpoint.method,
			environment: endpoint.environment,
			endpoint: endpoint.endpoint
		};
	}

	function fnOnChange() {
		onchange(getData());
	}

	$effect(() => {
		endpoint?.code;
		if (endpoint.code !== lastCode) {
			lastCode = endpoint.code;
			fnOnChange();
		}
	});
</script>

{#snippet tab_url()}
	<div>
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">Url to make the request. The operation is similar to a proxy</label>
		<AppVarsSelector
			freeTyping={true}
			placeholder={'http://your.url/path'}
			classIcon={'fa-solid fa-globe'}
			label={'Url'}
			environment={endpoint.environment}
			bind:value={endpoint.code}
			onselect={(selected) => {
				fnOnChange();
			}}
		></AppVarsSelector>
	</div>
{/snippet}

<Tab bind:tabs={tabList}></Tab>
