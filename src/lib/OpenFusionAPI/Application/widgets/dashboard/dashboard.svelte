<script>
	import { onDestroy, onMount } from 'svelte';
	import { Chart } from '@rdsslab/svelte-components';
	import {
		storeEndpointOnComplete,
		storeServerDynamicInformation,
		userStore,
		statusSystemEndpointsStore
	} from '$lib/OpenFusionAPI/Application/utils/stores.js';
	import {
		getLogsRecordsPerMinute,
		getLogsStatusClassPerMinute,
		getLogSummaryByAppStatusCode,
		getAppEndpointUsageSummary,
		restoreSystemEndpoints
	} from '$lib/OpenFusionAPI/Application/utils/request.js';
	let { idapp = $bindable() } = $props();
	let data_request = $state([]);

	let data_logs_per_minute = $state([]);
	let data_status_class = $state([]);
	let data_status_summary = $state([]);
	let data_top_endpoints = $state([]);
	let data_unused_endpoints = $state([]);
	let data_cpu = $state([]);
	let data_memory = $state([]);
	let cpuUsage = $state();
	let memoryUsage = $state();
	let selectedEnvironment = $state('prd');

	const STATUS_CLASSES = [
		{ key: 'success', name: 'Success', color: '#48c78e' },
		{ key: 'client_error', name: 'Client Error', color: '#ffe08a' },
		{ key: 'server_error', name: 'Server Error', color: '#f14668' },
		{ key: 'redirect', name: 'Redirect', color: '#3e8ed0' },
		{ key: 'info', name: 'Info', color: '#3298dc' }
	];

	$effect(() => {
		idapp;
		selectedEnvironment;
		onChangeIdApp();
	});

	function formatDataCPUUsage(data) {
		let now = new Date();
		cpuUsage = data.cpuUsage;
		return {
			name: now.toISOString(),
			value: [now, cpuUsage],
			other: 'Nada'
		};
	}

	function formatDataMemoryUsage(data) {
		let now = new Date();
		memoryUsage = data.memoryUsage;
		return {
			name: now.toISOString(),
			value: [now, memoryUsage],
			other: 'Nada'
		};
	}

	function matchesSelection(data_endpoint) {
		return (
			idapp &&
			data_endpoint?.idapp == idapp &&
			data_endpoint?.environment == selectedEnvironment
		);
	}

	function formatData(data_endpoint) {
		if (matchesSelection(data_endpoint)) {
			let now = new Date(data_endpoint.dateTime || Date.now());
			return {
				name: now.toISOString(),
				value: [now, data_endpoint?.responseTime],
				other: 'Nada'
			};
		}
	}

	// Trunca al minuto e incrementa el último punto del arreglo si ya corresponde a ese
	// minuto, o agrega uno nuevo — misma agrupación que hace el backend, pero incremental.
	function incrementMinutePoint(dataArray, dateValue) {
		const minuteDate = new Date(dateValue || Date.now());
		minuteDate.setSeconds(0, 0);

		const last = dataArray[dataArray.length - 1];
		if (last && new Date(last.value[0]).getTime() === minuteDate.getTime()) {
			last.value[1] += 1;
			return [...dataArray];
		}

		return [
			...dataArray,
			{ name: minuteDate.toISOString(), value: [minuteDate, 1], other: 'Nada' }
		];
	}

	function statusClassForCode(status_code) {
		const code = Number(status_code);
		if (code < 200) return 'info';
		if (code < 300) return 'success';
		if (code < 400) return 'redirect';
		if (code < 500) return 'client_error';
		return 'server_error';
	}

	async function onChangeIdApp() {
		//console.log('Busca por el idapp ' + idapp);
		if (idapp) {
			try {
				let data_log_pm = await getLogsRecordsPerMinute(
					{ idapp: idapp, last_hours: 12, environment: selectedEnvironment },
					$userStore.token
				);
				if (Array.isArray(data_log_pm)) {
					data_logs_per_minute = data_log_pm.map((dl) => {
						let now = new Date(dl.minute || Date.now());
						return {
							name: now.toISOString(),
							value: [now, parseInt(dl?.count)],
							other: 'Nada'
						};
					});
				} else {
					console.error('getLogsRecordsPerMinute did not return an array:', data_log_pm);
					data_logs_per_minute = [];
				}

				let data_status = await getLogsStatusClassPerMinute(
					{ idapp: idapp, last_hours: 24, environment: selectedEnvironment },
					$userStore.token
				);
				if (Array.isArray(data_status)) {
					data_status_class = STATUS_CLASSES.map((statusClass) => ({
						name: statusClass.name,
						color: statusClass.color,
						data: data_status
							.filter((row) => row.status_class === statusClass.key)
							.map((row) => {
								let now = new Date(row.minute || Date.now());
								return {
									name: now.toISOString(),
									value: [now, parseInt(row?.count)],
									other: 'Nada'
								};
							})
					}));
				} else {
					console.error('getLogsStatusClassPerMinute did not return an array:', data_status);
					data_status_class = [];
				}

				let status_sys_endp = await restoreSystemEndpoints(false, $userStore.token);
				statusSystemEndpointsStore.set(status_sys_endp);

				let summary = await getLogSummaryByAppStatusCode(
					{ idapp: idapp, environment: selectedEnvironment },
					$userStore.token
				);
				if (Array.isArray(summary)) {
					let countByStatusCode = {};
					for (const row of summary) {
						const code = String(row.status_code);
						countByStatusCode[code] = (countByStatusCode[code] || 0) + parseInt(row.recordCount);
					}
					data_status_summary = Object.entries(countByStatusCode).map(([name, value]) => ({
						name,
						value
					}));
				} else {
					console.error('getLogSummaryByAppStatusCode did not return an array:', summary);
					data_status_summary = [];
				}

				let usage = await getAppEndpointUsageSummary(
					{ idapp: idapp, environment: selectedEnvironment, last_days: 7, top: 5 },
					$userStore.token
				);
				data_top_endpoints = Array.isArray(usage?.most_used)
					? usage.most_used.map((e) => ({ name: e.resource, value: parseInt(e.requestCount) }))
					: [];
				data_unused_endpoints = Array.isArray(usage?.unused) ? usage.unused : [];
			} catch (error) {
				console.error(error);
			}
		} else {
			data_logs_per_minute = [];
			data_status_class = [];
			data_status_summary = [];
			data_top_endpoints = [];
			data_unused_endpoints = [];
		}
	}

	let unsubscribe_dy;
	let unsubscribe_com;

	onMount(() => {
		unsubscribe_dy = storeServerDynamicInformation.subscribe((event) => {
			//	console.log(event);
			data_cpu.push(formatDataCPUUsage(event));
			data_cpu = [...data_cpu];
			data_memory.push(formatDataMemoryUsage(event));
			data_memory = [...data_memory];
		});

		unsubscribe_com = storeEndpointOnComplete.subscribe((event) => {
			//	console.log(':::::> ', idapp, event);
			if (idapp) {
				if (Array.isArray(event)) {
					data_request = event.map((log) => {
						return formatData(log);
					});
				} else if (data_request && matchesSelection(event)) {
					//	console.log('Llega -------->');
					let point = formatData(event);
					if (point) {
						data_request.push(point);
						data_request = [...data_request];
					}

					data_logs_per_minute = incrementMinutePoint(data_logs_per_minute, event.dateTime);

					let status_class = statusClassForCode(event.statusCode);
					data_status_class = data_status_class.map((series, index) =>
						STATUS_CLASSES[index].key === status_class
							? { ...series, data: incrementMinutePoint(series.data, event.dateTime) }
							: series
					);
				}
			}
		});
	});

	onDestroy(() => {
		unsubscribe_dy();
		unsubscribe_com();
	});
</script>

<div class="field is-flex is-justify-content-flex-end">
	<div class="control">
		<div class="select is-small">
			<select bind:value={selectedEnvironment}>
				<option value="dev">dev</option>
				<option value="qa">qa</option>
				<option value="prd">prd</option>
			</select>
		</div>
	</div>
</div>

<div class="columns is-multiline is-mobile">
	<div class="column is-half-desktop is-full-tablet">
		<Chart.TimeSeries title="CPU Usage {cpuUsage}%" bind:data={data_cpu}></Chart.TimeSeries>
		<p class="help has-text-centered">Real-time server CPU usage percentage</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.TimeSeries title="Memory Usage {memoryUsage}%" bind:data={data_memory}
		></Chart.TimeSeries>
		<p class="help has-text-centered">Real-time server memory usage percentage</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		{#if data_request}
			<Chart.TimeSeries title="Response Time per Request" bind:data={data_request}
			></Chart.TimeSeries>
			<p class="help has-text-centered">
				Response time (ms) of each completed request for the selected app and environment
			</p>
		{/if}
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.TimeSeries title="Requests per minute" bind:data={data_logs_per_minute}
		></Chart.TimeSeries>
		<p class="help has-text-centered">
			Number of requests received per minute over the last 12 hours
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.TimeSeries title="Requests by Status per Minute (24h)" bind:series={data_status_class}
		></Chart.TimeSeries>
		<p class="help has-text-centered">
			Number of requests per minute over the last 24 hours, broken down by HTTP status class
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.Base
			title="Status Code Distribution"
			option={{
				tooltip: { trigger: 'item', formatter: '{b}: {c} requests ({d}%)' },
				legend: { orient: 'vertical', left: 'left' }
			}}
			series={[
				{
					type: 'pie',
					radius: ['40%', '70%'],
					label: { show: false },
					labelLine: { show: false },
					data: data_status_summary
				}
			]}
		></Chart.Base>
		<p class="help has-text-centered">
			Total distribution of HTTP status codes for the selected app and environment
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.Base
			title="Top Endpoints (last 7 days)"
			option={{
				tooltip: {},
				yAxis: { type: 'category', data: data_top_endpoints.map((d) => d.name) },
				xAxis: { type: 'value' }
			}}
			series={[{ type: 'bar', data: data_top_endpoints.map((d) => d.value) }]}
		></Chart.Base>
		<p class="help has-text-centered">
			Most-used endpoints for the selected app and environment in the last 7 days
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<p class="title is-6">Unused Endpoints (last 7 days)</p>
		{#if data_unused_endpoints.length}
			<ul>
				{#each data_unused_endpoints as ep}
					<li>{ep.resource} ({ep.method})</li>
				{/each}
			</ul>
		{:else}
			<p class="help">No unused endpoints in this window.</p>
		{/if}
		<p class="help has-text-centered">
			Endpoints with zero requests in the last 7 days for the selected environment
		</p>
	</div>
</div>
