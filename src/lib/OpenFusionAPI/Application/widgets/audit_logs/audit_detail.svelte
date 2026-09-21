<script>
	import { SlideFullScreen, Level, JSONView } from '@rdsslab/svelte-components';

	let { show = $bindable(false), detail = $bindable(null), loading = $bindable(false) } = $props();

	function fmtISO(iso) {
		if (!iso) return '—';
		// SQLite devuelve "2026-09-21 01:37:15.959 +00:00" (separador espacio, sin T).
		// Se normaliza a ISO con Z para que Date convierta UTC -> hora local, igual
		// que la columna Date/Time de la tabla.
		const s = String(iso)
			.replace(' ', 'T')
			.replace(/\s*([+-]\d{2}:\d{2}|Z)\s*$/, 'Z');
		const d = new Date(s);
		if (!isNaN(d.getTime())) {
			const p = (n) => String(n).padStart(2, '0');
			return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
		}
		return String(iso);
	}

	function hasContent(value) {
		if (value === null || value === undefined) return false;
		if (typeof value === 'string') return value.trim() !== '';
		if (Array.isArray(value)) return value.length > 0;
		if (typeof value === 'object') return Object.keys(value).length > 0;
		return true;
	}

	let hasBefore = $derived(hasContent(detail?.before_data));
	let hasAfter = $derived(hasContent(detail?.after_data));
	let hasSnapshots = $derived(hasBefore || hasAfter);
	let statusText = $derived(detail?.status ? 'Success' : detail?.status === false ? 'Failed' : '');
</script>

<SlideFullScreen bind:show>
	<Level left={[]} right={[r01]}>
		{#snippet r01()}
			<div class="field has-addons">
				<p class="control">
					<button
						class="button is-small"
						onclick={() => {
							show = false;
						}}
					>
						<span class="icon is-small"><i class="fa-solid fa-xmark"></i></span>
						<span>Close</span>
					</button>
				</p>
			</div>
		{/snippet}
	</Level>

	{#if loading}
		<div class="has-text-centered py-6">
			<span class="icon is-large has-text-info">
				<i class="fas fa-spinner fa-pulse"></i>
			</span>
		</div>
	{:else if detail}
		<p class="heading has-text-grey">Audit event</p>
		<p class="is-family-monospace has-text-grey is-size-7">
			{detail.id ? `ID ${detail.id}` : ''}
		</p>

		<div class="field is-grouped is-grouped-multiline mb-3">
			<div class="control">
				<div class="tags has-addons">
					<span class="tag is-light">Date</span>
					<span class="tag">{fmtISO(detail.timestamp)}</span>
				</div>
			</div>
			{#if detail.action}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Action</span>
						<span class="tag is-info">{detail.action}</span>
					</div>
				</div>
			{/if}
			{#if statusText}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Result</span>
						<span class="tag {detail.status ? 'is-success' : 'is-danger'}">{statusText}</span>
					</div>
				</div>
			{/if}
			{#if detail.result_code != null}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Code</span>
						<span class="tag">{detail.result_code}</span>
					</div>
				</div>
			{/if}
		</div>

		<div class="field is-grouped is-grouped-multiline mb-3">
			{#if detail.actor_username}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Actor</span>
						<span class="tag">{detail.actor_username}</span>
					</div>
				</div>
			{/if}
			{#if detail.actor_kind}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Actor type</span>
						<span class="tag">{detail.actor_kind}</span>
					</div>
				</div>
			{/if}
			{#if detail.actor_id}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Actor id</span>
						<span class="tag">{detail.actor_id}</span>
					</div>
				</div>
			{/if}
			{#if detail.entity_type}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Entity</span>
						<span class="tag">{detail.entity_type}</span>
					</div>
				</div>
			{/if}
			{#if detail.entity_id}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Entity id</span>
						<span class="tag">{detail.entity_id}</span>
					</div>
				</div>
			{/if}
			{#if detail.target_username}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Target</span>
						<span class="tag">{detail.target_username}</span>
					</div>
				</div>
			{/if}
			{#if detail.environment}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Env</span>
						<span class="tag">{detail.environment}</span>
					</div>
				</div>
			{/if}
			{#if detail.idapp}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">idapp</span>
						<span class="tag">{detail.idapp}</span>
					</div>
				</div>
			{/if}
			{#if detail.ip}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">IP</span>
						<span class="tag">{detail.ip}</span>
					</div>
				</div>
			{/if}
			{#if detail.idclient}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Client</span>
						<span class="tag">{detail.idclient}</span>
					</div>
				</div>
			{/if}
			{#if detail.trace_id}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Trace ID</span>
						<span class="tag" style="word-break: break-all;">{detail.trace_id}</span>
					</div>
				</div>
			{/if}
		</div>

		{#if detail.user_agent}
			<div class="mb-2">
				<p class="heading">User agent</p>
				<p class="is-size-7 has-text-grey" style="word-break: break-all;">{detail.user_agent}</p>
			</div>
		{/if}

		{#if detail.message}
			<div class="mb-3">
				<JSONView jsonObject={detail.message} label="Message" maxHeight={220} showBox={false} />
			</div>
		{/if}

		{#if hasSnapshots}
			<div class="notification is-info is-light py-2 px-3 mb-3">
				<span class="icon-text is-size-7">
					<span class="icon"><i class="fa-solid fa-circle-info"></i></span>
					<span>Secret fields (passwords, tokens, appvar values…) are stored as [REDACTED].</span>
				</span>
			</div>
			<div class="columns">
				<div class="column is-half">
					{#if hasBefore}
						<JSONView
							jsonObject={detail.before_data}
							label="Before"
							maxHeight={480}
							showBox={true}
						/>
					{:else}
						<p class="has-text-grey is-italic is-size-7">
							No before snapshot stored for this event.
						</p>
					{/if}
				</div>
				<div class="column is-half">
					{#if hasAfter}
						<JSONView jsonObject={detail.after_data} label="After" maxHeight={480} showBox={true} />
					{:else}
						<p class="has-text-grey is-italic is-size-7">
							No after snapshot stored for this event.
						</p>
					{/if}
				</div>
			</div>
		{:else}
			<p class="has-text-grey is-italic is-size-7">No snapshots stored for this event.</p>
		{/if}
	{/if}
</SlideFullScreen>
