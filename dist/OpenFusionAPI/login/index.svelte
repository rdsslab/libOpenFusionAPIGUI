<script>
	import {
		getListMethods,
		getListHandler,
		LoginRequest,
		GetServerAPIVersion,
		ChangeSystemUserPassword,
		GetRecoveryOptions,
		ForgotPassword,
		ConfirmResetPassword
	} from '../Application/utils/request.js';
	import { userStore } from '../Application/utils/stores.js';
	import {
		getJwtExpiresInMinutes,
		formatJwtTimeLeft,
		logJwtExpiration
	} from '../Application/utils/jwtUtils.js';
	import { getDefaultEnvironment } from '../Application/utils/permissions.js';
	import logo from '../img/favicon.png';
	import {
		Notifications,
		Modal,
		DialogModal,
		Input,
		BasicSelect
	} from '@rdsslab/svelte-components';
	import { version } from '../version.js';

	let noty = new Notifications();
	let { onlogin = () => {}, onfail = () => {}, isOverlay = false } = $props();
	let username = $state('');
	let password = $state('');
	let processing = $state({ waiting: false, error: null });
	let showPassword = $state(false);
	let mounted = $state(false);
	let serverVersion = $state('...');
	let mustChangePassword = $state(false);
	let lastToken = $state('');
	let forcedChangeError = $state('');
	let changePwd = $state({ current: '', newPassword: '', repeat: '' });
	let changePwdMatch = $derived(
		changePwd.newPassword.length > 0 && changePwd.newPassword === changePwd.repeat
	);

	// ── Recuperación / reset de clave (OTP por email o Telegram) ──
	const environment = getDefaultEnvironment();
	let recoveryOptions = $state(null);
	let showRecovery = $state(false);
	let recoveryStep = $state('request');
	let recoveryBusy = $state(false);
	let recoveryError = $state('');
	let recoveryInfo = $state('');
	let recovery = $state({ username: '', channel: 'auto', otp: '', newPassword: '', repeat: '' });

	const recoveryEnabled = $derived(
		recoveryOptions && (recoveryOptions.email?.enabled || recoveryOptions.telegram?.enabled)
	);

	const recoveryChannels = $derived.by(() => {
		const opts = [];
		const email = !!recoveryOptions?.email?.enabled;
		const telegram = !!recoveryOptions?.telegram?.enabled;
		if (email && telegram)
			opts.push({ id: 'auto', value: 'Auto (email / Telegram)', enabled: true });
		if (email) opts.push({ id: 'email', value: 'Email', enabled: true });
		if (telegram) opts.push({ id: 'telegram', value: 'Telegram', enabled: true });
		return opts;
	});

	const recoveryPwdMatch = $derived(
		recovery.newPassword.length > 0 && recovery.newPassword === recovery.repeat
	);

	$effect(() => {
		if (recoveryChannels.length > 0 && !recoveryChannels.some((c) => c.id === recovery.channel)) {
			recovery.channel = recoveryChannels[0].id;
		}
	});

	import { onMount } from 'svelte';

	async function loadServerVersion() {
		try {
			const versionRes = await GetServerAPIVersion();
			serverVersion = versionRes?.version || 'Unknown';
		} catch (error) {
			serverVersion = 'Unknown';
		}
	}

	onMount(() => {
		setTimeout(() => (mounted = true), 50);
		loadServerVersion();
		loadRecoveryOptions();
	});

	async function loadRecoveryOptions() {
		try {
			const res = await GetRecoveryOptions(environment);
			if (res && (res.email || res.telegram)) {
				recoveryOptions = res;
			}
		} catch (error) {
			// Endpoint no disponible (servidor antiguo): se oculta la opción.
			recoveryOptions = null;
		}
	}

	function openRecovery() {
		recoveryError = '';
		recoveryInfo = '';
		recoveryStep = 'request';
		if (!recovery.username && username) recovery.username = username;
		showRecovery = true;
	}

	function closeRecovery() {
		showRecovery = false;
		recoveryStep = 'request';
		recoveryError = '';
		recoveryInfo = '';
	}

	async function submitRecoveryRequest() {
		recoveryError = '';
		recoveryInfo = '';
		const name = String(recovery.username || '').trim();
		if (!name) {
			recoveryError = 'Please enter your username.';
			return;
		}
		if (recoveryBusy) return;
		recoveryBusy = true;
		try {
			const channel =
				recovery.channel === 'email' || recovery.channel === 'telegram'
					? recovery.channel
					: undefined;
			const data = await ForgotPassword({
				username: name,
				environment,
				...(channel ? { channel } : {})
			});
			recoveryInfo =
				typeof data?.message === 'string'
					? data.message
					: 'If the account exists and the selected channel is available, you will receive a verification code.';
			recoveryStep = 'code';
		} catch (error) {
			console.error(error);
			recoveryError = error.message || 'The code could not be sent. Try again later.';
		} finally {
			recoveryBusy = false;
		}
	}

	async function submitRecoveryConfirm() {
		recoveryError = '';
		const name = String(recovery.username || '').trim();
		const otp = String(recovery.otp || '').trim();
		if (!name || !otp) {
			recoveryError = 'Please enter the 6-digit verification code.';
			return;
		}
		if (!recovery.newPassword || !recovery.repeat) {
			recoveryError = 'Please enter and repeat the new password.';
			return;
		}
		if (recovery.newPassword !== recovery.repeat) {
			recoveryError = 'Passwords do not match.';
			return;
		}
		if (recoveryBusy) return;
		recoveryBusy = true;
		try {
			const data = await ConfirmResetPassword({
				username: name,
				otp,
				newPassword: recovery.newPassword
			});
			if (data && (data.success === true || data.error === undefined)) {
				recovery = { username: '', channel: 'auto', otp: '', newPassword: '', repeat: '' };
				recoveryStep = 'request';
				showRecovery = false;
				password = '';
				noty.push({
					message: data?.message || 'Password updated. Log in with your new password.',
					color: 'success'
				});
			} else {
				recoveryError = data?.error || data?.message || 'The code is invalid or has expired.';
			}
		} catch (error) {
			console.error(error);
			recoveryError = error.message || 'The password could not be updated.';
		} finally {
			recoveryBusy = false;
		}
	}

	/**
	 * Shows a notification with the lifetime of the session just started.
	 * @param {string} token
	 */
	function notifySessionLifetime(token) {
		logJwtExpiration(token);

		const minutesLeft = getJwtExpiresInMinutes(token);
		const timeText = formatJwtTimeLeft(minutesLeft);

		if (minutesLeft <= 0) {
			noty.push({
				message:
					'Your session has already expired or the token has an invalid lifetime. Contact the administrator.',
				color: 'danger'
			});
		} else if (minutesLeft < 1) {
			noty.push({
				message: `Session started with a very short lifetime: ${timeText}.`,
				color: 'danger'
			});
		} else if (minutesLeft < 5) {
			noty.push({
				message: `Session started. Session time: ${timeText}.`,
				color: 'warning'
			});
		} else {
			noty.push({
				message: `Session started. Session time: ${timeText}.`,
				color: 'success'
			});
		}
	}

	async function handleSubmit() {
		try {
			processing.waiting = true;
			processing.error = '';

			let data = await LoginRequest(username, password);

			if (data.login) {
				userStore.set({ login: data.login, token: data.token, user: data.user });
				lastToken = data.token;

				// Cambio de clave obligatorio (clave temporal o reset del admin).
				// No se entra a la aplicación hasta que el usuario la cambie.
				if (data.user?.change_password === true) {
					processing.waiting = false;
					forcedChangeError = '';
					changePwd = { current: password, newPassword: '', repeat: '' };
					password = '';
					mustChangePassword = true;
					return;
				}

				await getListMethods(data.token);
				await getListHandler(data.token);

				processing.waiting = false;

				notifySessionLifetime(data.token);

				onlogin({
					login: data.login
				});
			} else {
				processing.error = 'Invalid credentials';
				processing.waiting = false;
				noty.push({ message: processing.error, color: 'danger' });
				onfail();
			}
		} catch (error) {
			console.error(error);
			noty.push({ message: error.message, color: 'danger' });
			processing.waiting = false;
			processing.error = error.message;
		}
	}

	async function submitForcedChange() {
		forcedChangeError = '';

		if (!changePwd.newPassword || !changePwd.repeat) {
			forcedChangeError = 'Please enter and repeat the new password.';
			return;
		}
		if (changePwd.newPassword !== changePwd.repeat) {
			forcedChangeError = 'Passwords do not match.';
			return;
		}

		try {
			let result = await ChangeSystemUserPassword(
				{
					username,
					oldPassword: changePwd.current,
					newPassword: changePwd.newPassword
				},
				lastToken
			);

			if (result && result.success) {
				mustChangePassword = false;
				changePwd = { current: '', newPassword: '', repeat: '' };

				await getListMethods(lastToken);
				await getListHandler(lastToken);

				notifySessionLifetime(lastToken);

				onlogin({ login: true });
			} else {
				forcedChangeError = result?.error || result?.message || 'Password could not be changed.';
			}
		} catch (error) {
			console.error(error);
			forcedChangeError = error.message || 'Password could not be changed.';
		}
	}

	function cancelForcedChange() {
		mustChangePassword = false;
		userStore.set({});
		changePwd = { current: '', newPassword: '', repeat: '' };
		forcedChangeError = '';
		noty.push({ message: 'You must change your password to continue.', color: 'warning' });
	}
</script>

<Modal show={true}>
	<div class="login-wrapper" class:is-visible={mounted} class:overlay-mode={isOverlay}>
		<!-- Animated background orbs -->
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="orb orb-3"></div>

		<div class="login-card box">
			<!-- Logo & Brand -->
			<div class="brand-header has-text-centered">
				<div class="logo-ring">
					<div class="logo-figure">
						<img src={logo} alt="OpenFusionAPI" class="logo-img" />
					</div>
				</div>
				<h1 class="title is-4 mt-3 brand-title">Open Fusion API</h1>
				<p class="subtitle is-6 brand-subtitle">
					<span class="tag is-dark is-rounded">
						<span class="icon is-small"><i class="fa-solid fa-server"></i></span>
						<span>MCP Server</span>
					</span>
				</p>
			</div>

			<div class="divider-line"></div>

			{#if isOverlay}
				<div class="notification is-warning is-light has-text-centered">
					<span class="icon"><i class="fa-solid fa-clock-rotate-left"></i></span>
					<strong>Your session has expired, please log in again</strong>
				</div>
			{/if}

			<!-- Form -->
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="login-form"
			>
				<div class="field">
					<label class="label has-text-grey-light is-small" for="login-username">Username</label>
					<p class="control has-icons-left">
						<input
							id="login-username"
							class="input is-rounded"
							class:is-danger={processing.error}
							type="text"
							placeholder="Enter your username"
							bind:value={username}
							autocomplete="username"
						/>
						<span class="icon is-small is-left">
							<i class="fa-solid fa-user"></i>
						</span>
					</p>
				</div>

				<div class="field">
					<label class="label has-text-grey-light is-small" for="login-password">Password</label>
					<p class="control has-icons-left has-icons-right">
						<input
							id="login-password"
							class="input is-rounded"
							class:is-danger={processing.error}
							type={showPassword ? 'text' : 'password'}
							placeholder="Enter your password"
							bind:value={password}
							autocomplete="current-password"
						/>
						<span class="icon is-small is-left">
							<i class="fa-solid fa-lock"></i>
						</span>
						<button
							type="button"
							class="icon is-small is-right is-clickable eye-icon"
							onclick={() => (showPassword = !showPassword)}
							title={showPassword ? 'Hide password' : 'Show password'}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							<i class={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
						</button>
					</p>
				</div>

				{#if !processing.waiting && processing.error}
					<div class="notification is-danger is-light error-notification">
						<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
						<span>{processing.error}</span>
					</div>
				{/if}

				<div class="field mt-4">
					<p class="control">
						<button
							type="submit"
							class="button is-fullwidth is-rounded login-btn"
							class:is-loading={processing.waiting}
							disabled={processing.waiting || !username || !password}
						>
							{#if !processing.waiting}
								<span class="icon"><i class="fa-solid fa-right-to-bracket"></i></span>
								<span>Sign In</span>
							{/if}
						</button>
					</p>
				</div>
			</form>

			{#if recoveryEnabled}
				<div class="field has-text-centered mt-2">
					<button type="button" class="button is-ghost is-small forgot-btn" onclick={openRecovery}>
						<span class="icon is-small"><i class="fa-solid fa-key"></i></span>
						<span>Forgot your password?</span>
					</button>
				</div>
			{/if}

			<p class="version-tag has-text-centered has-text-grey">
				<span class="icon is-small"><i class="fa-solid fa-code-branch"></i></span>
				GUI v{version}
				<span class="version-separator">|</span>
				<span class="icon is-small"><i class="fa-solid fa-server"></i></span>
				Server v{serverVersion}
			</p>
		</div>
	</div>
</Modal>

<DialogModal
	title={recoveryTitle}
	body={recoveryBody}
	closeOnEscape={!recoveryBusy}
	closeOnBackground={!recoveryBusy}
	label_accept={recoveryStep === 'request' ? 'Send code' : 'Update password'}
	onaccept={async () => {
		if (recoveryStep === 'request') await submitRecoveryRequest();
		else await submitRecoveryConfirm();
	}}
	oncancel={closeRecovery}
	bind:show={showRecovery}
>
	{#snippet recoveryTitle()}
		<span class="has-text-info">
			<i class="fa-solid fa-key"></i> Password recovery
		</span>
	{/snippet}

	{#snippet recoveryBody()}
		{#if recoveryStep === 'request'}
			<p class="mb-2">
				Enter your username and we will send a one-time verification code to your registered email
				or Telegram.
			</p>
			<Input label="Username:" bind:value={recovery.username}></Input>
			{#if recoveryChannels.length > 1}
				<div class="mt-2">
					<BasicSelect
						label="Delivery channel"
						options={recoveryChannels}
						bind:option={recovery.channel}
						isExpanded
					></BasicSelect>
				</div>
			{/if}
		{:else}
			<p class="mb-2">
				Enter the 6-digit code you received and choose your new password (minimum 8 characters).
			</p>
			<Input label="Username:" bind:value={recovery.username} disabled={true}></Input>
			<Input
				label="Verification code:"
				type="text"
				maxlength="6"
				placeholder="123456"
				bind:value={recovery.otp}
			></Input>
			<Input label="New password:" type="password" bind:value={recovery.newPassword}></Input>
			<Input label="Repeat new password:" type="password" bind:value={recovery.repeat}></Input>
			{#if recovery.newPassword && !recoveryPwdMatch}
				<div class="notification is-danger is-light py-2 px-3 mt-2">
					<span class="icon-text">
						<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
						<span>Passwords do not match.</span>
					</span>
				</div>
			{/if}
		{/if}

		{#if recoveryInfo}
			<div class="notification is-info is-light py-2 px-3 mt-2">
				<span class="icon-text">
					<span class="icon"><i class="fa-solid fa-circle-info"></i></span>
					<span>{recoveryInfo}</span>
				</span>
			</div>
		{/if}
		{#if recoveryError}
			<div class="notification is-danger is-light py-2 px-3 mt-2">
				<span class="icon-text">
					<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
					<span>{recoveryError}</span>
				</span>
			</div>
		{/if}
	{/snippet}
</DialogModal>

<DialogModal
	title={forcedChangeTitle}
	body={forcedChangeBody}
	closeOnEscape={false}
	closeOnBackground={false}
	onaccept={async () => {
		await submitForcedChange();
	}}
	oncancel={() => {
		cancelForcedChange();
	}}
	bind:show={mustChangePassword}
>
	{#snippet forcedChangeTitle()}
		<span class="has-text-warning"><i class="fa-solid fa-key"></i> Password change required</span>
	{/snippet}

	{#snippet forcedChangeBody()}
		<div class="notification is-warning is-light">
			<span class="icon-text">
				<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
				<span>For security reasons you must change your password before continuing.</span>
			</span>
		</div>
		<Input label="Current password:" bind:value={changePwd.current}></Input>
		<Input label="New password:" bind:value={changePwd.newPassword}></Input>
		<Input label="Repeat new password:" bind:value={changePwd.repeat}></Input>
		{#if changePwd.newPassword && !changePwdMatch}
			<div class="notification is-danger is-light py-2 px-3 mt-2">
				<span class="icon-text">
					<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
					<span>Passwords do not match.</span>
				</span>
			</div>
		{/if}
		{#if forcedChangeError}
			<div class="notification is-danger is-light py-2 px-3 mt-2">
				<span class="icon-text">
					<span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
					<span>{forcedChangeError}</span>
				</span>
			</div>
		{/if}
	{/snippet}
</DialogModal>

<style>
	/* Overlay style override */
	:global(.overlay-mode) {
		background-color: rgba(25, 28, 38, 0.4);
	}

	/* ── Wrapper & Entry Animation ─────────────────────────────── */
	.login-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100%;
		overflow: hidden;
		padding: 1.5rem;
	}

	/* ── Animated background orbs ─────────────────────────────── */
	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(60px);
		opacity: 0;
		transition: opacity 1.2s ease;
		pointer-events: none;
	}

	.login-wrapper.is-visible .orb {
		opacity: 0.18;
	}

	.orb-1 {
		width: 260px;
		height: 260px;
		background: radial-gradient(circle, #ff6b1a, #ff3d00);
		top: -60px;
		right: -60px;
		animation: float1 8s ease-in-out infinite;
	}

	.orb-2 {
		width: 200px;
		height: 200px;
		background: radial-gradient(circle, #ff8c42, #ff3d00);
		bottom: -40px;
		left: -40px;
		animation: float2 10s ease-in-out infinite;
	}

	.orb-3 {
		width: 140px;
		height: 140px;
		background: radial-gradient(circle, #ff6b1a, #ffa040);
		bottom: 30px;
		right: 20px;
		animation: float3 7s ease-in-out infinite;
	}

	@keyframes float1 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(-20px, 20px) scale(1.08);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(18px, -15px) scale(1.06);
		}
	}

	@keyframes float3 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(-12px, 12px) scale(1.1);
		}
	}

	/* ── Card ─────────────────────────────────────────────────── */
	.login-card {
		position: relative;
		width: 100%;
		max-width: 400px;
		background: rgba(25, 28, 38, 0.82);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 20px !important;
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.45),
			0 0 0 1px rgba(255, 255, 255, 0.04) inset;
		padding: 2.2rem 2rem 1.6rem;

		/* Entry animation */
		opacity: 0;
		transform: translateY(28px) scale(0.97);
		transition:
			opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.login-wrapper.is-visible .login-card {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	/* ── Brand header ─────────────────────────────────────────── */
	.brand-header {
		margin-bottom: 1.2rem;
	}

	.logo-ring {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 88px;
		height: 88px;
		border-radius: 50%;
		background: linear-gradient(135deg, #ff6b1a 0%, #ff3d00 100%);
		padding: 4px;
		box-sizing: border-box;
		margin: 0 auto;
		box-shadow: 0 0 24px rgba(255, 107, 26, 0.4);
		animation: pulse-ring 3s ease-in-out infinite;
	}

	@keyframes pulse-ring {
		0%,
		100% {
			box-shadow: 0 0 20px rgba(255, 107, 26, 0.4);
		}
		50% {
			box-shadow: 0 0 44px rgba(255, 107, 26, 0.75);
		}
	}

	.logo-figure {
		width: 80px;
		height: 80px;
		flex-shrink: 0;
		border-radius: 50%;
		overflow: hidden;
		background: #1a1d27;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo-img {
		width: 56px;
		height: 56px;
		object-fit: contain;
		display: block;
		flex-shrink: 0;
	}

	.brand-title {
		color: #f0f4ff !important;
		font-weight: 700;
		letter-spacing: -0.3px;
		text-shadow: 0 0 20px rgba(255, 107, 26, 0.3);
	}

	.brand-subtitle {
		margin-bottom: 0 !important;
	}

	.brand-subtitle .tag {
		background: rgba(255, 255, 255, 0.07) !important;
		color: #a0aec0;
		border: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 0.72rem;
	}

	/* ── Divider ──────────────────────────────────────────────── */
	.divider-line {
		height: 1px;
		background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
		margin: 1.2rem 0;
	}

	/* ── Form ─────────────────────────────────────────────────── */
	.login-form .label {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 0.3rem;
	}

	.login-form .input {
		background: rgba(255, 255, 255, 0.06) !important;
		border-color: rgba(255, 255, 255, 0.12) !important;
		color: #e8eaf0 !important;
		transition:
			border-color 0.25s ease,
			box-shadow 0.25s ease,
			background 0.25s ease;
	}

	.login-form .input::placeholder {
		color: rgba(255, 255, 255, 0.3);
	}

	.login-form .input:focus {
		background: rgba(255, 255, 255, 0.1) !important;
		border-color: #ff6b1a !important;
		box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.22) !important;
	}

	.login-form .input.is-danger {
		border-color: #f14668 !important;
		box-shadow: 0 0 0 3px rgba(241, 70, 104, 0.18) !important;
	}

	.login-form .icon {
		color: rgba(255, 255, 255, 0.35) !important;
		transition: color 0.2s ease;
	}

	.login-form .input:focus ~ .icon {
		color: #00d1b2 !important;
	}

	.eye-icon {
		cursor: pointer;
		pointer-events: all;
		transition: color 0.2s ease;
	}

	.eye-icon:hover {
		color: #00d1b2 !important;
	}

	/* ── Error notification ───────────────────────────────────── */
	.error-notification {
		border-radius: 10px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.9rem;
		font-size: 0.85rem;
		animation: shake 0.4s ease;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-6px);
		}
		40% {
			transform: translateX(6px);
		}
		60% {
			transform: translateX(-4px);
		}
		80% {
			transform: translateX(4px);
		}
	}

	/* ── Login button ─────────────────────────────────────────── */
	.login-btn {
		background: linear-gradient(135deg, #ff6b1a, #ff3d00) !important;
		border: none !important;
		color: #fff !important;
		font-weight: 600;
		letter-spacing: 0.04em;
		height: 2.7rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;
		box-shadow: 0 4px 18px rgba(255, 107, 26, 0.4);
	}

	.login-btn:not(:disabled):hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 28px rgba(255, 107, 26, 0.6);
	}

	.login-btn:not(:disabled):active {
		transform: translateY(0);
	}

	.login-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* ── Forgot password link ─────────────────────────────────── */
	.forgot-btn {
		color: rgba(255, 255, 255, 0.45) !important;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
	}

	.forgot-btn:hover {
		color: #ff6b1a !important;
		background: transparent !important;
	}

	/* ── Version tag ──────────────────────────────────────────── */
	.version-tag {
		font-size: 0.72rem;
		margin-top: 1rem;
		color: rgba(255, 255, 255, 0.3) !important;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		flex-wrap: wrap;
	}

	.version-separator {
		opacity: 0.5;
		padding: 0 0.1rem;
	}
</style>
