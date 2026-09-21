<script>
	let { value = $bindable(), row = $bindable() } = $props();

	const ENTITY_CLASS = {
		app: 'is-link',
		appvar: 'is-info',
		endpoint: 'is-primary',
		bot: 'is-warning',
		interval_task: 'is-info',
		user: 'is-success',
		apiclient: 'is-dark',
		apikey: 'is-danger'
	};

	let badgeClass = $derived(ENTITY_CLASS[value] || 'is-light');
</script>

<td>
	<div class="tags has-addons">
		<span class="tag {badgeClass}">{value || '—'}</span>
	</div>
</td>
