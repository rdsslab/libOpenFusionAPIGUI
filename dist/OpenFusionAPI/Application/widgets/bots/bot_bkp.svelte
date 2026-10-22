<script>
	import { onMount } from 'svelte';
	import { Table } from '@rdsslab/svelte-components';
	import { url_paths } from '$lib/OpenFusionAPI/Application/utils/paths.js';
	import uFetch from '@rdsslab/uFetch';

	let uF = new uFetch(url_paths.getBotBackups);

	let {
		idbot = $bindable(),

		onselect = (d) => {}
	} = $props();

	let dataBackups = $state([]);
	let selectionType = $state(1);
	// `data` lleva el snapshot completo, token incluido: se usa para restaurar pero no se
	// pinta en la tabla.
	let columns = $state({
		hash: { hidden: true },
		idbot: { hidden: true },
		data: { hidden: true }
	});

	let data_backup = $state();
	let class_search = $derived.by(() => {
		return data_backup && data_backup?.data?.idbot == idbot ? 'is-link' : '';
	});

	async function fetchData() {
		if (idbot) {
			selectionType = 1;
			try {
				// lightweight: false porque el botón de restaurar carga el snapshot en el
				// formulario; sin `data` no habría nada que restaurar.
				let req = await uF.get({ data: { idbot, lightweight: false } });
				dataBackups = await req.json();
			} catch (error) {
				console.error('Error fetching bot backups:', error);
			}
		} else {
			dataBackups = [];
		}
	}

	onMount(() => {
		fetchData();
	});
</script>

<Table
	{columns}
	bind:RawDataTable={dataBackups}
	left_items={[restoreBackup]}
	bind:selectionType
	onsearch={fetchData}
	onselectrows={(selected) => {
		if (selected.rows && selected.rows.length == 1) {
			data_backup = selected.rows[0];
		} else {
			data_backup = null;
		}
	}}
>
	{#snippet restoreBackup()}
		<button
			class="button is-small {class_search}"
			onclick={() => {
				if (
					onselect &&
					data_backup &&
					data_backup?.data?.idbot == idbot &&
					confirm('Are you sure to restore this backup?')
				) {
					onselect(data_backup.data);
				}
			}}
		>
			<span>Restore Backup {data_backup?.idbackup || ''}</span>
			<span class="icon">
				<i class="fa-regular fa-circle-up"></i>
			</span>
		</button>
	{/snippet}
</Table>
