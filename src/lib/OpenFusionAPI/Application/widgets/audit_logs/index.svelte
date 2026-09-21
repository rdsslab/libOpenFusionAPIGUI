<script>
	import {
		Table,
		ColumnTypes,
		Input,
		BasicSelect,
		DialogModal,
		Notifications
	} from '@rdsslab/svelte-components';
	import {
		SearchAuditLogs,
		GetAuditLogDetail,
		GetAuditLogStats,
		PruneAuditLogs
	} from '$lib/OpenFusionAPI/Application/utils/request.js';
	import CellAction from './cellAction.svelte';
	import CellEntity from './cellEntity.svelte';
	import AuditDetail from './audit_detail.svelte';

	let notify = new Notifications();

	const ENVIRONMENTS = [
		{ id: '', value: 'All environments' },
		{ id: 'prd', value: 'Production' },
		{ id: 'qa', value: 'QA' },
		{ id: 'dev', value: 'Development' }
	];
	const ACTIONS = [
		{ id: '', value: 'All actions' },
		{ id: 'login', value: 'Login' },
		{ id: 'login_failed', value: 'Login failed' },
		{ id: 'logout', value: 'Logout' },
		{ id: 'create', value: 'Create' },
		{ id: 'update', value: 'Update' },
		{ id: 'delete', value: 'Delete' },
		{ id: 'enable', value: 'Enable' },
		{ id: 'disable', value: 'Disable' },
		{ id: 'restore', value: 'Restore' },
		{ id: 'bulk_delete', value: 'Bulk delete' }
	];
	const ENTITY_TYPES = [
		{ id: '', value: 'All entities' },
		{ id: 'app', value: 'App' },
		{ id: 'appvar', value: 'App variable' },
		{ id: 'endpoint', value: 'Endpoint' },
		{ id: 'bot', value: 'Bot' },
		{ id: 'interval_task', value: 'Interval task' },
		{ id: 'user', value: 'User' },
		{ id: 'apiclient', value: 'API client' },
		{ id: 'apikey', value: 'API key' }
	];
	const ACTOR_KINDS = [
		{ id: '', value: 'Any actor type' },
		{ id: 'user', value: 'User' },
		{ id: 'apikey', value: 'API key' },
		{ id: 'system', value: 'System' }
	];
	const STATUSES = [
		{ id: '', value: 'All results' },
		{ id: 'true', value: 'Success' },
		{ id: 'false', value: 'Failed' }
	];
	const STATS_WINDOWS = [7, 30, 90];

	// === Filtros ===
	let action = $state('');
	let entityType = $state('');
	let entityId = $state('');
	let actorKind = $state('');
	let actorUsername = $state('');
	let targetUsername = $state('');
	let environment = $state('');
	let statusFilter = $state('');
	let timeMode = $state('preset');
	let presetHours = $state(24);
	let startDate = $state('');
	let endDate = $state('');
	let limit = $state(100);
	let statsDays = $state(30);

	// === Datos ===
	let logs = $state([]);
	let total = $state(0);
	let offset = $state(0);
	let loading = $state(false);
	let loadingMore = $state(false);

	// === Stats ===
	let stats = $state(null);
	let loadingStats = $state(false);

	// === Detalle ===
	let showDetail = $state(false);
	let selectedRow = $state(null);
	let detailData = $state(null);
	let detailLoading = $state(false);

	// === Poda ===
	let showPrune = $state(false);
	let pruning = $state(false);
	let retentionDays = $state(365);

	function isNumeric(n) {
		return Number.isFinite(Number(n));
	}

	function normalizedLimit() {
		const n = Math.floor(Number(limit));
		if (!Number.isInteger(n) || n < 1) return 100;
		return Math.min(n, 200);
	}

	function isValidRange() {
		const s = String(startDate || '');
		const e = String(endDate || '');
		if (!s || !e) return false;
		const ds = new Date(s);
		const de = new Date(e);
		return !isNaN(ds.getTime()) && !isNaN(de.getTime()) && ds < de;
	}

	function buildQuery(forOffset = 0) {
		const q = { limit: normalizedLimit(), offset: forOffset };

		if (action) q.action = action;
		if (entityType) q.entity_type = entityType;
		const eid = String(entityId || '').trim();
		if (eid) q.entity_id = eid;
		if (actorKind) q.actor_kind = actorKind;
		const actor = String(actorUsername || '').trim();
		if (actor) q.actor_username = actor;
		const target = String(targetUsername || '').trim();
		if (target) q.target_username = target;
		if (environment) q.environment = environment;
		if (statusFilter !== '') q.status = statusFilter;

		if (timeMode === 'range') {
			if (isValidRange()) {
				q.from = startDate;
				q.to = endDate;
			}
		} else {
			const hours = Math.floor(Number(presetHours));
			if (isNumeric(hours) && hours > 0) {
				q.from = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
			}
		}

		return q;
	}

	function decorateRow(row) {
		return {
			...row,
			action: row.action || '',
			entity_type: row.entity_type || '',
			actor_username: row.actor_username || '',
			target_username: row.target_username || '',
			environment: row.environment || '',
			status: row.status !== false,
			message: row.message || '',
			trace_id: row.trace_id || ''
		};
	}

	let logs_guard = 0;

	async function loadAudit() {
		const rid = ++logs_guard;
		loading = true;
		try {
			const res = await SearchAuditLogs(buildQuery(0));
			if (rid !== logs_guard) return;
			const rows = Array.isArray(res?.rows) ? res.rows : [];
			logs = rows.map(decorateRow);
			total = Number(res?.total) || 0;
			offset = rows.length;
		} catch (e) {
			console.error(e);
			if (rid === logs_guard) {
				logs = [];
				total = 0;
				offset = 0;
				notify.push({ message: e.message || 'Failed to load audit logs', color: 'danger' });
			}
		} finally {
			if (rid === logs_guard) loading = false;
		}
	}

	async function loadMore() {
		if (loadingMore || offset >= total) return;
		const rid = logs_guard;
		loadingMore = true;
		try {
			const res = await SearchAuditLogs(buildQuery(offset));
			if (rid !== logs_guard) return;
			const rows = Array.isArray(res?.rows) ? res.rows : [];
			logs = [...logs, ...rows.map(decorateRow)];
			total = Number(res?.total) || total;
			offset += rows.length;
		} catch (e) {
			console.error(e);
			if (rid === logs_guard) {
				notify.push({ message: e.message || 'Failed to load more audit logs', color: 'danger' });
			}
		} finally {
			if (rid === logs_guard) loadingMore = false;
		}
	}

	let reloadTimer = null;

	function scheduleReload() {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(loadAudit, 350);
	}

	$effect(() => {
		action;
		entityType;
		entityId;
		actorKind;
		actorUsername;
		targetUsername;
		environment;
		statusFilter;
		timeMode;
		presetHours;
		startDate;
		endDate;
		limit;
		scheduleReload();
	});

	async function loadStats() {
		loadingStats = true;
		try {
			const res = await GetAuditLogStats({ last_days: statsDays });
			if (!res || res.error) {
				console.error('stats error:', res?.error || res);
				stats = null;
			} else {
				stats = res;
			}
		} catch (e) {
			console.error(e);
			stats = null;
		} finally {
			loadingStats = false;
		}
	}

	$effect(() => {
		statsDays;
		loadStats();
	});

	async function refreshAll() {
		await Promise.all([loadAudit(), loadStats()]);
	}

	async function onRowClick({ row }) {
		selectedRow = row;
		showDetail = true;
		detailData = null;
		detailLoading = true;
		try {
			const detail = await GetAuditLogDetail(row?.id);
			detailData = detail && !detail.error ? detail : row;
		} catch (e) {
			console.error(e);
			detailData = row;
		} finally {
			detailLoading = false;
		}
	}

	async function confirmPrune() {
		pruning = true;
		try {
			const res = await PruneAuditLogs();
			if (res && res.error) {
				notify.push({ message: res.error, color: 'danger' });
			} else if (res && res.status === 'ok') {
				notify.push({
					message: `Audit pruning complete: ${res.pruned} event(s) older than ${res.retention_days} days removed`,
					color: 'success'
				});
			} else if (res && res.status === 'disabled') {
				notify.push({
					message: 'Retention set to 0: pruning disabled, audit rows kept indefinitely',
					color: 'warning'
				});
			}
			showPrune = false;
			if (res && !res.error) await refreshAll();
		} catch (e) {
			console.error(e);
			notify.push({ message: e.message || 'Failed to prune audit logs', color: 'danger' });
		} finally {
			pruning = false;
		}
	}

	function handlePresetHoursChange(e) {
		const value = Math.floor(Number(e.target.value));
		presetHours = Number.isFinite(value) && value > 0 ? value : 24;
	}

	function handleLimitChange(e) {
		const value = Math.floor(Number(e.target.value));
		limit = Number.isFinite(value) && value > 0 ? value : 100;
	}

	let columns = $state({
		timestamp: {
			label: 'Date/Time',
			decorator: { component: ColumnTypes.DateTime, props: { format: 'yyyy-MM-dd HH:mm:ss' } }
		},
		action: { label: 'Action', decorator: { component: CellAction } },
		actor_username: { label: 'Actor' },
		entity_type: { label: 'Entity', decorator: { component: CellEntity } },
		target_username: { label: 'Target' },
		environment: { label: 'Env' },
		status: {
			label: 'Result',
			decorator: {
				component: ColumnTypes.Boolean,
				props: {
					custom: {
						ontrue: { label: 'Success' },
						onfalse: { label: 'Failed' },
						editInline: false
					}
				}
			}
		},
		result_code: { label: 'Code' },
		actor_kind: { label: 'Actor type' },
		message: {
			label: 'Message',
			decorator: { component: ColumnTypes.TextLimit, props: { limit: 40 } }
		},
		id: { hidden: true },
		trace_id: { hidden: true },
		actor_id: { hidden: true },
		idclient: { hidden: true },
		entity_id: { hidden: true },
		idapp: { hidden: true },
		ip: { hidden: true },
		user_agent: { hidden: true }
	});
</script>

{#if stats}
	<div class="box p-3 mb-3">
		<div class="field is-grouped is-grouped-multiline is-align-items-center">
			<span class="control">
				<span class="tag is-medium is-light mr-1">Window:</span>
			</span>
			{#each STATS_WINDOWS as d}
				<p class="control">
					<button
						class="button is-small {statsDays === d ? 'is-info' : 'is-light'}"
						onclick={() => (statsDays = d)}
					>
						{d}d
					</button>
				</p>
			{/each}
			<span class="control">
				<span class="tag is-medium is-info">{stats.total} events</span>
			</span>
			{#if stats.failures > 0}
				<span class="control">
					<span class="tag is-medium is-danger">{stats.failures} failures</span>
				</span>
			{/if}
			{#if loadingStats}
				<span class="icon is-small has-text-grey">
					<i class="fas fa-spinner fa-pulse"></i>
				</span>
			{/if}
		</div>
		{#if stats.by_action.length > 0}
			<div class="field is-grouped is-grouped-multiline">
				<span class="tag is-light is-italic">By action:</span>
				{#each stats.by_action as b}
					<span class="tag is-info is-light">{b.action} <b>{b.count}</b></span>
				{/each}
			</div>
		{/if}
		{#if stats.by_entity.length > 0}
			<div class="field is-grouped is-grouped-multiline">
				<span class="tag is-light is-italic">By entity:</span>
				{#each stats.by_entity as b}
					<span class="tag is-success is-light">{b.entity_type} <b>{b.count}</b></span>
				{/each}
			</div>
		{/if}
		{#if stats.by_actor.length > 0}
			<div class="field is-grouped is-grouped-multiline">
				<span class="tag is-light is-italic">By actor:</span>
				{#each stats.by_actor as b}
					<span class="tag is-warning is-light">{b.actor_username} <b>{b.count}</b></span>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<div class="box p-3 mb-3">
	<div class="field is-grouped is-grouped-multiline">
		<div class="control">
			<BasicSelect label="Action" options={ACTIONS} bind:option={action} />
		</div>
		<div class="control">
			<BasicSelect label="Entity" options={ENTITY_TYPES} bind:option={entityType} />
		</div>
		<div class="control">
			<Input
				label="Entity ID"
				type="text"
				placeholder="Search by entity_id"
				bind:value={entityId}
				isExpanded={false}
			/>
		</div>
		<div class="control">
			<BasicSelect label="Actor type" options={ACTOR_KINDS} bind:option={actorKind} />
		</div>
		<div class="control">
			<Input
				label="Actor"
				type="text"
				placeholder="Search by actor_username"
				bind:value={actorUsername}
				isExpanded={false}
			/>
		</div>
		<div class="control">
			<Input
				label="Target"
				type="text"
				placeholder="Target username"
				bind:value={targetUsername}
				isExpanded={false}
			/>
		</div>
		<div class="control">
			<BasicSelect label="Environment" options={ENVIRONMENTS} bind:option={environment} />
		</div>
		<div class="control">
			<BasicSelect label="Result" options={STATUSES} bind:option={statusFilter} />
		</div>
	</div>

	<div class="field is-grouped is-grouped-multiline">
		<div class="control">
			<BasicSelect
				label="Window"
				options={[
					{ id: 'preset', value: 'Last hours' },
					{ id: 'range', value: 'Date range' }
				]}
				bind:option={timeMode}
			/>
		</div>
		{#if timeMode === 'preset'}
			<div class="control">
				<Input
					label="Hours"
					type="number"
					min="1"
					step="1"
					bind:value={presetHours}
					onchange={handlePresetHoursChange}
				/>
			</div>
			<div class="control is-flex is-align-items-center" style="gap: 0.25rem;">
				{#each [1, 6, 12, 24, 48, 72, 168] as h}
					<button
						class="button is-small {presetHours === h ? 'is-info' : 'is-light'}"
						onclick={() => (presetHours = h)}
					>
						{h < 24 ? `${h}h` : h === 24 ? '24h' : h === 48 ? '2d' : h === 72 ? '3d' : '7d'}
					</button>
				{/each}
			</div>
		{:else}
			<div class="control">
				<Input label="From" type="datetime-local" bind:value={startDate} />
			</div>
			<div class="control">
				<Input label="To" type="datetime-local" bind:value={endDate} />
			</div>
		{/if}
		<div class="control">
			<Input
				label="Limit"
				type="number"
				min="1"
				max="200"
				step="50"
				bind:value={limit}
				onchange={handleLimitChange}
			/>
		</div>
		<div class="control">
			<button class="button is-small" onclick={refreshAll} disabled={loading || loadingStats}>
				<span class="icon is-small">
					<i class="fa-solid fa-rotate"></i>
				</span>
				<span>Refresh</span>
			</button>
		</div>
		<div class="control">
			<button
				class="button is-small is-danger is-outlined"
				title="Delete audit events older than the configured retention (appvar $_VAR_AUDIT_LOG_RETENTION_DAYS)"
				onclick={() => (showPrune = true)}
			>
				<span class="icon is-small"><i class="fa-solid fa-broom"></i></span>
				<span>Prune old</span>
			</button>
		</div>
	</div>
	{#if timeMode === 'range' && !isValidRange() && (startDate || endDate)}
		<p class="help has-text-warning">Set a valid From before To to apply the date range filter.</p>
	{/if}
	<p class="help">
		Audit trail of admin actions (login, CRUD of apps, endpoints, variables, users, API clients…).
		Click a row for the full event detail including the before/after snapshots.
	</p>
</div>

{#snippet tableStatus()}
	<span class="is-size-7 has-text-grey">
		{loading ? 'Loading…' : `${logs.length} of ${total} events`}
	</span>
	{#if loading}
		<span class="icon is-small has-text-info">
			<i class="fas fa-spinner fa-pulse"></i>
		</span>
	{/if}
{/snippet}

{#snippet loadMoreButton()}
	{#if offset < total}
		<button
			class="button is-small is-link is-outlined"
			onclick={loadMore}
			disabled={loadingMore || loading}
		>
			<span class="icon is-small">
				<i class="fa-solid {loadingMore ? 'fa-spinner fa-pulse' : 'fa-angle-double-down'}"></i>
			</span>
			<span>Load older (next {normalizedLimit()})</span>
		</button>
	{/if}
{/snippet}

<Table
	bind:RawDataTable={logs}
	{columns}
	left_items={[tableStatus]}
	right_items={[loadMoreButton]}
	showSelectionButton={false}
	showNewButton={false}
	showEditButton={false}
	showDeleteButton={false}
	showExportButton={true}
	fileNameExport="openfusion_audit_log"
	onclickrow={onRowClick}
></Table>

<AuditDetail bind:show={showDetail} bind:detail={detailData} bind:loading={detailLoading} />

<DialogModal
	title={pruneTitle}
	body={pruneBody}
	onaccept={confirmPrune}
	oncancel={() => (showPrune = false)}
	bind:show={showPrune}
>
	{#snippet pruneTitle()}
		<span>Confirm audit pruning</span>
	{/snippet}
	{#snippet pruneBody()}
		<div class="notification is-warning is-light py-2 px-3">
			<span class="icon-text">
				<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
				<span>
					This permanently deletes all audit events older than the configured retention (default {retentionDays}
					days). This cannot be undone.
				</span>
			</span>
		</div>
		{#if pruning}
			<p class="has-text-grey is-italic is-size-7">Pruning…</p>
		{/if}
	{/snippet}
</DialogModal>
