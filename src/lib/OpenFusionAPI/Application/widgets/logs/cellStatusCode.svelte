<script>
	import { httpStatusText } from '$lib/OpenFusionAPI/Application/utils/httpStatus.js';

	let { value = $bindable(), row = $bindable() } = $props();

	let statusClass = $derived.by(() => {
		const code = Number(value);
		if (!Number.isFinite(code) || code < 100) return 'is-light';
		if (code < 200) return 'is-info';
		if (code < 300) return 'is-success';
		if (code < 400) return 'is-warning';
		if (code < 500) return 'is-danger';
		return 'is-danger';
	});

	// El backend marca los intentos de fuerza bruta / ataques con message.type = 'posible_ataque'
	// (solo disponible cuando la consulta trae el payload completo, lightweight=false). El campo
	// message llega como string JSON sin serializar.
	let messageObj = $derived.by(() => {
		const m = row?.message;
		if (!m) return null;
		if (typeof m === 'string') {
			try {
				return JSON.parse(m);
			} catch {
				return null;
			}
		}
		return m;
	});

	let isAttack = $derived(messageObj?.type === 'posible_ataque');

	let titleText = $derived(
		[`HTTP ${value ?? ''} ${httpStatusText(value)}`, isAttack ? 'Possible attack detected' : '']
			.filter(Boolean)
			.join('\n')
	);
</script>

<td>
	<div class="tags has-addons" {titleText}>
		{#if value != null && value !== ''}
			<span class="tag {statusClass}">{value}</span>
		{:else}
			<span class="tag is-light">—</span>
		{/if}
		{#if isAttack}
			<span class="tag is-dark" title="Possible attack detected">
				<span class="icon is-small">
					<i class="fa-solid fa-shield-halved"></i>
				</span>
			</span>
		{/if}
	</div>
</td>
