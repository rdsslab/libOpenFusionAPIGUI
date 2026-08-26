<script>
	import AppVars from './variables.svelte';
	import {
		userStore,
		statusSystemEndpointsStore
	} from '../../utils/stores.js';
	import { currentUserHasPermission, getDefaultEnvironment } from '../../utils/permissions.js';
	import { restoreSystemEndpoints } from '../../utils/request.js';

	import { onMount } from 'svelte';

	let vars_widget;
	let { idapp = $bindable(0), onsavedeploy = () => {} } = $props();

	const permEnv = getDefaultEnvironment();
	const currentUser = $derived($userStore?.user);
	const canEdit = $derived(currentUserHasPermission(currentUser, permEnv, 'appvars', 'edit'));

	onMount(async () => {
		let status_sys_endp = await restoreSystemEndpoints(false, $userStore.token);
		statusSystemEndpointsStore.set(status_sys_endp);
	});
</script>

<div class="">
	APP VARIABLES
	<AppVars bind:this={vars_widget} bind:idapp environment="*" isReadOnly={!canEdit}></AppVars>
</div>
