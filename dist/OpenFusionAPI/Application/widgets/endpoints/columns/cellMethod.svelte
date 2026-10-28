<script>
	import BLabel from '../../common/icon_label.svelte';
	import { listHTTPMethods } from '../../../utils/static_values.js';
	import { onMount } from 'svelte';

	let { value = $bindable(''), row = $bindable() } = $props();

	let css_class_method = $state('');
	let css_icon = $state('fas fa-home');

	/**
	 * @param {string} method
	 */
	function setCSS(method) {
		let css_selected = listHTTPMethods[method];
		if (css_selected) {
			css_class_method = css_selected.color;
			css_icon = css_selected.icon;
		} else {
			css_class_method = '';
			css_icon = '';
		}
	}

	onMount(() => {
		setCSS(value);
	});
</script>

<td>
	{#if value != null}
		<BLabel bind:color={css_class_method} bind:label={value} bind:icon={css_icon}></BLabel>
	{/if}
</td>
