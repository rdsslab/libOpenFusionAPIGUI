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
		client: {start:"_app/immutable/entry/start.CvK4A7LL.js",app:"_app/immutable/entry/app.CCAgSmX9.js",imports:["_app/immutable/entry/start.CvK4A7LL.js","_app/immutable/chunks/DQZfVtAN.js","_app/immutable/chunks/BUViuycV.js","_app/immutable/chunks/C92U6oCk.js","_app/immutable/entry/app.CCAgSmX9.js","_app/immutable/chunks/BUViuycV.js","_app/immutable/chunks/D4M3gLlH.js","_app/immutable/chunks/k8OfMRS7.js","_app/immutable/chunks/C92U6oCk.js","_app/immutable/chunks/Moeizxl0.js","_app/immutable/chunks/kJtK5BpZ.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
