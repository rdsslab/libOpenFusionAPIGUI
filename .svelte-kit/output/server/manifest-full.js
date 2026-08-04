export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.naXe2FKW.js",app:"_app/immutable/entry/app.pnbSJJ0B.js",imports:["_app/immutable/entry/start.naXe2FKW.js","_app/immutable/chunks/aUPx5Aue.js","_app/immutable/chunks/B2-gqYGt.js","_app/immutable/chunks/BNZkfw83.js","_app/immutable/entry/app.pnbSJJ0B.js","_app/immutable/chunks/B2-gqYGt.js","_app/immutable/chunks/BjpyjAm5.js","_app/immutable/chunks/BtAC0YE9.js","_app/immutable/chunks/BNZkfw83.js","_app/immutable/chunks/C2r-prRb.js","_app/immutable/chunks/BVns79rp.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
