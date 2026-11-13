# libFusionAPIGUI

GUI for OpenFusionAPI — the runtime API platform.

## 🚀 Overview

**OpenFusionAPI GUI** provides a web-based admin console for managing, monitoring, and deploying APIs built with [libOpenFusionAPI](https://github.com/rdsslab/libOpenFusionAPI).

Built with SvelteKit and Bulma, it offers:

| Feature | Description |
|---------|-------------|
| **Endpoint management** | Create, edit, enable/disable endpoints across dev, qa, prd |
| **Application variables** | Manage reusable variables with environment scope |
| **Interval tasks** | Schedule cron/interval jobs with distributed locking |
| **Messaging bots** | Configure Telegram bots for notifications and auth |
| **Async wrappers** | Track background jobs via WebSocket or polls |
| **Audit logs** | Search and filter runtime events |

## 🧑‍💻 Target audiences

- **Backend developers** — Rapid API creation and testing
- **Platform operators** — Environment management and observability
- **Integration engineers** — SQL, SOAP, MongoDB, Hive handlers
- **AI agent workflows** — MCP tooling via HTTP API

## 🛠️ Installation & Development

```bash
git clone https://github.com/rdsslab/libOpenFusionAPIGUI.git
cd libOpenFusionAPIGUI
npm install
npm run dev
```

The GUI communicates with an OpenFusionAPI server at `http://localhost:3000`. Set the `VITE_API_BASE` environment variable to connect to a different instance.

## 🔗 Related projects

| Project | Version | Purpose |
|---------|---------|---------|
| **libOpenFusionAPI** | v14.2.1 | Runtime engine (API server) |
| **libOpenFusionAPIGUI** | v9.6.1 | Web admin console |

Both are open source under LGPL-3.0 and MIT respectively.

## 📚 Documentation

- [OpenFusionAPI Docs](https://github.com/rdsslab/libOpenFusionAPI#readme)
- [Handler Reference](./src/docs/handlers/)
- [Interval Tasks](./src/docs/interval_tasks/)

## 🤝 Contributing

Pull requests welcome. See [Issues](https://github.com/rdsslab/libOpenFusionAPIGUI/issues).