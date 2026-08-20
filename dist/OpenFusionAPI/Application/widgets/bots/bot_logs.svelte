<script>
	import { onMount } from 'svelte';
	import { Table } from '@rdsslab/svelte-components';
	import { url_paths } from '../../utils/paths.js';
	import uFetch from '@rdsslab/uFetch';

	let { idbot = $bindable(), hours = 24 } = $props();

	let uF = new uFetch(url_paths.getBotLogs);
	let dataLogs = $state([]);

	let columns = $state({
		id: { hidden: true },
		idbot: { hidden: true },
		idapp: { hidden: true },
		trace_id: { hidden: true },
		timestamp: { label: 'Time' },
		provider: { label: 'Provider' },
		environment: { label: 'Env' },
		event: { label: 'Event' },
		log_level: { label: 'Level' },
		status_code: { label: 'Status' },
		error_type: { label: 'Error type' },
		message: { label: 'Message' },
		stack: { hidden: true },
		provider_response: { hidden: true },
		runtime_status_snapshot: { label: 'Runtime status' },
		failure_count_snapshot: { hidden: true },
		duration_ms: { label: 'Duration (ms)' },
		user_agent: { label: 'Source' },
		metadata: { hidden: true }
	});

	let inputHours = $state(hours);

	async function fetchLogs() {
		if (idbot) {
			try {
				let req = await uF.get({ data: { idbot, last_hours: inputHours } });
				let jresp = await req.json();
				if (jresp && jresp.success && Array.isArray(jresp.data)) {
					dataLogs = jresp.data;
				} else {
					dataLogs = [];
				}
			} catch (error) {
				console.error('Error fetching bot logs:', error);
				dataLogs = [];
			}
		} else {
			dataLogs = [];
		}
	}

	onMount(() => {
		fetchLogs();
	});
</script>

<div class="field has-addons mb-3">
	<p class="control">
		<input class="input is-small" type="number" min="1" max="72" bind:value={inputHours} style="width:70px" />
	</p>
	<p class="control">
		<button class="button is-small" onclick={fetchLogs}>
			<span class="icon is-small"><i class="fa-solid fa-rotate"></i></span>
			<span>Hours</span>
		</button>
	</p>
</div>

<Table {columns} bind:RawDataTable={dataLogs} onsearch={fetchLogs}></Table>
