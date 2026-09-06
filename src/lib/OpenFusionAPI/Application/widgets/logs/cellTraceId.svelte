<script>
	import { copyTextToClipboard } from '@rdsslab/svelte-components';
	import { Notifications } from '@rdsslab/svelte-components';

	let { value = $bindable(), row = $bindable(), onOpenTrace = undefined } = $props();

	let notify = new Notifications();

	async function copyId() {
		const { result, error } = await copyTextToClipboard(String(value));
		if (result) {
			notify.push({ message: 'Trace ID copied to clipboard', color: 'success' });
		} else if (error) {
			notify.push({ message: 'Could not copy the trace ID', color: 'danger' });
		}
	}

	function openTrace(event) {
		event.stopPropagation();
		if (onOpenTrace) {
			onOpenTrace({ row });
		}
	}
</script>

<td onclick={(e) => e.stopPropagation()}>
	{#if value}
		<div class="is-flex is-align-items-center" style="gap: 0.4rem;">
			<span
				class="is-size-7 has-text-grey"
				style="word-break: break-all; overflow-wrap: anywhere;"
				title={value}
			>
				{value}
			</span>
			<button class="button is-small is-text" title="Copy trace ID" onclick={copyId}>
				<span class="icon is-small">
					<i class="fa-regular fa-copy"></i>
				</span>
			</button>
			<button
				class="button is-small is-link is-outlined"
				title="View trace detail"
				onclick={openTrace}
			>
				<span class="icon is-small">
					<i class="fa-solid fa-diagram-project"></i>
				</span>
			</button>
		</div>
	{:else}
		<span>—</span>
	{/if}
</td>
