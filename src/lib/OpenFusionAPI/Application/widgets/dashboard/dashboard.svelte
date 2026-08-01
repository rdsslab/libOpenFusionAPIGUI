<script>
	import { onDestroy, onMount } from 'svelte';
	import { Chart, BasicSelect } from '@rdsslab/svelte-components';
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
		getTopErrorEndpointsByTime,
		restoreSystemEndpoints
	} from '$lib/OpenFusionAPI/Application/utils/request.js';
	let { idapp = $bindable() } = $props();
	let data_request = $state([]);

	let data_logs_per_minute = $state([]);
	let data_status_class = $state([]);
	let data_status_summary = $state([]);
	let data_top_endpoints = $state([]);
	let data_unused_endpoints = $state([]);
	let data_top_error_endpoints = $state([]);
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

	// Los eventos llegan por websocket y no siempre en orden cronológico, por lo que no se
	// puede asumir que el punto más nuevo cae al final del arreglo: hay que ubicarlo por
	// fecha para que la gráfica de líneas no dibuje saltos hacia atrás en el tiempo.
	function insertSortedPoint(dataArray, point) {
		const t = new Date(point.value[0]).getTime();
		let i = dataArray.length - 1;
		while (i >= 0 && new Date(dataArray[i].value[0]).getTime() > t) {
			i--;
		}
		const result = [...dataArray];
		result.splice(i + 1, 0, point);
		return result;
	}

	// Trunca al minuto e incrementa el punto del arreglo que ya corresponda a ese minuto
	// (buscándolo, no asumiendo que es el último), o inserta uno nuevo en su posición
	// cronológica — misma agrupación que hace el backend, pero incremental.
	function incrementMinutePoint(dataArray, dateValue) {
		const minuteDate = new Date(dateValue || Date.now());
		minuteDate.setSeconds(0, 0);
		const t = minuteDate.getTime();

		let i = dataArray.length - 1;
		while (i >= 0 && new Date(dataArray[i].value[0]).getTime() > t) {
			i--;
		}

		if (i >= 0 && new Date(dataArray[i].value[0]).getTime() === t) {
			const updated = [...dataArray];
			updated[i] = { ...updated[i], value: [updated[i].value[0], updated[i].value[1] + 1] };
			return updated;
		}

		const updated = [...dataArray];
		updated.splice(i + 1, 0, {
			name: minuteDate.toISOString(),
			value: [minuteDate, 1],
			other: 'Nada'
		});
		return updated;
	}

	// Igual que incrementMinutePoint, pero truncando al bucket de tiempo indicado
	// ('hour' o 'minute') en vez de asumir siempre minuto — para series agrupadas
	// por hora, como la de top error endpoints.
	function incrementBucketPoint(dataArray, dateValue, granularity) {
		const bucketDate = new Date(dateValue || Date.now());
		if (granularity === 'hour') {
			bucketDate.setMinutes(0, 0, 0);
		} else {
			bucketDate.setSeconds(0, 0);
		}
		const t = bucketDate.getTime();

		let i = dataArray.length - 1;
		while (i >= 0 && new Date(dataArray[i].value[0]).getTime() > t) {
			i--;
		}

		if (i >= 0 && new Date(dataArray[i].value[0]).getTime() === t) {
			const updated = [...dataArray];
			updated[i] = { ...updated[i], value: [updated[i].value[0], updated[i].value[1] + 1] };
			return updated;
		}

		const updated = [...dataArray];
		updated.splice(i + 1, 0, {
			name: bucketDate.toISOString(),
			value: [bucketDate, 1],
			other: 'Nada'
		});
		return updated;
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
		console.log('Busca por el idapp ' + idapp, selectedEnvironment);
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

				let top_errors = await getTopErrorEndpointsByTime(
					{ idapp: idapp, environment: selectedEnvironment, last_hours: 24, top: 10, granularity: 'hour' },
					$userStore.token
				);
				data_top_error_endpoints = Array.isArray(top_errors?.top_error_endpoints)
					? top_errors.top_error_endpoints.map((ep) => ({
							idendpoint: ep.idendpoint,
							name: `${ep.method} ${ep.resource}`,
							data: (ep.series || []).map((s) => {
								let bucketDate = new Date(s.bucket);
								return {
									name: bucketDate.toISOString(),
									value: [bucketDate, s.count],
									other: ep.title
								};
							})
						}))
					: [];
			} catch (error) {
				console.error(error);
			}
		} else {
			data_logs_per_minute = [];
			data_status_class = [];
			data_status_summary = [];
			data_top_endpoints = [];
			data_unused_endpoints = [];
			data_top_error_endpoints = [];
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
						data_request = insertSortedPoint(data_request, point);
					}

					data_logs_per_minute = incrementMinutePoint(data_logs_per_minute, event.dateTime);

					let status_class = statusClassForCode(event.statusCode);
					data_status_class = data_status_class.map((series, index) =>
						STATUS_CLASSES[index].key === status_class
							? { ...series, data: incrementMinutePoint(series.data, event.dateTime) }
							: series
					);

					if (Number(event.statusCode) >= 400) {
						data_top_error_endpoints = data_top_error_endpoints.map((series) =>
							series.idendpoint === event.idendpoint
								? { ...series, data: incrementBucketPoint(series.data, event.dateTime, 'hour') }
								: series
						);
					}
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

<BasicSelect label="Environment" options={[{id: 'dev', value: 'Development'}, {id: 'qa', value: 'QA'}, {id: 'prd', value: 'Production', label:"Production"}]} bind:option={selectedEnvironment} class="is-small" />

	
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
		<Chart.TimeSeries title="Top 10 Endpoints with Most Errors (24h)" bind:series={data_top_error_endpoints}
		></Chart.TimeSeries>
		<p class="help has-text-centered">
			Endpoints with the most errors (status code &gt;= 400) per hour in the last 24 hours, for
			the selected app and environment
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
