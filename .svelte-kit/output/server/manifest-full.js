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
		client: {start:"_app/immutable/entry/start.Dcauyi10.js",app:"_app/immutable/entry/app.6b5Ajdb2.js",imports:["_app/immutable/entry/start.Dcauyi10.js","_app/immutable/chunks/CbmYF6Ma.js","_app/immutable/chunks/c_nRm3Ub.js","_app/immutable/chunks/B7109Kme.js","_app/immutable/entry/app.6b5Ajdb2.js","_app/immutable/chunks/CbmYF6Ma.js","_app/immutable/chunks/DipM-mbf.js","_app/immutable/chunks/D0wyDYTI.js","_app/immutable/chunks/c_nRm3Ub.js","_app/immutable/chunks/rLRJ6LBE.js","_app/immutable/chunks/B044_7Rv.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
