<script>
	// Historial de ejecuciones de una tarea programada. Hasta ahora solo se conservaba la
	// última respuesta, así que un fallo intermitente era invisible: aquí se ve cada
	// corrida con su duración, su código HTTP y su error.
	import { onMount } from 'svelte';
	import { Table, ColumnTypes } from '@rdsslab/svelte-components';
	import { url_paths } from '$lib/OpenFusionAPI/Application/utils/paths.js';
	import CellTaskStatus from '$lib/OpenFusionAPI/Application/widgets/interval_tasks/cellTaskStatus.svelte';
	import { storeIntervalTaskEvent } from '$lib/OpenFusionAPI/Application/utils/stores.js';
	import uFetch from '@rdsslab/uFetch';

	let { task = $bindable({}) } = $props();

	const uF = new uFetch(url_paths.getIntervalTaskRuns);

	let dataRuns = $state([]);
	let loading = $state(false);

	let columns = $state({
		idrun: { hidden: true },
		idtask: { hidden: true },
		started_at: { label: 'Started', decorator: { component: ColumnTypes.DateTime } },
		finished_at: { label: 'Finished', decorator: { component: ColumnTypes.DateTime } },
		duration_ms: { label: 'Duration (ms)' },
		status: { label: 'Status', decorator: { component: CellTaskStatus } },
		http_status: { label: 'HTTP' },
		error: { label: 'Error' },
		response: { hidden: true }
	});

	export async function fetchData() {
		if (!task?.idtask) {
			dataRuns = [];
			return;
		}

		loading = true;
		try {
			const req = await uF.get({ data: { idtask: task.idtask, limit: 200 } });
			const jresp = await req.json();
			dataRuns = Array.isArray(jresp) ? jresp : [];
		} catch (error) {
			console.error('Error fetching interval task runs:', error);
			dataRuns = [];
		} finally {
			loading = false;
		}
	}

	// Cada vez que el planificador termina una ejecución de ESTA tarea se recarga la
	// tabla, para no dejar la pantalla mostrando datos viejos mientras está abierta.
	$effect(() => {
		const ev = $storeIntervalTaskEvent;
		if (!ev || !task?.idtask) return;
		if (String(ev.idtask) !== String(task.idtask)) return;
		if (Number(ev.status) === 1) return; // el inicio todavía no genera fila

		fetchData();
	});

	onMount(() => {
		fetchData();
	});
</script>

<div class="mb-2">
	<span class="tag is-link is-light">Task {task?.idtask ?? '?'}</span>
	<span class="tag is-light">[{task?.method ?? ''}] {task?.url ?? ''}</span>
	<span class="tag is-light">History limit: {task?.history_limit ?? 50}</span>
	{#if loading}
		<span class="tag is-info is-light">Loading…</span>
	{/if}
</div>

<Table {columns} bind:RawDataTable={dataRuns} onsearch={fetchData}></Table>
