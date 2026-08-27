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
		client: {start:"_app/immutable/entry/start.BO-J7eLU.js",app:"_app/immutable/entry/app.BrVaxiiA.js",imports:["_app/immutable/entry/start.BO-J7eLU.js","_app/immutable/chunks/2tyRzVec.js","_app/immutable/chunks/BXoj7d-P.js","_app/immutable/chunks/DyXsJF4Y.js","_app/immutable/entry/app.BrVaxiiA.js","_app/immutable/chunks/2tyRzVec.js","_app/immutable/chunks/CsvDJLJs.js","_app/immutable/chunks/Cjj0MEcA.js","_app/immutable/chunks/BXoj7d-P.js","_app/immutable/chunks/cyjigVAx.js","_app/immutable/chunks/DqyjDvQd.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
