<script>
	import { onMount, onDestroy } from 'svelte';
	import { storeUsersList } from '../../../utils/stores.js';
	import { Table, ColumnTypes } from '@rdsslab/svelte-components';
	//import { TimeOutChangeValue } from '../../../../app/utils.js';

	let { users = $bindable({}) } = $props();

	/** @type {Array<Record<string, unknown>>} */
	let table_users = $state([]);
	/** @type {Array<Record<string, unknown>>} */
	let data_users = [];

	let columns = $state({
		auth: {
			label: 'Authorization',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					ontrue: { label: 'Enabled' },
					onfalse: { label: 'Unabled' },
					editInline: true
				}
			}
		},
		iduser: { label: 'iduser', hidden: true },
		enabled: {
			label: 'Enabled',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					ontrue: { label: 'Enabled' },
					onfalse: { label: 'Unabled' },
					editInline: false
				}
			}
		},
		name: { label: 'name' },
		username: { label: 'username' },
		email: { label: 'email' }
	});

	/** @type {ReturnType<typeof setTimeout>|undefined} */
	let timeoutChageAuth;
	/*
	$effect(() => {
		if (table_users) {
			timeoutChageAuth = TimeOutChangeValue(timeoutChageAuth, parseCode);
		}
	});
*/

	const unsubscribe = storeUsersList.subscribe((value) => {
		data_users = value;
		buildTableUsers();
	});

	function defaultValue() {
		if (users == null) {
			users = [];
		}
	}

	function buildTableUsers() {
		defaultValue();

		if (data_users && Array.isArray(data_users)) {
			table_users = data_users.map((u) => {
				return { auth: users.includes(u.iduser), ...u };
			});
		}
	}

	onMount(() => {
		defaultValue();
	});

	// Writeback: cuando el operador activa/desactiva el checkbox `auth` de un
	// usuario, se refleja en `users` (array de ids de usuario autorizados).
	$effect(() => {
		const normalized = Array.isArray(users) ? users : [];
		const selected = table_users
			.filter((u) => u.auth === true)
			.map((u) => u.iduser)
			.filter((id) => id != null);
		if (JSON.stringify(selected.slice().sort()) !== JSON.stringify(normalized.slice().sort())) {
			users = selected;
		}
	});

	onDestroy(() => {
		clearTimeout(timeoutChageAuth);
		unsubscribe();
	});
</script>

<Table bind:RawDataTable={table_users} bind:columns></Table>
