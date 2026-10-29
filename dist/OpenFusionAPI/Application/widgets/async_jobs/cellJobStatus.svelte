<script>
	import { getAsyncJobStatus } from '../../utils/static_values.js';

	let { value = $bindable(), row = $bindable() } = $props();

	// La celda conserva la firma de los decoradores de Table (value = la celda
	// cruda de `status`), pero el estado efectivo sale de la fila: EXPIRED es
	// derivado y depende de `expires_at`, no de lo escrito en la BD.
	let status = $derived(getAsyncJobStatus(row));
</script>

<td>
	<span class="tag is-{status.background}" title={status.description}>
		<span class="icon is-small">
			<i class={status.icon}></i>
		</span>
		<span>{status.label}</span>
	</span>
</td>
