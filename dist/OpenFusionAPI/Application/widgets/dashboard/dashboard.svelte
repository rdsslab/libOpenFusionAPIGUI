<script>
	import { onDestroy, onMount } from 'svelte';
	import { Chart, BasicSelect, Input, Table, ColumnTypes } from '@rdsslab/svelte-components';
	import {
		storeEndpointOnComplete,
		storeServerDynamicInformation,
		userStore
	} from '../../utils/stores.js';
	import {
		getLogsRecordsPerMinute,
		getLogsStatusClassPerMinute,
		getLogs as getRequestLogs,
		getLogSummaryByAppStatusCode,
		getAppEndpointUsageSummary,
		getTopErrorEndpointsByTime
	} from '../../utils/request.js';
	import { httpStatusText } from '../../utils/httpStatus.js';
	let { idapp = $bindable() } = $props();
	/**
 * @typedef {Record<string, unknown>} RowAny
 * @typedef {{value: Array<string|number>, name?: string, other?: string, seriesName?: string}} DashboardChartPoint
 * @typedef {{idendpoint?: string|number, type?: string, name?: string, showSymbol?: boolean, smooth?: boolean, large?: boolean, data?: Array<DashboardChartPoint>, itemStyle?: Record<string, unknown>, lineStyle?: Record<string, unknown>, extra?: Record<string, unknown>}} ChartSeriesItem
 * @typedef {{status_class?: string, count?: string|number, minute?: string}} StatusClassRow
 * @typedef {{status_code?: string|number, recordCount?: string|number}} StatusCodeRow
 * @typedef {{resource?: string, requestCount?: string|number}} EndpointUsageRow
 * @typedef {{idendpoint?: string|number, method?: string, resource?: string, series?: Array<DashboardChartPoint>, count?: string|number, bucket?: string, title?: string}} TopErrorEndpointRow
 * @typedef {{cpuUsage: number}} ServerCpuEvent
 * @typedef {{memoryUsage: number}} ServerMemoryEvent
 * @typedef {{name: string, value: number}} StatusSummaryEntry
 * @typedef {{idendpoint: string|number, name: string, showSymbol: boolean, symbolSize: number, data: Array<DashboardChartPoint>}} EndpointSeriesEntry
 */
	/** @type {Array<ChartSeriesItem>} */
	let data_request_series = $state([]);

	/** @type {Array<DashboardChartPoint>} */
	let data_logs_per_minute = $state([]);
	/** @type {Array<ChartSeriesItem>} */
	let data_status_class = $state([]);
	/** @type {Array<StatusSummaryEntry>} */
	let data_status_summary = $state([]);
	/** @type {Array<{name: string, value: number}>} */
	let data_top_endpoints = $state([]);
	/** @type {Array<RowAny>} */
	let data_unused_endpoints = $state([]);
	/** @type {Array<ChartSeriesItem>} */
	let data_top_error_endpoints = $state([]);
	/** @type {Array<RowAny>} */
	let data_error_requests = $state([]);
	let loading_error_requests = $state(false);
	/** @type {Array<DashboardChartPoint>} */
	let data_cpu = $state([]);
	/** @type {Array<DashboardChartPoint>} */
	let data_memory = $state([]);
	let cpuUsage = $state();
	let memoryUsage = $state();
	let selectedEnvironment = $state('prd');
	let selectedHours = $state(12);
	let selectedStatusClasses = $state(['5xx']);

	/** @type {Record<string, Array<number>>} */
	const STATUS_CODE_RANGES = {
		'1xx': [100, 199],
		'2xx': [200, 299],
		'3xx': [300, 399],
		'4xx': [400, 499],
		'5xx': [500, 599]
	};

	function statusMatchesSelectedClasses(/** @type {number} */ statusCode, /** @type {Array<string>} */ classes) {
		return classes.some((cls) => {
			const [min, max] = /** @type {Record<string, Array<number>>} */ (STATUS_CODE_RANGES)[cls] || [];
			return min && statusCode >= min && statusCode <= max;
		});
	}

	function topErrorsTooltipFormatter(/** @type {any} */ params) {
		const points = Array.isArray(params) ? params : [params];
		return points
			.map((/** @type {DashboardChartPoint} */ p) => {
				const date = new Date((/** @type {Array} */ p.value)[0]);
				const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
				const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
				return `URL: ${/** @type {string} */ (p.seriesName)}<br/>${formattedDate}<br/>Errores: ${(/** @type {Array} */ p.value)[1]}`;
			})
			.join('<br/><br/>');
	}

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
		selectedHours;
		onChangeIdApp();
	});

	// La tabla de requests con error se recarga en su propio efecto, aparte de las gráficas, por
	// dos razones: cambiar solo el filtro de status codes no tiene por qué volver a pedir todo el
	// dashboard, y así la tabla deja de depender de que las demás consultas de onChangeIdApp hayan
	// salido bien (si una fallaba, el catch se comía el resto y la tabla quedaba con datos viejos).
	$effect(() => {
		idapp;
		selectedEnvironment;
		selectedHours;
		selectedStatusClasses;
		loadErrorRequests();
	});

	// El componente Input es un passthrough al <input type="number"> nativo, sin validación
	// propia — hay que sanear acá que sea un entero positivo mayor a 1.
	function handleHoursChange(/** @type {Event} */ e) {
		const input = /** @type {HTMLInputElement} */ (e.target);
		if (!input) return;
		let value = Math.floor(Number(input.value));
		selectedHours = Number.isFinite(value) && value > 1 ? value : 12;
	}

	function formatDataCPUUsage(/** @type {ServerCpuEvent} */ data) {
		let now = new Date();
		cpuUsage = data.cpuUsage;
		return /** @type {DashboardChartPoint} */ ({
			name: now.toISOString(),
			value: [now, cpuUsage],
			other: 'Nada'
		});
	}

	function formatDataMemoryUsage(/** @type {ServerMemoryEvent} */ data) {
		let now = new Date();
		memoryUsage = data.memoryUsage;
		return /** @type {DashboardChartPoint} */ ({
			name: now.toISOString(),
			value: [now, memoryUsage],
			other: 'Nada'
		});
	}

	function matchesSelection(/** @type {RowAny} */ data_endpoint) {
		return (
			idapp && data_endpoint?.idapp == idapp && data_endpoint?.environment == selectedEnvironment
		);
	}

	function formatData(/** @type {RowAny} */ data_endpoint) {
		if (matchesSelection(data_endpoint)) {
			let now = new Date((/** @type {string|number} */ (data_endpoint.dateTime || Date.now())));
			let label = data_endpoint.method
				? `${data_endpoint.method} ${data_endpoint.resource || data_endpoint.url || ''}`.trim()
				: `Endpoint ${data_endpoint.idendpoint}`;
			return /** @type {DashboardChartPoint} */ ({
				name: now.toISOString(),
				value: [now, data_endpoint?.responseTime],
				other: label
			});
		}
	}

	// Los eventos llegan por websocket y no siempre en orden cronológico, por lo que no se
	// puede asumir que el punto más nuevo cae al final del arreglo: hay que ubicarlo por
	// fecha para que la gráfica de líneas no dibuje saltos hacia atrás en el tiempo.
	/**
		 * @param {Array<DashboardChartPoint>} dataArray
		 * @param {DashboardChartPoint} point
		 * @returns {Array<DashboardChartPoint>}
	 */
	function insertSortedPoint(dataArray, point) {
		const t = new Date((/** @type {Array<string|number>} */ point.value)[0]).getTime();
		let i = dataArray.length - 1;
		while (i >= 0 && new Date((/** @type {Array<string|number>} */ dataArray[i].value)[0]).getTime() > t) {
			i--;
		}
		const result = [...dataArray];
		result.splice(i + 1, 0, /** @type {DashboardChartPoint} */ (point));
		return result;
	}

	// Inserta `point` (ya ordenado cronológicamente vía insertSortedPoint) en la serie de
	// `data_request_series` correspondiente a `idendpoint`, creando la serie si el endpoint
	// no tenía actividad en la ventana histórica cargada.
	/**
		 * @param {Array<ChartSeriesItem>} seriesArray
		 * @param {string|number} idendpoint
		 * @param {string} label
		 * @param {DashboardChartPoint} point
		 * @returns {Array<ChartSeriesItem>}
	 */
	function upsertSeriesPoint(seriesArray, idendpoint, label, point) {
		const index = seriesArray.findIndex((series) => series.idendpoint === idendpoint);
		if (index === -1) {
			return [
				...seriesArray,
				/** @type {ChartSeriesItem} */ ({ idendpoint, name: label, showSymbol: true, symbolSize: 4, data: [point] })
			];
		}
		const updated = [...seriesArray];
		updated[index] = { ...updated[index], data: insertSortedPoint((/** @type {Array<DashboardChartPoint>} */ (updated[index].data || [])), point) };
		return updated;
	}

	// Trunca al minuto e incrementa el punto del arreglo que ya corresponda a ese minuto
	// (buscándolo, no asumiendo que es el último), o inserta uno nuevo en su posición
	// cronológica — misma agrupación que hace el backend, pero incremental.
	/**
		 * @param {Array<DashboardChartPoint>} dataArray
		 * @param {string|number} dateValue
		 * @returns {Array<DashboardChartPoint>}
	 */
	function incrementMinutePoint(dataArray, dateValue) {
		const minuteDate = new Date(dateValue || Date.now());
		minuteDate.setSeconds(0, 0);
		const t = minuteDate.getTime();

		let i = dataArray.length - 1;
		while (i >= 0 && new Date((/** @type {Array<string|number>} */ dataArray[i].value)[0]).getTime() > t) {
			i--;
		}

		if (i >= 0 && new Date((/** @type {Array<string|number>} */ dataArray[i].value)[0]).getTime() === t) {
			const updated = [...dataArray];
			const pt = /** @type {DashboardChartPoint} */ (updated[i]);
			pt.value = [pt.value[0], (/** @type {number} */ (/** @type {string|number} */ pt.value[1])) + 1];
			updated[i] = pt;
			return updated;
		}

		const updated = [...dataArray];
		updated.splice(i + 1, 0, /** @type {DashboardChartPoint} */ ({
			name: minuteDate.toISOString(),
			value: [minuteDate, 1],
			other: 'Nada'
		}));
		return updated;
	}

	// Igual que incrementMinutePoint, pero truncando al bucket de tiempo indicado
	// ('hour' o 'minute') en vez de asumir siempre minuto — para series agrupadas
	// por hora, como la de top error endpoints.
	/**
		 * @param {Array<DashboardChartPoint>} dataArray
		 * @param {string|number} dateValue
		 * @param {string} granularity
		 * @returns {Array<DashboardChartPoint>}
	 */
	function incrementBucketPoint(dataArray, dateValue, granularity) {
		const bucketDate = new Date(dateValue || Date.now());
		if (granularity === 'hour') {
			bucketDate.setMinutes(0, 0, 0);
		} else {
			bucketDate.setSeconds(0, 0);
		}
		const t = bucketDate.getTime();

		let i = dataArray.length - 1;
		while (i >= 0 && new Date((/** @type {Array<string|number>} */ dataArray[i].value)[0]).getTime() > t) {
			i--;
		}

		if (i >= 0 && new Date((/** @type {Array<string|number>} */ dataArray[i].value)[0]).getTime() === t) {
			const updated = [...dataArray];
			const pt = /** @type {DashboardChartPoint} */ (updated[i]);
			pt.value = [pt.value[0], (/** @type {number} */ (/** @type {string|number} */ pt.value[1])) + 1];
			updated[i] = pt;
			return updated;
		}

		const updated = [...dataArray];
		updated.splice(i + 1, 0, /** @type {DashboardChartPoint} */ ({
			name: bucketDate.toISOString(),
			value: [bucketDate, 1],
			other: 'Nada'
		}));
		return updated;
	}

	function statusClassForCode(/** @type {string|number} */ status_code) {
		const code = Number(status_code);
		if (code < 200) return 'info';
		if (code < 300) return 'success';
		if (code < 400) return 'redirect';
		if (code < 500) return 'client_error';
		return 'server_error';
	}

	// Busca o crea la entrada de `status_code` en el resumen y le suma 1 — mismo estilo que
	// incrementMinutePoint/incrementBucketPoint, pero sin bucket de tiempo (es un total, no
	// una serie temporal).
	/**
		 * @param {Array<StatusSummaryEntry>} dataArray
		 * @param {string|number} statusCode
		 * @returns {Array<StatusSummaryEntry>}
	 */
	function incrementStatusSummary(dataArray, statusCode) {
		const code = String(statusCode);
		const index = dataArray.findIndex((d) => d.name === code);
		if (index === -1) {
			return [...dataArray, { name: code, value: 1 }];
		}
		const updated = [...dataArray];
		updated[index] = { ...updated[index], value: updated[index].value + 1 };
		return updated;
	}

	// Throttle leading+trailing: aplica el primer evento de inmediato, y si llegan más antes
	// de que pase `intervalMs`, los acumula y los aplica todos juntos al cumplirse el
	// intervalo — usado para las gráficas a nivel de endpoint (deben verse casi inmediatas,
	// pero sin repintar más de una vez cada `intervalMs` bajo ráfaga).
	/**
		 * @param {number} intervalMs
		 * @param {() => void} flush
		 * @returns {{trigger: () => void, cancel: () => void}}
	 */
	function createLeadingTrailingThrottle(intervalMs, flush) {
		let cooling = false;
		let pending = false;
		/** @type {ReturnType<typeof setTimeout>|null|undefined} */
		let timer = null;
		function trigger() {
			if (!cooling) {
				flush();
				cooling = true;
				timer = setTimeout(tick, intervalMs);
			} else {
				pending = true;
			}
		}
		function tick() {
			if (pending) {
				flush();
				pending = false;
				timer = setTimeout(tick, intervalMs);
			} else {
				cooling = false;
				timer = null;
			}
		}
		function cancel() {
			if (timer) clearTimeout(timer);
			cooling = false;
			pending = false;
			timer = null;
		}
		return { trigger, cancel };
	}

	// Throttle solo-trailing: agrupa todo lo que llegue durante `intervalMs` y lo aplica de
	// una vez al final de la ventana, sin aplicación inmediata — usado para las gráficas
	// agregadas, que deben actualizarse a lo sumo cada `intervalMs`.
	/**
		 * @param {number} intervalMs
		 * @param {() => void} flush
		 * @returns {{trigger: () => void, cancel: () => void}}
	 */
	function createTrailingThrottle(intervalMs, flush) {
		/** @type {ReturnType<typeof setTimeout>|null|undefined} */
		let timer = null;
		function trigger() {
			if (!timer) {
				timer = setTimeout(() => {
					flush();
					timer = null;
				}, intervalMs);
			}
		}
		function cancel() {
			if (timer) clearTimeout(timer);
			timer = null;
		}
		return { trigger, cancel };
	}

	/** @type {Array<RowAny>} */
	let pendingEndpointEvents = [];
	/** @type {Array<RowAny>} */
	let pendingAggregateEvents = [];

	function flushEndpointCharts() {
		const events = pendingEndpointEvents;
		pendingEndpointEvents = [];
		for (const /** @type {RowAny} */ event of events) {
			let point = formatData(event);
			if (point) {
				data_request_series = upsertSeriesPoint(
					data_request_series,
					/** @type {string|number} */ (event.idendpoint),
					/** @type {string} */ (point.other),
					point
				);
			}

			if (Number((/** @type {string|number} */ event.statusCode)) >= 400) {
				data_top_error_endpoints = data_top_error_endpoints.map((series) =>
					series.idendpoint === event.idendpoint
						? { ...series, data: incrementBucketPoint((/** @type {Array<DashboardChartPoint>} */ (series.data || [])), /** @type {string|number} */ (event.dateTime), 'hour') }
						: series
				);
			}
		}
	}

	function flushAggregateCharts() {
		const events = pendingAggregateEvents;
		pendingAggregateEvents = [];
		for (const /** @type {RowAny} */ event of events) {
			data_logs_per_minute = incrementMinutePoint(data_logs_per_minute, /** @type {string|number} */ (event.dateTime));

			let status_class = statusClassForCode(/** @type {string|number} */ (event.statusCode));
			data_status_class = data_status_class.map((series, index) =>
				STATUS_CLASSES[index].key === status_class
					? { ...series, data: incrementMinutePoint((/** @type {Array<DashboardChartPoint>} */ (series.data || [])), /** @type {string|number} */ (event.dateTime)) }
					: series
			);

			data_status_summary = incrementStatusSummary(data_status_summary, /** @type {string|number} */ (event.statusCode));
		}
	}

	const endpointThrottle = createLeadingTrailingThrottle(2000, flushEndpointCharts);
	const aggregateThrottle = createTrailingThrottle(5000, flushAggregateCharts);

	// Consulta al backend el detalle de cada request con error, filtrado por las clases de
	// status code seleccionadas. Se llama al cambiar filtros y, en tiempo real, desde el throttle
	// atado al websocket (tableRefreshThrottle) — a diferencia de las gráficas, que se incrementan
	// localmente, acá se vuelve a consultar porque cada fila es un registro completo del log.
	// `status_code` acepta la lista de clases tal cual ('5xx', '4xx,5xx'); sin clases marcadas no
	// se consulta, porque devolvería todos los requests y no solo los que fallaron.
	let error_requests_request_id = 0;

	async function loadErrorRequests() {
		if (!idapp || selectedStatusClasses.length === 0) {
			data_error_requests = [];
			loading_error_requests = false;
			return;
		}

		// Marcar/desmarcar clases rápido dispara varias consultas encimadas y no hay garantía de
		// que respondan en orden: solo la más reciente puede escribir en la tabla, para que una
		// respuesta atrasada no pise los datos del filtro que el usuario tiene puesto ahora.
		const request_id = ++error_requests_request_id;
		loading_error_requests = true;

		try {
			let logs = await getRequestLogs(
				{
					idapp: idapp,
					environment: selectedEnvironment,
					last_hours: selectedHours,
					status_code: selectedStatusClasses.join(','),
					lightweight: true,
					order: 'timestamp',
					orderDirection: 'DESC',
					limit: 500
				},
				$userStore.token
			);
			if (request_id !== error_requests_request_id) return;
			data_error_requests = Array.isArray(logs) ? logs : [];
		} catch (error) {
			console.error(error);
			if (request_id === error_requests_request_id) {
				data_error_requests = [];
			}
		} finally {
			if (request_id === error_requests_request_id) {
				loading_error_requests = false;
			}
		}
	}

	const tableRefreshThrottle = createTrailingThrottle(5000, loadErrorRequests);

	async function onChangeIdApp() {
		console.log('Busca por el idapp ' + idapp, selectedEnvironment);

		// Descarta eventos en vuelo/atrasados de la selección anterior (app, entorno u horas)
		// antes de recargar el histórico, para que no se apliquen sobre el nuevo conjunto.
		pendingEndpointEvents = [];
		pendingAggregateEvents = [];
		endpointThrottle.cancel();
		aggregateThrottle.cancel();

		if (idapp) {
			try {
				data_request_series = [];

				let data_log_pm = await getLogsRecordsPerMinute(
					{ idapp: idapp, last_hours: selectedHours, environment: selectedEnvironment },
					$userStore.token
				);
				if (Array.isArray(data_log_pm)) {
					data_logs_per_minute = data_log_pm.map((/** @type {{minute?: string|number, count?: string|number}} */ dl) => {
						let now = new Date((dl.minute ? /** @type {string|number} */ dl.minute : Date.now()));
						return {
							name: now.toISOString(),
							value: [now.getTime(), parseInt(/** @type {string} */ (String(dl?.count)))],
							other: 'Nada'
						};
					});
				} else {
					console.error('getLogsRecordsPerMinute did not return an array:', data_log_pm);
					data_logs_per_minute = [];
				}

				let request_logs = await getRequestLogs(
					{
						idapp: idapp,
						environment: selectedEnvironment,
						last_hours: selectedHours,
						lightweight: true,
						order: 'timestamp',
						orderDirection: 'ASC',
						limit: 20000
					},
					$userStore.token
				);
				if (Array.isArray(request_logs)) {
					let seriesByEndpoint = new Map();
					for (const /** @type {RowAny} */ log of request_logs) {
						if (!seriesByEndpoint.has(log.idendpoint)) {
							seriesByEndpoint.set(log.idendpoint, /** @type {ChartSeriesItem} */ ({
								idendpoint: log.idendpoint,
								name: `${log.method} ${log.url}`,
								showSymbol: true,
								symbolSize: 4,
								data: []
							}));
						}
						let now = new Date(log.timestamp || Date.now());
						seriesByEndpoint.get(log.idendpoint).data.push(/** @type {DashboardChartPoint} */ ({
							name: now.toISOString(),
							value: [now, log?.response_time],
							other: `${log.method} ${log.url}`
						}));
					}
					data_request_series = Array.from(seriesByEndpoint.values());
				} else {
					console.error('getLogs did not return an array:', request_logs);
					data_request_series = [];
				}

				let data_status = await getLogsStatusClassPerMinute(
					{ idapp: idapp, last_hours: selectedHours, environment: selectedEnvironment },
					$userStore.token
				);
				if (Array.isArray(data_status)) {
					data_status_class = STATUS_CLASSES.map((statusClass) => ({
									name: statusClass.name,
									color: statusClass.color,
									data: data_status
										.filter((row) => (/** @type {StatusClassRow} */ row).status_class === statusClass.key)
										.map((row) => {
											let now = new Date((/** @type {StatusClassRow} */ row).minute || Date.now());
											return /** @type {DashboardChartPoint} */ ({
												name: now.toISOString(),
												value: [now, parseInt((/** @type {StatusClassRow} */ row)?.count)],
												other: 'Nada'
											});
										})
									}));
				} else {
					console.error('getLogsStatusClassPerMinute did not return an array:', data_status);
					data_status_class = [];
				}

				let summary = await getLogSummaryByAppStatusCode(
					{ idapp: idapp, environment: selectedEnvironment },
					$userStore.token
				);
				if (Array.isArray(summary)) {
					let countByStatusCode = /** @type {Record<string, number>} */ ({});
					for (const /** @type {StatusCodeRow} */ row of summary) {
						const code = String(row.status_code);
						countByStatusCode[code] = (countByStatusCode[code] || 0) + parseInt(row.recordCount);
					}
					data_status_summary = Object.entries(countByStatusCode).map(([name, value]) => /** @type {StatusSummaryEntry} */ ({
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
					? usage.most_used.map((/** @type {EndpointUsageRow} */ e) => ({ name: e.resource, value: parseInt(/** @type {string} */ (String(e.requestCount || '0'))) }))
					: [];
				data_unused_endpoints = Array.isArray(usage?.unused) ? usage.unused : [];

				let top_errors = await getTopErrorEndpointsByTime(
					{
						idapp: idapp,
						environment: selectedEnvironment,
						last_hours: selectedHours,
						top: 10,
						granularity: 'hour'
					},
					$userStore.token
				);
				data_top_error_endpoints = Array.isArray(top_errors?.top_error_endpoints)
					? top_errors.top_error_endpoints.map((/** @type {TopErrorEndpointRow} */ ep) => ({
							idendpoint: ep.idendpoint,
							name: `${ep.method} ${ep.resource}`,
							data: (/** @type {Array<{bucket: string, count: string|number}>} */ (/** @type {unknown} */ (ep.series || []))).map((/** @type {{bucket: string, count: string|number}} */ s) => {
								let bucketDate = new Date(s.bucket);
								return /** @type {DashboardChartPoint} */ ({
									name: bucketDate.toISOString(),
									value: [bucketDate, /** @type {number} */ s.count],
									other: ep.title
								});
							})
						}))
					: [];
			} catch (error) {
				console.error(error);
			}
		} else {
			data_request_series = [];
			data_logs_per_minute = [];
			data_status_class = [];
			data_status_summary = [];
			data_top_endpoints = [];
			data_unused_endpoints = [];
			data_top_error_endpoints = [];
		}
	}

	/** @type {(() => void)|undefined} */
	let unsubscribe_dy;
/** @type {(() => void)|undefined} */
	let unsubscribe_com;

	onMount(() => {
		unsubscribe_dy = storeServerDynamicInformation.subscribe((event) => {
			//	console.log(event);
			data_cpu.push(formatDataCPUUsage(/** @type {ServerCpuEvent} */ (event)));
			data_cpu = [...data_cpu];
			data_memory.push(formatDataMemoryUsage(/** @type {ServerMemoryEvent} */ (event)));
			data_memory = [...data_memory];
		});

		unsubscribe_com = storeEndpointOnComplete.subscribe((/** @type {RowAny} */ event) => {
			console.log('[dashboard] request_completed event:', event, {
				idapp,
				selectedEnvironment,
				matches: matchesSelection(event)
			});
			if (idapp && matchesSelection(event)) {
				pendingEndpointEvents.push(event);
				pendingAggregateEvents.push(event);
				endpointThrottle.trigger();
				aggregateThrottle.trigger();

				if (statusMatchesSelectedClasses(Number((/** @type {string|number} */ event.statusCode)), selectedStatusClasses)) {
					tableRefreshThrottle.trigger();
				}
			}
		});
	});

	onDestroy(() => {
		tableRefreshThrottle.cancel();
		unsubscribe_dy?.();
		unsubscribe_com?.();
		endpointThrottle.cancel();
		aggregateThrottle.cancel();
	});
</script>

<div class="field is-flex is-justify-content-flex-end is-align-items-center">
	<div class="mr-2">
		<Input
			label="Hours"
			type="number"
			min={2}
			step={5}
			bind:value={selectedHours}
			onchange={handleHoursChange}
		/>
	</div>
	<BasicSelect
		label="Environment"
		options={[
			{ id: 'dev', value: 'Development' },
			{ id: 'qa', value: 'QA' },
			{ id: 'prd', value: 'Production' }
		]}
		bind:option={selectedEnvironment}
		class="is-small"
	/>
</div>

{#snippet statusCodeFilter()}
	<span class="mr-2">Status codes:</span>
	{#each Object.keys(STATUS_CODE_RANGES) as cls}
		<label class="checkbox mr-2">
			<input
				type="checkbox"
				checked={selectedStatusClasses.includes(cls)}
				onchange={(/** @type {Event} */ e) => {
					const input = /** @type {HTMLInputElement} */ (e.target);
						if (!input) return;
					selectedStatusClasses = input.checked
						? [...selectedStatusClasses, cls]
						: selectedStatusClasses.filter((c) => c !== cls);
				}}
			/>
			{cls}
		</label>
	{/each}
	{#if loading_error_requests}
		<span class="icon is-small has-text-info" title="Loading requests…">
			<i class="fas fa-spinner fa-pulse"></i>
		</span>
	{/if}
{/snippet}

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
		<Chart.TimeSeries title="Response Time per Request" bind:series={data_request_series}
		></Chart.TimeSeries>
		<p class="help has-text-centered">
			Response time (ms) of each completed request for the selected app and environment, last {selectedHours}
			hours
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.TimeSeries title="Requests per minute" bind:data={data_logs_per_minute}
		></Chart.TimeSeries>
		<p class="help has-text-centered">
			Number of requests received per minute over the last {selectedHours} hours
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.TimeSeries
			title="Requests by Status per Minute ({selectedHours}h)"
			bind:series={data_status_class}
		></Chart.TimeSeries>
		<p class="help has-text-centered">
			Number of requests per minute over the last {selectedHours} hours, broken down by HTTP status class
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.Base
			title="Status Code Distribution"
			option={{
				tooltip: { trigger: 'item', formatter: '{b}: {c} requests ({d}%)' },
				legend: {
					orient: 'vertical',
					left: 'left',
					// La leyenda la dibuja ECharts sobre canvas (no es HTML), así que el tooltip
					// nativo de la leyenda es la única forma de describir cada status code al pasar
					// el mouse por encima.
					tooltip: {
						show: true,
						formatter: (/** @type {{ name: string }} */ params) => `${params.name} — ${httpStatusText(params.name)}`
					}
				}
			}}
			series={[
				{
					type: 'pie',
					data: /** @type {Array<{ value: any[]; name?: string }>} */ (data_status_summary.map((e) => ({ value: [e.value], name: e.name })))
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
			series={[{ type: 'bar', data: data_top_endpoints.map((/** @type {{name: string, value: number}} */ d) => ({ value: [d.value] })) }]}
		></Chart.Base>
		<p class="help has-text-centered">
			Most-used endpoints for the selected app and environment in the last 7 days
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<Chart.TimeSeries
			title="Top 10 Endpoints with Most Errors ({selectedHours}h)"
			bind:series={data_top_error_endpoints}
			tooltipFormatter={/** @type {(params: any) => string} */ (topErrorsTooltipFormatter)}
		></Chart.TimeSeries>
		<p class="help has-text-centered">
			Endpoints with the most errors (status code &gt;= 400) per hour in the last {selectedHours} hours,
			for the selected app and environment
		</p>
	</div>
	<div class="column is-full">
		<p class="title is-6">
			Request Log by Status Code ({selectedStatusClasses.length
				? selectedStatusClasses.join(', ')
				: 'no status selected'}, last {selectedHours}h)
		</p>
		<Table
			RawDataTable={data_error_requests}
			columns={{
				timestamp: {
					label: 'Date/Time',
					decorator: { component: ColumnTypes.DateTime, props: { format: 'yyyy-MM-dd HH:mm:ss' } }
				},
				method: { label: 'Method' },
				url: { label: 'URL' },
				status_code: { label: 'Status' },
				response_time: { label: 'Time (ms)' },
				trace_id: { label: 'Trace ID' },
				id: { hidden: true },
				idapp: { hidden: true },
				idendpoint: { hidden: true },
				log_level: { hidden: true }
			}}
			left_items={[statusCodeFilter]}
			showSelectionButton={false}
			showNewButton={false}
			showEditButton={false}
			showDeleteButton={false}
			fileNameExport="requests_by_status"
		></Table>
		<p class="help has-text-centered">
			One row per request received by the selected app and environment in the last {selectedHours} hours,
			keeping only the status code classes checked above (up to the 500 most recent, newest first). Check
			or uncheck a class to query the server again; with none checked nothing is loaded. The list also
			refreshes on its own — at most once every 5 seconds — when a new request matching those classes
			arrives. Copy a Trace ID to follow that request end to end in the endpoint's logs.
		</p>
	</div>
	<div class="column is-half-desktop is-full-tablet">
		<p class="title is-6">Unused Endpoints (last 7 days)</p>
		{#if data_unused_endpoints.length}
			<ul>
				{#each data_unused_endpoints as ep}
					<li>{/** @type {RowAny} */ (ep).resource} ({/** @type {RowAny} */ (ep).method})</li>
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
