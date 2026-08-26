/**
 * Core permission check.
 * @param {object|null} userCtrl - User.ctrl value
 * @param {string} environment - dev|qa|prd
 * @param {string} resource - resource name (users, apiclients, endpoints, etc.)
 * @param {string} action - read|create|edit|delete
 * @returns {boolean}
 */
export function hasPermission(userCtrl: object | null, environment: string, resource: string, action: string): boolean;
/**
 * Checks permission using the current user from the store.
 * @param {object} user - userStore.user (contains ctrl)
 * @param {string} environment
 * @param {string} resource
 * @param {string} action
 * @returns {boolean}
 */
export function currentUserHasPermission(user: object, environment: string, resource: string, action: string): boolean;
/**
 * Returns the default environment (configurable in the future).
 */
export function getDefaultEnvironment(): string;
