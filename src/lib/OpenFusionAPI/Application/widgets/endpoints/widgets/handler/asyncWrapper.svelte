<script>
	import { Input, TextArea } from '@rdsslab/svelte-components';
	/**
	 * @type {{endpoint: any, onchange: Function}}
	 */
	let { endpoint = $bindable({}), onchange = () => {} } = $props();

	function ensureAsyncConfig() {
		if (!endpoint.custom_data) endpoint.custom_data = {};
		if (!endpoint.custom_data.async) {
			endpoint.custom_data.async = { ttl_ms: 3600000, max_consumes: 5, notify_ws: false };
		}
	}

	$effect(() => {
		ensureAsyncConfig();
	});

	function update() {
		onchange({ code: endpoint.code, custom_data: endpoint.custom_data, data_test: endpoint.data_test });
	}
</script>

<div class="block">
	<div class="notification is-info is-light">
		<strong>ASYNC_WRAPPER</strong> — The <code>code</code> field must contain <strong>ONLY</strong> the <code>idendpoint</code> of the base endpoint (UUID). Configuration is read from <code>custom_data.async</code> of this async endpoint.
	</div>

	<TextArea
		label="Base endpoint ID (code)"
		rows="2"
		bind:value={endpoint.code}
		placeholder="e.g. c80415fa-1d7b-48c2-93aa-2607fd0f3804"
		onchange={update}
	/>

	<div class="columns">
		<div class="column">
			<Input
				label="TTL (ms)"
				type="number"
				bind:value={endpoint.custom_data.async.ttl_ms}
				min="1000"
				step="1000"
				onchange={update}
			/>
		</div>
		<div class="column">
			<Input
				label="Max consumes"
				type="number"
				bind:value={endpoint.custom_data.async.max_consumes}
				min="1"
				step="1"
				onchange={update}
			/>
		</div>
		<div class="column">
			<label class="checkbox" style="margin-top: 1.8em;">
				<input type="checkbox" bind:checked={endpoint.custom_data.async.notify_ws} onchange={update} />
				Notify via WebSocket
			</label>
		</div>
	</div>
</div>
