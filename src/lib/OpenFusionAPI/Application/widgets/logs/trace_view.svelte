<script>
	import { Modal, Notifications, copyTextToClipboard } from '@rdsslab/svelte-components';
	import { DateTime } from 'luxon';
	import { httpStatusText } from '$lib/OpenFusionAPI/Application/utils/httpStatus.js';
	import {
		getTraceSummary,
		getTraceErrorsOnly,
		getTraceSlowestHops
	} from '$lib/OpenFusionAPI/Application/utils/request.js';

	let { show = $bindable(false), trace_id = $bindable('') } = $props();

	let notify = new Notifications();

	let summary = $state(null);
	let errors = $state([]);
	let slowest = $state([]);
	let loading = $state(false);
	let errorText = $state('');

	function fmtTs(v) {
		if (v == null) return '—';
		const d = DateTime.fromISO(String(v));
		return d.isValid ? d.toFormat('yyyy-MM-dd HH:mm:ss') : String(v);
	}

	function fmtMs(v) {
		if (v == null) return '—';
		if (Number.isFinite(Number(v))) return `${Number(v).toLocaleString('en-US')} ms`;
		return String(v);
	}

	async function loadTrace() {
		if (!trace_id || !show) return;
		loading = true;
		errorText = '';
		summary = null;
		errors = [];
		slowest = [];
		try {
			const base = { trace_id };
			const [sum, errs, slw] = await Promise.all([
				getTraceSummary(base),
				getTraceErrorsOnly(base),
				getTraceSlowestHops(base)
			]);
			summary = sum;
			errors = Array.isArray(errs) ? errs : [];
			slowest = Array.isArray(slw) ? slw : [];
		} catch (e) {
			errorText = e?.message || String(e);
		} finally {
			loading = false;
		}
	}

	async function copyId() {
		const { result, error } = await copyTextToClipboard(String(trace_id));
		if (result) {
			notify.push({ message: 'Trace ID copied to clipboard', color: 'success' });
		} else if (error) {
			notify.push({ message: 'Could not copy the trace ID', color: 'danger' });
		}
	}

	let statusFamilies = $derived.by(() => {
		if (!summary?.by_status_family) return [];
		const order = ['2xx', '3xx', '4xx', '5xx', 'other'];
		return order
			.filter((key) => summary.by_status_family[key] != null)
			.map((key) => [key, summary.by_status_family[key]]);
	});

	function familyClass(fam) {
		if (fam === '2xx') return 'is-success';
		if (fam === '3xx') return 'is-warning';
		if (fam === '4xx' || fam === '5xx') return 'is-danger';
		return 'is-light';
	}
</script>

<Modal bind:show showCloseButton={true} closeOnEscape={true}>
	<div style="width: 95vw; max-width: 1100px; max-height: 88vh; overflow-y: auto;">
		<div class="box">
			<div class="level is-mobile mb-3">
				<div class="level-left">
					<div>
						<p class="heading">Trace</p>
						<p class="is-family-monospace is-size-7 has-text-grey" style="word-break: break-all;">
							{trace_id || '—'}
						</p>
					</div>
				</div>
				<div class="level-right">
					<button class="button is-small is-light" onclick={copyId} title="Copy trace ID">
						<span class="icon is-small">
							<i class="fa-regular fa-copy"></i>
						</span>
						<span>Copy</span>
					</button>
				</div>
			</div>

			{#if loading}
				<div class="has-text-centered my-5">
					<span class="loader is-size-1" style="color: #3e8ed0;"></span>
					<p class="is-size-7 has-text-grey mt-2">Loading trace data…</p>
				</div>
			{:else if errorText}
				<div class="notification is-danger is-light">
					<p class="is-size-7">Could not load trace: {errorText}</p>
				</div>
			{:else if summary}
				<div class="columns is-multiline is-variable is-2 mb-2">
					<div class="cell column">
						<div class="has-text-weight-semibold is-size-7">Total requests</div>
						<div class="is-size-6">{summary.total_requests ?? '—'}</div>
					</div>
					<div class="cell column">
						<div class="has-text-weight-semibold is-size-7">Errors</div>
						<div class="is-size-6 has-text-danger">{summary.errors_total ?? '—'}</div>
					</div>
					<div class="cell column">
						<div class="has-text-weight-semibold is-size-7">Slow hops</div>
						<div class="is-size-6 has-text-warning">{summary.slow_requests_total ?? '—'}</div>
					</div>
					<div class="cell column">
						<div class="has-text-weight-semibold is-size-7">Unique endpoints</div>
						<div class="is-size-6">{summary.unique_endpoints ?? '—'}</div>
					</div>
					{#if summary.worst_status_code != null && summary.worst_status_code > 0}
						<div class="cell column">
							<div class="has-text-weight-semibold is-size-7">Worst status</div>
							<div class="is-size-6" title={httpStatusText(summary.worst_status_code)}>
								{summary.worst_status_code}
							</div>
						</div>
					{/if}
					{#if summary.first_timestamp}
						<div class="cell column">
							<div class="has-text-weight-semibold is-size-7">First</div>
							<div class="is-size-7">{fmtTs(summary.first_timestamp)}</div>
						</div>
					{/if}
					{#if summary.last_timestamp}
						<div class="cell column">
							<div class="has-text-weight-semibold is-size-7">Last</div>
							<div class="is-size-7">{fmtTs(summary.last_timestamp)}</div>
						</div>
					{/if}
				</div>

				{#if statusFamilies.length > 0}
					<div class="mb-3">
						<p class="heading mb-1">Status distribution</p>
						<div class="tags">
							{#each statusFamilies as [fam, count]}
								<span class="tag {familyClass(fam)}">{fam}: {count}</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if summary.first_problematic_request}
					<div class="mb-2">
						<p class="heading mb-1">First problematic request</p>
						<div class="columns is-multiline is-variable is-2">
							<div class="cell column">
								<div class="has-text-weight-semibold is-size-7">When</div>
								<div class="is-size-7">{fmtTs(summary.first_problematic_request.timestamp)}</div>
							</div>
							{#if summary.first_problematic_request.status_code}
								<div class="cell column">
									<div class="has-text-weight-semibold is-size-7">Status</div>
									<div class="is-size-7">
										<span
											class="tag is-danger"
											title={httpStatusText(summary.first_problematic_request.status_code)}
										>
											{summary.first_problematic_request.status_code}
										</span>
									</div>
								</div>
							{/if}
							{#if summary.first_problematic_request.method}
								<div class="cell column">
									<div class="has-text-weight-semibold is-size-7">Method</div>
									<div class="is-size-7">{summary.first_problematic_request.method}</div>
								</div>
							{/if}
							{#if summary.first_problematic_request.url}
								<div class="cell column is-full">
									<div class="has-text-weight-semibold is-size-7">URL</div>
									<div class="is-size-7 is-family-monospace" style="word-break: break-all;">
										{summary.first_problematic_request.url}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				{#if summary.slowest_request}
					<div class="mb-2">
						<p class="heading mb-1">Slowest request</p>
						<div class="columns is-multiline is-variable is-2">
							<div class="cell column">
								<div class="has-text-weight-semibold is-size-7">When</div>
								<div class="is-size-7">{fmtTs(summary.slowest_request.timestamp)}</div>
							</div>
							<div class="cell column">
								<div class="has-text-weight-semibold is-size-7">Time</div>
								<div class="is-size-7">{fmtMs(summary.slowest_request.response_time)}</div>
							</div>
							{#if summary.slowest_request.method}
								<div class="cell column">
									<div class="has-text-weight-semibold is-size-7">Method</div>
									<div class="is-size-7">{summary.slowest_request.method}</div>
								</div>
							{/if}
							{#if summary.slowest_request.url}
								<div class="cell column is-full">
									<div class="has-text-weight-semibold is-size-7">URL</div>
									<div class="is-size-7 is-family-monospace" style="word-break: break-all;">
										{summary.slowest_request.url}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{:else}
				<p class="has-text-grey is-italic is-size-7">No trace data.</p>
			{/if}
		</div>

		{#if !loading && !errorText}
			<div class="box">
				<p class="heading mb-2">Errors</p>
				{#if errors.length === 0}
					<p class="has-text-grey is-italic is-size-7">No error hops for this trace.</p>
				{:else}
					<div class="table-container">
						<table class="table is-fullwidth is-narrow is-striped is-hoverable">
							<thead>
								<tr>
									<th>Date/Time</th>
									<th>Status</th>
									<th>Method</th>
									<th>Endpoint</th>
									<th class="has-text-right">Time (ms)</th>
									<th>Message</th>
								</tr>
							</thead>
							<tbody>
								{#each errors as err}
									<tr>
										<td class="is-size-7">{fmtTs(err.timestamp)}</td>
										<td class="is-size-7">
											<span class="tag is-danger" title={httpStatusText(err.status_code)}
												>{err.status_code ?? '—'}</span
											>
										</td>
										<td class="is-size-7">{err.method ?? '—'}</td>
										<td class="is-size-7" style="word-break: break-all;">{err.url ?? '—'}</td>
										<td class="has-text-right is-size-7">{fmtMs(err.response_time)}</td>
										<td class="is-size-7" style="word-break: break-all;">{err.message ?? '—'}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>

			<div class="box">
				<p class="heading mb-2">Slowest hops</p>
				{#if slowest.length === 0}
					<p class="has-text-grey is-italic is-size-7">No slow hops recorded for this trace.</p>
				{:else}
					<div class="table-container">
						<table class="table is-fullwidth is-narrow is-striped is-hoverable">
							<thead>
								<tr>
									<th>Endpoint</th>
									<th>Method</th>
									<th class="has-text-right">Hits</th>
									<th class="has-text-right">Avg (ms)</th>
									<th class="has-text-right">Min (ms)</th>
									<th class="has-text-right">Max (ms)</th>
								</tr>
							</thead>
							<tbody>
								{#each slowest as hop}
									<tr>
										<td class="is-size-7" style="word-break: break-all;"
											>{hop.url ?? hop.idendpoint ?? '—'}</td
										>
										<td class="is-size-7">{hop.method ?? '—'}</td>
										<td class="has-text-right is-size-7">{hop.hits ?? '—'}</td>
										<td class="has-text-right is-size-7">{fmtMs(hop.avg_response_time)}</td>
										<td class="has-text-right is-size-7">{fmtMs(hop.min_response_time)}</td>
										<td class="has-text-right is-size-7">{fmtMs(hop.max_response_time)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</Modal>

<style>
	.cell {
		flex: none;
		width: 16.6%;
		min-width: 150px;
	}
</style>
