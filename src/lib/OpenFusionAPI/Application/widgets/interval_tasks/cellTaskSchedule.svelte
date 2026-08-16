<script>
	let { value = $bindable(), row = $bindable() } = $props();

	let isCron = $derived(value === 'cron');
	let label = $derived(isCron ? row?.cron || 'Invalid cron' : `Every ${row?.interval ?? 300}s`);
	let title = $derived(
		isCron
			? `Cron${row?.timezone ? ` (${row.timezone})` : ''}`
			: `Fixed interval: ${row?.interval ?? 300} seconds`
	);
</script>

<td>
	<span class="icon-text" {title}>
		<span class="icon has-text-grey">
			<i class={isCron ? 'fa-solid fa-calendar-days' : 'fa-solid fa-repeat'}></i>
		</span>
		<span>{label}</span>
	</span>
</td>
