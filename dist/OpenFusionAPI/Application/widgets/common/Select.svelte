<script>
	let {
		/** @type {(option: string) => void} */
		onchange = () => {},
		option = $bindable('NA'),
		css_class = $bindable(' is-small '),
		options = $bindable(/** @type {Array<{id: string, value: string, enabled?: boolean}>} */ ([{ id: 'TEST', value: `TEST`, enabled: true }]))
	} = $props();

	function handleClick() {
		onchange(option);
	}
</script>

<div class="control">
	<div class="select {css_class}">
		<select bind:value={option} onchange={handleClick}>
			{#if options && options.length > 0}
				{#each options as h}
					<option value={h.id}>
						{h.value}
					</option>
				{/each}
			{/if}
		</select>
	</div>
</div>
