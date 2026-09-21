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
		client: {start:"_app/immutable/entry/start.T1sIWEeu.js",app:"_app/immutable/entry/app.DnorVibR.js",imports:["_app/immutable/entry/start.T1sIWEeu.js","_app/immutable/chunks/BMndIsjw.js","_app/immutable/chunks/De1nWHi8.js","_app/immutable/chunks/C9edUzZ-.js","_app/immutable/entry/app.DnorVibR.js","_app/immutable/chunks/BMndIsjw.js","_app/immutable/chunks/DOD-a_Qo.js","_app/immutable/chunks/D6-47zDk.js","_app/immutable/chunks/De1nWHi8.js","_app/immutable/chunks/DMDuJMhE.js","_app/immutable/chunks/BhXx4uY9.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
