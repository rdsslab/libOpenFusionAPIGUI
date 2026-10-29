/**
 * Permisos de un environment agrupados por recurso y acción.
 */
export type EnvPermissions = Record<string, Record<string, boolean>>;
/**
 * Valor de `user.ctrl` tal como lo guarda el backend.
 */
export type UserCtrl = {
    as_admin?: boolean | undefined;
    admin?: boolean | undefined;
    users?: unknown[] | undefined;
    log?: Record<string, unknown> | undefined;
    env?: Record<string, EnvPermissions> | undefined;
};
/**
 * Usuario interno que viaja en la sesión.
 */
export type SessionUser = {
    username: string;
    name?: string | undefined;
    email?: string | undefined;
    enabled?: boolean | undefined;
    ctrl?: UserCtrl | undefined;
};
/**
 * Contenido de `userStore`. Tras el logout queda vacío, por eso todo es opcional.
 */
export type SessionState = {
    token?: string | undefined;
    login?: string | undefined;
    valid?: boolean | undefined;
    message?: string | undefined;
    user?: SessionUser | undefined;
    data?: unknown;
};
/**
 * Respuesta de `restoreSystemEndpoints`.
 */
export type SystemEndpointsStatus = {
    message?: string | undefined;
    valid?: boolean | undefined;
};
/**
 * Evento `server_model_changed` del websocket.
 */
export type ServerModelChangedEvent = {
    model?: string | undefined;
    action?: string | undefined;
    idapp?: string | number | undefined;
    id?: string | number | undefined;
    ts?: string | number | undefined;
};
/**
 * Evento `interval_task` del websocket.
 */
export type IntervalTaskEvent = {
    idtask?: string | number | undefined;
    idapp?: string | number | undefined;
    status?: string | undefined;
    timestamp?: number | undefined;
    ts?: number | undefined;
};
/**
 * Fila de `ofapi_async_jobs`: el estado persistido de una petición que el
 * handler ASYNC_WRAPPER ejecuta en segundo plano. `id` es el mismo UUID que
 * el endpoint devuelve como `requestId` con el 202. EXPIRED nunca se escribe
 * en la tabla: se deriva de `expires_at`.
 */
export type AsyncJobRow = {
    id?: string | undefined;
    idendpoint_base?: string | undefined;
    idendpoint_async?: string | undefined;
    idapp?: string | undefined;
    environment?: string | undefined;
    params?: {
        query?: Record<string, unknown>;
        body?: unknown;
    } | null | undefined;
    fingerprint?: string | undefined;
    status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "EXPIRED" | undefined;
    consume_count?: number | undefined;
    max_consumes?: number | undefined;
    job_token?: string | undefined;
    ttl_ms?: number | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    expires_at?: string | undefined;
    completed_at?: string | undefined;
    method?: string | undefined;
    url?: string | undefined;
    resource?: string | undefined;
    duration_ms?: number | undefined;
    consume?: string | undefined;
};
/**
 * Evento `database_hook` de la tabla `ofapi_async_jobs`: el backend emite
 * uno por cada create/update/destroy del modelo, de manera que la vista de
 * Async Requests refleja los cambios de estado sin recargar.
 */
export type AsyncJobChangedEvent = {
    model?: string | undefined;
    action?: string | undefined;
    data?: AsyncJobRow | undefined;
    ts?: string | number | undefined;
};
/**
 * Evento `bot_status_changed` del websocket.
 */
export type BotStatusChangedEvent = {
    idbot?: string | number | undefined;
    idapp?: string | number | undefined;
    runtime_status?: string | undefined;
    failure_count?: number | undefined;
};
/**
 * Evento `bot_changed` del websocket.
 */
export type BotChangedEvent = {
    idbot?: string | number | undefined;
    idapp?: string | number | undefined;
    action?: string | undefined;
};
/**
 * Opción de un select (`{label, value}`).
 */
export type SelectOption = {
    label?: string | undefined;
    value: string | number;
    icon?: string | undefined;
    description?: string | undefined;
    enabled?: boolean | undefined;
};
/**
 * Opción del `PredictiveInput` (`{name, value}`).
 */
export type PredictiveOption = {
    name: string;
    value: unknown;
    enabled?: boolean | undefined;
};
/**
 * Fila de la tabla de aplicaciones.
 */
export type AppRow = {
    idapp?: string | number | undefined;
    app?: string | undefined;
    description?: string | undefined;
    enabled?: boolean | undefined;
    rowkey?: number | undefined;
    endpoint?: string | undefined;
    endpoints?: EndpointRow[] | undefined;
    jwt_key?: string | undefined;
};
/**
 * Fila de `ofapi_appvar`.
 */
export type AppVarRow = {
    idvar?: string | number | undefined;
    idapp?: string | number | undefined;
    name?: string | undefined;
    value?: string | undefined;
    environment?: string | undefined;
    env_destination?: string | undefined;
    description?: string | undefined;
    enabled?: boolean | undefined;
    type?: string | undefined;
    edit_name?: boolean | undefined;
    org_name?: string | undefined;
    idvar_destination?: string | number | undefined;
};
/**
 * Fila de `ofapi_intervaltask`.
 */
export type IntervalTaskRow = {
    idtask?: number | null | undefined;
    idendpoint?: string | number | undefined;
    iduser?: number | null | undefined;
    idapp?: string | number | undefined;
    enabled?: boolean | undefined;
    interval?: number | undefined;
    datestart?: string | undefined;
    dateend?: string | undefined;
    next_run?: string | undefined;
    last_run?: string | undefined;
    exec_time_limit?: number | undefined;
    failed_attempts?: number | undefined;
    status?: number | undefined;
    params?: Record<string, unknown> | undefined;
    allow_concurrent?: boolean | undefined;
    idkey?: number | null | undefined;
    schedule_mode?: string | undefined;
    cron?: string | undefined;
    timezone?: string | undefined;
    window_start?: string | undefined;
    window_end?: string | undefined;
    window_days?: string | undefined;
    max_failed_attempts?: number | undefined;
    history_limit?: number | undefined;
    disabled_by?: string | null | undefined;
    disabled_reason?: string | null | undefined;
    note?: string | undefined;
    last_response?: string | undefined;
    task_enabled?: boolean | undefined;
    url?: string | undefined;
    method?: string | undefined;
    resource?: string | undefined;
    last_exec_time?: number | undefined;
};
/**
 * Fila de `ofapi_bot`.
 */
export type BotRow = {
    idbot?: number | null | undefined;
    idapp?: string | number | undefined;
    name?: string | undefined;
    description?: string | undefined;
    provider?: string | undefined;
    token?: string | undefined;
    code?: string | undefined;
    enabled?: boolean | undefined;
    environment?: string | undefined;
    params?: Record<string, unknown> | undefined;
    runtime_status?: string | undefined;
    failure_count?: number | undefined;
    last_error_type?: string | undefined;
    last_error_message?: string | undefined;
    last_failure_at?: string | undefined;
    next_retry_at?: string | undefined;
    last_started_at?: string | undefined;
    last_healthy_at?: string | undefined;
    disabled_by?: string | null | undefined;
    disabled_reason?: string | null | undefined;
};
/**
 * Fila de usuario interno (`ofapi_system_user`).
 */
export type SystemUserRow = {
    iduser?: string | number | undefined;
    username?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    enabled?: boolean | undefined;
    ctrl?: UserCtrl | undefined;
    last_login?: string | undefined;
};
/**
 * Entrada de `data_test.query` / `data_test.headers`.
 */
export type DataTestRow = {
    enabled?: boolean | undefined;
    key?: string | undefined;
    name?: string | undefined;
    value?: string | undefined;
};
/**
 * Configuración del tester de un endpoint.
 */
export type DataTest = {
    query: Array<DataTestRow>;
    headers: Array<DataTestRow>;
    body: Record<string, unknown>;
    auth: Record<string, unknown>;
    last_response?: Object | undefined;
};
/**
 * Mensaje del chat de prueba de agentes IA.
 */
export type ChatMessage = {
    type: "ia" | "user";
    sender?: string | undefined;
    prompt: string;
    time?: string | undefined;
    status?: string | undefined;
};
/**
 * Configuración del handler ASYNC_WRAPPER.
 */
export type AsyncWrapperConfig = {
    ttl_ms?: number | undefined;
    max_consumes?: number | undefined;
    notify_ws?: boolean | undefined;
};
/**
 * Configuración específica de cada handler. Cada handler usa sus propias claves,
 * así que solo se declaran las que la GUI tipa de forma explícita.
 */
export type CustomData = {
    mimeType?: string | undefined;
    fileName?: string | undefined;
    isBase64?: boolean | undefined;
    async?: AsyncWrapperConfig | undefined;
    query_type?: string | undefined;
    connection_override_allow?: string[] | undefined;
};
/**
 * `custom_data` del handler TEXT.
 */
export type TextCustomData = {
    mimeType?: string | undefined;
    fileName?: string | undefined;
    isBase64?: boolean | undefined;
};
/**
 * Payload que los editores de handler envían al editor de endpoints.
 */
export type HandlerChangePayload = {
    data_test?: DataTest | undefined;
    code?: string | undefined;
    docs?: string | undefined;
    File?: File | undefined;
    custom_data?: CustomData | undefined;
    resource?: string | undefined;
    method?: string | undefined;
    environment?: string | undefined;
    endpoint?: string | undefined;
};
/**
 * Fila de `ofapi_endpoint` tal como la maneja la GUI.
 */
export type EndpointRow = {
    idendpoint?: string | undefined;
    idapp?: string | undefined;
    app?: string | undefined;
    endpoint?: string | undefined;
    resource?: string | undefined;
    method?: string | undefined;
    handler?: string | undefined;
    environment?: string | undefined;
    description?: string | undefined;
    code?: string | undefined;
    enabled?: boolean | undefined;
    access?: number | undefined;
    cache_time?: number | undefined;
    rowkey?: number | undefined;
    latest_updater?: string | null | undefined;
    cors?: Record<string, unknown> | undefined;
    headers_test?: Record<string, unknown> | undefined;
    data_test?: DataTest | undefined;
    json_schema?: Record<string, unknown> | undefined;
    mcp?: Record<string, unknown> | undefined;
    ctrl?: UserCtrl | undefined;
    File?: File | undefined;
    params?: Record<string, unknown> | undefined;
    code_js?: string | undefined;
    custom_data?: CustomData | undefined;
    docs?: string | undefined;
    keywords?: string | undefined;
    title?: string | undefined;
    timeout?: number | undefined;
    price_by_request?: number | undefined;
    price_kb_request?: number | undefined;
    price_kb_response?: number | undefined;
};
/**
 * Fila de `ofapi_app`.
 */
export type AppDetail = {
    idapp?: string | number | undefined;
    app?: string | undefined;
    description?: string | undefined;
    rowkey?: number | undefined;
    iduser?: number | null | undefined;
    enabled?: boolean | undefined;
    vars?: Record<string, Record<string, unknown>> | undefined;
    params?: Record<string, unknown> | undefined;
    endpoints?: EndpointRow[] | undefined;
};
/**
 * Fila de un cliente de API.
 */
export type ApiClientRow = {
    idapiclient?: string | number | undefined;
    name?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
    enabled?: boolean | undefined;
    description?: string | undefined;
    ctrl?: UserCtrl | undefined;
    idapp?: string | number | undefined;
    app?: string | undefined;
};
/**
 * Formulario de cliente de API (`widgets/users`).
 */
export type ApiClientForm = {
    idclient?: string | number | undefined;
    username?: string | undefined;
    first_name?: string | undefined;
    last_name?: string | undefined;
    email?: string | undefined;
    document_type?: string | undefined;
    document_id?: string | undefined;
    phone?: string | undefined;
    password?: string | undefined;
    repeatPassword?: string | undefined;
    startAt?: string | undefined;
    endAt?: string | undefined;
    enabled?: boolean | undefined;
    exp_time?: number | undefined;
    status?: string | undefined;
    change_password?: boolean | undefined;
};
/**
 * Formulario de usuario interno (`widgets/system_users`).
 */
export type SystemUserForm = {
    iduser?: number | undefined;
    username?: string | undefined;
    first_name?: string | undefined;
    last_name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    repeatPassword?: string | undefined;
    enabled?: boolean | undefined;
    custom_data: Record<string, unknown>;
    start_date?: string | undefined;
    end_date?: string | undefined;
    exp_time?: number | undefined;
    ctrl: UserCtrl;
    change_password?: boolean | undefined;
};
/**
 * Fila de una API key.
 */
export type ApiKeyRow = {
    idkey?: string | number | undefined;
    idapp?: string | number | undefined;
    idclient?: string | number | undefined;
    name?: string | undefined;
    key?: string | undefined;
    enabled?: boolean | undefined;
    description?: string | undefined;
    ctrl?: UserCtrl | undefined;
    startAt?: string | undefined;
    endAt?: string | undefined;
    token?: string | undefined;
    params?: Record<string, unknown> | undefined;
    exec_time_limit?: number | undefined;
    failed_attempts?: number | undefined;
    status?: string | undefined;
    last_exec_time?: number | undefined;
    last_response?: unknown;
    app?: string | undefined;
    resource?: string | undefined;
    environment?: string | undefined;
    app_enabled?: boolean | undefined;
    last_run?: string | undefined;
};
/**
 * Fila de logs de peticiones.
 */
export type RequestLogRow = {
    idlog?: string | number | undefined;
    endpoint?: string | undefined;
    method?: string | undefined;
    statusCode?: number | undefined;
    status_code?: string | undefined;
    response_time?: number | undefined;
    timestamp?: string | undefined;
    environment?: string | undefined;
    idapp?: string | number | undefined;
    trace_id?: string | undefined;
    response?: unknown;
    url?: string | undefined;
    log_level?: string | undefined;
    client?: string | undefined;
    app_name?: string | undefined;
};
/**
 * Fila del historial de una interval task.
 */
export type IntervalTaskHistoryRow = {
    idhistory?: string | number | undefined;
    idtask?: string | number | undefined;
    status?: number | undefined;
    started_at?: string | undefined;
    finished_at?: string | undefined;
    duration_ms?: number | undefined;
    response?: unknown;
    error?: string | undefined;
};
