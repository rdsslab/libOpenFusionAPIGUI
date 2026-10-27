<script>
	import AppVars from './variables.svelte';
	import { userStore } from '../../utils/stores.js';
	import {
		currentUserHasPermission,
		getDefaultEnvironment
	} from '../../utils/permissions.js';

	let vars_widget;
	let { idapp = $bindable(0) } = $props();

	const permEnv = getDefaultEnvironment();
	const currentUser = $derived($userStore?.user);
	const canEdit = $derived(currentUserHasPermission(currentUser, permEnv, 'appvars', 'edit'));
</script>

<div class="">
	APP VARIABLES
	<AppVars bind:this={vars_widget} bind:idapp environment="*" isReadOnly={!canEdit}></AppVars>
</div>
