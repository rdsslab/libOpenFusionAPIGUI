<script>
	import {
		getIntervalTaskLastResultStatus,
		getIntervalTaskRuntimeStatus,
		IntervalTaskStatus,
		IntervalTaskStatusFallback
	} from '$lib/OpenFusionAPI/Application/utils/static_values.js';

	let { value = $bindable(), row = $bindable(), currentState = false } = $props();

	let recordedStatus = $derived(IntervalTaskStatus[Number(value)] || IntervalTaskStatusFallback);
	let status = $derived(currentState ? getIntervalTaskRuntimeStatus(value) : recordedStatus);
	let lastResultStatus = $derived(currentState ? getIntervalTaskLastResultStatus(value) : null);

	// Una tarea que falla se reintenta sola con espera creciente, así que lo útil no es
	// repetir el error sino cuándo vuelve a intentarlo.
	let nextIn = $derived.by(() => {
		if (!row?.next_run) return '';
		const seconds = Math.round((new Date(row.next_run).getTime() - Date.now()) / 1000);
		if (!Number.isFinite(seconds)) return '';
		if (seconds <= 0) return 'now';
		if (seconds < 60) return `${seconds}s`;
		if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
		return `${Math.round(seconds / 3600)}h`;
	});

	let title = $derived(
		[
			status.description,
			lastResultStatus ? `Último resultado: ${lastResultStatus.label}` : '',
			row?.failed_attempts ? `Fallos consecutivos: ${row.failed_attempts}` : '',
			row?.last_exec_time ? `Última duración: ${row.last_exec_time} ms` : ''
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
		{#if row?.failed_attempts > 0}
			<span class="tag is-dark">{row.failed_attempts} fails</span>
		{:else if nextIn && status === IntervalTaskStatus[0]}
			<span class="tag is-dark">next {nextIn}</span>
		{/if}
	</div>
</td>
