/**
 * Tipos compartidos de la GUI (solo JSDoc: este módulo no exporta código).
 *
 * Se importan con `import('#lib/OpenFusionAPI/types/models.js').Nombre` dentro de
 * un comentario JSDoc.
 */

/**
 * Permisos de un environment agrupados por recurso y acción.
 * @typedef {Record<string, Record<string, boolean>>} EnvPermissions
 */

/**
 * Valor de `user.ctrl` tal como lo guarda el backend.
 * @typedef {object} UserCtrl
 * @property {boolean} [as_admin]
 * @property {boolean} [admin]
 * @property {Array<unknown>} [users]
 * @property {Record<string, unknown>} [log]
 * @property {Record<string, EnvPermissions>} [env]
 */

/**
 * Usuario interno que viaja en la sesión.
 * @typedef {object} SessionUser
 * @property {string} username
 * @property {string} [name]
 * @property {string} [email]
 * @property {boolean} [enabled]
 * @property {UserCtrl} [ctrl]
 */

/**
 * Contenido de `userStore`. Tras el logout queda vacío, por eso todo es opcional.
 * @typedef {object} SessionState
 * @property {string} [token]
 * @property {string} [login]
 * @property {boolean} [valid]
 * @property {string} [message]
 * @property {SessionUser} [user]
 * @property {unknown} [data]
 */

/**
 * Respuesta de `restoreSystemEndpoints`.
 * @typedef {object} SystemEndpointsStatus
 * @property {string} [message]
 * @property {boolean} [valid]
 */

/**
 * Evento `server_model_changed` del websocket.
 * @typedef {object} ServerModelChangedEvent
 * @property {string} [model]
 * @property {string} [action]
 * @property {number|string} [idapp]
 * @property {number|string} [id]
 * @property {number|string} [ts]
 */

/**
 * Evento `interval_task` del websocket.
 * @typedef {object} IntervalTaskEvent
 * @property {number|string} [idtask]
 * @property {number|string} [idapp]
 * @property {string} [status]
 * @property {number} [timestamp]
 * @property {number} [ts]
 */

/**
 * Evento `bot_status_changed` del websocket.
 * @typedef {object} BotStatusChangedEvent
 * @property {number|string} [idbot]
 * @property {number|string} [idapp]
 * @property {string} [runtime_status]
 * @property {number} [failure_count]
 */

/**
 * Evento `bot_changed` del websocket.
 * @typedef {object} BotChangedEvent
 * @property {number|string} [idbot]
 * @property {number|string} [idapp]
 * @property {string} [action]
 */

/**
 * Opción de un select (`{label, value}`).
 * @typedef {object} SelectOption
 * @property {string} [label]
 * @property {string|number} value
 * @property {string} [icon]
 * @property {string} [description]
 * @property {boolean} [enabled]
 */

/**
 * Opción del `PredictiveInput` (`{name, value}`).
 * @typedef {object} PredictiveOption
 * @property {string} name
 * @property {unknown} value
 * @property {boolean} [enabled]
 */

/**
 * Fila de la tabla de aplicaciones.
 * @typedef {object} AppRow
 * @property {number|string} [idapp]
 * @property {string} [app]
 * @property {string} [description]
 * @property {boolean} [enabled]
 * @property {number} [rowkey]
 * @property {string} [endpoint]
 * @property {Array<EndpointRow>} [endpoints]
 * @property {string} [jwt_key]
 */

/**
 * Fila de `ofapi_appvar`.
 * @typedef {object} AppVarRow
 * @property {number|string} [idvar]
 * @property {number|string} [idapp]
 * @property {string} [name]
 * @property {string} [value]
 * @property {string} [environment]
 * @property {string} [env_destination]
 * @property {string} [description]
 * @property {boolean} [enabled]
 * @property {string} [type]
 * @property {boolean} [edit_name]
 * @property {string} [org_name]
 * @property {number|string} [idvar_destination]
 */

/**
 * Fila de `ofapi_intervaltask`.
 * @typedef {object} IntervalTaskRow
 * @property {number|null} [idtask]
 * @property {number|string} [idendpoint]
 * @property {number|null} [iduser]
 * @property {number|string} [idapp]
 * @property {boolean} [enabled]
 * @property {number} [interval]
 * @property {string} [datestart]
 * @property {string} [dateend]
 * @property {string} [next_run]
 * @property {string} [last_run]
 * @property {number} [exec_time_limit]
 * @property {number} [failed_attempts]
 * @property {number} [status]
 * @property {Record<string, unknown>} [params]
 * @property {boolean} [allow_concurrent]
 * @property {number|null} [idkey]
 * @property {string} [schedule_mode]
 * @property {string} [cron]
 * @property {string} [timezone]
 * @property {string} [window_start]
 * @property {string} [window_end]
 * @property {string} [window_days]
 * @property {number} [max_failed_attempts]
 * @property {number} [history_limit]
 * @property {string|null} [disabled_by]
 * @property {string|null} [disabled_reason]
 * @property {string} [note]
 * @property {string} [last_response]
 * @property {boolean} [task_enabled]
 * @property {string} [url]
 * @property {string} [method]
 * @property {string} [resource]
 * @property {number} [last_exec_time]
 */

/**
 * Fila de `ofapi_bot`.
 * @typedef {object} BotRow
 * @property {number|null} [idbot]
 * @property {number|string} [idapp]
 * @property {string} [name]
 * @property {string} [description]
 * @property {string} [provider]
 * @property {string} [token]
 * @property {string} [code]
 * @property {boolean} [enabled]
 * @property {string} [environment]
 * @property {Record<string, unknown>} [params]
 * @property {string} [runtime_status]
 * @property {number} [failure_count]
 * @property {string} [last_error_type]
 * @property {string} [last_error_message]
 * @property {string} [last_failure_at]
 * @property {string} [next_retry_at]
 * @property {string} [last_started_at]
 * @property {string} [last_healthy_at]
 * @property {string|null} [disabled_by]
 * @property {string|null} [disabled_reason]
 */

/**
 * Fila de usuario interno (`ofapi_system_user`).
 * @typedef {object} SystemUserRow
 * @property {number|string} [iduser]
 * @property {string} [username]
 * @property {string} [name]
 * @property {string} [email]
 * @property {boolean} [enabled]
 * @property {UserCtrl} [ctrl]
 * @property {string} [last_login]
 */

/**
 * Entrada de `data_test.query` / `data_test.headers`.
 * @typedef {object} DataTestRow
 * @property {boolean} [enabled]
 * @property {string} [key]
 * @property {string} [name]
 * @property {string} [value]
 */

/**
 * Configuración del tester de un endpoint.
 * @typedef {object} DataTest
 * @property {Array<DataTestRow>} query
 * @property {Array<DataTestRow>} headers
 * @property {Record<string, unknown>} body
 * @property {Record<string, unknown>} auth
 * @property {Object} [last_response]
 */

/**
 * Mensaje del chat de prueba de agentes IA.
 * @typedef {object} ChatMessage
 * @property {'ia'|'user'} type
 * @property {string} [sender]
 * @property {string} prompt
 * @property {string} [time]
 * @property {string} [status]
 */

/**
 * Configuración del handler ASYNC_WRAPPER.
 * @typedef {object} AsyncWrapperConfig
 * @property {number} [ttl_ms]
 * @property {number} [max_consumes]
 * @property {boolean} [notify_ws]
 */

/**
 * Configuración específica de cada handler. Cada handler usa sus propias claves,
 * así que solo se declaran las que la GUI tipa de forma explícita.
 * @typedef {object} CustomData
 * @property {string} [mimeType]
 * @property {string} [fileName]
 * @property {boolean} [isBase64]
 * @property {AsyncWrapperConfig} [async]
 * @property {string} [query_type]
 * @property {Array<string>} [connection_override_allow]
 */

/**
 * `custom_data` del handler TEXT.
 * @typedef {object} TextCustomData
 * @property {string} [mimeType]
 * @property {string} [fileName]
 * @property {boolean} [isBase64]
 */

/**
 * Payload que los editores de handler envían al editor de endpoints.
 * @typedef {object} HandlerChangePayload
 * @property {DataTest} [data_test]
 * @property {string} [code]
 * @property {string} [docs]
 * @property {File} [File]
 * @property {CustomData} [custom_data]
 * @property {string} [resource]
 * @property {string} [method]
 * @property {string} [environment]
 * @property {string} [endpoint]
 */

/**
 * Fila de `ofapi_endpoint` tal como la maneja la GUI.
 * @typedef {object} EndpointRow
 * @property {string} [idendpoint]
 * @property {string} [idapp]
 * @property {string} [app]
 * @property {string} [endpoint]
 * @property {string} [resource]
 * @property {string} [method]
 * @property {string} [handler]
 * @property {string} [environment]
 * @property {string} [description]
 * @property {string} [code]
 * @property {boolean} [enabled]
 * @property {number} [access]
 * @property {number} [cache_time]
 * @property {number} [rowkey]
 * @property {string|null} [latest_updater]
 * @property {Record<string, unknown>} [cors]
 * @property {Record<string, unknown>} [headers_test]
 * @property {DataTest} [data_test]
 * @property {Record<string, unknown>} [json_schema]
 * @property {Record<string, unknown>} [mcp]
 * @property {UserCtrl} [ctrl]
 * @property {File} [File]
 * @property {Record<string, unknown>} [params]
 * @property {string} [code_js]
 * @property {CustomData} [custom_data]
 * @property {string} [docs]
 * @property {string} [keywords]
 * @property {string} [title]
 * @property {number} [timeout]
 * @property {number} [price_by_request]
 * @property {number} [price_kb_request]
 * @property {number} [price_kb_response]
 */

/**
 * Fila de `ofapi_app`.
 * @typedef {object} AppDetail
 * @property {number|string} [idapp]
 * @property {string} [app]
 * @property {string} [description]
 * @property {number} [rowkey]
 * @property {number|null} [iduser]
 * @property {boolean} [enabled]
 * @property {Record<string, Record<string, unknown>>} [vars]
 * @property {Record<string, unknown>} [params]
 * @property {Array<EndpointRow>} [endpoints]
 */

/**
 * Fila de un cliente de API.
 * @typedef {object} ApiClientRow
 * @property {number|string} [idapiclient]
 * @property {string} [name]
 * @property {string} [username]
 * @property {string} [password]
 * @property {boolean} [enabled]
 * @property {string} [description]
 * @property {UserCtrl} [ctrl]
 * @property {number|string} [idapp]
 * @property {string} [app]
 */

/**
 * Formulario de cliente de API (`widgets/users`).
 * @typedef {object} ApiClientForm
 * @property {number|string} [idclient]
 * @property {string} [username]
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [email]
 * @property {string} [document_type]
 * @property {string} [document_id]
 * @property {string} [phone]
 * @property {string} [password]
 * @property {string} [repeatPassword]
 * @property {string} [startAt]
 * @property {string} [endAt]
 * @property {boolean} [enabled]
 * @property {number} [exp_time]
 * @property {string} [status]
 * @property {boolean} [change_password]
 */

/**
 * Formulario de usuario interno (`widgets/system_users`).
 * @typedef {object} SystemUserForm
 * @property {number} [iduser]
 * @property {string} [username]
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [email]
 * @property {string} [password]
 * @property {string} [repeatPassword]
 * @property {boolean} [enabled]
 * @property {Record<string, unknown>} custom_data
 * @property {string} [start_date]
 * @property {string} [end_date]
 * @property {number} [exp_time]
 * @property {UserCtrl} ctrl
 * @property {boolean} [change_password]
 */

/**
 * Fila de una API key.
 * @typedef {object} ApiKeyRow
 * @property {number|string} [idkey]
 * @property {number|string} [idapp]
 * @property {number|string} [idclient]
 * @property {string} [name]
 * @property {string} [key]
 * @property {boolean} [enabled]
 * @property {string} [description]
 * @property {UserCtrl} [ctrl]
 * @property {string} [startAt]
 * @property {string} [endAt]
 * @property {string} [token]
 * @property {Record<string, unknown>} [params]
 * @property {number} [exec_time_limit]
 * @property {number} [failed_attempts]
 * @property {string} [status]
 * @property {number} [last_exec_time]
 * @property {unknown} [last_response]
 * @property {string} [app]
 * @property {string} [resource]
 * @property {string} [environment]
 * @property {boolean} [app_enabled]
 * @property {string} [last_run]
 */

/**
 * Fila de logs de peticiones.
 * @typedef {object} RequestLogRow
 * @property {number|string} [idlog]
 * @property {string} [endpoint]
 * @property {string} [method]
 * @property {number} [statusCode]
 * @property {string} [status_code]
 * @property {number} [response_time]
 * @property {string} [timestamp]
 * @property {string} [environment]
 * @property {number|string} [idapp]
 * @property {string} [trace_id]
 * @property {unknown} [response]
 * @property {string} [url]
 * @property {string} [log_level]
 * @property {string} [client]
 * @property {string} [app_name]
 */

/**
 * Fila del historial de una interval task.
 * @typedef {object} IntervalTaskHistoryRow
 * @property {number|string} [idhistory]
 * @property {number|string} [idtask]
 * @property {number} [status]
 * @property {string} [started_at]
 * @property {string} [finished_at]
 * @property {number} [duration_ms]
 * @property {unknown} [response]
 * @property {string} [error]
 */

export {};
