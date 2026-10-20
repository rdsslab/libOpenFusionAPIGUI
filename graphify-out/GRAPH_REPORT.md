# Graph Report - libOpenFusionAPIGUI  (2026-10-19)

## Corpus Check
- 105 files · ~85,315 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 1072 nodes · 1812 edges · 84 communities (71 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82

## God Nodes (most connected - your core abstractions)
1. `@rdsslab/svelte-components` - 52 edges
2. `checkStatus()` - 52 edges
3. `svelte` - 41 edges
4. `userStore` - 17 edges
5. `@rdsslab/uFetch` - 14 edges
6. `url_paths` - 13 edges
7. `scripts` - 12 edges
8. `currentUserHasPermission()` - 12 edges
9. `getDefaultEnvironment()` - 10 edges
10. `GetEndpointsByIdapp()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `loadEndpointOptions()` --calls--> `GetEndpointsByIdapp()`  [EXTRACTED]
  src/lib/OpenFusionAPI/Application/widgets/logs/index.svelte → src/lib/OpenFusionAPI/Application/utils/request.js
- `loadApps()` --calls--> `getListApps()`  [EXTRACTED]
  src/lib/OpenFusionAPI/Application/widgets/logs/index.svelte → src/lib/OpenFusionAPI/Application/utils/request.js
- `refreshCurrentUserCtrl()` --calls--> `currentUserHasPermission()`  [EXTRACTED]
  src/lib/OpenFusionAPI/Application/index.svelte → src/lib/OpenFusionAPI/Application/utils/permissions.js
- `refreshCurrentUserCtrl()` --calls--> `GetSystemUsersList()`  [EXTRACTED]
  src/lib/OpenFusionAPI/Application/index.svelte → src/lib/OpenFusionAPI/Application/utils/request.js
- `menu` --calls--> `currentUserHasPermission()`  [EXTRACTED]
  src/lib/OpenFusionAPI/Application/index.svelte → src/lib/OpenFusionAPI/Application/utils/permissions.js

## Import Cycles
- None detected.

## Communities (84 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (40): aggregateThrottle, cpuUsage, createLeadingTrailingThrottle(), tick(), trigger(), createTrailingThrottle(), cancel(), trigger() (+32 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (43): isCron, label, title, { value = $bindable(), row = $bindable() }, activeTab, applyRuntimeEvent(), canCreate, canDelete (+35 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (35): activeStatusFilter, appNameById, columns, endDate, endpointsOptions, environment, ENVIRONMENTS, eventName (+27 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (38): clearCache(), GetAppVars(), getListFunction(), migrateEndpoints(), app, avisoVersionTitulo, canCreate, canDelete (+30 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (37): getListAppsInternal(), onRestoreAllFileSelected(), changeUserPassword(), checkStatus(), DeleteAppVar(), GetAllAppsBackup(), GetApp(), GetAppBackup() (+29 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (35): action, ACTIONS, ACTOR_KINDS, actorKind, actorUsername, columns, detailData, detailLoading (+27 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (30): ForgotPassword(), GetRecoveryOptions(), changePwd, changePwdMatch, environment, forcedChangeError, lastToken, loadRecoveryOptions() (+22 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (30): GetAPIClients(), GetAPIKeys(), canCreate, canDelete, canEdit, clientLabel, closeEditor(), columns (+22 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (21): luxon, HTTP_STATUS_TEXT, httpStatusText(), isAttack, messageObj, statusClass, titleText, { value = $bindable(), row = $bindable() } (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (27): CreateSystemUser(), DeleteSystemUser(), GetSystemUsersList(), ResetSystemUserPassword(), UpdateSystemUser(), canCreate, canDelete, canEdit (+19 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (23): activeTab, canCreate, canDelete, canEdit, columns, currentUser, customToken, DataTableBots (+15 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (24): ChangeAPIClientPassword(), CreateAPIClient(), GetAPIClientsList(), UpdateAPIClient(), canCreate, canEdit, changePassword(), columns (+16 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (23): author, description, exports, files, homepage, keywords, license, main (+15 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (20): EndpointSave(), app, availableURL, clearValues(), deploying, derivedtabList, endpoint, getHandlerDocsRequest() (+12 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (21): BOT_RUNTIME_FIELDS, defaultApp, defaultEndpoint, defaultValuesBot(), defaultValuesIntervalTask(), getIntervalTaskLastResultStatus(), getIntervalTaskRuntimeStatus(), getIntervalTaskSuspensionStatus() (+13 more)

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (20): backupAllApps(), changepwd_compare_verify, currentUser, defaultPasswordChange, downloadFullBackupFile(), idapp, loading, loading_full_backup (+12 more)

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (15): available_environments_list, DataAppVars, Datavars, env_dev, env_prd, env_qa, GetData(), handleServerModelChanged() (+7 more)

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (14): active_tab, columns_logs, columns_trace, dataLogs, datatraceLogs, {
		endpoint = $bindable({}),
		log = $bindable({
			status_info: 1,
			status_success: 1,
			status_redirect: 1,
			status_client_error: 2,
			status_server_error: 3
		})
	}, formattedNow, now (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-svelte, globals, prettier, prettier-plugin-svelte (+9 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (14): listFunctionStoreDev, listFunctionStorePRD, listFunctionStoreQA, css_class, css_icon, error_function, label, searchFunction() (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (11): isNewApp(), app, clearDataVars(), deploying, GetApp(), { idapp = $bindable(), onsavedeploy = () => {} }, notify, SaveApp() (+3 more)

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (13): RFC-7515, decodeJwtPayload(), formatJwtTimeLeft(), getJwtExpiresInMinutes(), isJwtExpiringSoon(), logJwtExpiration(), authEventStore, failedLogins (+5 more)

### Community 22 - "Community 22"
Cohesion: 0.13
Nodes (12): available_environments_list, {
		endpoint = $bindable({ method: 'X', access: 0, handler: '?', environment: '?' }),
		app = $bindable({}),
		validateResource = $bindable(false),
		availableURL = $bindable(false),
		oncopy = () => {}
	}, endpoint_copied, endpoint_env_copy, endpoint_replace_copy, environment_list, handlers, list_keywords (+4 more)

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (7): @rdsslab/uFetch, $lib/OpenFusionAPI/app/cellMethodsAttrs.svelte, messages, { url = $bindable(''), init_prompts = $bindable([]) }, appDataTable, columns, uf

### Community 24 - "Community 24"
Cohesion: 0.21
Nodes (4): svelte, { value = $bindable(), row = $bindable() }, { value = $bindable(), row = $bindable(), onchangecell = () => {} }, { mcp = $bindable({}) }

### Community 25 - "Community 25"
Cohesion: 0.17
Nodes (9): equalObjs(), appVarsFiltered, appVarsInternal, classAnimationCopyName, {
		idapp = $bindable('-'),
		isReadOnly = $bindable(false),
		showCode = $bindable(false),
		appVars = $bindable([]),
		title = $bindable(''),
		environment = $bindable(''),
		onchange = () => {},
		oncopy = () => {}
	}, internalOnchange(), new_var_name, noty (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.17
Nodes (12): scripts, build, check, check:watch, dev, dev_proxy, format, lint (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.20
Nodes (6): @rdsslab/svelte-components, {
		left = $bindable([]),
		onsavedeploy = () => {},
		oncancel = () => {},
		deploying = $bindable({ show: false, error: false, message: '' })
	}, ListTypes, { value = $bindable(), row = $bindable() }, notify, { value = $bindable(), row = $bindable(), onOpenTrace = undefined }

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (8): { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), internal_code, tabList, activeItems, copiedStates, vars_js

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (7): code_desc, code_sample_options, { endpoint = $bindable(), onchange = () => {} }, jsonParams, tabList, {
		freeTyping = $bindable(),
		placeholder = $bindable(),
		classIcon = $bindable(),
		label = $bindable(),
		custom = $bindable(),
		appvar = $bindable(),
		environment = $bindable(),
		langEditor = $bindable(),
		onselect = () => {}
	}, use_var_app

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (10): custom_data, { endpoint = $bindable({}), onchange = () => {} }, file_selected, fnOnChange(), getData(), langEditor, mimeTypes, notify (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.18
Nodes (8): listAccessMethod, storeCacheSize, labelx, { value = $bindable(), row = $bindable() }, unsubscribe, { value = $bindable(), row = $bindable() }, value_cache, endpointColumns

### Community 32 - "Community 32"
Cohesion: 0.20
Nodes (8): listAppVars, {
		freeTyping = $bindable(false),
		placeholder = $bindable('$_VAR_NAME'),
		classIcon = $bindable(''),
		label = $bindable('Application Variable'),
		value = $bindable(''),
		environment = $bindable(''),
		onselect = () => {}
	}, options_app_vars, value_selected, { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), tabList

### Community 33 - "Community 33"
Cohesion: 0.20
Nodes (9): TimeOutChangeValue(), cnx_appvar, cnx_custom, data_example, { endpoint = $bindable({ endpoint: '', method: '', environment: '' }), onchange = () => {} }, fnOnChange(), getData(), table_name (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.20
Nodes (9): cnx_appvar, cnx_custom, cnx_sample, { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), query_code, sample_bind_post (+1 more)

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): cnx_appvar, cnx_custom, { endpoint = $bindable({ endpoint: '', method: '', environment: '' }), onchange = () => {} }, fnOnChange(), getData(), query_code, sample_bind_post, sample_replace_post (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.20
Nodes (9): cnx_appvar, cnx_custom, cnx_sample, { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), query_code, sample_bind_post (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.20
Nodes (9): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck, sourceMap, extends (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.24
Nodes (9): $lib/OpenFusionAPI/app/utils.js, storeUsersList, buildTableUsers(), columns, data_users, defaultValue(), table_users, unsubscribe (+1 more)

### Community 39 - "Community 39"
Cohesion: 0.27
Nodes (8): menu, currentUserHasPermission(), getDefaultEnvironment(), hasPermission(), canEdit, currentUser, { idapp = $bindable(0) }, permEnv

### Community 40 - "Community 40"
Cohesion: 0.22
Nodes (8): Environment, storeEndpointOnStart, env_params, { value = $bindable(), row = $bindable() }, env_params, isRunning, { value = $bindable(), row = $bindable() }, ../utils.js

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (8): cnx_appvar, cnx_custom, cnx_param_sample, { endpoint = $bindable({ endpoint: '', method: '', environment: '' }), onchange = () => {} }, fnOnChange(), getData(), js_code, tabList

### Community 42 - "Community 42"
Cohesion: 0.25
Nodes (6): url_paths, columns, dataLogs, { idbot = $bindable(), hours = 24 }, inputHours, uF

### Community 43 - "Community 43"
Cohesion: 0.22
Nodes (8): statusSystemEndpointsStore, storeBotChanged, storeBotStatusChanged, storeEndpointOnComplete, storeServerDynamicInformation, storeServerModelChanged, storeSystemUsersList, userStore

### Community 44 - "Community 44"
Cohesion: 0.22
Nodes (7): class_search, columns, data_backup, dataBackups, {
		idbot = $bindable(),

		onselect = (d) => {}
	}, selectionType, uF

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (7): class_search, columns, data_backup, dataBackups, {
		idendpoint = $bindable(),

		onselect = (d) => {}
	}, selectionType, uF

### Community 46 - "Community 46"
Cohesion: 0.28
Nodes (7): activeTab, { ctrl = $bindable({}) }, ensureCtrl(), environments, resources, toggleAsAdmin(), togglePermission()

### Community 47 - "Community 47"
Cohesion: 0.25
Nodes (4): packageData, packagePath, parts, versionFilePath

### Community 48 - "Community 48"
Cohesion: 0.29
Nodes (6): $lib/OpenFusionAPI/app/endpoint/widgets/js_predefined_vars.svelte, { endpoint = $bindable({}), onchange = () => {} }, fnOnChange(), getData(), internal_code, tabList

### Community 49 - "Community 49"
Cohesion: 0.25
Nodes (5): listHTTPMethods, {
		color = $bindable(''),
		label = $bindable(' Label '),
		icon = $bindable('fas fa-home')
	}, css_class_method, css_icon, { value = $bindable(''), row = $bindable() }

### Community 50 - "Community 50"
Cohesion: 0.25
Nodes (6): storeIntervalTaskEvent, columns, dataRuns, loading, { task = $bindable({}) }, uF

### Community 51 - "Community 51"
Cohesion: 0.25
Nodes (5): hasAfter, hasBefore, hasSnapshots, { show = $bindable(false), detail = $bindable(null), loading = $bindable(false) }, statusText

### Community 52 - "Community 52"
Cohesion: 0.29
Nodes (8): buildQuery(), decorateRow(), isNumeric(), isValidRange(), loadAudit(), loadMore(), normalizedLimit(), scheduleReload()

### Community 53 - "Community 53"
Cohesion: 0.29
Nodes (6): BotRuntimeStatus, BotRuntimeStatusFallback, retryIn, status, title, { value = $bindable(), row = $bindable() }

### Community 54 - "Community 54"
Cohesion: 0.38
Nodes (5): listHandlerStore, defaultValuesEndpointRow(), ensureDataTestShape(), mergeSourceOverwrite(), validateURL()

### Community 55 - "Community 55"
Cohesion: 0.33
Nodes (6): getHandlerParams(), setCSS(), copied, env_selected, {
		environment = $bindable('?'),
		endpoint = $bindable('?'),
		method = $bindable('?'),
		handler = $bindable('?')
	}, handler_params

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (7): buildQuery(), decorateRow(), isValidRange(), loadLogs(), refreshAll(), scheduleRealtimeRefresh(), scheduleReload()

### Community 57 - "Community 57"
Cohesion: 0.33
Nodes (6): dependencies, bulma, @fortawesome/fontawesome-free, luxon, @rdsslab/svelte-components, @rdsslab/uFetch

### Community 58 - "Community 58"
Cohesion: 0.33
Nodes (3): copied, isExpanded, { value = '' }

### Community 59 - "Community 59"
Cohesion: 0.40
Nodes (4): eslint-config-prettier, @eslint/js, eslint-plugin-svelte, globals

### Community 60 - "Community 60"
Cohesion: 0.40
Nodes (5): ChangeSystemUserPassword(), getListHandler(), getListMethods(), changePassword(), submitForcedChange()

### Community 61 - "Community 61"
Cohesion: 0.40
Nodes (4): listMethodStore, { disabled = $bindable(false), option = $bindable({}), onselect }, methods, unsubscribe

### Community 62 - "Community 62"
Cohesion: 0.40
Nodes (4): storeCountResponseStatusCode, unsubscribe, { value = $bindable(), row = $bindable() }, value_count_status_code

### Community 63 - "Community 63"
Cohesion: 0.40
Nodes (3): {
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
	}, messageInput, messages_list

### Community 64 - "Community 64"
Cohesion: 0.50
Nodes (3): bulma, @fortawesome/fontawesome-free, App

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (3): ACTION_CLASS, badgeClass, { value = $bindable(), row = $bindable() }

### Community 67 - "Community 67"
Cohesion: 0.50
Nodes (3): badgeClass, ENTITY_CLASS, { value = $bindable(), row = $bindable() }

### Community 69 - "Community 69"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 71 - "Community 71"
Cohesion: 0.67
Nodes (3): getServerAPIVersion, getServerAPIVer(), loadServerVersion()

### Community 72 - "Community 72"
Cohesion: 0.67
Nodes (3): LoginRequest(), handleSubmit(), startRateLimit()

### Community 73 - "Community 73"
Cohesion: 0.67
Nodes (3): confirmPrune(), loadStats(), refreshAll()

## Knowledge Gaps
- **15 isolated node(s):** `./.svelte-kit/tsconfig.json`, `@sveltejs/package`, `@sveltejs/vite-plugin-svelte`, `@types/eslint`, `eslint` (+10 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 693 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@rdsslab/svelte-components` connect `Community 27` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 11`, `Community 12`, `Community 13`, `Community 15`, `Community 16`, `Community 17`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 25`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 38`, `Community 41`, `Community 42`, `Community 44`, `Community 45`, `Community 46`, `Community 48`, `Community 50`, `Community 51`, `Community 55`, `Community 58`, `Community 61`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **What connects `./.svelte-kit/tsconfig.json`, `@sveltejs/package`, `@sveltejs/vite-plugin-svelte` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05319148936170213 - nodes in this community are weakly interconnected._
- **Why does `svelte` connect `Community 24` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 6`, `Community 7`, `Community 10`, `Community 12`, `Community 13`, `Community 15`, `Community 16`, `Community 17`, `Community 19`, `Community 21`, `Community 22`, `Community 23`, `Community 25`, `Community 27`, `Community 28`, `Community 31`, `Community 38`, `Community 40`, `Community 42`, `Community 43`, `Community 44`, `Community 45`, `Community 49`, `Community 50`, `Community 54`, `Community 61`, `Community 62`, `Community 63`, `Community 68`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04698581560283688 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Community 18` to `Community 12`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._