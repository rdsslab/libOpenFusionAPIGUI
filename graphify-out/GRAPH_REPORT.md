# Graph Report - libOpenFusionAPIGUI  (2026-10-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1084 nodes · 1369 edges · 82 communities (67 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b59ab8f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- request.js
- dashboard.svelte
- interval_tasks/index.svelte
- logs/index.svelte
- audit_logs/index.svelte
- login/index.svelte
- bots/index.svelte
- endpoints/index.svelte
- apikeys/index.svelte
- system_users/index.svelte
- variables.svelte
- package.json
- Application/index.svelte
- editor.svelte
- widgets/users/index.svelte
- trace_view.svelte
- stores.js
- devDependencies
- static_values.js
- logs.svelte
- basic.svelte
- endpoint.svelte
- ref_lib
- columns/index.svelte
- compilerOptions
- scripts
- text.svelte
- svelte
- endpoint_bkp.svelte
- utils.js
- hiveDriver.svelte
- sql.svelte
- sqlHana.svelte
- @rdsslab/uFetch
- mongodb.svelte
- sqlBulkInsert.svelte
- @rdsslab/svelte-components
- cellTaskStatus.svelte
- set_version.js
- audit_detail.svelte
- buildQuery
- cellHandler.svelte
- authorizations.svelte
- asyncWrapper.svelte
- jwtUtils.js
- manifest.json
- bot_logs.svelte
- customFunction.svelte
- soap.svelte
- telegramBot.svelte
- history.svelte
- loadLogs
- dependencies
- js.svelte
- js_predefined_vars.svelte
- cellStatusCode.svelte
- OpenFusionAPI/index.svelte
- eslint.config.js
- application_variables/index.svelte
- cellBotStatus.svelte
- cellMethod.svelte
- app_vars_selector.svelte
- endpoint_label.svelte
- fetch.svelte
- params_json_selector.svelte
- cellTaskSchedule.svelte
- cellTraceId.svelte
- app.d.ts
- vite.config.js
- permissions.js
- cellAction.svelte
- cellEntity.svelte
- cellPath.svelte
- loglevel_select.svelte
- repository
- httpStatus.js
- refreshAll
- common/Select.svelte
- widgets/Select.svelte
- bugs
- peerDependencies

## God Nodes (most connected - your core abstractions)
1. `checkStatus()` - 53 edges
2. `@rdsslab/svelte-components` - 53 edges
3. `svelte` - 41 edges
4. `@rdsslab/uFetch` - 14 edges
5. `scripts` - 12 edges
6. `loadTasks()` - 7 edges
7. `compilerOptions` - 7 edges
8. `createLeadingTrailingThrottle()` - 6 edges
9. `buildQuery()` - 6 edges
10. `loadLogs()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `refreshAll()` --calls--> `loadAudit()`  [EXTRACTED]
  src/lib/OpenFusionAPI/Application/widgets/audit_logs/index.svelte → src/lib/OpenFusionAPI/Application/widgets/audit_logs/index.svelte  _Bridges community 41 → community 71_

## Import Cycles
- None detected.

## Communities (82 total, 15 thin omitted)

### Community 0 - "request.js"
Cohesion: 0.06
Nodes (53): ChangeAPIClientPassword(), ChangeSystemUserPassword(), changeUserPassword(), checkStatus(), clearCache(), CreateAPIClient(), CreateSystemUser(), DeleteAppVar() (+45 more)

### Community 1 - "dashboard.svelte"
Cohesion: 0.05
Nodes (41): aggregateThrottle, cpuUsage, createLeadingTrailingThrottle(), tick(), trigger(), createTrailingThrottle(), cancel(), trigger() (+33 more)

### Community 2 - "interval_tasks/index.svelte"
Cohesion: 0.05
Nodes (39): activeTab, applyRuntimeEvent(), canCreate, canDelete, canEdit, columns, currentUser, DataTableTasks (+31 more)

### Community 3 - "logs/index.svelte"
Cohesion: 0.05
Nodes (33): activeStatusFilter, appNameById, columns, endDate, endpointsOptions, environment, ENVIRONMENTS, eventName (+25 more)

### Community 4 - "audit_logs/index.svelte"
Cohesion: 0.05
Nodes (35): action, ACTIONS, ACTOR_KINDS, actorKind, actorUsername, columns, detailData, detailLoading (+27 more)

### Community 5 - "login/index.svelte"
Cohesion: 0.06
Nodes (29): changePwd, changePwdMatch, environment, forcedChangeError, handleSubmit(), lastToken, mounted, mustChangePassword (+21 more)

### Community 6 - "bots/index.svelte"
Cohesion: 0.06
Nodes (32): app, avisoVersionTitulo, canCreate, canDelete, canEdit, currentUser, downloadFileAppDoc(), EndpointEditorWidget (+24 more)

### Community 7 - "endpoints/index.svelte"
Cohesion: 0.07
Nodes (30): copied, isExpanded, { value = '' }, canCreate, canDelete, canEdit, clientLabel, closeEditor() (+22 more)

### Community 8 - "apikeys/index.svelte"
Cohesion: 0.07
Nodes (28): canCreate, canDelete, canEdit, columns, currentUser, DataTableUsers, deleteUser(), environment (+20 more)

### Community 9 - "system_users/index.svelte"
Cohesion: 0.06
Nodes (24): url_paths, class_search, columns, data_backup, dataBackups, {
		idendpoint = $bindable(),

		onselect = (d) => {}
	}, selectionType, uF (+16 more)

### Community 10 - "variables.svelte"
Cohesion: 0.07
Nodes (27): retryIn, status, title, { value = $bindable(), row = $bindable() }, activeTab, canCreate, canDelete, canEdit (+19 more)

### Community 11 - "package.json"
Cohesion: 0.07
Nodes (22): appVarsFiltered, appVarsInternal, classAnimationCopyName, {
		idapp = $bindable('-'),
		isReadOnly = $bindable(false),
		showCode = $bindable(false),
		appVars = $bindable([]),
		title = $bindable(''),
		environment = $bindable(''),
		onchange = () => {},
		oncopy = () => {}
	}, new_var_name, noty, search_var, available_environments_list (+14 more)

### Community 12 - "Application/index.svelte"
Cohesion: 0.08
Nodes (23): author, description, exports, files, homepage, keywords, license, main (+15 more)

### Community 13 - "editor.svelte"
Cohesion: 0.09
Nodes (21): backupAllApps(), changepwd_compare_verify, currentUser, defaultPasswordChange, downloadFullBackupFile(), getListAppsInternal(), idapp, loading (+13 more)

### Community 14 - "widgets/users/index.svelte"
Cohesion: 0.11
Nodes (19): app, availableURL, clearValues(), deploying, derivedtabList, dirty, endpoint, getHandlerDocsRequest() (+11 more)

### Community 15 - "trace_view.svelte"
Cohesion: 0.10
Nodes (19): canCreate, canEdit, columns, currentUser, DataTableUsers, getDefaultValues(), isEditing, loadUsers() (+11 more)

### Community 16 - "stores.js"
Cohesion: 0.10
Nodes (14): luxon, formattedDate, hasMessage, isAttack, jsonFields, { show = $bindable(false), row = $bindable(), appName = $bindable('') }, errors, errorText (+6 more)

### Community 17 - "devDependencies"
Cohesion: 0.10
Nodes (19): authEventStore, listAppVars, listFunctionStoreDev, listFunctionStorePRD, listFunctionStoreQA, listHandlerStore, listMethodStore, statusSystemEndpointsStore (+11 more)

### Community 18 - "static_values.js"
Cohesion: 0.11
Nodes (18): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-svelte, globals, prettier, prettier-plugin-svelte (+10 more)

### Community 19 - "logs.svelte"
Cohesion: 0.11
Nodes (11): BOT_RUNTIME_FIELDS, BotRuntimeStatus, BotRuntimeStatusFallback, defaultEndpoint, Environment, INTERVAL_TASK_RUNTIME_FIELDS, IntervalTaskStatus, IntervalTaskStatusFallback (+3 more)

### Community 20 - "basic.svelte"
Cohesion: 0.13
Nodes (12): defaultApp, userStore, app, clearDataVars(), deploying, GetApp(), { idapp = $bindable(), onsavedeploy = () => {} }, notify (+4 more)

### Community 21 - "endpoint.svelte"
Cohesion: 0.13
Nodes (9): @rdsslab/uFetch, {
		class_content = $bindable('is-small'),
		onmessage = () => {},
		currentChat = $bindable({
			id: 1,
			name: 'Ana Pérez',
			preview: 'Hola, ¿cómo estás?',
			time: '12:30',
			avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
			active: true
		}),
		messages = $bindable([
			{ type: 'ia', sender: 'Ana Pérez', prompt: 'Hola, ¿cómo estás?', time: '12:30' },
			{ type: 'user', prompt: '¡Hola! Todo bien, ¿y tú?', time: '12:31', status: 'read' },
			{
				type: 'ia',
				sender: 'Ana Pérez',
				prompt: 'Muy bien, gracias. ¿Qué tal el trabajo?',
				time: '12:32'
			},
			{
				type: 'user',
				prompt: 'Bien, bastante ocupado últimamente. ¿Y tú?',
				time: '12:33',
				status: 'read'
			},
			{
				type: 'ia',
				sender: 'Ana Pérez',
				prompt: 'Igual, pero me encanta lo que hago. ¿Tienes planes para el fin de semana?',
				time: '12:34'
			}
		])
	}, messageInput, messages_list, messages, { url = $bindable(''), init_prompts = $bindable([]) }, appDataTable, columns (+1 more)

### Community 22 - "ref_lib"
Cohesion: 0.13
Nodes (10): labelx, { value = $bindable(), row = $bindable() }, unsubscribe, { value = $bindable(), row = $bindable() }, value_cache, { value = $bindable(), row = $bindable() }, env_params, isRunning (+2 more)

### Community 23 - "columns/index.svelte"
Cohesion: 0.13
Nodes (12): available_environments_list, {
		endpoint = $bindable({ method: 'X', access: 0, handler: '?', environment: '?' }),
		app = $bindable({}),
		validateResource = $bindable(false),
		availableURL = $bindable(false),
		oncopy = () => {}
	}, endpoint_copied, endpoint_env_copy, endpoint_replace_copy, environment_list, handlers, list_keywords (+4 more)

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (6): env_params, { value = $bindable(), row = $bindable() }, copied, env_selected, {
		environment = $bindable('?'),
		endpoint = $bindable('?'),
		method = $bindable('?'),
		handler = $bindable('?')
	}, handler_params

### Community 25 - "scripts"
Cohesion: 0.17
Nodes (11): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck, sourceMap, exclude (+3 more)

### Community 26 - "text.svelte"
Cohesion: 0.17
Nodes (12): scripts, build, check, check:watch, dev, dev_proxy, format, lint (+4 more)

### Community 27 - "svelte"
Cohesion: 0.17
Nodes (7): @rdsslab/svelte-components, ListTypes, { value = $bindable(), row = $bindable() }, {
		freeTyping = $bindable(false),
		placeholder = $bindable('$_VAR_NAME'),
		classIcon = $bindable(''),
		label = $bindable('Application Variable'),
		value = $bindable(''),
		environment = $bindable(''),
		onselect = () => {}
	}, options_app_vars, value_selected, { mcp = $bindable({}) }

### Community 28 - "endpoint_bkp.svelte"
Cohesion: 0.17
Nodes (8): svelte, { disabled = $bindable(false), option = $bindable({}), onselect }, methods, unsubscribe, unsubscribe, { value = $bindable(), row = $bindable() }, value_count_status_code, { value = $bindable(), row = $bindable(), onchangecell = () => {} }

### Community 29 - "utils.js"
Cohesion: 0.18
Nodes (10): custom_data, { endpoint = $bindable({}), onchange = () => {} }, file_selected, fnOnChange(), getData(), langEditor, mimeTypes, notify (+2 more)

### Community 30 - "hiveDriver.svelte"
Cohesion: 0.22
Nodes (4): defaultValuesEndpointRow(), ensureDataTestShape(), isNewApp(), mergeSourceOverwrite()

### Community 31 - "sql.svelte"
Cohesion: 0.20
Nodes (9): cnx_appvar, cnx_custom, cnx_sample, { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), query_code, sample_bind_post (+1 more)

### Community 32 - "sqlHana.svelte"
Cohesion: 0.20
Nodes (9): cnx_appvar, cnx_custom, { endpoint = $bindable({ endpoint: '', method: '', environment: '' }), onchange = () => {} }, fnOnChange(), getData(), query_code, sample_bind_post, sample_replace_post (+1 more)

### Community 33 - "@rdsslab/uFetch"
Cohesion: 0.20
Nodes (9): cnx_appvar, cnx_custom, cnx_sample, { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), query_code, sample_bind_post (+1 more)

### Community 34 - "mongodb.svelte"
Cohesion: 0.22
Nodes (8): cnx_appvar, cnx_custom, cnx_param_sample, { endpoint = $bindable({ endpoint: '', method: '', environment: '' }), onchange = () => {} }, fnOnChange(), getData(), js_code, tabList

### Community 35 - "sqlBulkInsert.svelte"
Cohesion: 0.22
Nodes (8): cnx_appvar, cnx_custom, data_example, { endpoint = $bindable({ endpoint: '', method: '', environment: '' }), onchange = () => {} }, fnOnChange(), getData(), table_name, tabList

### Community 36 - "@rdsslab/svelte-components"
Cohesion: 0.25
Nodes (6): {
		left = $bindable([]),
		onsavedeploy = () => {},
		oncancel = () => {},
		deploying = $bindable({ show: false, error: false, message: '' }),
		dirty = $bindable(false)
	}, { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), lastCode, tabList

### Community 37 - "cellTaskStatus.svelte"
Cohesion: 0.22
Nodes (7): class_search, columns, data_backup, dataBackups, {
		idbot = $bindable(),

		onselect = (d) => {}
	}, selectionType, uF

### Community 38 - "set_version.js"
Cohesion: 0.22
Nodes (8): lastResultStatus, nextIn, recordedStatus, response, status, suspension, title, { value = $bindable(), row = $bindable(), currentState = false }

### Community 39 - "audit_detail.svelte"
Cohesion: 0.25
Nodes (4): packageData, packagePath, parts, versionFilePath

### Community 40 - "buildQuery"
Cohesion: 0.25
Nodes (5): hasAfter, hasBefore, hasSnapshots, { show = $bindable(false), detail = $bindable(null), loading = $bindable(false) }, statusText

### Community 41 - "cellHandler.svelte"
Cohesion: 0.29
Nodes (8): buildQuery(), decorateRow(), isNumeric(), isValidRange(), loadAudit(), loadMore(), normalizedLimit(), scheduleReload()

### Community 42 - "authorizations.svelte"
Cohesion: 0.29
Nodes (6): css_class, css_icon, error_function, label, searchFunction(), { value = $bindable(), row = $bindable() }

### Community 43 - "asyncWrapper.svelte"
Cohesion: 0.32
Nodes (7): buildTableUsers(), columns, data_users, defaultValue(), table_users, unsubscribe, { users = $bindable({}) }

### Community 44 - "jwtUtils.js"
Cohesion: 0.32
Nodes (6): applyBaseEndpoint(), createEndpointUrl(), { endpoint = $bindable({}), onchange = () => {}, app = $bindable({}) }, endpointOptions, getFullRoute(), update()

### Community 45 - "manifest.json"
Cohesion: 0.29
Nodes (5): { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), functions, getData(), tabList

### Community 46 - "bot_logs.svelte"
Cohesion: 0.43
Nodes (5): RFC-7515, decodeJwtPayload(), getJwtExpiresInMinutes(), isJwtExpiringSoon(), logJwtExpiration()

### Community 47 - "customFunction.svelte"
Cohesion: 0.29
Nodes (6): category, description, handler, icon, label, name

### Community 48 - "soap.svelte"
Cohesion: 0.29
Nodes (5): columns, dataLogs, { idbot = $bindable(), hours = 24 }, inputHours, uF

### Community 49 - "telegramBot.svelte"
Cohesion: 0.29
Nodes (5): code_desc, code_sample_options, { endpoint = $bindable(), onchange = () => {} }, jsonParams, tabList

### Community 50 - "history.svelte"
Cohesion: 0.33
Nodes (5): { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), internal_code, tabList

### Community 51 - "loadLogs"
Cohesion: 0.29
Nodes (5): columns, dataRuns, loading, { task = $bindable({}) }, uF

### Community 52 - "dependencies"
Cohesion: 0.29
Nodes (7): buildQuery(), decorateRow(), isValidRange(), loadLogs(), refreshAll(), scheduleRealtimeRefresh(), scheduleReload()

### Community 53 - "js.svelte"
Cohesion: 0.33
Nodes (6): dependencies, bulma, @fortawesome/fontawesome-free, luxon, @rdsslab/svelte-components, @rdsslab/uFetch

### Community 54 - "js_predefined_vars.svelte"
Cohesion: 0.40
Nodes (5): { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), internal_code, tabList

### Community 55 - "cellStatusCode.svelte"
Cohesion: 0.33
Nodes (3): activeItems, copiedStates, vars_js

### Community 56 - "OpenFusionAPI/index.svelte"
Cohesion: 0.33
Nodes (5): isAttack, messageObj, statusClass, titleText, { value = $bindable(), row = $bindable() }

### Community 57 - "eslint.config.js"
Cohesion: 0.40
Nodes (5): failedLogins, page, sessionExpired, startJwtWatcher(), stopJwtWatcher()

### Community 58 - "application_variables/index.svelte"
Cohesion: 0.40
Nodes (4): eslint-config-prettier, @eslint/js, eslint-plugin-svelte, globals

### Community 59 - "cellBotStatus.svelte"
Cohesion: 0.40
Nodes (4): canEdit, currentUser, { idapp = $bindable(0) }, permEnv

### Community 60 - "cellMethod.svelte"
Cohesion: 0.40
Nodes (3): css_class_method, css_icon, { value = $bindable(''), row = $bindable() }

### Community 62 - "endpoint_label.svelte"
Cohesion: 0.40
Nodes (4): isCron, label, title, { value = $bindable(), row = $bindable() }

### Community 64 - "params_json_selector.svelte"
Cohesion: 0.50
Nodes (3): bulma, @fortawesome/fontawesome-free, App

### Community 67 - "app.d.ts"
Cohesion: 0.50
Nodes (3): ACTION_CLASS, badgeClass, { value = $bindable(), row = $bindable() }

### Community 68 - "vite.config.js"
Cohesion: 0.50
Nodes (3): badgeClass, ENTITY_CLASS, { value = $bindable(), row = $bindable() }

### Community 69 - "permissions.js"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 71 - "cellEntity.svelte"
Cohesion: 0.67
Nodes (3): confirmPrune(), loadStats(), refreshAll()

## Knowledge Gaps
- **12 isolated node(s):** `eslint`, `prettier`, `prettier-plugin-svelte`, `publint`, `svelte-check` (+7 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 777 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@rdsslab/svelte-components` connect `svelte` to `dashboard.svelte`, `interval_tasks/index.svelte`, `logs/index.svelte`, `audit_logs/index.svelte`, `login/index.svelte`, `bots/index.svelte`, `endpoints/index.svelte`, `apikeys/index.svelte`, `system_users/index.svelte`, `variables.svelte`, `package.json`, `Application/index.svelte`, `editor.svelte`, `widgets/users/index.svelte`, `trace_view.svelte`, `stores.js`, `basic.svelte`, `endpoint.svelte`, `ref_lib`, `columns/index.svelte`, `compilerOptions`, `endpoint_bkp.svelte`, `utils.js`, `sql.svelte`, `sqlHana.svelte`, `@rdsslab/uFetch`, `mongodb.svelte`, `sqlBulkInsert.svelte`, `@rdsslab/svelte-components`, `cellTaskStatus.svelte`, `buildQuery`, `asyncWrapper.svelte`, `jwtUtils.js`, `manifest.json`, `soap.svelte`, `telegramBot.svelte`, `history.svelte`, `loadLogs`, `js_predefined_vars.svelte`, `cellStatusCode.svelte`, `eslint.config.js`, `app_vars_selector.svelte`, `fetch.svelte`?**
  _High betweenness centrality (0.385) - this node is a cross-community bridge._
- **What connects `eslint`, `prettier`, `prettier-plugin-svelte` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `request.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06487434248977206 - nodes in this community are weakly interconnected._
- **Why does `svelte` connect `endpoint_bkp.svelte` to `dashboard.svelte`, `interval_tasks/index.svelte`, `logs/index.svelte`, `login/index.svelte`, `bots/index.svelte`, `endpoints/index.svelte`, `system_users/index.svelte`, `variables.svelte`, `package.json`, `Application/index.svelte`, `editor.svelte`, `widgets/users/index.svelte`, `devDependencies`, `endpoint.svelte`, `ref_lib`, `columns/index.svelte`, `compilerOptions`, `svelte`, `hiveDriver.svelte`, `cellTaskStatus.svelte`, `authorizations.svelte`, `asyncWrapper.svelte`, `manifest.json`, `soap.svelte`, `loadLogs`, `cellStatusCode.svelte`, `eslint.config.js`, `cellMethod.svelte`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Should `dashboard.svelte` be split into smaller, more focused modules?**
  _Cohesion score 0.05272108843537415 - nodes in this community are weakly interconnected._
- **Why does `@rdsslab/uFetch` connect `endpoint.svelte` to `request.js`, `interval_tasks/index.svelte`, `cellTaskStatus.svelte`, `endpoints/index.svelte`, `system_users/index.svelte`, `variables.svelte`, `Application/index.svelte`, `soap.svelte`, `loadLogs`, `basic.svelte`, `cellStatusCode.svelte`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `interval_tasks/index.svelte` be split into smaller, more focused modules?**
  _Cohesion score 0.05179704016913319 - nodes in this community are weakly interconnected._