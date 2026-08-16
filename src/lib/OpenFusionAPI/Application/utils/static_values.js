export const listAccessMethod = [
	{ value: 'Public', id: 0 },
	{ value: 'Basic', id: 1 },
	{ value: 'Bearer', id: 2 },
	{ value: 'Basic & Bearer', id: 3 }
];

export const listHTTPMethods = {
	GET: { color: 'primary', icon: 'fa-brands fa-get-pocket' },
	POST: { color: 'link', icon: 'fa-solid fa-signs-post' },
	DELETE: { color: 'danger', icon: 'fa-solid fa-trash' },
	PUT: { color: 'info', icon: 'fa-solid fa-file-pen' },
	WS: { color: 'warning', icon: 'fa-solid fa-tower-broadcast' }
};

export const Environment = [
	{
		id: 'dev',
		value: `Development`,
		color: ' has-text-danger ',
		background: 'danger',
		icon: ' fa-solid fa-bug '
	},
	{
		id: 'qa',
		value: `Quality`,
		color: ' has-text-warning ',
		background: 'warning',
		icon: ' fa-solid fa-eye '
	},
	{
		id: 'prd',
		value: `Production`,
		color: ' has-text-success ',
		background: 'success',
		icon: ' fa-solid fa-check '
	}
];

export const defaultApp = {
	vars: {
		dev: {},
		qa: {},
		prd: {}
	},
	params: {},
	idapp: undefined,
	app: '',
	rowkey: 0,
	iduser: null,
	enabled: false,
	description: ''
};

export const defaultEndpoint = {
	enabled: false,
	endpoint: '',
	access: 0,
	method: 'GET',
	handler: 'NA',
	mcp: {},
	cache_time: 0,
	ctrl: {
		admin: true,
		users: [],
		log: {}
	},
	resource: '',
	code: '',
	idapp: 0,
	description: '',
	idendpoint: 0,
	cors: {},
	headers_test: {},
	data_test: {
		query: [
			{
				enabled: false,
				key: '',
				value: ''
			}
		],
		body: {
			selection: 0
		},
		headers: {},
		auth: {
			selection: 0
		}
	},
	latest_updater: null,
	environment: 'dev',
	json_schema: {
		in: {
			enabled: false,
			schema: {
				type: 'object',
				properties: {},
				additionalProperties: true
			}
		},
		out: {
			enabled: false,
			schema: {
				type: 'object',
				properties: {},
				additionalProperties: true
			}
		}
	}
};

export const defaultValuesIntervalTask = (task) => {
	const baseTask = {
		idtask: null,
		idendpoint: '',
		iduser: null,
		idapp: '',
		enabled: false,
		interval: 300,
		datestart: '',
		dateend: '',
		next_run: '',
		last_run: '',
		exec_time_limit: 30,
		failed_attempts: 0,
		status: 0,
		params: {},
		allow_concurrent: false,
		idkey: null,
		schedule_mode: 'interval',
		cron: '',
		timezone: '',
		window_start: '',
		window_end: '',
		window_days: '',
		max_failed_attempts: 10,
		history_limit: 50,
		note: ''
	};

	// Un `undefined` que llegue en `task` no debe pisar el default: los `bind:` de los
	// selects lanzan `props_invalid_value` si el campo enlazado queda sin valor.
	const incoming = Object.fromEntries(
		Object.entries(task || {}).filter(([, v]) => v !== undefined)
	);

	const merged = {
		...baseTask,
		...incoming
	};

	// La API devuelve los TINYINT(1) como 1/0 e `Input type="boolean"` imprime el valor
	// crudo, así que sin esto el editor muestra "1" y "0" en lugar de "true" y "false".
	merged.enabled = !!merged.enabled;
	merged.allow_concurrent = !!merged.allow_concurrent;

	return merged;
};

/**
 * Estados que el planificador escribe en `status`. La tabla y el editor muestran la
 * etiqueta, nunca el número: un "3" no le dice nada a quien administra las tareas.
 */
export const IntervalTaskStatus = {
	0: {
		label: 'Waiting',
		background: 'light',
		icon: ' fa-solid fa-clock ',
		description: 'Waiting for its next run.'
	},
	1: {
		label: 'Running',
		background: 'info',
		icon: ' fa-solid fa-play ',
		description: 'The task is running right now.'
	},
	2: {
		label: 'OK',
		background: 'success',
		icon: ' fa-solid fa-circle-check ',
		description: 'The last run finished successfully.'
	},
	3: {
		label: 'Error',
		background: 'danger',
		icon: ' fa-solid fa-triangle-exclamation ',
		description: 'The last run failed. Check the recorded response.'
	},
	4: {
		label: 'Timeout',
		background: 'warning',
		icon: ' fa-solid fa-hourglass-end ',
		description: 'The run exceeded its time limit and was aborted.'
	}
};

export const IntervalTaskStatusFallback = {
	label: 'Unknown',
	background: 'light',
	icon: ' fa-solid fa-circle-question ',
	description: 'Unknown status.'
};

/**
 * `status` conserva el resultado de la última corrida cuando esta termina. Para mostrar
 * el estado operativo actual, toda tarea que no esté ejecutándose vuelve a Waiting.
 */
export function getIntervalTaskRuntimeStatus(value) {
	return Number(value) === 1 ? IntervalTaskStatus[1] : IntervalTaskStatus[0];
}

/** Resultado de la última ejecución, separado del estado operativo actual. */
export function getIntervalTaskLastResultStatus(value) {
	const numericStatus = Number(value);
	return numericStatus >= 2 && numericStatus <= 4 ? IntervalTaskStatus[numericStatus] : null;
}

/**
 * Campos de `ofapi_intervaltask` que escribe el planificador, no el usuario. El editor
 * los muestra como solo lectura y no los reenvía al guardar.
 */
export const INTERVAL_TASK_RUNTIME_FIELDS = [
	'status',
	'last_run',
	'next_run',
	'last_exec_time',
	'last_response'
];

export const defaultValuesBot = (bot) => {
	const baseBot = {
		idbot: null,
		idapp: '',
		name: '',
		description: '',
		provider: 'telegram',
		token: '',
		code: '',
		enabled: true,
		environment: 'prd',
		params: {}
	};

	return {
		...baseBot,
		...(bot || {})
	};
};

/**
 * Estado observado del runtime de un bot (columna `runtime_status` de `ofapi_bot`).
 *
 * Es distinto de `enabled`: `enabled` es la INTENCIÓN del usuario ("este bot debe correr")
 * y `runtime_status` es lo que realmente está pasando. El servidor nunca apaga un bot por
 * un fallo recuperable —red, DNS, 429 o 5xx del proveedor—: lo reintenta con backoff y
 * luego lo pone en cuarentena sondeando indefinidamente, así que un bot en BACKOFF o
 * QUARANTINED se recupera solo y NO requiere que nadie lo toque. Por eso cada estado
 * declara `needsAction`: es lo que decide si la interfaz debe alarmar o tranquilizar.
 */
export const BotRuntimeStatus = {
	STOPPED: {
		label: 'Stopped',
		color: ' has-text-grey ',
		background: 'light',
		icon: ' fa-solid fa-circle-stop ',
		needsAction: false,
		description: 'The bot is not running.'
	},
	STARTING: {
		label: 'Starting',
		color: ' has-text-info ',
		background: 'info',
		icon: ' fa-solid fa-play ',
		needsAction: false,
		description: 'The worker is starting and validating the token against the provider.'
	},
	RUNNING: {
		label: 'Running',
		color: ' has-text-success ',
		background: 'success',
		icon: ' fa-solid fa-circle-check ',
		needsAction: false,
		description: 'The bot is up and receiving updates.'
	},
	BACKOFF: {
		label: 'Retrying',
		color: ' has-text-warning ',
		background: 'warning',
		icon: ' fa-solid fa-clock-rotate-left ',
		needsAction: false,
		description:
			'A recoverable failure (network, DNS, provider 429/5xx). The bot stays enabled and is ' +
			'retried automatically. No action is needed.'
	},
	QUARANTINED: {
		label: 'Quarantined',
		color: ' has-text-warning ',
		background: 'warning',
		icon: ' fa-solid fa-hourglass-half ',
		needsAction: false,
		description:
			'Recoverable failures persist, so the bot moved to slow probing (15/30/60 min). It stays ' +
			'enabled and keeps retrying indefinitely: it recovers on its own once the cause clears.'
	},
	DISABLED_ERROR: {
		label: 'Disabled (error)',
		color: ' has-text-danger ',
		background: 'danger',
		icon: ' fa-solid fa-triangle-exclamation ',
		needsAction: true,
		description:
			'Repeated permanent failures (revoked token or code that does not compile). Fix the token ' +
			'or the code and save: the bot is re-enabled automatically.'
	}
};

/** Estado a mostrar cuando el servidor todavía no reportó ninguno. */
export const BotRuntimeStatusFallback = BotRuntimeStatus.STOPPED;

/**
 * Campos de `ofapi_bot` que escribe el runtime, no el usuario. La interfaz los muestra
 * pero nunca los reenvía al guardar: hacerlo sobrescribiría el estado observado con una
 * copia vieja tomada al abrir el editor.
 */
export const BOT_RUNTIME_FIELDS = [
	'runtime_status',
	'failure_count',
	'last_error_type',
	'last_error_message',
	'last_failure_at',
	'next_retry_at',
	'last_started_at',
	'last_healthy_at',
	'disabled_by',
	'disabled_reason'
];
