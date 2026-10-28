<script>
	'use strict';
	import { onDestroy, onMount } from 'svelte';
	import { storeCountResponseStatusCode } from '../../../utils/stores.js';

	let { value = $bindable(), row = $bindable() } = $props();
	/** @type {Record<string, number>|undefined} */
	let value_count_status_code = $state(undefined);

	const unsubscribe = storeCountResponseStatusCode.subscribe((ListCountStatusCode) => {
		//console.log('storeCountResponseStatusCode >>>> ', ListCountStatusCode);
		if (row && row.idendpoint) {
			value_count_status_code = ListCountStatusCode[row.idendpoint];
		}
	});

	onMount(() => {
		//
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<td>
	{#if row.method !== 'WS'}
		{#if value_count_status_code}
			<div class="field is-grouped is-grouped-multiline">
				{#each Object.entries(value_count_status_code) as [statusCode, count]}
					{@const code = Number(statusCode)}
					<div class="control">
						<div class="tags has-addons">
							{#if code >= 100 && code < 200}
								<span class="tag is-info">{statusCode}</span>
							{:else if code >= 200 && code < 300}
								<span class="tag is-success">{statusCode}</span>
							{:else if code >= 300 && code < 400}
								<span class="tag is-primary">{statusCode}</span>
							{:else if code >= 400 && code < 500}
								<span class="tag is-warning">{statusCode}</span>
							{:else if code >= 500 && code < 600}
								<span class="tag is-danger">{statusCode}</span>
							{:else}
								<span class="tag is-dark">{statusCode}</span>
							{/if}
							<span class="tag is-dark">{count}</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</td>
