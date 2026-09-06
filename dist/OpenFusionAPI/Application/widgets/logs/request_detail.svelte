<script>
	import { Modal, JSONView } from '@rdsslab/svelte-components';
	import { DateTime } from 'luxon';
	import { httpStatusText } from '../../utils/httpStatus.js';

	let { show = $bindable(false), row = $bindable(), appName = $bindable('') } = $props();

	let isAttack = $derived(row?.message?.type === 'posible_ataque');

	let hasMessage = $derived(row?.message != null && String(row.message).trim() !== '');

	let jsonFields = $derived(
		['req_headers', 'res_headers', 'query', 'body', 'params', 'response_data'].filter(
			(k) => row?.[k] != null && String(row[k] ?? '').trim() !== ''
		)
	);

	let formattedDate = $derived.by(() => {
		if (!row?.timestamp) return '—';
		const t = DateTime.fromISO(row.timestamp);
		return t.isValid ? t.toFormat('yyyy-MM-dd HH:mm:ss') : String(row.timestamp);
	});
</script>

<Modal bind:show showCloseButton={true}>
	<div class="box">
		<div class="level is-mobile mb-3">
			<div class="level-left">
				<div>
					<p class="heading">Request detail</p>
					<p class="is-size-6 is-family-monospace has-text-grey">
						{row?.id ? String(row.id).slice(0, 8) : ''}
					</p>
				</div>
			</div>
			<div class="level-right">
				{#if isAttack}
					<span class="tag is-danger">
						<span class="icon is-small">
							<i class="fa-solid fa-shield-halved"></i>
						</span>
						<span>Possible attack</span>
					</span>
				{/if}
			</div>
		</div>

		<div class="field is-grouped is-grouped-multiline mb-3">
			<div class="control">
				<div class="tags has-addons">
					<span class="tag is-light">Date</span>
					<span class="tag">{formattedDate}</span>
				</div>
			</div>
			{#if row?.method}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Method</span>
						<span class="tag is-info">{row.method}</span>
					</div>
				</div>
			{/if}
			{#if row?.status_code != null && row.status_code !== ''}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Status</span>
						<span class="tag is-dark" title={httpStatusText(row.status_code)}
							>{row.status_code}</span
						>
					</div>
				</div>
			{/if}
			{#if row?.environment}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Env</span>
						<span class="tag">{row.environment}</span>
					</div>
				</div>
			{/if}
			{#if appName}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">App</span>
						<span class="tag">{appName}</span>
					</div>
				</div>
			{/if}
			{#if row?.idapp}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">idapp</span>
						<span class="tag">{row.idapp}</span>
					</div>
				</div>
			{/if}
			{#if row?.idendpoint}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">idendpoint</span>
						<span class="tag">{row.idendpoint}</span>
					</div>
				</div>
			{/if}
			{#if row?.log_level != null}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Log level</span>
						<span class="tag">{row.log_level}</span>
					</div>
				</div>
			{/if}
			{#if row?.response_time != null}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Time</span>
						<span class="tag">{row.response_time} ms</span>
					</div>
				</div>
			{/if}
			{#if row?.client}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Client IP</span>
						<span class="tag">{row.client}</span>
					</div>
				</div>
			{/if}
			{#if row?.trace_id}
				<div class="control">
					<div class="tags has-addons">
						<span class="tag is-light">Trace ID</span>
						<span class="tag" style="word-break: break-all;">{row.trace_id}</span>
					</div>
				</div>
			{/if}
		</div>

		{#if row?.url}
			<div class="mb-2">
				<p class="heading">Resource</p>
				<p class="is-family-code is-size-7" style="word-break: break-all;">{row.url}</p>
			</div>
		{/if}
		{#if row?.user_agent}
			<div class="mb-2">
				<p class="heading">User agent</p>
				<p class="is-size-7 has-text-grey" style="word-break: break-all;">{row.user_agent}</p>
			</div>
		{/if}

		{#if hasMessage}
			<div class="mb-3">
				{@render jsonBlock(row.message, 'Message')}
			</div>
		{/if}

		{#if jsonFields.length > 0}
			{#each jsonFields as field}
				<div class="mb-3">
					{@render jsonBlock(row[field], field)}
				</div>
			{/each}
		{:else}
			<p class="has-text-grey is-italic is-size-7">
				No request/response payload stored for this log entry.
			</p>
		{/if}
	</div>
</Modal>

{#snippet jsonBlock(data, label)}
	<JSONView jsonObject={data} {label} maxHeight={340} showBox={false} />
{/snippet}
