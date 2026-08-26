/**
 * Client-side permission evaluation for internal users.
 * Mirrors the backend permissions.js logic.
 */

const VALID_ACTIONS = ['read', 'create', 'edit', 'delete'];

/**
 * Core permission check.
 * @param {object|null} userCtrl - User.ctrl value
 * @param {string} environment - dev|qa|prd
 * @param {string} resource - resource name (users, apiclients, endpoints, etc.)
 * @param {string} action - read|create|edit|delete
 * @returns {boolean}
 */
export function hasPermission(userCtrl, environment, resource, action) {
	if (!userCtrl || !environment || !resource || !action) return false;
	if (userCtrl.as_admin === true) return true;

	const envPerms = userCtrl.env?.[environment];
	if (!envPerms) return false;

	const resourcePerms = envPerms[resource];
	if (resourcePerms && resourcePerms[action] === true) return true;

	const wildcardPerms = envPerms['*'];
	if (wildcardPerms && wildcardPerms[action] === true) return true;

	return false;
}

/**
 * Checks permission using the current user from the store.
 * @param {object} user - userStore.user (contains ctrl)
 * @param {string} environment
 * @param {string} resource
 * @param {string} action
 * @returns {boolean}
 */
export function currentUserHasPermission(user, environment, resource, action) {
	const ctrl = user?.ctrl;
	return hasPermission(ctrl, environment, resource, action);
}

/**
 * Returns the default environment (configurable in the future).
 */
export function getDefaultEnvironment() {
	return 'prd';
}
