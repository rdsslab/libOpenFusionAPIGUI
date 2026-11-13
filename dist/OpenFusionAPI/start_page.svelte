<script>
	/**
	 * Landing page for OpenFusionAPIGUI.
	 * Shows version info and entry points.
	 * Designed to match the branding of libOpenFusionAPI landing page.
	 */
	const VERSION = "9.6.1";
	const OFAPI_VERSION = "14.2.1";
	const OFAPI_REPO = "https://github.com/rdsslab/libOpenFusionAPI";
	const GITHUB_REPO = "https://github.com/rdsslab/libOpenFusionAPIGUI";
	const GITHUB_ISSUES = "https://github.com/rdsslab/libOpenFusionAPIGUI/issues";
</script>

<div class="landing-container">
	<header class="navbar">
		<div class="navbar-brand">
			<span class="brand-mark">OFGUI</span>
			<span class="brand-text"><strong>OpenFusionAPI GUI</strong><small>v{VERSION}</small></span>
		</div>
		<div class="navbar-menu">
			<div class="navbar-end">
				<a class="navbar-link" href="https://github.com/rdsslab/libOpenFusionAPIGUI" target="_blank">GitHub</a>
				<a class="navbar-link" href="https://github.com/rdsslab/libOpenFusionAPI" target="_blank">OpenFusionAPI</a>
			</div>
		</div>
	</header>

	<section class="hero">
		<div class="hero-content">
			<h1 class="title">
				<span class="grad-text">Manage your API runtime</span> through a web interface.
			</h1>
			<p class="lead">
				Create endpoints, configure variables, schedule tasks, and monitor your services
				using OpenFusionAPI v{OFAPI_VERSION}.
			</p>

			<div class="actions">
				<a href="/openfusionapi" class="button is-primary is-large">
					Enter GUI
				</a>
				<a href="{OFAPI_REPO}#readme" class="button is-light is-large" target="_blank">
					Read docs <span class="icon"><i class="fas fa-external-link-alt"></i></span>
				</a>
			</div>

			<div class="features">
				<div class="feature">
					<i class="fas fa-cogs feature-icon"></i>
					<strong>Endpoints</strong>
					<br><small>Create handlers, schemas, access policies</small>
				</div>
				<div class="feature">
					<i class="fas fa-clock feature-icon"></i>
					<strong>Tasks</strong>
					<br><small>Cron/interval jobs with auto-backoff</small>
				</div>
				<div class="feature">
					<i class="fas fa-bots feature-icon"></i>
					<strong>Bots</strong>
					<br><small>Telegram integration for notifications</small>
				</div>
				<div class="feature">
					<i class="fas fa-database feature-icon"></i>
					<strong>Variables</strong>
					<br><small>Reuse config across endpoints</small>
				</div>
			</div>
		</div>
	</section>

	<section class="stats">
		<div class="stat">
			<span class="num">{VERSION}</span>
			<span class="lbl">Latest version</span>
		</div>
		<div class="stat">
			<span class="num">v{OFAPI_VERSION}</span>
			<span class="lbl">OpenFusionAPI runtime</span>
		</div>
		<div class="stat">
			<span class="num">12</span>
			<span class="lbl">Handlers</span>
		</div>
		<div class="stat">
			<span class="badge">MIT + LGPL-3</span>
			<span class="lbl">Open source</span>
		</div>
	</section>
</div>

<style>
	/* --- CSS Custom Properties --- */
	:root {
		--bg: #0a0a0a;
		--bg-2: #121212;
		--ink: #f0f0f0;
		--muted: #b3b3b3;
		--dim: #888;
		--line: rgba(255, 255, 255, 0.08);
		--line-strong: rgba(255, 255, 255, 0.15);
		--panel: rgba(255, 255, 255, 0.04);
		--brand: #F85C00;
		--brand-2: #FF7A00;
		--grad: linear-gradient(135deg, #F85C00 0%, #FF7A00 100%);
		--shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
		--radius: 12px;
		--font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		--mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		--teal: #00c2a8;
	}

	/* --- Layout --- */
	.landing-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* --- Navbar --- */
	.navbar {
		position: sticky;
		top: 0;
		z-index: 1000;
		background: rgba(26, 26, 26, 0.7);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--line);
		padding: 8px 20px;
	}
	.navbar-brand {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.brand-mark {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--grad);
		color: #fff;
		font-weight: 800;
		font-size: 14px;
		display: grid;
		place-items: center;
	}
	.brand-text strong { font-size: 15px; font-family: var(--font); }
	.brand-text small { color: var(--muted); font-size: 11px; }
	.navbar-links {
		display: flex;
		gap: 24px;
	}
	.navbar-link {
		color: var(--muted);
		text-decoration: none;
		transition: color 120ms;
	}
	.navbar-link:hover { color: var(--ink); }

	/* --- Hero --- */
	.hero {
		flex: 1;
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 48px;
		align-items: center;
		padding: 68px 20px;
	}
	.hero-content h1.title {
		font-size: clamp(2rem, 4.5vw, 3.2rem);
		line-height: 1.1;
		margin: 0 0 16px;
		font-family: var(--font);
	}
	.grad-text {
		background: var(--grad);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.lead {
		color: var(--muted);
		font-size: 16px;
		max-width: 560px;
		margin: 0 0 24px;
		font-family: var(--font);
	}
	.actions {
		display: flex;
		gap: 12px;
		margin-bottom: 32px;
	}
	.button.is-primary.is-large {
		padding: 12px 24px;
		font-weight: 600;
		border-radius: 10px;
	}
	.button.is-light.is-large {
		padding: 12px 24px;
		font-weight: 600;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: var(--panel);
	}
	.features {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}
	.feature {
		text-align: center;
		padding: 16px;
		border: 1px solid var(--line);
		border-radius: 10px;
		background: var(--panel);
	}
	.feature-icon {
		font-size: 24px;
		color: var(--brand);
		margin-bottom: 8px;
	}
	.feature strong { display: block; font-size: 14px; margin-bottom: 4px; }
	.feature small { color: var(--muted); font-size: 11px; }

	/* --- Glow effect --- */
	.glow {
		position: absolute;
		width: 200px;
		height: 200px;
		border-radius: 50%;
		background: var(--brand);
		filter: blur(70px);
		opacity: 0.15;
		top: -60px;
		left: -80px;
		z-index: 0;
		pointer-events: none;
	}
	.hero-visual {
		position: relative;
	}
	.hero-visual::before {
		content: "";
		position: absolute;
		inset: 0;
		background: radial-gradient(800px 400px at 8% -10%, #12307a33 0%, transparent 50%),
		            radial-gradient(600px 260px at 50% -60%, #F85C0033 0%, transparent 50%);
		z-index: -1;
	}

	/* --- Stats --- */
	.stats {
		padding: 0 20px 40px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}
	.stat {
		text-align: center;
		padding: 20px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--panel);
	}
	.num {
		font-size: 26px;
		font-weight: 800;
		letter-spacing: -0.015em;
		background: var(--grad);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		display: inline-block;
	}
	.lbl {
		display: block;
		margin-top: 6px;
		color: var(--dim);
		font-size: 11.5px;
		text-transform: uppercase;
		font-family: var(--mono);
	}
	.badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 999px;
		background: var(--brand);
		color: #fff;
		font-size: 12px;
		font-weight: 600;
	}

	/* --- Responsive --- */
	@media (width <= 920px) {
		.hero {
			grid-template-columns: 1fr;
			gap: 36px;
		}
		.features {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (width <= 560px) {
		.features {
			grid-template-columns: 1fr;
		}
		.stats {
			grid-template-columns: 1fr 1fr;
		}
		.actions {
			flex-direction: column;
		}
	}
</style>