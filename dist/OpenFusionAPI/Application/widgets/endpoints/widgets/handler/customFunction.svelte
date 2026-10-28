<script>
	import { onMount } from 'svelte';
	import {
		listFunctionStoreDev,
		listFunctionStoreQA,
		listFunctionStorePRD
	} from '../../../../utils/stores.js';
	import SelectFns from '../../../common/Select.svelte';
	import { Tab } from '@rdsslab/svelte-components';
	import { ensureDataTestShape } from '../../../../utils/utils.js';

	let { endpoint = $bindable({}), onchange = () => {} } = $props();
	let functions = $derived.by(() => {
		/** @type {Array<{id: string, value: string|number}>} */
		let r = [];

		switch (endpoint.environment) {
			case 'dev':
				r = $listFunctionStoreDev;
				break;
			case 'qa':
				r = $listFunctionStoreQA;
				break;
			case 'prd':
				r = $listFunctionStorePRD;
				break;
		}
		return r;
	});

	let tabList = $state([{ label: 'Function', component: tab_fn }]);

	function defaultValues() {
		if (!endpoint) {
			endpoint = { data_test: {}, method: 'GET', resource: '', endpoint: '' };
		}

		if (!endpoint?.data_test) {
			endpoint.data_test = ensureDataTestShape({});
		}

		if (!endpoint?.method) {
			endpoint.method = 'GET';
		}
		if (!endpoint?.resource) {
			endpoint.resource = '';
		}
		if (!endpoint?.endpoint) {
			endpoint.endpoint = '';
		}
	}

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

	onMount(() => {
		defaultValues();
	});
</script>

{#snippet tab_fn()}
	<div class="content is-small">Use the selected function to return a response.</div>

	<div class="field is-horizontal">
		<div class="field-label is-normal">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="label is-small">Function</label>
		</div>
		<div class="field-body">
			<div class="field is-narrow">
				<SelectFns
					options={functions}
					bind:option={endpoint.code}
					onchange={(/** @type {string} */ s) => {
						fnOnChange();
					}}
				/>
			</div>
		</div>
	</div>
{/snippet}

<svelte:boundary onerror={(e) => console.error(e)}><Tab bind:tabs={tabList}></Tab></svelte:boundary>
