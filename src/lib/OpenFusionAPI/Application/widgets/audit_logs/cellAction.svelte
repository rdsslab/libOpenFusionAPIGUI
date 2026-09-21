<script>
	let { value = $bindable(), row = $bindable() } = $props();

	const ACTION_CLASS = {
		login: 'is-info',
		login_failed: 'is-danger',
		logout: 'is-light',
		create: 'is-success',
		update: 'is-warning',
		delete: 'is-danger',
		enable: 'is-success',
		disable: 'is-warning',
		restore: 'is-info',
		bulk_delete: 'is-danger'
	};

	let badgeClass = $derived(ACTION_CLASS[value] || 'is-link');
</script>

<td>
	<div class="tags has-addons">
		<span class="tag {badgeClass}">{value || '—'}</span>
	</div>
</td>
