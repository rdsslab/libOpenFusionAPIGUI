<script>
	import { Tab, EditorCode, JSONView } from '@rdsslab/svelte-components';
	import AppVarsSelector from '$lib/OpenFusionAPI/Application/widgets/endpoints/widgets/params_json_selector.svelte';
	import { TimeOutChangeValue } from '$lib/OpenFusionAPI/Application/utils/utils.js';

	let { endpoint = $bindable({}), onchange = () => {} } = $props();

	let cnx_sample = $state({
		host: 'localhost',
		port: 21050,
		username: '',
		password: '',
		authType: 'PLAIN',
		useTLS: false,
		maxRows: 1000,
		timeoutMs: 30000
	});

	let query_sample_get = 'SELECT id, name, category FROM enddb.demo WHERE category = $category;';
	let query_sample_post = 'SELECT * FROM enddb.demo WHERE category IN ($categories) AND id >= $min_id LIMIT 1000;';
	let query_sample_post_result = 'SELECT * FROM enddb.demo WHERE category IN (\'X\', \'Y\') AND id >= 1 LIMIT 1000;';

	let sample_bind_post = $state({
		bind: { categories: ['X', 'Y', 'Z'], min_id: 1 }
	});

	let tabList = $state([
		{ label: 'Query', isActive: true, classIcon: ' fa-solid fa-database ', component: tab_query },
		{ label: 'Pass Parameters', component: tab_pass_params },
		{ label: 'Connection Parameters', component: tab_cnx_params }
	]);

	let query_code = $state('');
	let timeoutChange;

	let cnx_custom = $state({});
	let cnx_appvar = $state('');

	$effect(() => {
		endpoint?.code;
		endpoint?.custom_data;
		timeoutChange = TimeOutChangeValue(timeoutChange, parseCode);
	});

	function parseCode() {
		query_code = endpoint.code ?? 'SELECT 1;';
		if (typeof endpoint.custom_data === 'string') {
			cnx_appvar = endpoint.custom_data;
			cnx_custom = {};
		} else {
			cnx_custom = endpoint.custom_data || {};
			cnx_appvar = '';
		}
	}

	function fnOnChange() {
		onchange(getData());
	}

	function getData() {
		let data = {
			code: query_code,
			custom_data:
				cnx_appvar && typeof cnx_appvar === 'string' && cnx_appvar.trim().length > 0
					? cnx_appvar
					: cnx_custom,
			data_test: $state.snapshot(endpoint.data_test),
			resource: endpoint.resource,
			method: endpoint.method,
			environment: endpoint.environment,
			endpoint: endpoint.endpoint
		};
		return data;
	}
</script>

{#snippet tab_query()}
	<div>
		<div>
			<div>
				<div class="content is-small">
					<span style="font-style: oblique; font-weight: bold;">$nameparameter</span>
					to bind a scalar value, or <span style="font-style: oblique; font-weight: bold;">:nameparameter</span>
					for array bind (expands to <code>IN (...)</code>). See the "Pass Parameters" tab.
				</div>
			</div>
		</div>
		<EditorCode
			isReadOnly={false}
			lang="sql"
			showFormat={true}
			bind:code={query_code}
			onchange={(c) => {
				fnOnChange();
			}}
		></EditorCode>
	</div>
{/snippet}

{#snippet tab_pass_params()}
	<div>
		<div class="content is-small">
			<p>
				This handler connects to <strong>Apache Hive / Cloudera Impala</strong> via the pure-JS <code>hive-driver</code> (Thrift TCP). It supports both scalar bind (<code>$param</code>) and array bind (<code>:param</code>) for <code>IN (...)</code> filters.
			</p>
			<div class="block">
				<h4>Parameter rules</h4>
				<div class="block">
					If you use <strong>"$param"</strong>, the value is a scalar (number, string, boolean, <code>NULL</code>).
					<br />
					<div class="block">
						For example: <br /> <code>{query_sample_get}</code>
					</div>
				</div>
				<div class="block">
					If you use <strong>":param"</strong>, the value is an array that expands into <code>IN (...)</code>.
					<br />
					<div class="block">
						For example: <br /> <code>{query_sample_post}</code>
						<br />
						The request payload should look like:
						<br />
						<JSONView bind:jsonObject={sample_bind_post} />
						<br />
						Internally the query becomes: <br /> <code>{query_sample_post_result}</code>
					</div>
				</div>

				<div class="icon-text">
					<span class="icon has-text-warning">
						<i class="fa-solid fa-circle-exclamation"></i>
					</span>
					<span>Always include <code>LIMIT</code> or a narrowing <code>WHERE</code>; <code>SELECT *</code> without a filter will pull the entire result set into memory.</span>
				</div>
			</div>

			{#if endpoint.method === 'GET'}
				<div class="block">
					<div class="icon-text">
						<span class="icon has-text-warning">
							<i class="fas fa-exclamation-triangle"></i>
						</span>
						<span>GET Method — simple requests work well; bind parameters come from the query string.</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet tab_cnx_params()}
	<div>
		<div class="content is-small">
			Configuration object for the <code>hive-driver</code> TCP connection.
			<div class="block">
				<h4>Connection parameters</h4>
				<p>Most common settings:</p>
				<JSONView bind:jsonObject={cnx_sample} />
			</div>
			<div class="block">
				<details>
					<summary>Full parameter reference</summary>
					<table class="table is-bordered is-small">
						<thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
						<tbody>
							<tr><td>host</td><td>string</td><td>Required. HiveServer2 / Impala host</td></tr>
							<tr><td>port</td><td>number</td><td>Default 21050</td></tr>
							<tr><td>username</td><td>string</td><td>LDAP / domain user (for PLAIN)</td></tr>
							<tr><td>password</td><td>string</td><td>Domain password (use TLS in production)</td></tr>
							<tr><td>authType</td><td>string</td><td>PLAIN (default), NONE / NOSASL, KERBEROS (future)</td></tr>
							<tr><td>useTLS</td><td>boolean</td><td>Enable SSL on the TCP socket</td></tr>
							<tr><td>tls</td><td>object</td><td>TLS options: ca, rejectUnauthorized, cert, key</td></tr>
							<tr><td>maxRows</td><td>number</td><td>Fetch batch size (default 1000). Not a total result limit.</td></tr>
							<tr><td>timeoutMs</td><td>number</td><td>Query timeout (default 30000)</td></tr>
						</tbody>
					</table>
				</details>
			</div>
		</div>

		<AppVarsSelector
			bind:custom={cnx_custom}
			bind:appvar={cnx_appvar}
			bind:environment={endpoint.environment}
			onselect={(selected) => {
				fnOnChange();
			}}
		></AppVarsSelector>
	</div>
{/snippet}

<Tab bind:tabs={tabList}></Tab>
