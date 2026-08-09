<script>
	import {
		BotRuntimeStatus,
		BotRuntimeStatusFallback
	} from '../../utils/static_values.js';

	let { value = $bindable(), row = $bindable() } = $props();

	let status = $derived(BotRuntimeStatus[value] || BotRuntimeStatusFallback);

	// Un bot en BACKOFF o QUARANTINED sigue reintentando solo, así que lo útil no es el
	// error sino cuándo vuelve a intentarlo.
	let retryIn = $derived.by(() => {
		if (!row?.next_retry_at) return '';
		const seconds = Math.round((new Date(row.next_retry_at).getTime() - Date.now()) / 1000);
		if (!Number.isFinite(seconds) || seconds <= 0) return 'now';
		if (seconds < 60) return `${seconds}s`;
		if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
		return `${Math.round(seconds / 3600)}h`;
	});

	let title = $derived(
		[
			status.description,
			row?.last_error_type ? `Last error: ${row.last_error_type}` : '',
			row?.failure_count ? `Consecutive failures: ${row.failure_count}` : ''
		]
			.filter(Boolean)
			.join('\n')
	);
</script>

<td>
	<div class="tags has-addons" {title}>
		<span class="tag is-{status.background}">
			<span class="icon is-small">
				<i class={status.icon}></i>
			</span>
			<span>{status.label}</span>
		</span>
		{#if retryIn && (value === 'BACKOFF' || value === 'QUARANTINED')}
			<!-- El plazo del próximo reintento es la respuesta a "¿tengo que hacer algo?": no. -->
			<span class="tag is-dark">retry {retryIn}</span>
		{:else if row?.failure_count > 0 && value !== 'RUNNING'}
			<span class="tag is-dark">{row.failure_count}</span>
		{/if}
	</div>
</td>
