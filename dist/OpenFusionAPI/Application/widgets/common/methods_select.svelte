<script>
	import { onDestroy } from 'svelte';
	import { BasicSelect } from '@rdsslab/svelte-components';
	import { listMethodStore } from '../../utils/stores.js';

	/**
	 * @type {{disabled?: boolean, option?: string|number|undefined, onselect?: (e: {value: any}) => void}}
	 */
	let {
		disabled = $bindable(false),
		option = $bindable(undefined),
		onselect = (/** @type {{value: any}} */ s) => {}
	} = $props();

	/** @type {Array<{id: string, value: string, enabled?: boolean, description?: string}>} */
	let methods = $state([]);

	const unsubscribe = listMethodStore.subscribe((value) => {
		methods = value;
		//console.log('methods', methods);
	});
	onDestroy(unsubscribe);
</script>

{#if methods}
	<BasicSelect label="Method" bind:disabled bind:options={methods} bind:option {onselect} />
{/if}
