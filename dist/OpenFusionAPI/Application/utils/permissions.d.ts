/**
 * Client-side permission evaluation for internal users.
 * Mirrors the backend permissions.js logic.
 */
/**
 * @typedef {import('../../types/models.js').UserCtrl} UserCtrl
 */
/**
 * Core permission check.
 * @param {UserCtrl|null|undefined} userCtrl - User.ctrl value
 * @param {string} environment - dev|qa|prd
 * @param {string} resource - resource name (users, apiclients, endpoints, etc.)
 * @param {string} action - read|create|edit|delete
 * @returns {boolean}
 */
export function hasPermission(userCtrl: UserCtrl | null | undefined, environment: string, resource: string, action: string): boolean;
/**
 * Checks permission using the current user from the store.
 * @param {{ctrl?: UserCtrl}|null|undefined} user - userStore.user (contains ctrl)
 * @param {string} environment
 * @param {string} resource
 * @param {string} action
 * @returns {boolean}
 */
export function currentUserHasPermission(user: {
    ctrl?: UserCtrl;
} | null | undefined, environment: string, resource: string, action: string): boolean;
/**
 * Returns the default environment (configurable in the future).
 */
export function getDefaultEnvironment(): string;
export type UserCtrl = import("../../types/models.js").UserCtrl;
