import "clsx";
import { w as writable, g as get } from "../../chunks/index2.js";
import { a5 as is_array, a6 as get_prototype_of, a7 as object_prototype, a8 as ssr_context, a9 as attr_class, aa as clsx, ab as stringify, e as escape_html, ac as attr, ad as bind_props, a4 as derived, ae as ensure_array_like, af as spread_props, ag as attributes, ah as fallback, ai as attr_style, aj as store_get, ak as unsubscribe_stores } from "../../chunks/index.js";
import uFetch from "@rdsslab/uFetch";
import "events";
import * as XLSX from "xlsx-js-style";
import { DateTime } from "luxon";
import prettierPluginSql from "prettier-plugin-sql";
import { marked, Renderer } from "marked";
import "echarts";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { sql } from "@codemirror/lang-sql";
import prettierPluginBabel from "prettier/plugins/babel.mjs";
import Estree from "prettier/plugins/estree.mjs";
import prettierPluginHtml from "prettier/plugins/html.mjs";
const empty = [];
function snapshot(value, skip_warning = false, no_tojson = false) {
  return clone(value, /* @__PURE__ */ new Map(), "", empty, null, no_tojson);
}
function clone(value, cloned, path, paths, original = null, no_tojson = false) {
  if (typeof value === "object" && value !== null) {
    var unwrapped = cloned.get(value);
    if (unwrapped !== void 0) return unwrapped;
    if (value instanceof Map) return (
      /** @type {Snapshot<T>} */
      new Map(value)
    );
    if (value instanceof Set) return (
      /** @type {Snapshot<T>} */
      new Set(value)
    );
    if (is_array(value)) {
      var copy = (
        /** @type {Snapshot<any>} */
        Array(value.length)
      );
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var i = 0; i < value.length; i += 1) {
        var element = value[i];
        if (i in value) {
          copy[i] = clone(element, cloned, path, paths, null, no_tojson);
        }
      }
      return copy;
    }
    if (get_prototype_of(value) === object_prototype) {
      copy = {};
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var key of Object.keys(value)) {
        copy[key] = clone(
          // @ts-expect-error
          value[key],
          cloned,
          path,
          paths,
          null,
          no_tojson
        );
      }
      return copy;
    }
    if (value instanceof Date) {
      value.getTime();
      return (
        /** @type {Snapshot<T>} */
        structuredClone(value)
      );
    }
    if (typeof /** @type {T & { toJSON?: any } } */
    value.toJSON === "function" && !no_tojson) {
      return clone(
        /** @type {T & { toJSON(): any } } */
        value.toJSON(),
        cloned,
        path,
        paths,
        // Associate the instance with the toJSON clone
        value
      );
    }
  }
  if (value instanceof EventTarget) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
  try {
    return (
      /** @type {Snapshot<T>} */
      structuredClone(value)
    );
  } catch (e) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
}
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
const url_paths = {
  app: "/api/system/api/app/prd",
  apps_get_list: "/api/system/api/apps/prd",
  endpoint: "/api/system/api/endpoint/prd",
  endpoints_get_by_idapp: "/api/system/api/app/endpoints/prd",
  wsServerEvents: "/ws/system/websocket/server/prd",
  environment: "/api/system/system/environment/prd",
  serverAPIVersionLast: "/api/system/libopenfusionapi/version/last/prd",
  clearCache: "/api/system/cache/clear/prd",
  login: "/api/system/system/login/prd",
  getHandler: "/api/system/system/handler/0.01/prd",
  Methods: "/api/system/system/method/0.01/prd",
  apiDoc: "/api/system/api/handler/documentation/prd",
  getlistFunctionsVarsJS: "/api/system/system/handler/js/functions/prd",
  getLogs: "/api/system/system/log/prd",
  getListIntervalTasksByIdApp: "/api/system/interval_tasks/byidapp/prd",
  upsertIntervalTasksByIdTask: "/api/system/interval_tasks/upsert/prd",
  deleteIntervalTasksByIdTask: "/api/system/interval_tasks/delete/prd",
  getIntervalTaskRuns: "/api/system/interval_tasks/runs/prd",
  runNowIntervalTask: "/api/system/interval_tasks/run_now/prd",
  resetIntervalTaskAttempts: "/api/system/interval_tasks/reset_attempts/prd",
  getfunctions: "/api/system/api/function_names/prd",
  serverAPIVersion: "/api/system/server/version/prd",
  appBackup: "/api/system/app/backup/prd",
  appsBackup: "/api/system/apps/backup/prd",
  appDocumentation: "/api/system/app/documentation/prd",
  appvarsbyidapp: "/api/system/app/variables/idapp/prd",
  appvar: "/api/system/app/var/prd",
  getLogsRecordsPerMinute: "/api/system/system/log/recordsperminute/prd",
  getLogsStatusClassPerMinute: "/api/system/system/log/statusclassperminute/prd",
  getResponseTimePerMinute: "/api/system/system/log/responsetimeperminute/prd",
  changeUserPassword: "/api/system/user/changepassword/prd",
  restoreSystemEndpoints: "/api/system/restore/prd",
  bots: "/api/system/bots",
  getLogSummaryByAppStatusCode: "/api/system/log/app/summary/prd",
  appEndpointUsageSummary: "/api/system/system/log/app/endpoints/usage/prd",
  getTopErrorEndpointsByTime: "/api/system/system/log/errors/top/bytime/prd",
  getTopErrorEndpoints: "/api/system/system/log/errors/top/prd",
  getTraceSummary: "/api/system/system/log/trace/summary/prd",
  getTraceErrorsOnly: "/api/system/system/log/trace/errors/prd",
  getTraceSlowestHops: "/api/system/system/log/trace/slow/prd",
  getEndpointBackups: "/api/system/api/endpoint/backup/prd",
  getBotBackups: "/api/system/bots/backup/prd",
  getBotLogs: "/api/system/bots/logs/prd",
  APIKeys: "/api/system/apikey/prd",
  APIClients: "/api/system/api_clients/prd",
  APIClient: "/api/system/apiclient/prd",
  APIClientUpdate: "/api/system/apiclient/update/prd",
  APIClientChangePassword: "/api/system/apiclient/changepassword/prd",
  migrateEndpoints: "/api/system/endpoints/migrate/prd",
  migrateAppVars: "/api/system/appvars/migrate/prd",
  // Internal System Users
  systemUsersList: "/api/system/users/list/prd",
  systemUserCreate: "/api/system/user/create/prd",
  systemUserUpdate: "/api/system/user/update/prd",
  systemUserDelete: "/api/system/user/delete/prd",
  systemUserChangePassword: "/api/system/user/changepassword/prd",
  systemUserResetPassword: "/api/system/user/resetpassword/prd",
  userRecoveryOptions: "/api/system/user/recovery/options/prd",
  userForgotPassword: "/api/system/user/forgotpassword/prd",
  userResetPasswordConfirm: "/api/system/user/resetpassword/confirm/prd"
};
const authEventStore = writable(null);
const userStore = writable({});
const statusSystemEndpointsStore = writable({});
const listMethodStore = writable({});
const listHandlerStore = writable([]);
const listFunctionStoreDev = writable({});
const listFunctionStoreQA = writable({});
const listFunctionStorePRD = writable({});
const listAppVars = writable({});
const storeCacheSize = writable({});
const storeUsersList = writable({});
const storeCountResponseStatusCode = writable({});
const storeEndpointOnStart = writable({});
const storeEndpointOnComplete = writable({});
const storeBotStatusChanged = writable(null);
const storeBotChanged = writable(null);
const getHandlerParams = (handler) => {
  const list = get(listHandlerStore);
  return Array.isArray(list) ? list.find((item) => item.id == handler) : {};
};
const equalObjs = (value, new_value) => {
  let new_value_str = typeof new_value == "object" ? JSON.stringify(new_value) : new_value;
  let currect_value_str = typeof value == "object" ? JSON.stringify(value) : value;
  return new_value_str == currect_value_str;
};
const jsonToHtmlString = (obj) => {
  let jsonString = JSON.stringify(obj, null, 2);
  return jsonString.split("\n").map((line) => line.replace(/ /g, "&nbsp;")).join("<br>");
};
function createEndpoint(method, app, resource, environment) {
  return `${method == "WS" ? "/ws/" : "/api/"}${app}${resource}/${environment}`;
}
const mergeSourceOverwrite = (target, source) => {
  if (target === source) return target;
  if (source == null || typeof source !== "object") return target;
  if (target == null || typeof target !== "object") return source;
  const isPlainObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tarVal = target[key];
    if (isPlainObject(tarVal) && isPlainObject(srcVal)) {
      result[key] = mergeSourceOverwrite(tarVal, srcVal);
    } else {
      result[key] = srcVal;
    }
  }
  return result;
};
function checkStatus(response) {
  if (response && response.status === 401) {
    authEventStore.set({ type: "unauthorized" });
    throw new Error("Session expired or unauthorized (401)");
  }
  return response;
}
const ForgotPassword = async (data) => {
  let uf = new uFetch();
  let res = await uf.post({ url: url_paths.userForgotPassword, data });
  return await res.json();
};
const ConfirmResetPassword = async (data) => {
  let uf = new uFetch();
  let res = await uf.post({ url: url_paths.userResetPasswordConfirm, data });
  return await res.json();
};
const GetAPIKeys = async (idapp) => {
  let apiKeys = [];
  let uf = new uFetch(url_paths.APIKeys);
  let request = checkStatus(
    await uf.get({
      data: { idapp }
    })
  );
  apiKeys = await request.json();
  return apiKeys;
};
const GetAPIClients = async (data) => {
  let apiKeys = [];
  let uf = new uFetch(url_paths.APIClients);
  let request = checkStatus(
    await uf.get({
      data
    })
  );
  apiKeys = await request.json();
  return apiKeys;
};
const ChangeAPIClientPassword = async (data) => {
  let uf = new uFetch(url_paths.APIClientChangePassword);
  let request = checkStatus(
    await uf.post({
      data
    })
  );
  let result = await request.json();
  return result;
};
const getListHandler = async (token) => {
  let f = new uFetch();
  let fr = checkStatus(await f.get({ url: url_paths.getHandler }));
  let list = await fr.json();
  if (list && Array.isArray(list)) {
    let data = list.map((m) => {
      return {
        id: m.handler,
        value: m.label,
        enabled: m.enabled,
        description: m.description,
        css_class: m.css_class,
        css_icon: m.css_icon,
        modules: m.modules
      };
    });
    listHandlerStore.set(data);
  }
};
const getListMethods = async (token) => {
  let f = new uFetch();
  let fr = checkStatus(await f.get({ url: url_paths.Methods }));
  let list = await fr.json();
  if (list && Array.isArray(list)) {
    let data = list.map((m) => {
      return {
        id: m.method,
        value: m.label,
        enabled: m.enabled,
        description: ""
      };
    });
    listMethodStore.set(data);
  }
};
const getHandlerDocs = async (handler, token) => {
  if (handler) {
    let uF = new uFetch();
    let req = checkStatus(await uF.get({ url: url_paths.apiDoc, data: { handler } }));
    let res = await req.json();
    return res;
  } else {
    return {};
  }
};
const migrateAppVars = async (data) => {
  let uf = new uFetch();
  let request = checkStatus(
    await uf.post({
      url: url_paths.migrateAppVars,
      data
    })
  );
  let response = await request.json();
  return response;
};
const EndpointSave = async (endpoint) => {
  if (endpoint.handler == "TEXT" && endpoint.File) {
    let uf = new uFetch();
    let formData = new FormData();
    formData.append("file", endpoint.File);
    for (const key in endpoint) {
      if (key !== "File") {
        let value = endpoint[key];
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    }
    let req = checkStatus(await uf.post({ url: url_paths.endpoint, data: formData }));
    let es = await req.json();
    return es;
  } else {
    let uf = new uFetch();
    let req = checkStatus(await uf.post({ url: url_paths.endpoint, data: endpoint }));
    let es = await req.json();
    return es;
  }
};
const getLogs = async (options, token) => {
  let uf = new uFetch();
  if (options) {
    let get_list_logs = checkStatus(
      await uf.get({
        url: url_paths.getLogs,
        data: options
      })
    );
    let logs_list = await get_list_logs.json();
    return logs_list;
  }
};
const GetAppVars = async (idapp, setStoreListAppVars = false) => {
  let uf = new uFetch();
  let req = checkStatus(
    await uf.get({
      url: url_paths.appvarsbyidapp,
      data: { idapp }
    })
  );
  let resp = await req.json();
  if (setStoreListAppVars && resp && Array.isArray(resp)) {
    listAppVars.set(resp);
  }
  return resp;
};
const getListApps = async () => {
  let uf = new uFetch();
  let apps_res = checkStatus(await uf.get({ url: url_paths.apps_get_list }));
  let apps = await apps_res.json();
  return apps;
};
const changeUserPassword = async (data, token) => {
  let uf = new uFetch();
  let apps_res = checkStatus(await uf.post({ url: url_paths.changeUserPassword, data }));
  let apps = await apps_res.json();
  return apps;
};
const restoreSystemEndpoints = async (restore) => {
  let uf = new uFetch();
  let sys_res = checkStatus(
    await uf.put({
      url: url_paths.restoreSystemEndpoints,
      data: { restore }
    })
  );
  let r = await sys_res.json();
  return r;
};
const ChangeSystemUserPassword = async (data, token) => {
  let uf = new uFetch();
  if (token) uf.setBearerAuthorization(token);
  let request = checkStatus(await uf.post({ url: url_paths.systemUserChangePassword, data }));
  let result = await request.json();
  return result;
};
const ResetSystemUserPassword = async (data) => {
  let uf = new uFetch();
  let request = checkStatus(await uf.post({ url: url_paths.systemUserResetPassword, data }));
  let result = await request.json();
  return result;
};
function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Token con formato inválido");
  let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }
  return JSON.parse(atob(base64));
}
function getJwtExpiresInMinutes(token) {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload.exp) return Infinity;
    const nowSeconds = Date.now() / 1e3;
    return (payload.exp - nowSeconds) / 60;
  } catch {
    return -1;
  }
}
function isJwtExpiringSoon(token, thresholdMinutes = 5) {
  const minutesLeft = getJwtExpiresInMinutes(token);
  return minutesLeft >= 0 && minutesLeft <= thresholdMinutes;
}
function formatJwtTimeLeft(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "menos de 1 minuto";
  }
  const wholeMinutes = Math.floor(minutes);
  const seconds = Math.floor((minutes - wholeMinutes) * 60);
  if (wholeMinutes === 0) {
    return `${seconds} segundo${seconds !== 1 ? "s" : ""}`;
  }
  if (wholeMinutes < 2 && seconds > 0) {
    return `${wholeMinutes} minuto y ${seconds} segundo${seconds !== 1 ? "s" : ""}`;
  }
  return `${wholeMinutes} minuto${wholeMinutes !== 1 ? "s" : ""}`;
}
function logJwtExpiration(token) {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload.exp) return;
    const nowSeconds = Date.now() / 1e3;
    const diffSeconds = payload.exp - nowSeconds;
    console.debug("[JWT] expiración:", {
      exp: payload.exp,
      now: Math.floor(nowSeconds),
      secondsLeft: Math.floor(diffSeconds),
      minutesLeft: Number((diffSeconds / 60).toFixed(2))
    });
  } catch {
  }
}
function hasPermission(userCtrl, environment, resource, action) {
  if (!userCtrl || !environment || !resource || !action) return false;
  if (userCtrl.as_admin === true) return true;
  const envPerms = userCtrl.env?.[environment];
  if (!envPerms) return false;
  const resourcePerms = envPerms[resource];
  if (resourcePerms && resourcePerms[action] === true) return true;
  const wildcardPerms = envPerms["*"];
  if (wildcardPerms && wildcardPerms[action] === true) return true;
  return false;
}
function currentUserHasPermission(user, environment, resource, action) {
  const ctrl = user?.ctrl;
  return hasPermission(ctrl, environment, resource, action);
}
function getDefaultEnvironment() {
  return "prd";
}
const Logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABwRJREFUWEeNl1tsXNUVhr+195mZYztxlCo3gngiKFWwhFQqpVGT2M7F5ELpQ2ugQUV9gaoqvfDQIKWFxA4EikMCTVtQCmpJo8Z1EuOmoiShVGrVhz4godL0pRdBLpCQW6P4NuOZOavZ+5yZOWPPAJZGPnPOnr3+9a9//WsfmVwuTxqjq9WAWFSMaGTAWDQSxWTw34k/6u9bUOGvuUH6pJew0MoBAuaIQbGo2mS9FcSoaiCKKNg4htvHrwn4ueSXsxlhGEvggyQLqtfx9+S+gNE4CBwLh/gaX6e1YDmFZZ4YUCMqgapLyK1zoPx1EO+jVtRY//xcMaJHdAm5/HxeF0N3HQBLAcsFLBGCOuQqyUYOvfDH3CDf5Uu0TM3jhBrm1kCLe+6AoAYrloVqMTEAt5dEWH02fJwBtyX5FWzAMoKQqTJgmRDDC1nlF5SZcOtoh1F/AYUyU/OPua+CbtG5oxmMY3lWBnXPR0Mkl2URlq2RsNlYjGMiBsC50hQ9s57mI0FAbyVXWMgbGDo9APdx0CwlLG9JxLbscf7hlibxZ/xzy+MfgXZpMNHBpiBgmxpZitFUCVARngn7GXBr4184FlbJXYiOYMiI4d9qacP4DBz1F0UYyE7xijnJ+PTocfD4b/wRFlvlMTXcL5acWKLI8C8JWITQjuGDsmV9Wx8X6gDoRnKFMY7fyHgVhtMKD5ks31bLBsQLtIThzRJsbxvhXcdGOvDbD5PpEHoQ+rDc5uttGDMBLxPwT4V9GhCI4elwJ7t96uoYSO1SWOm1cFQtWTH0XbnKnnkLeaBs2CaWmxKROWEOXFdeXXCYMZfFxIPcbAK2SsAWFXJOuGrkHQLtu3CNvy2ex281kFUYPV8qsnbWQJx9wkANwallZJcs4ASWlSqcCQ0rOMmlsc18Nmvpx7JB43Yti/CnkrDd5rjlBrAdCLe5PlfLKEb2hzn9iezlav5R1mnAb8QSRIanWnfxXK2ELn8fvwJCKHSynkBfUyGrhv7wJE8Jomd7tWV+mQdV2FplI+CaGnJiJIdV167vRFl2tCzgz7KDSHvJFm5hyIs74MOyYV3bLs6nNVQVYeWmLiObX8QfxP3IcKYorJh9gouV56Nf4fZswHaEHg3IeFczjBrh5WzIHnmR/8XaVvLfp0cMBxPWdrX8mN11beTtIi2CSkd0cxeWI1hyKmwPj/NMugXP9NIyP+AHxvBYZMmXlS1tt/Km9BFV2NSHyRRaOewSUcv5clHWtj2vddlXos/oab2TTOEz/B7DGnVtM8UXZr3lTKPWbvkHuFtUBiPLWLGkHe2HuJyubf472oPloGvrCPpb97C3kYfUSlCTgY+S72GjCEMefVl6207o39Mb5O/jbgIGI8NYqUQCoNJbwuQjfAPDTrE6VrJ0p5UfE69JG84oQbzJ23eSWTaPR42Ro+Eb+t/p6D0Ay6B6BuiYc4jL6frqDszYVTqDgAXhHoZ8CdMUVtuwwc2qIMEPuAhk/B4WzDrGR1XnTBhwZuMAtA9y2SVV7iIYv505s3/GlUaUp7OPNTADQNWiPEWXvsjs9rl8C0tvSfly2zH50Ct8OoBEA5PfZK0E0lcWfbb1Aq/LEcoNgaTCTHtej2hiE8utceNWQoz+KDfCc47ORgC88g3DYlmNkf9k0W7ZJ9cr9U6LtCLneh9oUA7fEYsZQtiI5YNI6Gwd5lwjAMWHWFOyDInxbvlk+NOa5zcuR2oaVozZjzUPy+UZy6q4iXXlDMOupTA8ER6Vgfx96rvAacB1wekS15fMZRhhNZbTU+PS1f6qNtZBKlH5GA1WQXsWbuYwhg0EnI2KrDEhdxDIoBodKxbpCNq4QwxDzvNvnAj7w5fSnp8aPf6y1i8zrLgZVcV76C5bfneD2gDLTuAUGTnkAEQZPmeFVzCsxPBeTllj9nO5bl7XUZyw7Mdx3V/tXOMxpujxg6XMEYT1GM5i2YNltyuBBnzPGF5MwG0PX5rmes1oTgZBs6RT8eMdJr9KlygjWD8p3xVLhxryYnkfy1Is72dzrDH7uDR94jU7ywlOBYnYGg2m9Ea+za54AN3J2dG/K3ikgX9neCK7v7HnV1VQCZe4cQMjaupfXjrFXjrLgjs75ipnfQ/CyOmcapf5JZfqJZbKfXqy7n3l48NVdFAromNh6poH0K3xy4Y/RUfK462/4vmm9WzyoApgmvyqo6LqWAl1bt3EvXSL4SgBueRAcrZUpnP2r93B5dM0dtoT06ZQ16EzMNR8oYugcJOMYNW9TTmOfxge4IV4QSMAlTyTcqTmwIwSfBr8bs3kFtbhzguGi6HKajmo1WNbcyAz6+CdsN6bPlEVPsfIueNSf2D5S8tB9n7SO1MzUIkVN887DXD6qvH7+XxrlvfkQIPZX1ncdGvXgMr/Adgcxpok5CivAAAAAElFTkSuQmCC";
function Boolean$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      onclick_cell,
      value = void 0,
      row = void 0,
      editInline,
      custom,
      css_cell = "has-text-centered"
    } = $$props;
    let defaultconfig = {
      ontrue: {
        label: "",
        iconClass: "fa-regular fa-square-check",
        iconColorClass: " has-text-success "
      },
      onfalse: {
        label: "",
        iconClass: "fa-regular fa-square",
        iconColorClass: " has-text-danger "
      }
    };
    if (custom) {
      $$renderer2.push(`<!--[0--><td${attr_class(clsx(value ? custom.ontrue?.css_cell ? custom.ontrue.css_cell : css_cell : custom.onfalse?.css_cell ? custom.onfalse.css_cell : css_cell))}><span${attr_class(`icon-text ${editInline ? "is-clickable" : ""}`)}><span class="icon">`);
      if (value) {
        $$renderer2.push(`<!--[0--><i${attr_class(`${stringify(custom.ontrue?.iconClass ? custom.ontrue?.iconClass : defaultconfig.ontrue?.iconClass)} ${stringify(custom.ontrue?.iconColorClass ? custom.ontrue?.iconColorClass : defaultconfig.ontrue?.iconColorClass)}`)}></i>`);
      } else {
        $$renderer2.push(`<!--[-1--><i${attr_class(`${stringify(custom.onfalse?.iconClass ? custom.onfalse?.iconClass : defaultconfig.onfalse?.iconClass)} ${stringify(custom.onfalse?.iconColorClass ? custom.onfalse?.iconColorClass : defaultconfig.onfalse?.iconColorClass)}`)}></i>`);
      }
      $$renderer2.push(`<!--]--></span> `);
      if (value) {
        $$renderer2.push(`<!--[0--><span>${escape_html(custom.ontrue?.label ? custom.ontrue.label : defaultconfig.ontrue.label)}</span>`);
      } else {
        $$renderer2.push(`<!--[-1--><span>${escape_html(custom.onfalse?.label ? custom.onfalse.label : defaultconfig.onfalse.label)}</span>`);
      }
      $$renderer2.push(`<!--]--></span></td>`);
    } else {
      $$renderer2.push(`<!--[-1--><td${attr_class(clsx(css_cell))}>`);
      if (editInline) {
        $$renderer2.push(`<!--[0--><input type="checkbox"${attr("checked", value, true)}/>`);
      } else {
        $$renderer2.push(`<!--[-1--><input type="checkbox"${attr("checked", value, true)}/>`);
      }
      $$renderer2.push(`<!--]--></td>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { value, row });
  });
}
function DateTime_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = void 0,
      onclick_cell = () => {
      },
      row = void 0,
      format = "yyyy-MM-dd HH:mm:ss",
      fromFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      HighlightIsntToday = false,
      editInline = false,
      css_cell = ""
    } = $$props;
    let dt = derived(() => {
      if (!value) return null;
      if (value instanceof Date) {
        return DateTime.fromJSDate(value);
      }
      let d = DateTime.fromISO(value);
      if (!d.isValid && fromFormat) {
        d = DateTime.fromFormat(value, fromFormat);
      }
      if (!d.isValid) {
        d = DateTime.fromSQL(value);
      }
      if (!d.isValid) {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          d = DateTime.fromJSDate(parsedDate);
        }
      }
      return d;
    });
    let isNotToday = derived(() => HighlightIsntToday && (!dt() || !dt().isValid || dt().toFormat("yyyy-MM-dd") !== DateTime.local().toFormat("yyyy-MM-dd")));
    let formattedValue = derived(() => dt() && dt().isValid ? dt().toLocal().toFormat(format) : "");
    $$renderer2.push(`<td${attr_class(clsx(css_cell), void 0, { "has-text-danger": isNotToday() })}>`);
    if (isNotToday()) {
      $$renderer2.push(`<!--[0--><span class="icon-text" title="Incorrect date"><span class="icon"><i class="fas fa-exclamation-triangle"></i></span> <span>${escape_html(value || "")}</span></span>`);
    } else {
      $$renderer2.push(`<!--[-1-->${escape_html(formattedValue())}`);
    }
    $$renderer2.push(`<!--]--></td>`);
    bind_props($$props, { value, row });
  });
}
function TreeNode_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, key = "" } = $$props;
    function getType(val) {
      if (val === null) return "null";
      return typeof val;
    }
    if (value && typeof value === "object") {
      $$renderer2.push(`<!--[0--><details class="svelte-nx9cj5"><summary class="svelte-nx9cj5"><span class="icon is-small toggle-icon svelte-nx9cj5"><i class="fa-solid fa-chevron-right has-text-grey svelte-nx9cj5"></i></span> <span class="key-label svelte-nx9cj5">${escape_html(key)}</span> `);
      if (Array.isArray(value)) {
        $$renderer2.push(`<!--[0--><span class="meta-label svelte-nx9cj5">[${escape_html(value.length)}]</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></summary> <ul class="svelte-nx9cj5">`);
      if (Array.isArray(value)) {
        $$renderer2.push(`<!--[0--><!--[-->`);
        const each_array = ensure_array_like(value);
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let item = each_array[index];
          $$renderer2.push(`<li class="svelte-nx9cj5">`);
          TreeNode_1($$renderer2, { key: index, value: item });
          $$renderer2.push(`<!----></li>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push(`<!--[-1--><!--[-->`);
        const each_array_1 = ensure_array_like(Object.entries(value));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let [childKey, childValue] = each_array_1[$$index_1];
          $$renderer2.push(`<li class="svelte-nx9cj5">`);
          TreeNode_1($$renderer2, { key: childKey, value: childValue });
          $$renderer2.push(`<!----></li>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></ul></details>`);
    } else {
      $$renderer2.push(`<!--[-1--><div class="leaf-node svelte-nx9cj5"><span class="key-label svelte-nx9cj5">${escape_html(key)}:</span> <span${attr_class(`value-label ${stringify(getType(value))}`, "svelte-nx9cj5")}>${escape_html(String(value))}</span></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { value });
  });
}
function TreeView($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, onclick_cell = () => {
    }, css_cell = "" } = $$props;
    $$renderer2.push(`<td${attr_class(clsx(css_cell), "svelte-62hmh0")}>`);
    if (value && typeof value === "object") {
      $$renderer2.push(`<!--[0--><details class="tree-root svelte-62hmh0"><summary class="svelte-62hmh0"><span class="icon is-small toggle-icon svelte-62hmh0"><i class="fa-solid fa-chevron-right has-text-grey svelte-62hmh0"></i></span> <span class="key-label svelte-62hmh0">root</span> <button class="button is-small is-ghost p-0 ml-2" title="Copy JSON"><span class="icon is-small svelte-62hmh0">`);
      {
        $$renderer2.push(`<!--[-1--><i class="fa-regular fa-copy has-text-grey-light"></i>`);
      }
      $$renderer2.push(`<!--]--></span></button></summary> <ul class="svelte-62hmh0"><!--[-->`);
      const each_array = ensure_array_like(Object.entries(value));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [k, v] = each_array[$$index];
        $$renderer2.push(`<li class="svelte-62hmh0">`);
        TreeNode_1($$renderer2, { key: k, value: v });
        $$renderer2.push(`<!----></li>`);
      }
      $$renderer2.push(`<!--]--></ul></details>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></td>`);
    bind_props($$props, { value });
  });
}
function Auto($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = void 0,
      onclick_cell,
      row = void 0,
      editInline = false,
      css_cell,
      onchangecell
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (typeof value === "boolean") {
        $$renderer3.push("<!--[0-->");
        Boolean$1($$renderer3, {
          editInline,
          css_cell,
          onclick_cell,
          get value() {
            return value;
          },
          set value($$value) {
            value = $$value;
            $$settled = false;
          },
          get row() {
            return row;
          },
          set row($$value) {
            row = $$value;
            $$settled = false;
          }
        });
      } else if (value instanceof Date) {
        $$renderer3.push("<!--[1-->");
        DateTime_1($$renderer3, {
          row,
          editInline,
          css_cell,
          onclick_cell,
          get value() {
            return value;
          },
          set value($$value) {
            value = $$value;
            $$settled = false;
          }
        });
      } else if (value && (typeof value === "object" || Array.isArray(value))) {
        $$renderer3.push("<!--[2-->");
        TreeView($$renderer3, {
          editInline,
          css_cell,
          onclick_cell,
          get value() {
            return value;
          },
          set value($$value) {
            value = $$value;
            $$settled = false;
          }
        });
      } else if (typeof value === "number" || typeof value === "bigint") {
        $$renderer3.push(`<!--[3--><td${attr_class(clsx(css_cell), "svelte-3foszi")}>`);
        if (editInline) {
          $$renderer3.push(`<!--[0--><input class="input is-small" type="number" placeholder="Input"${attr("value", value)}/>`);
        } else {
          $$renderer3.push(`<!--[-1--><div class="text_end svelte-3foszi">${escape_html(value)}</div>`);
        }
        $$renderer3.push(`<!--]--></td>`);
      } else if (typeof value === "string") {
        $$renderer3.push(`<!--[4--><td${attr_class(clsx(css_cell), "svelte-3foszi")}>`);
        if (editInline) {
          $$renderer3.push(`<!--[0--><input class="input is-small" type="text" placeholder="Input"${attr("value", value)}/>`);
        } else {
          $$renderer3.push(`<!--[-1--><div>${escape_html(value)}</div>`);
        }
        $$renderer3.push(`<!--]--></td>`);
      } else {
        $$renderer3.push(`<!--[-1--><td${attr_class(clsx(css_cell), "svelte-3foszi")}><span>${escape_html(JSON.stringify(value))}</span></td>`);
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { value, row });
  });
}
let notifications_store = writable([]);
let Notifications$1 = class Notifications {
  /**
   * Creates an instance of Notifications.
   */
  constructor() {
    this._intervals = /* @__PURE__ */ new Map();
  }
  /**
   * Adds a new notification to the global store and automatically schedules its removal.
   * 
   * @param {Object} new_notify - The notification object to add.
   * @param {string} [new_notify.id] - Optional ID. One will be generated if not provided.
   * @param {number} [new_notify.timeout=5000] - Duration in milliseconds before the notification is automatically removed.
   * @param {string} [new_notify.message] - The message text of the notification.
   * @param {string} [new_notify.title] - The title of the notification.
   * @param {string} [new_notify.color] - The color type: 'success', 'danger', 'warning', 'info'.
   */
  push(new_notify) {
    new_notify.id = `${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const timeout = new_notify.timeout || 5e3;
    new_notify.timeout = timeout;
    new_notify._remaining = timeout;
    new_notify._lastTick = Date.now();
    new_notify.paused = false;
    notifications_store.update((u) => {
      u.push(new_notify);
      this._startTimer(new_notify.id, timeout);
      return u;
    });
  }
  _startTimer(id, timeout) {
    if (this._intervals.has(id)) {
      clearInterval(this._intervals.get(id));
    }
    const interval = setInterval(() => {
      notifications_store.update((u) => {
        const n = u.find((n2) => n2.id === id);
        if (!n) {
          clearInterval(interval);
          this._intervals.delete(id);
          return u;
        }
        if (n.paused) {
          n._lastTick = Date.now();
          return u;
        }
        const now = Date.now();
        const elapsed = now - n._lastTick;
        n._remaining -= elapsed;
        n._lastTick = now;
        if (n._remaining <= 0) {
          const index = u.findIndex((n2) => n2.id === id);
          if (index !== -1) u.splice(index, 1);
          clearInterval(interval);
          this._intervals.delete(id);
        }
        return u;
      });
    }, 100);
    this._intervals.set(id, interval);
  }
  /**
   * Removes a notification from the global notifications store by its ID.
   * 
   * @param {string} id - The unique identifier of the notification to be removed.
   */
  removeNotify(id) {
    if (this._intervals.has(id)) {
      clearInterval(this._intervals.get(id));
      this._intervals.delete(id);
    }
    notifications_store.update((u) => {
      const index = u.findIndex((obj) => obj.id === id);
      if (index !== -1) {
        u.splice(index, 1);
      }
      return u;
    });
  }
};
function Level($$renderer, $$props) {
  let { left, right } = $$props;
  $$renderer.push(`<nav class="nav_margin svelte-6urat2"><div class="responsive-columns svelte-6urat2"><div class="responsive-column-left svelte-6urat2"><div class="container_left svelte-6urat2">`);
  if (Array.isArray(left)) {
    $$renderer.push(`<!--[0--><!--[-->`);
    const each_array = ensure_array_like(left);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let left_item = each_array[$$index];
      if (left_item) {
        $$renderer.push(`<!--[0--><span class="slot_padding svelte-6urat2">`);
        left_item?.($$renderer);
        $$renderer.push(`<!----></span>`);
      } else {
        $$renderer.push("<!--[-1-->");
      }
      $$renderer.push(`<!--]-->`);
    }
    $$renderer.push(`<!--]-->`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div></div> <div class="responsive-column-right svelte-6urat2"><div class="container_right svelte-6urat2">`);
  if (Array.isArray(right)) {
    $$renderer.push(`<!--[0--><!--[-->`);
    const each_array_1 = ensure_array_like(right);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let right_item = each_array_1[$$index_1];
      if (right_item) {
        $$renderer.push(`<!--[0--><span class="slot_padding svelte-6urat2">`);
        right_item?.($$renderer);
        $$renderer.push(`<!----></span>`);
      } else {
        $$renderer.push("<!--[-1-->");
      }
      $$renderer.push(`<!--]-->`);
    }
    $$renderer.push(`<!--]-->`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div></div></div></nav>`);
}
function TableToolbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      requestData = void 0,
      loading = false,
      LastFetchResponse = true,
      timeRemainingToRefresh = 0,
      showExportButton = true,
      showDeleteButton = false,
      showEditButton = false,
      showNewButton = false,
      showSelectionButton = true,
      selectionType = 0,
      iconExport = "fa-solid fa-file-excel",
      iconDeleteRow = "fa-solid fa-trash",
      text_search = void 0,
      left_items = [],
      right_items = [],
      onRefresh = () => {
      },
      onSearch = () => {
      },
      onSearchInput = () => {
      },
      onExport = (type) => {
      },
      onDelete = () => {
      },
      onEdit = () => {
      },
      onNew = () => {
      },
      onSelectionTypeChange = (type) => {
      }
    } = $$props;
    function t_refresh($$renderer3) {
      if (requestData && requestData.url) {
        $$renderer3.push(`<!--[0--><button class="button is-small" title="Refresh time">`);
        if (loading) {
          $$renderer3.push(`<!--[0--><span class="icon has-text-info"><i class="fas fa-spinner fa-pulse"></i></span>`);
        } else if (LastFetchResponse) {
          $$renderer3.push(`<!--[1--><span class="icon"><i class="fas fa-hourglass-half"></i></span>`);
        } else {
          $$renderer3.push(`<!--[-1--><span class="icon has-text-danger"><i class="fas fa-exclamation-triangle"></i></span>`);
        }
        $$renderer3.push(`<!--]--> <span>${escape_html(timeRemainingToRefresh)}s</span></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function t_search($$renderer3) {
      $$renderer3.push(`<div class="field has-addons"><p class="control"><input class="input size_search is-small svelte-1xmhp6b" type="text" placeholder="Search"${attr("value", text_search)}/></p> <p class="control"><button aria-label="close" class="button is-small" title="Search"><span class="icon is-small"><i class="fas fa-search"></i></span></button></p></div>`);
    }
    function t_export_excel($$renderer3) {
      if (showExportButton) {
        $$renderer3.push(`<!--[0--><button aria-label="close" class="button is-small" title="Export to Excel"><span class="icon"><i${attr_class(clsx(iconExport), "svelte-1xmhp6b")}></i></span></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function t_export_html($$renderer3) {
      if (showExportButton) {
        $$renderer3.push(`<!--[0--><button aria-label="close" class="button is-small" title="Export to Html"><span class="icon"><i class="fa-solid fa-download"></i></span></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function t_selection_type($$renderer3) {
      if (showSelectionButton) {
        $$renderer3.push(`<!--[0--><div class="dropdown is-hoverable is-right" title="Selection type"><div class="dropdown-trigger"><button aria-label="close" class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu"><span class="icon"><i class="far fa-list-alt"></i></span></button></div> <div class="dropdown-menu" role="menu"><div class="dropdown-content"><a class="dropdown-item is-size-7"><input class="check_margin svelte-1xmhp6b" type="radio" name="selection_type" value="1"${attr("checked", selectionType == 1, true)}/> <span class="icon"><i class="fas fa-check"></i></span> <span>Simple</span></a> <a class="dropdown-item is-size-7"><input class="check_margin svelte-1xmhp6b" type="radio" name="selection_type" value="2"${attr("checked", selectionType == 2, true)}/> <span class="icon"><i class="fas fa-check-double"></i></span> <span>Multiple</span></a> <hr class="dropdown-divider"/> <a class="dropdown-item is-size-7"><input class="check_margin svelte-1xmhp6b" type="radio" name="selection_type" value="0"${attr("checked", selectionType == 0, true)}/> <span class="icon"><i class="fas fa-ban"></i></span> <span>None</span></a></div></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function t_delete($$renderer3) {
      if (showDeleteButton) {
        $$renderer3.push(`<!--[0--><button aria-label="close" class="button is-small" title="Delete row"><span class="icon"><i${attr_class(clsx(iconDeleteRow), "svelte-1xmhp6b")}></i></span></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function t_edit($$renderer3) {
      if (showEditButton) {
        $$renderer3.push(`<!--[0--><button aria-label="close" class="button is-small" title="Edit row"><span class="icon"><i class="far fa-edit"></i></span></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function t_new($$renderer3) {
      if (showNewButton) {
        $$renderer3.push(`<!--[0--><button aria-label="close" class="button is-small" title="New row"><span class="icon"><i class="far fa-file"></i></span></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    Level($$renderer2, {
      left: left_items,
      right: [
        ...right_items,
        t_refresh,
        t_new,
        t_edit,
        t_delete,
        t_selection_type,
        t_export_excel,
        t_export_html,
        t_search
      ]
    });
    bind_props($$props, { selectionType, text_search });
  });
}
function TablePagination($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      pageSelected = 1,
      totalPages = 0,
      totalFilteredRows = 0,
      pageSize = [25, 50, 100],
      pageSizeSelected = 0,
      visiblePages = []
    } = $$props;
    $$renderer2.push(`<div class="table_pagination svelte-em308e"><nav class="level"><div class="level-left">`);
    if (totalPages > 1) {
      $$renderer2.push(`<!--[0--><div class="level-item"><span>Page ${escape_html(pageSelected)} of ${escape_html(totalPages)} (Total ${escape_html(totalFilteredRows)}
						rows)</span></div> <div class="level-item"><div class="buttons has-addons"><button aria-label="first page" class="button is-small"><span class="icon"><i class="fas fa-angle-double-left"></i></span></button> <button aria-label="previous page" class="button is-small"><span class="icon"><i class="fas fa-angle-left"></i></span></button> <button class="button is-small is-info">${escape_html(pageSelected)}</button> <!--[-->`);
      const each_array = ensure_array_like(visiblePages);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let pageNum = each_array[$$index];
        $$renderer2.push(`<button class="button is-small">${escape_html(pageNum)}</button>`);
      }
      $$renderer2.push(`<!--]--> <button aria-label="next page" class="button is-small"><span class="icon"><i class="fas fa-angle-right"></i></span></button> <button aria-label="last page" class="button is-small"><span class="icon"><i class="fas fa-angle-double-right"></i></span></button></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="level-right"><span class="level-item"><span class="label_rows_per_page svelte-em308e">Rows per page</span> <div class="select is-small"><select name="rows_per_page"><!--[-->`);
    const each_array_1 = ensure_array_like(pageSize);
    for (let itd = 0, $$length = each_array_1.length; itd < $$length; itd++) {
      let item = each_array_1[itd];
      $$renderer2.option({ value: itd, selected: item == pageSize[pageSizeSelected] }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(item)}`);
      });
    }
    $$renderer2.push(`<!--]--></select></div></span></div></nav></div>`);
  });
}
function FileName(fileNameExport, extension = "txt") {
  let fName = "Report";
  if (fileNameExport && fileNameExport.length > 0) {
    fName = fileNameExport;
  }
  return `${fName}_${DateTime.local().toFormat("yyyy-MM-dd_HH-mm-ss")}.${extension}`;
}
function ConvertDataToHtml(data) {
  let tableHTML = "";
  tableHTML += "<thead><tr>";
  if (data.length > 0) {
    Object.keys(data[0]).forEach((key) => {
      tableHTML += "<th>" + escapeHtml(key) + "</th>";
    });
  }
  tableHTML += "</tr></thead>";
  tableHTML += "<tbody>";
  data.forEach((row, rowIndex) => {
    tableHTML += "<tr>";
    Object.values(row).forEach((value) => {
      tableHTML += "<td>" + escapeHtml(String(value ?? "")) + "</td>";
    });
    tableHTML += "</tr>";
  });
  tableHTML += "</tbody>";
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Report</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
    margin: 2rem;
    color: #333;
  }
  h1 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: #1F4E79;
  }
  #report_table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.85rem;
  }
  #report_table th,
  #report_table td {
    border: 1px solid #c0c0c0;
    padding: 8px 12px;
    text-align: left;
  }
  #report_table thead th {
    background-color: #1F4E79;
    color: #ffffff;
    font-weight: 600;
    text-align: center;
    position: sticky;
    top: 0;
  }
  #report_table tbody tr:nth-child(even) {
    background-color: #E8F0FE;
  }
  #report_table tbody tr:hover {
    background-color: #d2e3fc;
  }
  #report_table td {
    vertical-align: top;
  }
  @media print {
    #report_table { font-size: 0.75rem; }
    #report_table thead th { position: static; }
  }
</style>
</head>
<body>
<h1>Report</h1>
<table id="report_table">
${tableHTML}
</table>
</body>
</html>`;
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function FormatDataToExport(array_data, columns, text_length_limit_in_cell = 0) {
  let exceedsLimit = false;
  const excelLimit = 32767;
  const data = array_data.map((row) => {
    const newRow = {};
    Object.keys(row).forEach((key) => {
      if (columns[key] && columns[key].hidden) {
        return;
      }
      const colConfig = columns[key];
      let value = row[key];
      if (colConfig && colConfig.decorator && colConfig.decorator.component && colConfig.decorator.component === DateTime_1) {
        let dtLuxon = null;
        if (value instanceof Date) {
          dtLuxon = DateTime.fromJSDate(value);
        } else if (typeof value === "string") {
          dtLuxon = DateTime.fromISO(value);
          if (!dtLuxon.isValid && colConfig.fromFormat) {
            dtLuxon = DateTime.fromFormat(value, colConfig.fromFormat);
          }
          if (!dtLuxon.isValid) {
            dtLuxon = DateTime.fromSQL(value);
          }
          if (!dtLuxon.isValid) {
            const parsedDate = new Date(value);
            if (!isNaN(parsedDate.getTime())) {
              dtLuxon = DateTime.fromJSDate(parsedDate);
            }
          }
        }
        if (dtLuxon && dtLuxon.isValid) {
          const fmt = colConfig.format || "yyyy-MM-dd HH:mm:ss";
          value = dtLuxon.toFormat(fmt);
        }
      } else if (value !== null && typeof value === "object") {
        value = JSON.stringify(value);
      }
      if (typeof value === "string") {
        if (value.length > excelLimit) {
          console.warn(
            `El valor de la columna ${key} es muy largo para Excel (${value.length} chars).`
          );
          exceedsLimit = true;
        }
        if (text_length_limit_in_cell > 0 && value.length > text_length_limit_in_cell) {
          value = value.substring(0, text_length_limit_in_cell);
        }
      }
      if (key !== "internal_hash_row") {
        newRow[key] = value;
      }
    });
    return newRow;
  });
  return { data, exceedsLimit };
}
function applyWorksheetStyles(ws) {
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddr = XLSX.utils.encode_cell({ r: 0, c: col });
    if (ws[cellAddr]) {
      ws[cellAddr].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
        fill: { fgColor: { rgb: "1F4E79" }, patternType: "solid" },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "C0C0C0" } },
          bottom: { style: "thin", color: { rgb: "C0C0C0" } },
          left: { style: "thin", color: { rgb: "C0C0C0" } },
          right: { style: "thin", color: { rgb: "C0C0C0" } }
        }
      };
    }
  }
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const isEven = (row - 1) % 2 === 1;
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddr = XLSX.utils.encode_cell({ r: row, c: col });
      if (ws[cellAddr]) {
        ws[cellAddr].s = {
          font: { sz: 10 },
          fill: isEven ? { fgColor: { rgb: "E8F0FE" }, patternType: "solid" } : { fgColor: { rgb: "FFFFFF" }, patternType: "solid" },
          border: {
            top: { style: "thin", color: { rgb: "C0C0C0" } },
            bottom: { style: "thin", color: { rgb: "C0C0C0" } },
            left: { style: "thin", color: { rgb: "C0C0C0" } },
            right: { style: "thin", color: { rgb: "C0C0C0" } }
          }
        };
      }
    }
  }
  const colWidths = [];
  for (let col = range.s.c; col <= range.e.c; col++) {
    let maxWidth = 8;
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cellAddr = XLSX.utils.encode_cell({ r: row, c: col });
      const cellValue = ws[cellAddr] ? String(ws[cellAddr].v ?? "") : "";
      maxWidth = Math.max(maxWidth, Math.min(cellValue.length + 2, 60));
    }
    colWidths.push({ wch: maxWidth });
  }
  ws["!cols"] = colWidths;
}
const ExportTableToXlsx = (filteredData, columns, fileNameExport) => {
  try {
    const { data: FormatedData, exceedsLimit } = FormatDataToExport(filteredData, columns, 0);
    if (FormatedData && FormatedData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(FormatedData);
      applyWorksheetStyles(ws);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      let ExtensionFile = "xlsx";
      if (exceedsLimit) {
        ExtensionFile = "csv";
        console.warn("Data exceeds Excel cell limit, switching to CSV export to preserve full content.");
      }
      const NameFile = FileName(fileNameExport, ExtensionFile);
      const wopts = {
        bookType: ExtensionFile,
        bookSST: false,
        type: "binary",
        FS: ";"
      };
      XLSX.writeFile(wb, NameFile, wopts);
    }
  } catch (error) {
    console.error(error);
  }
};
const ExportTableToHTML = (filteredData, columns, fileNameExport) => {
  try {
    const { data: FormatedData } = FormatDataToExport(filteredData, columns);
    const html_content = ConvertDataToHtml(FormatedData);
    const link_download = document.createElement("a");
    link_download.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(html_content));
    link_download.setAttribute("download", FileName(fileNameExport, "html"));
    link_download.style.display = "none";
    document.body.appendChild(link_download);
    link_download.click();
    document.body.removeChild(link_download);
  } catch (error) {
    console.error(error);
  }
};
function checkIsArray(data) {
  return data && Array.isArray(data);
}
function Table($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      RawDataTable = void 0,
      selectionType = 0,
      columns = {},
      showNewButton = false,
      showEditButton = false,
      showEditRow = false,
      showSelectionButton = true,
      showExportButton = true,
      iconExport = "fa-solid fa-file-excel",
      iconDeleteRow = "fa-solid fa-trash",
      showDeleteButton = false,
      pageSize = [25, 50, 100, 200, 300, 500, 1e3],
      pageSizeSelected = 0,
      relatedTablesForAutoRefresh = [],
      fileNameExport = "",
      requestData = void 0,
      rowClassFunction = function(row) {
        return "";
      },
      left_items = [],
      right_items = [],
      onclickrow = (c) => {
      },
      oneditrow = (e) => {
        console.trace("oneditrow no implemented.");
      },
      onnewrow = (n) => {
        console.trace("onnewrow no implemented.");
      },
      onsearch = (n) => {
        console.trace("onsearch no implemented.");
      },
      ondeleterow = (d) => {
        ownDeleteRows(d);
      },
      onselectrows = (s) => {
      },
      onclickcell = (s) => {
      },
      onchangecell = (s) => {
      }
    } = $$props;
    new uFetch();
    const notify = new Notifications$1();
    let DataTable = [];
    let SelectedRows = /* @__PURE__ */ new Set();
    let text_search = void 0;
    let loading = false;
    let ColumnSort = void 0;
    let ShowDialogColumn = false;
    let timeRemainingToRefresh = 999;
    let LastFetchResponse = true;
    let IntervalRefresh = [10, 20, 30, 45, 60, 120, 240, 480, 960, 1920, 3840];
    let PageSelected = 1;
    let totalFilteredRows = 0;
    let paginatedData = [];
    let totalPages = derived(() => {
      return paginatedData.length;
    });
    let visiblePages = derived(() => {
      const maxVisible = 4;
      const pages = [];
      const start = PageSelected + 1;
      const end = Math.min(start + maxVisible, totalPages() + 1);
      for (let i = start; i < end; i++) {
        pages.push(i);
      }
      return pages;
    });
    let internal_columns = {};
    let idTimeoutDataChanged;
    let idTimeoutSearch;
    function requestDataExists() {
      return requestData && requestData.url && requestData.url.length > 0;
    }
    function ArrayChunk(myArray, chunk_size) {
      let tempArray = [];
      chunk_size = parseInt(chunk_size);
      if (checkIsArray(myArray)) {
        for (let index = 0; index < myArray.length; index += chunk_size) {
          let myChunk = myArray.slice(index, index + chunk_size);
          tempArray.push(myChunk);
        }
      }
      return tempArray;
    }
    function RowIsSelected(internal_hash_row) {
      return SelectedRows.has(internal_hash_row);
    }
    function GetSelectedRows() {
      if (!RawDataTableIsArray()) return [];
      return RawDataTable.filter((row) => SelectedRows.has(row.internal_hash_row));
    }
    function handleExport(type) {
      try {
        let filteredData = GetSelectedRows();
        if (filteredData && filteredData.length > 0) {
          if (type === "xlsx") {
            ExportTableToXlsx(filteredData, columns, fileNameExport);
          } else {
            ExportTableToHTML(filteredData, columns, fileNameExport);
          }
          notify.push({
            message: `Exported ${filteredData.length} rows to ${type.toUpperCase()}.`,
            color: "success",
            title: "Export"
          });
        } else {
          selectionType = 2;
          notify.push({
            message: "Select the rows to export.",
            color: "warning",
            title: "Export"
          });
        }
      } catch (error) {
        notify.push({
          message: "Export failed: " + error.message,
          color: "danger",
          title: "Export Error"
        });
        console.error(error);
      }
    }
    let auto_refresh;
    onDestroy(() => {
      clearInterval(auto_refresh);
      clearTimeout(idTimeoutDataChanged);
      clearTimeout(idTimeoutSearch);
    });
    function ChangeIntervalRefresh() {
      if (requestDataExists()) {
        let i = requestData.refresh_time + 1;
        if (IntervalRefresh[i]) {
          requestData.refresh_time = i;
        } else {
          requestData.refresh_time = 0;
        }
        timeRemainingToRefresh = IntervalRefresh[requestData.refresh_time];
      } else {
        console.warn("ChangeIntervalRefresh: requestData not setted.");
      }
    }
    function ownDeleteRows(selected_rows) {
      if (selected_rows.rows && selected_rows.rows.length > 0) {
        RawDataTable = RawDataTable ? RawDataTable.filter((item) => {
          let r = selected_rows.rows.find((r2) => {
            return r2.internal_hash_row == item.internal_hash_row;
          });
          return !r;
        }) : [];
      }
    }
    function HClickDelete(e) {
      try {
        let filteredData = GetSelectedRows();
        if (filteredData && filteredData.length > 0) {
          ondeleterow({ rows: snapshot(filteredData) });
        } else {
          selectionType = 2;
          notify.push({
            message: "Select the rows to delete.",
            color: "warning",
            title: "Delete"
          });
        }
      } catch (error) {
        notify.push({
          message: "Delete failed: " + error.message,
          color: "danger",
          title: "Delete Error"
        });
        console.error(error);
      }
    }
    function handleClickSearch() {
      if (onsearch) {
        onsearch();
      }
      FilterData();
      if (!text_search || text_search.length === 0) {
        timeRemainingToRefresh = 0;
      }
    }
    function handleSearchInput() {
      clearTimeout(idTimeoutSearch);
      idTimeoutSearch = setTimeout(
        () => {
          if (onsearch) {
            onsearch();
          }
          FilterData();
          if (!text_search || text_search.length === 0) {
            timeRemainingToRefresh = 0;
          }
        },
        300
      );
    }
    function RawDataTableIsArray() {
      return checkIsArray(RawDataTable);
    }
    function FilterData() {
      let TempData;
      if (text_search && text_search.length > 0 && RawDataTableIsArray()) {
        TempData = RawDataTable.filter((d) => {
          let s = Object.values(d).filter((item) => {
            if (item) {
              return item.toString().toUpperCase().includes(text_search.toUpperCase());
            } else {
              return item;
            }
          });
          if (s.length > 0) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        TempData = RawDataTable;
      }
      if (TempData) {
        totalFilteredRows = TempData.length;
        Pagination(TempData);
      }
    }
    function eventOnChangeCell(item, dataRow) {
      let row = RawDataTable && Array.isArray(RawDataTable) ? RawDataTable.findIndex((row2) => {
        return row2.internal_hash_row == dataRow.internal_hash_row;
      }) : -1;
      if (onchangecell) {
        onchangecell(snapshot({ field: item, data: row }));
      }
    }
    function Pagination(rows) {
      paginatedData = ArrayChunk(rows, pageSize[pageSizeSelected]);
      if (PageSelected > totalPages()) {
        PageSelected = 1;
      }
      SelectPage();
    }
    function SelectPage() {
      let tmpdata = paginatedData[PageSelected - 1] ?? [];
      if (tmpdata) {
        DataTable = tmpdata.filter((ev) => {
          return ev && ev.internal_hash_row;
        });
      }
    }
    function HandleOnClickEdit() {
      showEditRow = !showEditRow;
      return false;
    }
    function handleToolbarRefresh() {
      ChangeIntervalRefresh();
    }
    function handleToolbarSearch() {
      handleClickSearch();
    }
    function handleToolbarSearchInput() {
      handleSearchInput();
    }
    function handleToolbarExport(type) {
      handleExport(type);
    }
    function handleToolbarDelete() {
      HClickDelete();
    }
    function handleToolbarEdit() {
      HandleOnClickEdit();
    }
    function handleToolbarNew() {
      if (onnewrow) {
        onnewrow();
      }
    }
    function handleToolbarSelectionTypeChange(type) {
      selectionType = type;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      TableToolbar($$renderer3, {
        requestData,
        loading,
        LastFetchResponse,
        timeRemainingToRefresh,
        showExportButton,
        showDeleteButton,
        showEditButton,
        showNewButton,
        showSelectionButton,
        iconExport,
        iconDeleteRow,
        left_items,
        right_items,
        onRefresh: handleToolbarRefresh,
        onSearch: handleToolbarSearch,
        onSearchInput: handleToolbarSearchInput,
        onExport: handleToolbarExport,
        onDelete: handleToolbarDelete,
        onEdit: handleToolbarEdit,
        onNew: handleToolbarNew,
        onSelectionTypeChange: handleToolbarSelectionTypeChange,
        get selectionType() {
          return selectionType;
        },
        set selectionType($$value) {
          selectionType = $$value;
          $$settled = false;
        },
        get text_search() {
          return text_search;
        },
        set text_search($$value) {
          text_search = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="table-container is-size-7">`);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">`);
      if (DataTable && DataTable.length > 0) {
        $$renderer3.push(`<!--[0--><thead><tr class="has-background-link-dark"><th class="has-text-centered has-text-white resizable">#</th>`);
        if (selectionType == 1) {
          $$renderer3.push(`<!--[0--><th class="has-text-centered has-text-white"><span>-</span></th>`);
        } else if (selectionType == 2) {
          $$renderer3.push(`<!--[1--><th class="has-text-centered has-text-white"><input type="checkbox"/></th>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
        if (showEditRow) {
          $$renderer3.push(`<!--[0--><th class="has-text-centered has-text-white"><i class="fas fa-pen"></i></th>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
        if (internal_columns) {
          $$renderer3.push(`<!--[0--><!--[-->`);
          const each_array = ensure_array_like(Object.keys(internal_columns));
          for (let ith = 0, $$length = each_array.length; ith < $$length; ith++) {
            let item = each_array[ith];
            if (internal_columns[item]) {
              $$renderer3.push("<!--[0-->");
              if (!internal_columns[item].hidden || internal_columns[item].hidden == null) {
                $$renderer3.push(`<!--[0--><th class="has-text-centered show_cursor_mouse has-text-white svelte-122u0gu"${attr("data-column", item)}>${escape_html(internal_columns[item].label)} `);
                if (ColumnSort == item) {
                  $$renderer3.push("<!--[0-->");
                  {
                    $$renderer3.push(`<!--[0--><i class="fas fa-caret-down"></i>`);
                  }
                  $$renderer3.push(`<!--]-->`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]--></th>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></tr></thead> <tbody><!--[-->`);
        const each_array_1 = ensure_array_like(DataTable);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let dataRow = each_array_1[i];
          $$renderer3.push(`<tr${attr_class(clsx(rowClassFunction(dataRow)), "svelte-122u0gu")}><td>${escape_html(i + 1 + pageSize[pageSizeSelected] * (PageSelected - 1))}</td>`);
          if (selectionType == 1) {
            $$renderer3.push(`<!--[0--><td class="has-text-centered"><input type="radio" name="single_select" class="show_cursor_mouse svelte-122u0gu"${attr("checked", RowIsSelected(dataRow.internal_hash_row), true)}${attr("data-internal_hash_row", dataRow.internal_hash_row)}/></td>`);
          } else if (selectionType == 2) {
            $$renderer3.push(`<!--[1--><td class="has-text-centered"><input class="show_cursor_mouse svelte-122u0gu" type="checkbox"${attr("checked", RowIsSelected(dataRow.internal_hash_row), true)}${attr("data-internal_hash_row", dataRow.internal_hash_row)}/></td>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]-->`);
          if (showEditRow) {
            $$renderer3.push(`<!--[0--><td class="has-text-centered show_cursor_mouse svelte-122u0gu"><span class="icon is-small"><i class="fas fa-pen"></i></span></td>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--><!--[-->`);
          const each_array_2 = ensure_array_like(Object.keys(internal_columns));
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let item = each_array_2[$$index_1];
            if (internal_columns[item]) {
              $$renderer3.push("<!--[0-->");
              if (!internal_columns[item].hidden || internal_columns[item].hidden == null) {
                $$renderer3.push("<!--[0-->");
                if (internal_columns[item].decorator && internal_columns[item].decorator.component) {
                  $$renderer3.push("<!--[0-->");
                  const Component = internal_columns[item].decorator.component;
                  if (Component) {
                    $$renderer3.push("<!--[-->");
                    Component($$renderer3, spread_props([
                      internal_columns[item]?.decorator?.props,
                      {
                        onchangecell: (e) => {
                          eventOnChangeCell(item, dataRow);
                        },
                        onclickcell: (e) => {
                          if (onclickcell) {
                            onclickcell(snapshot({ field: item, data: dataRow }));
                          }
                        },
                        get row() {
                          return DataTable[i];
                        },
                        set row($$value) {
                          DataTable[i] = $$value;
                          $$settled = false;
                        },
                        get value() {
                          return dataRow[item];
                        },
                        set value($$value) {
                          dataRow[item] = $$value;
                          $$settled = false;
                        }
                      }
                    ]));
                    $$renderer3.push("<!--]-->");
                  } else {
                    $$renderer3.push("<!--[!-->");
                    $$renderer3.push("<!--]-->");
                  }
                } else {
                  $$renderer3.push("<!--[-1-->");
                  Auto($$renderer3, spread_props([
                    internal_columns[item]?.decorator?.props,
                    {
                      onchangecell: (e) => {
                        eventOnChangeCell(item, dataRow);
                      },
                      onclickcell: (e) => {
                        if (onclickcell) {
                          onclickcell(snapshot({ field: item, data: dataRow }));
                        }
                      },
                      get row() {
                        return DataTable[i];
                      },
                      set row($$value) {
                        DataTable[i] = $$value;
                        $$settled = false;
                      },
                      get value() {
                        return dataRow[item];
                      },
                      set value($$value) {
                        dataRow[item] = $$value;
                        $$settled = false;
                      }
                    }
                  ]));
                }
                $$renderer3.push(`<!--]-->`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--></tr>`);
        }
        $$renderer3.push(`<!--]--></tbody>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></table> `);
      if (!DataTable || DataTable.length < 1) {
        $$renderer3.push(`<!--[0--><div class="has-text-centered"><i class="fa fa-table" aria-hidden="true"></i> There is no data to show</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      TablePagination($$renderer3, {
        pageSelected: PageSelected,
        totalPages: totalPages(),
        totalFilteredRows,
        pageSize,
        pageSizeSelected,
        visiblePages: visiblePages()
      });
      $$renderer3.push(`<!----></div> <div${attr_class("modal", void 0, { "is-active": ShowDialogColumn })}><div class="modal-card"><header class="modal-card-head has-background-dark"><p class="modal-card-title has-text-white"><b><span>Columns</span></b></p> <button class="delete" aria-label="close"></button></header> <section class="modal-card-body"><div class="columns"><!--[-->`);
      const each_array_3 = ensure_array_like(Object.keys(columns));
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let col = each_array_3[$$index_3];
        $$renderer3.push(`<div class="column"><label class="checkbox"><input type="checkbox"/> ${escape_html(col)}</label></div>`);
      }
      $$renderer3.push(`<!--]--></div></section> <footer class="modal-card-foot has-background-dark"><button class="button is-success is-small"><span>Accept</span></button> <button class="button is-small"><span>Cancel</span></button></footer></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, {
      RawDataTable,
      selectionType,
      columns,
      showNewButton,
      showEditButton,
      showEditRow,
      showSelectionButton,
      showExportButton,
      iconExport,
      iconDeleteRow,
      showDeleteButton,
      pageSize,
      pageSizeSelected,
      relatedTablesForAutoRefresh,
      fileNameExport,
      requestData,
      left_items,
      right_items,
      GetSelectedRows
    });
  });
}
function Modal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      show = false,
      children,
      showCloseButton = false,
      closeOnEscape = true,
      closeOnBackground = true
    } = $$props;
    const isBrowser = typeof document !== "undefined";
    function handleKeydown(e) {
      if (e.key === "Escape" && show && closeOnEscape) {
        show = false;
        e.stopPropagation();
      }
    }
    onDestroy(() => {
      if (!isBrowser) return;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeydown);
    });
    $$renderer2.push(`<div${attr_class("modal", void 0, { "is-active": show })} role="dialog" aria-modal="true"><div class="modal-background"></div> <div class="modal-content">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div> `);
    if (showCloseButton) {
      $$renderer2.push(`<!--[0--><button class="modal-close is-large" aria-label="close"></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { show, showCloseButton });
  });
}
function Modal_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      show = false,
      title,
      oncancel,
      onaccept,
      body,
      label_accept = "ACCEPT",
      label_cancel = "CANCEL",
      closeOnEscape = true,
      closeOnBackground = true
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Modal($$renderer3, {
        closeOnEscape,
        closeOnBackground,
        get show() {
          return show;
        },
        set show($$value) {
          show = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="modal-card"><header class="modal-card-head has-background-dark svelte-zl17qn"><p class="modal-card-title has-text-white svelte-zl17qn"><b>`);
          title?.($$renderer4);
          $$renderer4.push(`<!----></b></p> <button class="delete" aria-label="close"></button></header> <section class="modal-card-body">`);
          body?.($$renderer4);
          $$renderer4.push(`<!----></section> <footer class="modal-card-foot has-background-dark svelte-zl17qn"><button class="button is-success is-small">${escape_html(label_accept)}</button> <button class="button is-small">${escape_html(label_cancel)}</button></footer></div>`);
        },
        $$slots: { default: true }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { show });
  });
}
function Predictive($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      /** @type {Option[]} options - Lista de opciones disponibles para el autocompletado. */
      options = [
        { name: "Manzana", value: "1" },
        { name: "Durazno", value: "2" },
        { name: "Pera", value: "pera" },
        { name: "Kiwi", value: "34" }
      ],
      /** @type {string} label - Etiqueta a mostrar junto al campo de entrada. */
      label = "SELECT",
      /** @type {any} selectedValue - Valor actualmente seleccionado. Es bindable. */
      selectedValue = null,
      /** @type {string} classLabel - Clases CSS adicionales para la etiqueta. */
      classLabel = "is-small",
      /** @type {string} classInput - Clases CSS adicionales para el campo de texto. */
      classInput = "is-small",
      /** @type {string} placeholder - Texto de marcador de posición para el campo de texto. */
      placeholder = "",
      /** @type {string} classIcon - Clases CSS para el icono del botón desplegable. Si está vacío, se calcula automáticamente. */
      classIcon = "",
      /** @type {string} classOnSucess - Clase CSS a aplicar cuando hay un valor válido seleccionado. */
      classOnSucess = "is-success",
      /** @type {string} classOnError - Clase CSS a aplicar cuando no hay un valor válido (a menos que freeTyping sea true). */
      classOnError = "is-danger fa-beat-fade",
      /** @type {boolean} freeTyping - Permite ingresar texto libre que no esté en la lista de opciones. */
      freeTyping = false,
      /** @type {function(Option): void} onselect - Función callback que se ejecuta al seleccionar una opción. */
      onselect = () => {
      }
    } = $$props;
    let inputValue = "";
    let placeholderInternal = derived(() => placeholder && placeholder.length > 0 ? placeholder : "Type to see options");
    let classIconInternal = derived(() => classIcon && classIcon.length > 0 ? classIcon : freeTyping ? "fa-regular fa-keyboard" : "fa-solid fa-angle-down");
    let selectedValueIsValid = derived(() => freeTyping ? true : options.some((option) => option.value === selectedValue));
    $$renderer2.push(`<div class="field has-addons">`);
    if (label && label.length > 0) {
      $$renderer2.push(`<!--[0--><p class="control"${attr("title", selectedValue)}><span${attr_class(`button ${stringify(classLabel)} is-static`, "svelte-9kgxnp")}><span>${escape_html(label)}</span></span></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="control is-expanded"><input${attr_class(`input ${stringify(classInput)} is-outlined`, "svelte-9kgxnp")} type="text"${attr("value", inputValue)}${attr("placeholder", placeholderInternal())}/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <p class="control"><button${attr_class(`button is-outlined ${stringify(classLabel)} ${stringify(selectedValueIsValid() ? classOnSucess : classOnError)}`, "svelte-9kgxnp")} aria-label="Toggle dropdown"><span class="icon"><i${attr_class(clsx(classIconInternal()), "svelte-9kgxnp")}></i></span></button></p></div>`);
    bind_props($$props, {
      label,
      selectedValue,
      classLabel,
      classInput,
      placeholder,
      classIcon,
      classOnSucess,
      classOnError,
      freeTyping
    });
  });
}
function FileUpload($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      label = void 0,
      accept = ".json",
      url = "http://localhost:3000/upload",
      multiple = false,
      onselect = () => {
      },
      onupload = () => {
      },
      onchange = () => {
      },
      showUploadButton = true,
      sizeClass = "is-small"
    } = $$props;
    let statusSend = 0;
    let selectedFiles;
    let class_status_upload = derived(() => {
      let s = "";
      switch (statusSend) {
        case 1:
          s = "is-success";
          break;
        case 2:
          s = "is-danger";
          break;
        default:
          s = "";
          break;
      }
      return s;
    });
    function createFormData() {
      const formData = new FormData();
      for (let index = 0; index < selectedFiles.length; index++) {
        const f = selectedFiles[index];
        formData.append(f.name, f);
      }
      return formData;
    }
    async function uploadFile() {
      const response = await fetch(url, { method: "POST", body: createFormData() });
      return await response.json();
    }
    $$renderer2.push(`<div class="field has-addons">`);
    if (label != null) {
      $$renderer2.push(`<!--[0--><p class="control"><a${attr_class(`button is-static ${stringify(sizeClass)} `)}>${escape_html(label)}</a></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p class="control file is-expanded"><input${attr_class(`input ${stringify(sizeClass)} `)} type="file"${attr("multiple", multiple, true)}${attr("accept", accept)}/></p> `);
    if (showUploadButton) {
      $$renderer2.push(`<!--[0--><p class="control"><button${attr_class(`button ${stringify(sizeClass)} ${stringify(class_status_upload())}`)}><span${attr_class(`icon ${stringify(sizeClass)}`)}><i class="fa-solid fa-upload"></i></span> <span>Upload</span></button></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { label, accept, showUploadButton, sizeClass, uploadFile });
  });
}
function Basic$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      placeholder = "",
      type = "text",
      label = void 0,
      value = void 0,
      sizeClass = "is-small",
      labelClass = "",
      min = void 0,
      max = void 0,
      step = void 0,
      isExpanded = true,
      accept = ".json",
      url = "http://localhost:3000/upload",
      multiple = false,
      onselect = () => {
      },
      onupload = () => {
      },
      onchange = () => {
      },
      showUploadButton = true,
      pattern = void 0,
      required = false,
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const id = rest.id || `input-${Math.random().toString(36).substring(2, 9)}`;
    let inputClass = derived(() => `input ${sizeClass} ${rest.class || ""}`);
    let localDateTime = derived(() => {
      if (!value) return "";
      if (type !== "datetime-local") return "";
      let d = DateTime.fromISO(value, { zone: "utc" });
      if (!d.isValid) {
        d = DateTime.fromSQL(value, { zone: "utc" });
      }
      if (!d.isValid) {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          d = DateTime.fromJSDate(parsedDate, { zone: "utc" });
        }
      }
      return d.isValid ? d.toLocal().toFormat("yyyy-MM-dd'T'HH:mm") : "";
    });
    let dateFormated = derived(() => {
      if (!value) return "";
      if (type !== "date") return "";
      let d = DateTime.fromISO(value, { zone: "utc" });
      if (!d.isValid) {
        d = DateTime.fromSQL(value, { zone: "utc" });
      }
      if (!d.isValid) {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          d = DateTime.fromJSDate(parsedDate, { zone: "utc" });
        }
      }
      return d.isValid ? d.toFormat("yyyy-MM-dd") : "";
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (type == "file") {
        $$renderer3.push("<!--[0-->");
        FileUpload($$renderer3, {
          onchange,
          onselect,
          onupload,
          get label() {
            return label;
          },
          set label($$value) {
            label = $$value;
            $$settled = false;
          },
          get accept() {
            return accept;
          },
          set accept($$value) {
            accept = $$value;
            $$settled = false;
          },
          get url() {
            return url;
          },
          set url($$value) {
            url = $$value;
            $$settled = false;
          },
          get multiple() {
            return multiple;
          },
          set multiple($$value) {
            multiple = $$value;
            $$settled = false;
          },
          get showUploadButton() {
            return showUploadButton;
          },
          set showUploadButton($$value) {
            showUploadButton = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push(`<!--[-1--><div class="field has-addons">`);
        if (label != null) {
          $$renderer3.push(`<!--[0--><p class="control"><label${attr_class(`button is-static ${stringify(sizeClass)} ${stringify(labelClass)}`)}${attr("for", id)}>${escape_html(label)}</label></p>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> <p${attr_class(`control ${isExpanded ? "is-expanded" : ""}`)}>`);
        if (type == "checkbox") {
          $$renderer3.push(`<!--[0--><a${attributes({
            class: `button ${stringify(sizeClass)} ${value ? "is-success" : ""}`,
            ...rest
          })}><span class="icon-text"><span${attr_class(`icon ${stringify(sizeClass)}`)}>`);
          if (value) {
            $$renderer3.push(`<!--[0--><i class="fa-regular fa-square-check"></i>`);
          } else {
            $$renderer3.push(`<!--[-1--><i class="fa-regular fa-square"></i>`);
          }
          $$renderer3.push(`<!--]--></span></span></a>`);
        } else if (type == "datetime-local") {
          $$renderer3.push(`<!--[1--><input${attributes(
            {
              id,
              class: clsx(inputClass()),
              type: "datetime-local",
              placeholder,
              required,
              ...rest,
              value: localDateTime()
            },
            void 0,
            void 0,
            void 0,
            4
          )}/>`);
        } else if (type == "date") {
          $$renderer3.push(`<!--[2--><input${attributes(
            {
              id,
              class: clsx(inputClass()),
              type: "date",
              placeholder,
              required,
              ...rest,
              value: dateFormated()
            },
            void 0,
            void 0,
            void 0,
            4
          )}/>`);
        } else if (type == "number") {
          $$renderer3.push(`<!--[3--><input${attributes(
            {
              id,
              class: clsx(inputClass()),
              type: "number",
              value,
              min,
              max,
              step,
              placeholder,
              required,
              ...rest
            },
            void 0,
            void 0,
            void 0,
            4
          )}/>`);
        } else if (type == "boolean") {
          $$renderer3.push(`<!--[4--><a${attributes({
            class: `button ${stringify(sizeClass)} ${value ? "is-success" : "is-danger"}`,
            ...rest
          })}>${escape_html(value)}</a>`);
        } else {
          $$renderer3.push(`<!--[-1--><input${attributes(
            {
              id,
              class: clsx(inputClass()),
              type,
              value,
              placeholder,
              required,
              pattern,
              ...rest
            },
            void 0,
            void 0,
            void 0,
            4
          )}/>`);
        }
        $$renderer3.push(`<!--]--></p></div>`);
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, {
      placeholder,
      type,
      label,
      value,
      sizeClass,
      labelClass,
      min,
      max,
      step,
      isExpanded,
      accept,
      showUploadButton,
      pattern,
      required
    });
  });
}
function Tab($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      classSize = "is-small",
      onselect = (e) => {
      },
      tabs = [],
      active = 0,
      children
    } = $$props;
    $$renderer2.push(`<div${attr_class(`tabs is-boxed ${stringify(classSize)} tab-margin`)} role="tablist" aria-label="Tabs"><ul><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let item = each_array[i];
      $$renderer2.push(`<li${attr_class(clsx(active === i ? "is-active" : ""))} role="presentation"><a role="tab"${attr("id", `tab-${stringify(i)}`)}${attr("aria-selected", active === i)}${attr("aria-controls", `tabpanel-${stringify(i)}`)}${attr("aria-disabled", item.disabled || false)}${attr("tabindex", active === i ? 0 : -1)}>`);
      if (item.disabled) {
        $$renderer2.push(`<!--[0--><span class="icon is-small"><i class="fa-solid fa-ban" aria-hidden="true"></i></span> <span>${escape_html(item.label)}</span>`);
      } else if (item.classIcon) {
        $$renderer2.push(`<!--[1--><span class="icon is-small"><i${attr_class(clsx(item.classIcon))} aria-hidden="true"></i></span> <span>${escape_html(item.label)}</span>`);
      } else {
        $$renderer2.push(`<!--[-1-->${escape_html(item.label)}`);
      }
      $$renderer2.push(`<!--]--></a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <!--[-->`);
    const each_array_1 = ensure_array_like(tabs);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let tab = each_array_1[i];
      if (tab.component && active === i && !tab.disabled) {
        $$renderer2.push(`<!--[0--><div${attr("id", `tabpanel-${stringify(i)}`)} role="tabpanel"${attr("aria-labelledby", `tab-${stringify(i)}`)}>`);
        tab.component($$renderer2);
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { classSize, tabs, active });
  });
}
function EditorCode($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let code2 = fallback($$props["code"], "");
    let left = fallback($$props["left"], null);
    let right = fallback($$props["right"], null);
    let lang = fallback($$props["lang"], "json");
    let showFormat = fallback($$props["showFormat"], false);
    let showSelectLang = fallback($$props["showSelectLang"], false);
    let isReadOnly = fallback($$props["isReadOnly"], false);
    let showHiddenButton = fallback($$props["showHiddenButton"], true);
    let showResetButton = fallback($$props["showResetButton"], false);
    let showCode = fallback($$props["showCode"], true);
    let onchange = fallback($$props["onchange"], null);
    let editorView = null;
    let formatError = false;
    let debounceTimer = null;
    ({
      js: javascript(),
      json: json(),
      html: xml(),
      sql: sql(),
      xml: xml()
    });
    const listLangs = [
      { label: "None", value: "none", prettier: "", plugins: [] },
      {
        label: "HTML",
        value: "html",
        prettier: "html",
        plugins: [prettierPluginHtml]
      },
      {
        label: "Javascript",
        value: "js",
        prettier: "babel",
        plugins: [prettierPluginBabel, Estree]
      },
      {
        label: "JSON",
        value: "json",
        prettier: "json-stringify",
        plugins: [prettierPluginBabel, Estree]
      },
      {
        label: "SQL",
        value: "sql",
        prettier: "sql",
        plugins: [prettierPluginSql]
      },
      {
        label: "XML",
        value: "xml",
        prettier: "html",
        plugins: [prettierPluginHtml]
      },
      { label: "String", value: "string", prettier: "", plugins: [] },
      { label: "Number", value: "number", prettier: "", plugins: [] }
    ];
    function getPrettierParserFor(langValue) {
      const found = listLangs.find((l) => l.value === langValue);
      return found ? found.prettier : "";
    }
    onDestroy(() => {
      clearTimeout(debounceTimer);
    });
    function setCode(newCode) {
      code2 = newCode;
    }
    function getCode() {
      try {
        if (!editorView) return code2;
        const text = editorView.state.doc.toString();
        if (lang === "json") return JSON.parse(text);
        return text;
      } catch (err) {
        formatError = true;
        return code2;
      }
    }
    function reset() {
      return;
    }
    function r01($$renderer3) {
      $$renderer3.push(`<div class="field has-addons">`);
      if (showSelectLang) {
        $$renderer3.push(`<!--[0--><p class="control"><button${attr("disabled", isReadOnly, true)} class="button is-static is-small">Lang</button></p> <p class="control"><span${attr_class(`select is-small ${formatError ? "is-danger" : " "}`)}>`);
        $$renderer3.select({ disabled: isReadOnly, value: lang }, ($$renderer4) => {
          $$renderer4.push(`<!--[-->`);
          const each_array = ensure_array_like(listLangs);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let ll = each_array[$$index];
            $$renderer4.option({ value: ll.value }, ($$renderer5) => {
              $$renderer5.push(`${escape_html(ll.label)}`);
            });
          }
          $$renderer4.push(`<!--]-->`);
        });
        $$renderer3.push(`</span></p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (showFormat && getPrettierParserFor(lang)) {
        $$renderer3.push(`<!--[0--><p class="control"><button${attr("disabled", isReadOnly, true)}${attr_class(`button is-small ${formatError ? "is-danger" : " "}`)}><span class="icon is-small">`);
        if (formatError) {
          $$renderer3.push(`<!--[0--><i class="fa-solid fa-triangle-exclamation"></i>`);
        } else {
          $$renderer3.push(`<!--[-1--><i class="fa-solid fa-check"></i>`);
        }
        $$renderer3.push(`<!--]--></span> <span>Format ${escape_html(!showSelectLang ? lang.toUpperCase() : "")}</span></button></p>`);
      } else if (showFormat && lang === "number") {
        $$renderer3.push(`<!--[1--><p class="control"><button${attr("disabled", isReadOnly, true)}${attr_class(`button is-small ${formatError ? "is-danger" : ""}`)}><span class="icon is-small">`);
        if (formatError) {
          $$renderer3.push(`<!--[0--><i class="fa-solid fa-triangle-exclamation"></i>`);
        } else {
          $$renderer3.push(`<!--[-1--><i class="fa-solid fa-check"></i>`);
        }
        $$renderer3.push(`<!--]--></span> <span>Parser ${escape_html(!showSelectLang ? lang.toUpperCase() : "")}</span></button></p>`);
      } else {
        $$renderer3.push(`<!--[-1--><p class="control"><button disabled=""${attr_class(`button is-small ${formatError ? "is-danger" : " "}`)}><span class="icon is-small"><i class="fa-solid fa-ban"></i></span> <span>Format ${escape_html(!showSelectLang ? lang.toUpperCase() : "")}</span></button></p>`);
      }
      $$renderer3.push(`<!--]--></div> <div class="field has-addons">`);
      if (showResetButton) {
        $$renderer3.push(`<!--[0--><p class="control"><button${attr("disabled", isReadOnly, true)} class="button is-small"><span class="icon is-small"><i class="fa-solid fa-rotate-left"></i></span> <span>Reset</span></button></p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (showHiddenButton) {
        $$renderer3.push(`<!--[0--><p class="control"><button title="Hide or show Code" class="button is-small"><span class="icon is-small">`);
        if (showCode) {
          $$renderer3.push(`<!--[0--><i class="fa-solid fa-eye-slash"></i>`);
        } else {
          $$renderer3.push(`<!--[-1--><i class="fa-solid fa-eye"></i>`);
        }
        $$renderer3.push(`<!--]--></span></button></p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    Level($$renderer2, { left: [left], right: [right, r01] });
    $$renderer2.push(`<!----> <div${attr_class(clsx(showCode ? "" : "is-hidden"))}><div></div></div>`);
    bind_props($$props, {
      code: code2,
      left,
      right,
      lang,
      showFormat,
      showSelectLang,
      isReadOnly,
      showHiddenButton,
      showResetButton,
      showCode,
      onchange,
      setCode,
      getCode,
      reset
    });
  });
}
function BasicSelect($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      label = "",
      isExpanded = false,
      option = "",
      options = [{ id: "TEST", value: `TEST`, enabled: true }],
      css_class = " is-small ",
      onselect = (s) => {
      }
    } = $$props;
    function handleClick() {
      onselect({ value: option });
    }
    $$renderer2.push(`<div class="field has-addons">`);
    if (label && label.length > 0) {
      $$renderer2.push(`<!--[0--><p class="control"><a${attr_class(`button is-static ${stringify(css_class)}`)}>${escape_html(label)}</a></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p${attr_class(`control ${isExpanded ? "is-expanded" : ""}`)}><span${attr_class(`select ${stringify(css_class)}`)}>`);
    $$renderer2.select({ value: option, onchange: handleClick }, ($$renderer3) => {
      if (options && Array.isArray(options)) {
        $$renderer3.push(`<!--[0--><!--[-->`);
        const each_array = ensure_array_like(options);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let h = each_array[$$index];
          $$renderer3.option({ value: h.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(h.value)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</span></p></div>`);
    bind_props($$props, { label, isExpanded, option, options, css_class });
  });
}
function SlideFullScreen($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { show = false, children } = $$props;
    $$renderer2.push(`<div><div class="overlay svelte-1bm86z2"${attr_style(`width: ${show ? "100%" : "0%"};`)}><div class="overlay-content box svelte-1bm86z2">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div></div></div>`);
    bind_props($$props, { show });
  });
}
function Kv($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data = [], onchange = () => {
    }, enableFileType = false } = $$props;
    let fieldTypes = [
      { id: 1, text: `Text` },
      { id: 2, text: `Text Multiline` },
      { id: 3, text: `File` }
    ];
    let fieldTypesVisible = derived(() => {
      return enableFileType ? fieldTypes : fieldTypes.filter((p) => p.id !== 3);
    });
    function add_item($$renderer3) {
      $$renderer3.push(`<div class="field has-addons"><p class="control"><button class="button is-small"><span class="icon"><i class="fa-solid fa-plus"></i></span> <span>Add Parameter</span></button></p></div>`);
    }
    Level($$renderer2, { right: [add_item] });
    $$renderer2.push(`<!----> `);
    if (Array.isArray(data)) {
      $$renderer2.push(`<!--[0--><!--[-->`);
      const each_array = ensure_array_like(data);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let item = each_array[index];
        $$renderer2.push(`<div class="field has-addons"><p class="control">`);
        if (item.enabled) {
          $$renderer2.push(`<!--[0--><button class="button is-small is-success"><span class="icon"><i class="fa-solid fa-square-check"></i></span></button>`);
        } else {
          $$renderer2.push(`<!--[-1--><button class="button is-small"><span class="icon"><i class="fa-regular fa-square-check"></i></span></button>`);
        }
        $$renderer2.push(`<!--]--></p> <p class="control"><input class="input is-small" type="text" placeholder="Param name"${attr("value", item.key)}/></p> `);
        if (item.type === 2) {
          $$renderer2.push(`<!--[0--><p class="control is-expanded"><textarea class="textarea is-small" placeholder="Multiline Value">`);
          const $$body = escape_html(item.value);
          if ($$body) {
            $$renderer2.push(`${$$body}`);
          } else {
            $$renderer2.push(`
					`);
          }
          $$renderer2.push(`</textarea></p>`);
        } else if (item.type === 3) {
          $$renderer2.push(`<!--[1--><p class="control file is-expanded"><input class="input is-small" type="file"${attr("multiple", false, true)}/></p>`);
        } else {
          $$renderer2.push(`<!--[-1--><p class="control is-expanded"><input class="input is-small" type="text" placeholder="Value"${attr("value", item.value)}/></p>`);
        }
        $$renderer2.push(`<!--]--> <p class="control"><span class="select is-small">`);
        $$renderer2.select(
          {
            value: item.type,
            onchange: () => {
              if (item.type === 3) {
                item.value = void 0;
              } else if (typeof item.value !== "string") {
                item.value = "";
              }
              onchange(data);
            }
          },
          ($$renderer3) => {
            $$renderer3.push(`<!--[-->`);
            const each_array_1 = ensure_array_like(fieldTypesVisible());
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let fieldType = each_array_1[$$index];
              $$renderer3.option({ value: fieldType.id }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(fieldType.text)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          }
        );
        $$renderer2.push(`</span></p> <p class="control"><button class="button is-small is-danger" title="Delete"><span class="icon"><i class="fa-solid fa-trash-can"></i></span></button></p></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data });
  });
}
function tab_none($$renderer) {
  $$renderer.push(`<label class="label is-small">No Authentication Selected</label>`);
}
function Auth($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      data = {
        selection: 0,
        basic: { username: "", password: "" },
        bearer: { token: "" }
      },
      onchange = () => {
      }
    } = $$props;
    let username = data?.basic?.username || "";
    let password = data?.basic?.password || "";
    let token = data?.bearer?.token || "";
    let tabList = [
      { label: "None", component: tab_none },
      { label: "Basic", component: tab_basic },
      { label: "Bearer", component: tab_bearer }
    ];
    function tab_basic($$renderer3) {
      if (data != null) {
        $$renderer3.push(`<!--[0--><div><div class="field"><label class="label is-small">Username</label> `);
        if (data && data.basic) {
          $$renderer3.push(`<!--[0--><div class="control has-icons-left has-icons-right"><input class="input is-small" type="text" placeholder="Username"${attr("value", username)}/> <span class="icon is-small is-left"><i class="fa-solid fa-user"></i></span></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> <div class="field"><label class="label is-small">Password</label> `);
        if (data && data.basic) {
          $$renderer3.push(`<!--[0--><div class="control has-icons-left has-icons-right"><input class="input is-small" type="text" placeholder="Password"${attr("value", password)}/> <span class="icon is-small is-left"><i class="fa-solid fa-key"></i></span></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_bearer($$renderer3) {
      if (data != null) {
        $$renderer3.push(`<!--[0--><div><div class="field"><label class="label is-small">Token</label> <div class="control">`);
        if (data && data.bearer) {
          $$renderer3.push(`<!--[0--><textarea class="textarea is-small" placeholder="Token">`);
          const $$body = escape_html(token);
          if ($$body) {
            $$renderer3.push(`${$$body}`);
          }
          $$renderer3.push(`</textarea>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (data?.selection != null) {
        $$renderer3.push("<!--[0-->");
        Tab($$renderer3, {
          onselect: () => {
            data = data;
          },
          get tabs() {
            return tabList;
          },
          set tabs($$value) {
            tabList = $$value;
            $$settled = false;
          },
          get active() {
            return data.selection;
          },
          set active($$value) {
            data.selection = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { data });
  });
}
function Body($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      data = {
        selection: 0,
        json: { code: {} },
        xml: { code: "" },
        text: {},
        form: [],
        urlencoded: []
      },
      onchange = () => {
      }
    } = $$props;
    let tabList = [
      { label: "JSON", component: tab_json },
      { label: "XML", disabled: false, component: tab_xml },
      { label: "Text", disabled: false, component: tab_text },
      { label: "Form", disabled: false, component: tab_form },
      {
        label: "Form-Encode",
        disabled: false,
        component: tab_form_encode
      },
      { label: "Binary", disabled: true, component: tab_binary }
    ];
    function getCode() {
    }
    function reset() {
    }
    function defaultValues() {
      if (!data) {
        data = {
          selection: 0,
          json: { code: {} },
          xml: { code: "" },
          text: {}
        };
      }
      if (data && data.json == null) {
        data.json = { code: {} };
      }
      if (data && data.json && data.json.code == null) {
        data.json.code = {};
      }
      if (data && data.xml == null) {
        data.xml = {};
      }
      if (data && data.xml && data.xml.code == null) {
        data.xml.code = "";
      }
      if (data && data.text == null) {
        data.text = { value: "" };
      }
      if (data && data.text.value && data.text.value == null) {
        data.text.value = "";
      }
      if (data && data.selection == null) {
        data.selection = 0;
      }
      if (data && data.form == null) {
        data.form = [];
      }
      if (data && data.urlencoded == null) {
        data.urlencoded = [];
      }
    }
    function internalOnChange() {
      onchange(data);
    }
    function tab_json($$renderer3) {
      $$renderer3.push(`<div>`);
      if (data?.json?.code) {
        $$renderer3.push("<!--[0-->");
        {
          let failed = function($$renderer4, error) {
            $$renderer4.push(`<div><span class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>${escape_html(error.message)}</span></span></div>`);
          };
          $$renderer3.boundary({ failed }, ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            {
              EditorCode($$renderer4, {
                lang: "json",
                showFormat: true,
                onchange: () => {
                  internalOnChange();
                },
                get code() {
                  return data.json.code;
                },
                set code($$value) {
                  data.json.code = $$value;
                  $$settled = false;
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    function tab_xml($$renderer3) {
      if (data && data.xml) {
        $$renderer3.push("<!--[0-->");
        {
          let failed = function($$renderer4, error) {
            $$renderer4.push(`<div><span class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>${escape_html(error.message)}</span></span></div>`);
          };
          $$renderer3.boundary({ failed }, ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            {
              EditorCode($$renderer4, {
                lang: "xml",
                onchange: () => {
                  internalOnChange();
                },
                get code() {
                  return data.xml.code;
                },
                set code($$value) {
                  data.xml.code = $$value;
                  $$settled = false;
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_text($$renderer3) {
      if (data) {
        $$renderer3.push(`<!--[0--><div><div class="field"><label class="label is-small">Content</label> <div class="control">`);
        if (data && data.text) {
          $$renderer3.push(`<!--[0--><textarea class="textarea is-small" placeholder="Content">`);
          const $$body = escape_html(data.text.value);
          if ($$body) {
            $$renderer3.push(`${$$body}`);
          }
          $$renderer3.push(`</textarea>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_form_encode($$renderer3) {
      if (data && data.urlencoded) {
        $$renderer3.push(`<!--[0--><div>`);
        Kv($$renderer3, {
          onchange: () => {
            internalOnChange();
          },
          get data() {
            return data.urlencoded;
          },
          set data($$value) {
            data.urlencoded = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_form($$renderer3) {
      if (data && data.form) {
        $$renderer3.push("<!--[0-->");
        {
          let failed = function($$renderer4, error) {
            $$renderer4.push(`<div><span class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>${escape_html(error.message)}</span></span></div>`);
          };
          $$renderer3.boundary({ failed }, ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            {
              Kv($$renderer4, {
                enableFileType: true,
                onchange: () => {
                  internalOnChange();
                },
                get data() {
                  return data.form;
                },
                set data($$value) {
                  data.form = $$value;
                  $$settled = false;
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_binary($$renderer3) {
      if (data) {
        $$renderer3.push(`<!--[0--><div>`);
        FileUpload($$renderer3, { showUploadButton: false });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (data) {
        $$renderer3.push("<!--[0-->");
        Tab($$renderer3, {
          active: data.selection,
          onselect: (r) => {
            defaultValues();
            data.selection = r.index;
          },
          get tabs() {
            return tabList;
          },
          set tabs($$value) {
            tabList = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { data, getCode, reset });
  });
}
function JSONView($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      jsonObject = {},
      indent = 2,
      showCopy = true,
      showLineNumbers = true,
      showBox = true,
      maxHeight = 0,
      emptyMessage = "Sin datos",
      label
    } = $$props;
    function formatJson(obj) {
      if (obj === void 0 || obj === null) return "";
      if (typeof obj === "string") {
        try {
          return JSON.stringify(JSON.parse(obj), null, indent);
        } catch {
          return obj;
        }
      }
      try {
        return JSON.stringify(obj, null, indent);
      } catch {
        return String(obj);
      }
    }
    function syntaxHighlight(json2) {
      if (!json2) return "";
      json2 = json2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return json2.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function(match) {
        let cls = "number";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "key" : "string";
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return `<span class="jv-${cls}">${match}</span>`;
      });
    }
    function addLineNumbers(html2) {
      const lines = html2.split("\n");
      return lines.map((line, i) => {
        const num = String(i + 1).padStart(String(lines.length).length, " ");
        return `<span class="jv-line-num">${num}</span>${line}`;
      }).join("\n");
    }
    let formattedText = derived(() => formatJson(jsonObject));
    let highlightedHtml = derived(() => formatJson(jsonObject) ? syntaxHighlight(formattedText()) : "");
    let displayHtml = derived(() => highlightedHtml() ? showLineNumbers ? addLineNumbers(highlightedHtml()) : highlightedHtml() : "");
    let isEmpty = derived(() => jsonObject === void 0 || jsonObject === null || typeof jsonObject === "object" && !Array.isArray(jsonObject) && Object.keys(jsonObject).length === 0 || typeof jsonObject === "string" && jsonObject.trim() === "");
    function content($$renderer3) {
      $$renderer3.push(`<div${attr_class("jv-container svelte-o5guq5", void 0, { "jv-with-box": showBox })}>`);
      if (label || showCopy) {
        $$renderer3.push(`<!--[0--><div class="jv-header svelte-o5guq5">`);
        if (label) {
          $$renderer3.push(`<!--[0--><span class="jv-label svelte-o5guq5">${escape_html(label)}</span>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (showCopy && !isEmpty()) {
          $$renderer3.push(`<!--[0--><button class="button is-small is-light jv-copy-btn svelte-o5guq5" title="Copiar JSON"><span class="icon is-small"><i${attr_class(clsx("fa-regular fa-copy"))}></i></span> <span>${escape_html("Copiar")}</span></button>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="jv-scroll svelte-o5guq5"${attr_style(maxHeight > 0 ? `max-height: ${maxHeight}px; overflow-y: auto;` : "")}>`);
      if (isEmpty()) {
        $$renderer3.push(`<!--[0--><div class="jv-empty svelte-o5guq5"><i class="fa-regular fa-file-code svelte-o5guq5"></i> <span>${escape_html(emptyMessage)}</span></div>`);
      } else {
        $$renderer3.push(`<!--[-1--><pre class="jv-pre svelte-o5guq5">${html(displayHtml())}</pre>`);
      }
      $$renderer3.push(`<!--]--></div></div>`);
    }
    if (showBox) {
      $$renderer2.push(`<!--[0--><div class="box">`);
      content($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      content($$renderer2);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { jsonObject });
  });
}
const METHODS = [
  { method: "CONNECT", label: "CONNECT" },
  { method: "DELETE", label: "DELETE" },
  { method: "GET", label: "GET" },
  { method: "HEAD", label: "HEAD" },
  { method: "OPTIONS", label: "OPTIONS" },
  { method: "POST", label: "POST" },
  { method: "PATCH", label: "PATCH" },
  { method: "PUT", label: "PUT" },
  { method: "TRACE", label: "TRACE" }
];
const RESPONSES_AS = [
  { as: "json", label: "JSON" },
  { as: "datatable", label: "Table" },
  { as: "text", label: "Text" }
];
function RESTTester($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      url = "",
      method = "GET",
      limitSizeResponseView = 2e4,
      methodDisabled = false,
      data = {
        query: [{ enabled: true, key: "", value: "" }],
        body: {
          selection: 0,
          js: {},
          xml: { code: "" },
          text: {},
          json: { code: {} },
          form: [],
          urlencoded: []
        },
        headers: [{ enabled: false, key: "", value: "" }],
        auth: { selection: 0, basic: {}, bearer: {} }
      },
      onchange = () => {
      }
    } = $$props;
    let response_as = "json";
    let active_tab = 0;
    let data_result = { data: "", sizeKBResponse: -1 };
    let timerInterval;
    const methods = METHODS;
    const responses_as = RESPONSES_AS;
    let tabList = [
      {
        label: "Query Parameters",
        isActive: true,
        component: tab_query
      },
      { label: "HTTP Headers", component: tab_headers },
      { label: "Auth", component: tab_auth },
      { label: "Body", component: tab_body },
      { label: "Result", component: tab_result }
    ];
    let last_data = "";
    let timeoutChangeData;
    let icon_download_button = derived(() => {
      let class_icon = " fa-solid fa-file-arrow-down ";
      let ct = classifyContent(data_result.contentType);
      if (ct == "pdf") {
        class_icon = " fa-regular fa-file-pdf ";
      } else if (ct == "image") {
        class_icon = " fa-regular fa-image ";
      } else if (ct == "text") {
        class_icon = " fa-regular fa-file-lines ";
      }
      return class_icon;
    });
    let icon_headers_button = derived(() => "fa-solid fa-eye");
    function classifyContent(contentType) {
      const type = contentType ? contentType.toLowerCase() : "";
      if (type.includes("application/json")) return "json";
      if (type.includes("text/") && !type.includes("html")) return "text";
      if (type.includes("image/")) return "image";
      if (type.includes("application/pdf")) return "pdf";
      if (type.includes("application/") || type.includes("octet-stream")) return "bin";
      return "";
    }
    function internalOnChange() {
      const data_to_emit = {
        data: { ...data },
        url: snapshot(url),
        method: snapshot(method),
        last_response: data_result
      };
      let new_data = JSON.stringify(data_to_emit);
      if (new_data !== last_data) {
        last_data = new_data;
        onchange(data_to_emit);
      }
    }
    function defaultValues() {
      if (data == null) {
        data = { query: [], headers: [], auth: { selection: 0 }, body: {} };
      }
      if (data && data.auth == null) {
        data.auth = { selection: 0 };
      }
      if (data && data.auth && data.auth.selection == null) {
        data.auth.selection = 0;
      }
      if (data && data.body == null) {
        data.body = { selection: 0, urlencoded: [] };
      }
      if (data && data.body && data.body.selection == null) {
        data.body.selection = 0;
      }
      if (data && data.body && data.body.urlencoded == null) {
        data.body.urlencoded = [];
      }
      if (data && data.query == null) {
        data.query = [];
      }
      if (data && data.headers == null) {
        data.headers = [];
      }
      if (!method) {
        method = "GET";
      }
      if (!url) {
        url = "";
      }
    }
    onDestroy(() => {
      clearTimeout(timeoutChangeData);
      clearInterval(timerInterval);
    });
    function tab_query($$renderer3) {
      if (data?.query != null) {
        $$renderer3.push("<!--[0-->");
        {
          let failed = function($$renderer4, error) {
            $$renderer4.push(`<div><span class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>${escape_html(error.message)}</span></span></div>`);
          };
          $$renderer3.boundary({ failed }, ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            {
              Kv($$renderer4, {
                onchange: () => {
                  internalOnChange();
                },
                get data() {
                  return data.query;
                },
                set data($$value) {
                  data.query = $$value;
                  $$settled = false;
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_headers($$renderer3) {
      if (data?.headers != null) {
        $$renderer3.push("<!--[0-->");
        {
          let failed = function($$renderer4, error) {
            $$renderer4.push(`<div><span class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>${escape_html(error.message)}</span></span></div>`);
          };
          $$renderer3.boundary({ failed }, ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            {
              Kv($$renderer4, {
                onchange: () => {
                  internalOnChange();
                },
                get data() {
                  return data.headers;
                },
                set data($$value) {
                  data.headers = $$value;
                  $$settled = false;
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_auth($$renderer3) {
      if (data?.auth != null) {
        $$renderer3.push("<!--[0-->");
        {
          let failed = function($$renderer4, error) {
            $$renderer4.push(`<div><span class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>${escape_html(error.message)}</span></span></div>`);
          };
          $$renderer3.boundary({ failed }, ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            {
              Auth($$renderer4, {
                onchange: () => {
                  internalOnChange();
                },
                get data() {
                  return data.auth;
                },
                set data($$value) {
                  data.auth = $$value;
                  $$settled = false;
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_body($$renderer3) {
      if (data?.body != null) {
        $$renderer3.push("<!--[0-->");
        {
          let failed = function($$renderer4, error) {
            $$renderer4.push(`<div><span class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>${escape_html(error.message)}</span></span></div>`);
          };
          $$renderer3.boundary({ failed }, ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            {
              Body($$renderer4, {
                onchange: () => {
                  internalOnChange();
                },
                get data() {
                  return data.body;
                },
                set data($$value) {
                  data.body = $$value;
                  $$settled = false;
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_result($$renderer3) {
      $$renderer3.push(`<div class="field is-grouped is-grouped-multiline"><div class="control"><div class="tags has-addons"><span${attr_class(`tag ${"is-dark"}`)}>Status</span> `);
      {
        $$renderer3.push(`<!--[-1--><span class="tag"></span>`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="control"><div class="tags has-addons"><span${attr_class(`tag ${"is-dark"}`)}>Status Text</span> `);
      {
        $$renderer3.push(`<!--[-1--><span class="tag"></span>`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="control"><div class="tags has-addons"><span${attr_class(`tag ${"is-dark"}`)}>Ok</span> `);
      {
        $$renderer3.push(`<!--[-1--><span class="tag"></span>`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="control"><div class="tags has-addons"><span class="tag is-dark">MimeType</span> `);
      if (data_result && data_result.contentType) {
        $$renderer3.push(`<!--[0--><span class="tag">${escape_html(data_result.contentType)}</span>`);
      } else {
        $$renderer3.push(`<!--[-1--><span class="tag"></span>`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="control"><div class="tags has-addons"><span class="tag is-dark">Time</span> `);
      {
        $$renderer3.push(`<!--[-1--><span class="tag">ms</span>`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="control"><div class="tags has-addons"><span${attr_class(`tag ${data_result.sizeKBResponse > limitSizeResponseView ? "is-danger" : "is-dark"} `)}>Size</span> `);
      if (data_result.sizeKBResponse) {
        $$renderer3.push(`<!--[0--><span class="tag">${escape_html((+data_result.sizeKBResponse).toFixed(2))} KB</span>`);
      } else {
        $$renderer3.push(`<!--[-1--><span class="tag">KB</span>`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="control"><button class="button is-small"><span class="icon"><i${attr_class(clsx(icon_headers_button()), "svelte-1srha5r")}></i></span> <span>Headers</span></button></div> <div class="control"><button${attr_class(`button is-small ${data_result.sizeKBResponse > 0 ? "is-success" : ""}`)}><span class="icon"><i${attr_class(clsx(icon_download_button()), "svelte-1srha5r")}></i></span> <span>Download</span></button></div></div> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div>`);
      if (Number(data_result.sizeKBResponse) < Number(limitSizeResponseView)) {
        $$renderer3.push("<!--[0-->");
        if (data_result.fileExtension == "json" && data_result.data) {
          $$renderer3.push("<!--[1-->");
          JSONView($$renderer3, {
            get jsonObject() {
              return data_result.data;
            },
            set jsonObject($$value) {
              data_result.data = $$value;
              $$settled = false;
            }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (data_result.error) {
        $$renderer3.push(`<!--[0--><div class="notification is-danger">${escape_html(data_result.error)}</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="block block_marg svelte-1srha5r"><div class="columns"><div class="column is-half"><div class="field has-addons"><p class="control"><a class="button is-static is-small">Url</a></p> <p class="control is-expanded"><input class="input is-small is-expanded" type="text" placeholder="URL"${attr("value", url)}/></p></div></div> <div class="column"><nav class="level"><div class="level-right"><span class="level-item"><div class="field has-addons"><p class="control"><button class="button is-static is-small">Method:</button></p> <p class="control"><span class="select is-small">`);
      $$renderer3.select({ value: method, disabled: methodDisabled }, ($$renderer4) => {
        $$renderer4.push(`<!--[-->`);
        const each_array = ensure_array_like(methods);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let m = each_array[$$index];
          $$renderer4.option({ value: m.method }, ($$renderer5) => {
            $$renderer5.push(`${escape_html(m.label)}`);
          });
        }
        $$renderer4.push(`<!--]-->`);
      });
      $$renderer3.push(`</span></p></div></span> <span class="level-item"><div class="field has-addons"><p class="control"><button class="button is-static is-small">Show as:</button></p> <p class="control"><span class="select is-small">`);
      $$renderer3.select({ value: response_as }, ($$renderer4) => {
        $$renderer4.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(responses_as);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let ras = each_array_1[$$index_1];
          $$renderer4.option({ value: ras.as }, ($$renderer5) => {
            $$renderer5.push(`${escape_html(ras.label)}`);
          });
        }
        $$renderer4.push(`<!--]-->`);
      });
      $$renderer3.push(`</span></p></div></span> <span class="level-item"><button${attr_class(`button is-small ${"is-success"} is-outlined`)}><span class="icon is-small">`);
      {
        $$renderer3.push(`<!--[-1--><i class="fa-solid fa-play"></i>`);
      }
      $$renderer3.push(`<!--]--></span> <span>${escape_html("Execute")}</span></button></span></div></nav></div></div> `);
      if (data) {
        $$renderer3.push("<!--[0-->");
        Tab($$renderer3, {
          onselect: (s) => {
            defaultValues();
          },
          get tabs() {
            return tabList;
          },
          set tabs($$value) {
            tabList = $$value;
            $$settled = false;
          },
          get active() {
            return active_tab;
          },
          set active($$value) {
            active_tab = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push(`<!--[-1--><div><span class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>There is no data to start.</span></span></div>`);
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { url, method, limitSizeResponseView, methodDisabled, data });
  });
}
function Notifications2($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let list_notify = [];
    notifications_store.subscribe((value) => {
      list_notify = value;
    });
    let visibleCount = derived(() => list_notify.filter((n) => !n.hidden).length);
    let overflowCount = derived(() => Math.max(0, visibleCount() - 5));
    const ICONS = {
      success: "fa-check-circle",
      danger: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle"
    };
    const COLOR_MAP = {
      success: "#23d160",
      danger: "#ff3860",
      warning: "#ffdd57",
      info: "#3e8ed0"
    };
    function getIcon(color) {
      return ICONS[color] || ICONS.info;
    }
    function getAccentColor(color) {
      return COLOR_MAP[color] || COLOR_MAP.info;
    }
    $$renderer2.push(`<div class="notifications-container svelte-qo16om" role="alert" aria-live="polite"><!--[-->`);
    const each_array = ensure_array_like(list_notify);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let s = each_array[$$index];
      if (!s.hidden) {
        $$renderer2.push(`<!--[0--><div${attr_class(`notification-toast is-${stringify(s.color)}`, "svelte-qo16om")} role="status"><div class="notification-accent svelte-qo16om"${attr_style(`background-color: ${stringify(getAccentColor(s.color))};`)}></div> <div class="notification-icon svelte-qo16om"><i${attr_class(`fas ${stringify(getIcon(s.color))}`, "svelte-qo16om")}${attr_style(`color: ${stringify(getAccentColor(s.color))};`)}></i></div> <div class="notification-content svelte-qo16om">`);
        if (s.title) {
          $$renderer2.push(`<!--[0--><div class="notification-title svelte-qo16om">${escape_html(s.title)}</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="notification-message svelte-qo16om">${escape_html(s.message)}</div> <div class="notification-progress svelte-qo16om"><div class="notification-progress-bar svelte-qo16om"${attr_style(`width: ${stringify(Math.max(0, s._remaining / s.timeout * 100))}%;`)}></div></div></div> <button class="notification-close svelte-qo16om" aria-label="Close notification"><i class="fas fa-times"></i></button></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    if (overflowCount() > 0) {
      $$renderer2.push(`<!--[0--><div class="notification-overflow svelte-qo16om">+${escape_html(overflowCount())} more</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function TextArea$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = "",
      label = void 0,
      sizeClass = "is-small",
      isExpanded = true,
      placeholder = void 0,
      rows = 3,
      $$slots,
      $$events,
      ...rest
    } = $$props;
    $$renderer2.push(`<div${attr_class(`field ${label != null ? "has-label" : ""}`, "svelte-8iih8y")}>`);
    if (label != null) {
      $$renderer2.push(`<!--[0--><p class="control svelte-8iih8y"><a${attr_class(`button is-static ${stringify(sizeClass)} label-textarea`, "svelte-8iih8y")}>${escape_html(label)}</a></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p${attr_class(`control ${isExpanded ? "is-expanded" : ""}`, "svelte-8iih8y")}><textarea${attributes(
      {
        class: `textarea ${stringify(sizeClass)} ${label != null ? "textarea-with-label" : ""}`,
        placeholder,
        rows,
        ...rest
      },
      "svelte-8iih8y"
    )}>`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></p></div>`);
    bind_props($$props, { value, label, sizeClass, isExpanded, placeholder, rows });
  });
}
function iconFallback$1($$renderer) {
  $$renderer.push(`<i class="fas fa-cube svelte-154qom8"></i>`);
}
function MenuSide($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      logoText = "LOGO TEXT",
      logoIcon: logoIcon2 = iconFallback$1,
      isMobile = false,
      sidebarState = "icons-only",
      menu = [
        {
          title: "GRUP 01",
          items: [
            {
              label: "Demo Font",
              icon: " fa-brands fa-font-awesome ",
              link: ""
            },
            {
              label: "Demo Face",
              icon: " fa-brands fa-facebook ",
              link: ""
            }
          ]
        }
      ]
    } = $$props;
    let sidebarActive = false;
    let currentActiveMenu = 0;
    function toggleSidebar() {
      if (isMobile) {
        sidebarActive = !sidebarActive;
      } else {
        if (sidebarState === "icons-only") {
          sidebarState = "expanded";
        } else if (sidebarState === "expanded") {
          sidebarState = "hidden";
        } else {
          sidebarState = "icons-only";
        }
      }
    }
    function snp_menu_item($$renderer3, item) {
      if (item && !item.hidden) {
        $$renderer3.push(`<!--[0--><li${attr_class(clsx(item.enabled === false ? "disabled-item" : ""), "svelte-154qom8")}><a${attr("title", item.label)}${attr_class(clsx(currentActiveMenu == item.internal_id ? "is-active" : ""), "svelte-154qom8")}><span class="icon-text svelte-154qom8">`);
        if (item.icon && item.icon.length > 0) {
          $$renderer3.push(`<!--[0--><span class="icon svelte-154qom8"><i${attr_class(clsx(item.icon), "svelte-154qom8")}></i></span>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (sidebarState !== "icons-only") {
          $$renderer3.push(`<!--[0--><span class="svelte-154qom8">${escape_html(item.label)}</span>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (sidebarState !== "icons-only" && item.items && item.items.length > 0) {
          $$renderer3.push(`<!--[0--><span class="submenu_arrow svelte-154qom8"><i${attr_class(
            ` ${item.internal_isopen ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-right"}`,
            "svelte-154qom8"
          )}></i></span>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></span></a> `);
        if (sidebarState !== "icons-only" && item.internal_isopen && item.items && item.items.length > 0) {
          $$renderer3.push(`<!--[0--><ul class="svelte-154qom8"><!--[-->`);
          const each_array = ensure_array_like(item.items);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let subitem = each_array[$$index];
            snp_menu_item($$renderer3, subitem);
          }
          $$renderer3.push(`<!--]--></ul>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></li>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function snp_section($$renderer3, section) {
      if (sidebarState !== "icons-only") {
        $$renderer3.push(`<!--[0--><p class="menu-label svelte-154qom8">${escape_html(section.title)}</p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (section.items && section.items.length > 0) {
        $$renderer3.push(`<!--[0--><ul class="menu-list svelte-154qom8"><!--[-->`);
        const each_array_1 = ensure_array_like(section.items);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let menu_item = each_array_1[$$index_1];
          snp_menu_item($$renderer3, menu_item);
        }
        $$renderer3.push(`<!--]--></ul>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    if (sidebarActive) {
      $$renderer2.push(`<!--[0--><div class="overlay active svelte-154qom8"></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <aside${attr_class("sidebar menu svelte-154qom8", void 0, {
      "icons-only": sidebarState === "icons-only",
      "hidden": sidebarState === "hidden",
      "active": sidebarActive
    })}><div class="sidebar-header svelte-154qom8"><a href="#" class="sidebar-logo svelte-154qom8"><div class="logo-icon svelte-154qom8">`);
    if (logoIcon2) {
      $$renderer2.push("<!--[0-->");
      logoIcon2($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push(`<!--[-1--><i class="fas fa-cube svelte-154qom8"></i>`);
    }
    $$renderer2.push(`<!--]--></div> <span class="logo-text svelte-154qom8">${escape_html(logoText)}</span></a></div> <!--[-->`);
    const each_array_2 = ensure_array_like(menu);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let section = each_array_2[$$index_2];
      snp_section($$renderer2, section);
    }
    $$renderer2.push(`<!--]--></aside>`);
    bind_props($$props, {
      logoText,
      logoIcon: logoIcon2,
      isMobile,
      sidebarState,
      menu,
      toggleSidebar
    });
  });
}
function Viewer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      markdown = "",
      content_class = "",
      allow_html = false,
      gfm = true,
      breaks = false,
      showBox = false,
      empty_message = "",
      options = {}
    } = $$props;
    const DANGEROUS_PROTOCOLS = /^(javascript|vbscript|data|file):/i;
    function hasDangerousProtocol(url) {
      if (!url) return true;
      if (!/^[a-z][a-z0-9+.\-]*:/i.test(url.trim())) return false;
      return DANGEROUS_PROTOCOLS.test(url.trim());
    }
    function escapeHtml2(text) {
      return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function createSafeRenderer(allowHtml) {
      const renderer = new Renderer();
      const baseLink = renderer.link.bind(renderer);
      renderer.link = (token) => {
        if (hasDangerousProtocol(token.href)) {
          return renderer.parser.parseInline(token.tokens);
        }
        return baseLink(token);
      };
      const baseImage = renderer.image.bind(renderer);
      renderer.image = (token) => {
        if (hasDangerousProtocol(token.href)) return "";
        return baseImage(token);
      };
      if (!allowHtml) {
        renderer.html = (token) => escapeHtml2(token.text);
      }
      return renderer;
    }
    function renderMarkdown(src) {
      try {
        if (!src || src.trim() === "") return "";
        return marked.parse(src, {
          ...options,
          async: false,
          gfm,
          breaks,
          renderer: createSafeRenderer(allow_html)
        });
      } catch (err) {
        console.error("[MarkdownViewer] Parse error:", err);
        return `<p class="has-text-danger">Error rendering Markdown.</p>`;
      }
    }
    let html_string = derived(() => renderMarkdown(markdown));
    let is_empty = derived(() => !markdown || markdown.trim() === "");
    if (showBox) {
      $$renderer2.push(`<!--[0--><div class="box">`);
      if (is_empty() && empty_message) {
        $$renderer2.push(`<!--[0--><p class="has-text-grey">${escape_html(empty_message)}</p>`);
      } else if (!is_empty()) {
        $$renderer2.push(`<!--[1--><div${attr_class(`content ${stringify(content_class)}`)}>${html(html_string())}</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      if (is_empty() && empty_message) {
        $$renderer2.push(`<!--[0--><p class="has-text-grey">${escape_html(empty_message)}</p>`);
      } else if (!is_empty()) {
        $$renderer2.push(`<!--[1--><div${attr_class(`content ${stringify(content_class)}`)}>${html(html_string())}</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { markdown, content_class });
  });
}
const HEARTBEAT_INTERVAL = 60 * 1e3;
const PONG_TIMEOUT = 10 * 1e3;
const MAX_RECONNECT_DELAY = 30 * 1e3;
class OpenFusionWebsocketClient extends EventTarget {
  /**
   * Creates an instance of OpenFusionWebsocketClient.
   * 
   * @param {string} url - The WebSocket URL to connect to (e.g., 'wss://example.com/socket').
   * @param {Object} [headers={}] - Optional headers. Note: standard browser WebSockets do not support custom headers natively.
   */
  constructor(url, headers = {}) {
    super();
    this.url = url;
    this.headers = headers;
    this.ws = null;
    this.retryCount = 0;
    this.heartbeatTimer = null;
    this.pongTimeoutTimer = null;
    this.connect();
  }
  /**
   * Emits a custom event on this EventTarget instance.
   * 
   * @param {string} type - The name of the event to emit.
   * @param {any} [detail] - Optional data payload attached to the event detail property.
   */
  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
  /**
   * Subscribes to an event emitted by this client (Node.js EventEmitter pattern style).
   * 
   * @param {string} eventName - The name of the event to listen for ('message', 'open', etc.).
   * @param {function(any): void} callback - The callback function executed when the event is emitted. Receives the event `detail` as argument.
   */
  on(eventName, callback) {
    this.addEventListener(eventName, (event) => callback(event.detail));
  }
  /**
   * Unsubscribes from an event.
   * 
   * @param {string} eventName - The name of the event.
   * @param {EventListener} callback - The original callback function to remove.
   */
  off(eventName, callback) {
    this.removeEventListener(eventName, callback);
  }
  /**
   * Establishes the WebSocket connection.
   * Registers internal event handlers for open, message, close, and error events.
   */
  connect() {
    const ws = new WebSocket(this.url);
    this.ws = ws;
    ws.onopen = () => {
      console.log("✅ Conectado al WebSocket");
      this.retryCount = 0;
      this.startHeartbeat();
      this.emit("open", {});
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (err) {
        console.warn("⚠️ Mensaje no JSON recibido:", event.data);
      }
    };
    ws.onclose = (event) => {
      console.log(`🔌 Conexión cerrada (code=${event.code}, reason=${event.reason || "ninguna"})`);
      this.cleanupHeartbeat();
      this.reconnect();
    };
    ws.onerror = (error) => {
      console.error("❌ Error en WebSocket:", error.message);
    };
  }
  /**
   * Starts the heartbeat timer to keep the connection alive by periodically sending `/ping` messages.
   */
  startHeartbeat() {
    this.cleanupHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ channel: "/ping", payload: {} }));
        this.pongTimeoutTimer = setTimeout(() => {
          console.warn("⏰ No se recibió pong a tiempo → Forzando desconexión");
          this.ws.close(4e3, "Pong timeout");
        }, PONG_TIMEOUT);
      }
    }, HEARTBEAT_INTERVAL);
  }
  /**
   * Clears active heartbeat and pong timeout timers.
   */
  cleanupHeartbeat() {
    clearInterval(this.heartbeatTimer);
    clearTimeout(this.pongTimeoutTimer);
  }
  /**
   * Sends a JSON stringified message through the WebSocket if it is open.
   * 
   * @param {Object} message - The message object to be stringified and sent.
   */
  send(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("⚠️ No se puede enviar: conexión no abierta");
    }
  }
  /**
   * Subscribes to a specific channel by sending a `/subscribe` message.
   * 
   * @param {string} channel - The name of the channel to subscribe to.
   */
  subscribe(channel) {
    this.send({
      payload: { channel },
      channel: "/subscribe"
    });
  }
  /**
   * Internal handler for parsing received WebSocket messages.
   * Clears pong timeouts if a `/pong` message is received.
   * Emits a 'message' event for all other data.
   * 
   * @param {Object} data - The parsed message data from the WebSocket.
   * @param {string} [data.channel] - The channel of the message.
   */
  handleMessage(data) {
    if (data.channel === "/pong") {
      console.log("❤️ Pong recibido (heartbeat OK)");
      clearTimeout(this.pongTimeoutTimer);
    }
    this.emit("message", data);
  }
  /**
   * Attempts to reconnect to the WebSocket server using an exponential backoff strategy.
   */
  reconnect() {
    const delay = Math.min(1e3 * 2 ** this.retryCount, MAX_RECONNECT_DELAY);
    this.retryCount++;
    console.log(`🔄 Reintentando conexión en ${delay}ms (intento #${this.retryCount})...`);
    setTimeout(() => this.connect(), delay);
  }
  /**
   * Closes the WebSocket connection manually without triggering a reconnection.
   */
  close() {
    this.cleanupHeartbeat();
    if (this.ws) this.ws.close(1e3, "Cierre manual");
  }
}
function Chart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      title = "Title",
      data = [],
      series = [],
      option = {},
      chart = null
    } = $$props;
    function handleResize() {
    }
    onDestroy(() => {
      window.removeEventListener("resize", handleResize);
    });
    $$renderer2.push(`<div style="width: 100%; height: 400px;"></div>`);
    bind_props($$props, { title, data, series, option, chart });
  });
}
function TimeSeries($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      title = "Title",
      data = [],
      series = [],
      chart = null,
      tooltipFormatter = void 0,
      option = {
        title: { text: title, left: "center" },
        toolbox: { feature: { saveAsImage: {} } },
        legend: series.length > 0 ? { top: 36, left: "center", type: "scroll" } : void 0,
        grid: series.length > 0 ? { top: 80, left: 48, right: 24, bottom: 70 } : void 0,
        tooltip: {
          // 'item' en vez de 'axis': con muchas series cuyos puntos no caen en el mismo
          // instante de tiempo (ej. una serie por endpoint, cada una con sus propios
          // timestamps de request), 'axis' junta en un solo tooltip el punto más cercano
          // de cada serie — ilegible con decenas de series. 'item' muestra únicamente el
          // punto exacto bajo el cursor.
          trigger: "item",
          formatter: tooltipFormatter || function(params) {
            var points = Array.isArray(params) ? params : [params];
            return points.map(function(p) {
              var date = new Date(p.value[0]);
              var pad = function(n) {
                return String(n).padStart(2, "0");
              };
              var formattedDate = pad(date.getDate()) + "/" + pad(date.getMonth() + 1) + "/" + date.getFullYear() + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
              var label = p.seriesName ? p.seriesName + "<br/>" : "";
              return label + formattedDate + " : " + p.value[1];
            }).join("<br/><br/>");
          },
          axisPointer: { animation: false }
        },
        xAxis: {
          type: "time",
          scale: false,
          interval: 1e3 * 60 * 30,
          splitLine: {
            show: true,
            // Mostrar líneas de grilla del eje X
            lineStyle: {
              //color: '#e6eaf0', // Color rojo para las líneas verticales
              //width: 1, // Ancho de 2 píxeles
              opacity: 0.2
              //type: 'solid' // Puedes usar 'dashed', 'dotted', 'solid'
            }
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          lineStyle: {
            //color: '#e6eaf0', // Color rojo para las líneas verticales
            //width: 1, // Ancho de 2 píxeles
            opacity: 0.2
            //type: 'solid' // Puedes usar 'dashed', 'dotted', 'solid'
          },
          splitLine: { show: true }
        },
        dataZoom: [
          { type: "inside", start: 75, end: 100 },
          { start: 0, end: 20 }
        ]
      }
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Chart($$renderer3, {
        get title() {
          return title;
        },
        set title($$value) {
          title = $$value;
          $$settled = false;
        },
        get option() {
          return option;
        },
        set option($$value) {
          option = $$value;
          $$settled = false;
        },
        get data() {
          return data;
        },
        set data($$value) {
          data = $$value;
          $$settled = false;
        },
        get series() {
          return series;
        },
        set series($$value) {
          series = $$value;
          $$settled = false;
        },
        get chart() {
          return chart;
        },
        set chart($$value) {
          chart = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { title, data, series, chart, tooltipFormatter, option });
  });
}
function iconFallback($$renderer) {
  $$renderer.push(`<i class="fas fa-cube svelte-azjspp"></i>`);
}
function App($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      logoText = "LOGO TEXT",
      logoIcon: logoIcon2 = iconFallback,
      topRightNavBar = [],
      topLeftNavBar = [],
      children,
      menu = []
    } = $$props;
    let sidebarState = "";
    let left_items_tnv = derived(() => {
      return [bntToggleSidebar].concat(topLeftNavBar);
    });
    let dimensions_top_nav = { height: 60 };
    onDestroy(() => {
    });
    function bntToggleSidebar($$renderer3) {
      $$renderer3.push(`<span class="icon is-clickable svelte-azjspp"><i class="fas fa-bars svelte-azjspp"></i></span>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      MenuSide($$renderer3, {
        get logoIcon() {
          return logoIcon2;
        },
        set logoIcon($$value) {
          logoIcon2 = $$value;
          $$settled = false;
        },
        get logoText() {
          return logoText;
        },
        set logoText($$value) {
          logoText = $$value;
          $$settled = false;
        },
        get sidebarState() {
          return sidebarState;
        },
        set sidebarState($$value) {
          sidebarState = $$value;
          $$settled = false;
        },
        get menu() {
          return menu;
        },
        set menu($$value) {
          menu = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <span${attr_class("top-nav svelte-azjspp", void 0, {
        "icons-only": sidebarState === "icons-only",
        "expanded": sidebarState === "hidden"
      })}>`);
      Level($$renderer3, {
        left: left_items_tnv(),
        get right() {
          return topRightNavBar;
        },
        set right($$value) {
          topRightNavBar = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></span> <main${attr_class("main-content svelte-azjspp", void 0, {
        "icons-only": sidebarState === "icons-only",
        "expanded": sidebarState === "hidden"
      })}${attr_style("", {
        "--topbar-height": dimensions_top_nav.height + "px",
        "margin-top": "var(--topbar-height)"
      })}>`);
      children?.($$renderer3);
      $$renderer3.push(`<!----></main> `);
      Notifications2($$renderer3);
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { logoText, logoIcon: logoIcon2, topRightNavBar, topLeftNavBar, menu });
  });
}
const ChartWidgets = { Base: Chart, TimeSeries };
const version = "9.1.1";
function Login($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let noty = new Notifications$1();
    let { onlogin = () => {
    }, onfail = () => {
    }, isOverlay = false } = $$props;
    let username = "";
    let password = "";
    let processing = { waiting: false, error: null };
    let mounted = false;
    let serverVersion = "...";
    let mustChangePassword = false;
    let lastToken = "";
    let forcedChangeError = "";
    let changePwd = { current: "", newPassword: "", repeat: "" };
    let changePwdMatch = derived(() => changePwd.newPassword.length > 0 && changePwd.newPassword === changePwd.repeat);
    const environment = getDefaultEnvironment();
    let recoveryOptions = null;
    let showRecovery = false;
    let recoveryStep = "request";
    let recoveryBusy = false;
    let recoveryError = "";
    let recoveryInfo = "";
    let recovery = {
      username: "",
      channel: "auto",
      otp: "",
      newPassword: "",
      repeat: ""
    };
    const recoveryEnabled = derived(() => recoveryOptions);
    const recoveryChannels = derived(() => {
      const opts = [];
      return opts;
    });
    const recoveryPwdMatch = derived(() => recovery.newPassword.length > 0 && recovery.newPassword === recovery.repeat);
    function closeRecovery() {
      showRecovery = false;
      recoveryStep = "request";
      recoveryError = "";
      recoveryInfo = "";
    }
    async function submitRecoveryRequest() {
      recoveryError = "";
      recoveryInfo = "";
      const name = String(recovery.username || "").trim();
      if (!name) {
        recoveryError = "Please enter your username.";
        return;
      }
      if (recoveryBusy) return;
      recoveryBusy = true;
      try {
        const channel = recovery.channel === "email" || recovery.channel === "telegram" ? recovery.channel : void 0;
        const data = await ForgotPassword({ username: name, environment, ...channel ? { channel } : {} });
        recoveryInfo = typeof data?.message === "string" ? data.message : "If the account exists and the selected channel is available, you will receive a verification code.";
        recoveryStep = "code";
      } catch (error) {
        console.trace(error);
        recoveryError = error.message || "The code could not be sent. Try again later.";
      } finally {
        recoveryBusy = false;
      }
    }
    async function submitRecoveryConfirm() {
      recoveryError = "";
      const name = String(recovery.username || "").trim();
      const otp = String(recovery.otp || "").trim();
      if (!name || !otp) {
        recoveryError = "Please enter the 6-digit verification code.";
        return;
      }
      if (!recovery.newPassword || !recovery.repeat) {
        recoveryError = "Please enter and repeat the new password.";
        return;
      }
      if (recovery.newPassword !== recovery.repeat) {
        recoveryError = "Passwords do not match.";
        return;
      }
      if (recoveryBusy) return;
      recoveryBusy = true;
      try {
        const data = await ConfirmResetPassword({ username: name, otp, newPassword: recovery.newPassword });
        if (data && (data.success === true || data.error === void 0)) {
          recovery = {
            username: "",
            channel: "auto",
            otp: "",
            newPassword: "",
            repeat: ""
          };
          recoveryStep = "request";
          showRecovery = false;
          password = "";
          noty.push({
            message: data?.message || "Password updated. Log in with your new password.",
            color: "success"
          });
        } else {
          recoveryError = data?.error || data?.message || "The code is invalid or has expired.";
        }
      } catch (error) {
        console.trace(error);
        recoveryError = error.message || "The password could not be updated.";
      } finally {
        recoveryBusy = false;
      }
    }
    function notifySessionLifetime(token) {
      logJwtExpiration(token);
      const minutesLeft = getJwtExpiresInMinutes(token);
      const timeText = formatJwtTimeLeft(minutesLeft);
      if (minutesLeft <= 0) {
        noty.push({
          message: "Your session has already expired or the token has an invalid lifetime. Contact the administrator.",
          color: "danger"
        });
      } else if (minutesLeft < 1) {
        noty.push({
          message: `Session started with a very short lifetime: ${timeText}.`,
          color: "danger"
        });
      } else if (minutesLeft < 5) {
        noty.push({
          message: `Session started. Session time: ${timeText}.`,
          color: "warning"
        });
      } else {
        noty.push({
          message: `Session started. Session time: ${timeText}.`,
          color: "success"
        });
      }
    }
    async function submitForcedChange() {
      forcedChangeError = "";
      if (!changePwd.newPassword || !changePwd.repeat) {
        forcedChangeError = "Please enter and repeat the new password.";
        return;
      }
      if (changePwd.newPassword !== changePwd.repeat) {
        forcedChangeError = "Passwords do not match.";
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
          changePwd = { current: "", newPassword: "", repeat: "" };
          await getListMethods(lastToken);
          await getListHandler(lastToken);
          notifySessionLifetime(lastToken);
          onlogin({ login: true });
        } else {
          forcedChangeError = result?.error || result?.message || "Password could not be changed.";
        }
      } catch (error) {
        console.trace(error);
        forcedChangeError = error.message || "Password could not be changed.";
      }
    }
    function cancelForcedChange() {
      mustChangePassword = false;
      userStore.set({});
      changePwd = { current: "", newPassword: "", repeat: "" };
      forcedChangeError = "";
      noty.push({
        message: "You must change your password to continue.",
        color: "warning"
      });
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Modal($$renderer3, {
        show: true,
        children: ($$renderer4) => {
          $$renderer4.push(`<div${attr_class("login-wrapper svelte-177ibf8", void 0, { "is-visible": mounted, "overlay-mode": isOverlay })}><div class="orb orb-1 svelte-177ibf8"></div> <div class="orb orb-2 svelte-177ibf8"></div> <div class="orb orb-3 svelte-177ibf8"></div> <div class="login-card box svelte-177ibf8"><div class="brand-header has-text-centered svelte-177ibf8"><div class="logo-ring svelte-177ibf8"><div class="logo-figure svelte-177ibf8"><img${attr("src", Logo)} alt="OpenFusionAPI" class="logo-img svelte-177ibf8"/></div></div> <h1 class="title is-4 mt-3 brand-title svelte-177ibf8">Open Fusion API</h1> <p class="subtitle is-6 brand-subtitle svelte-177ibf8"><span class="tag is-dark is-rounded svelte-177ibf8"><span class="icon is-small svelte-177ibf8"><i class="fa-solid fa-server svelte-177ibf8"></i></span> <span class="svelte-177ibf8">MCP Server</span></span></p></div> <div class="divider-line svelte-177ibf8"></div> `);
          if (isOverlay) {
            $$renderer4.push(`<!--[0--><div class="notification is-warning is-light has-text-centered svelte-177ibf8"><span class="icon svelte-177ibf8"><i class="fa-solid fa-clock-rotate-left svelte-177ibf8"></i></span> <strong class="svelte-177ibf8">Your session has expired, please log in again</strong></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> <form class="login-form svelte-177ibf8"><div class="field svelte-177ibf8"><label class="label has-text-grey-light is-small svelte-177ibf8" for="login-username">Username</label> <p class="control has-icons-left svelte-177ibf8"><input id="login-username"${attr_class("input is-rounded svelte-177ibf8", void 0, { "is-danger": processing.error })} type="text" placeholder="Enter your username"${attr("value", username)} autocomplete="username"/> <span class="icon is-small is-left svelte-177ibf8"><i class="fa-solid fa-user svelte-177ibf8"></i></span></p></div> <div class="field svelte-177ibf8"><label class="label has-text-grey-light is-small svelte-177ibf8" for="login-password">Password</label> <p class="control has-icons-left has-icons-right svelte-177ibf8"><input id="login-password"${attr_class("input is-rounded svelte-177ibf8", void 0, { "is-danger": processing.error })}${attr("type", "password")} placeholder="Enter your password"${attr("value", password)} autocomplete="current-password"/> <span class="icon is-small is-left svelte-177ibf8"><i class="fa-solid fa-lock svelte-177ibf8"></i></span> <button type="button" class="icon is-small is-right is-clickable eye-icon svelte-177ibf8"${attr("title", "Show password")}${attr("aria-label", "Show password")}><i${attr_class(clsx("fa-solid fa-eye"), "svelte-177ibf8")}></i></button></p></div> `);
          {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> <div class="field mt-4 svelte-177ibf8"><p class="control svelte-177ibf8"><button type="submit"${attr_class("button is-fullwidth is-rounded login-btn svelte-177ibf8", void 0, { "is-loading": processing.waiting })}${attr("disabled", !username, true)}>`);
          {
            $$renderer4.push(`<!--[0--><span class="icon svelte-177ibf8"><i class="fa-solid fa-right-to-bracket svelte-177ibf8"></i></span> <span class="svelte-177ibf8">Sign In</span>`);
          }
          $$renderer4.push(`<!--]--></button></p></div></form> `);
          if (recoveryEnabled()) {
            $$renderer4.push(`<!--[0--><div class="field has-text-centered mt-2 svelte-177ibf8"><button type="button" class="button is-ghost is-small forgot-btn svelte-177ibf8"><span class="icon is-small svelte-177ibf8"><i class="fa-solid fa-key svelte-177ibf8"></i></span> <span class="svelte-177ibf8">Forgot your password?</span></button></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> <p class="version-tag has-text-centered has-text-grey svelte-177ibf8"><span class="icon is-small svelte-177ibf8"><i class="fa-solid fa-code-branch svelte-177ibf8"></i></span> GUI v${escape_html(version)} <span class="version-separator svelte-177ibf8">|</span> <span class="icon is-small svelte-177ibf8"><i class="fa-solid fa-server svelte-177ibf8"></i></span> Server v${escape_html(serverVersion)}</p></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      {
        let recoveryTitle = function($$renderer4) {
          $$renderer4.push(`<span class="has-text-info svelte-177ibf8"><i class="fa-solid fa-key svelte-177ibf8"></i> Password recovery</span>`);
        }, recoveryBody = function($$renderer4) {
          if (recoveryStep === "request") {
            $$renderer4.push(`<!--[0--><p class="mb-2 svelte-177ibf8">Enter your username and we will send a one-time verification code to your registered email
				or Telegram.</p> `);
            Basic$1($$renderer4, {
              label: "Username:",
              get value() {
                return recovery.username;
              },
              set value($$value) {
                recovery.username = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            if (recoveryChannels().length > 1) {
              $$renderer4.push(`<!--[0--><div class="mt-2 svelte-177ibf8">`);
              BasicSelect($$renderer4, {
                label: "Delivery channel",
                options: recoveryChannels(),
                isExpanded: true,
                get option() {
                  return recovery.channel;
                },
                set option($$value) {
                  recovery.channel = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]-->`);
          } else {
            $$renderer4.push(`<!--[-1--><p class="mb-2 svelte-177ibf8">Enter the 6-digit code you received and choose your new password (minimum 8 characters).</p> `);
            Basic$1($$renderer4, {
              label: "Username:",
              disabled: true,
              get value() {
                return recovery.username;
              },
              set value($$value) {
                recovery.username = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            Basic$1($$renderer4, {
              label: "Verification code:",
              type: "text",
              maxlength: "6",
              placeholder: "123456",
              get value() {
                return recovery.otp;
              },
              set value($$value) {
                recovery.otp = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            Basic$1($$renderer4, {
              label: "New password:",
              type: "password",
              get value() {
                return recovery.newPassword;
              },
              set value($$value) {
                recovery.newPassword = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            Basic$1($$renderer4, {
              label: "Repeat new password:",
              type: "password",
              get value() {
                return recovery.repeat;
              },
              set value($$value) {
                recovery.repeat = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> `);
            if (recovery.newPassword && !recoveryPwdMatch()) {
              $$renderer4.push(`<!--[0--><div class="notification is-danger is-light py-2 px-3 mt-2 svelte-177ibf8"><span class="icon-text svelte-177ibf8"><span class="icon svelte-177ibf8"><i class="fa-solid fa-triangle-exclamation svelte-177ibf8"></i></span> <span class="svelte-177ibf8">Passwords do not match.</span></span></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]--> `);
          if (recoveryInfo) {
            $$renderer4.push(`<!--[0--><div class="notification is-info is-light py-2 px-3 mt-2 svelte-177ibf8"><span class="icon-text svelte-177ibf8"><span class="icon svelte-177ibf8"><i class="fa-solid fa-circle-info svelte-177ibf8"></i></span> <span class="svelte-177ibf8">${escape_html(recoveryInfo)}</span></span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (recoveryError) {
            $$renderer4.push(`<!--[0--><div class="notification is-danger is-light py-2 px-3 mt-2 svelte-177ibf8"><span class="icon-text svelte-177ibf8"><span class="icon svelte-177ibf8"><i class="fa-solid fa-triangle-exclamation svelte-177ibf8"></i></span> <span class="svelte-177ibf8">${escape_html(recoveryError)}</span></span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Modal_1($$renderer3, {
          title: recoveryTitle,
          body: recoveryBody,
          closeOnEscape: !recoveryBusy,
          closeOnBackground: !recoveryBusy,
          label_accept: recoveryStep === "request" ? "Send code" : "Update password",
          onaccept: async () => {
            if (recoveryStep === "request") await submitRecoveryRequest();
            else await submitRecoveryConfirm();
          },
          oncancel: closeRecovery,
          get show() {
            return showRecovery;
          },
          set show($$value) {
            showRecovery = $$value;
            $$settled = false;
          },
          recoveryTitle,
          recoveryBody,
          $$slots: { recoveryTitle: true, recoveryBody: true }
        });
      }
      $$renderer3.push(`<!----> `);
      {
        let forcedChangeTitle = function($$renderer4) {
          $$renderer4.push(`<span class="has-text-warning svelte-177ibf8"><i class="fa-solid fa-key svelte-177ibf8"></i> Password change required</span>`);
        }, forcedChangeBody = function($$renderer4) {
          $$renderer4.push(`<div class="notification is-warning is-light svelte-177ibf8"><span class="icon-text svelte-177ibf8"><span class="icon svelte-177ibf8"><i class="fa-solid fa-triangle-exclamation svelte-177ibf8"></i></span> <span class="svelte-177ibf8">For security reasons you must change your password before continuing.</span></span></div> `);
          Basic$1($$renderer4, {
            label: "Current password:",
            get value() {
              return changePwd.current;
            },
            set value($$value) {
              changePwd.current = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            label: "New password:",
            get value() {
              return changePwd.newPassword;
            },
            set value($$value) {
              changePwd.newPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            label: "Repeat new password:",
            get value() {
              return changePwd.repeat;
            },
            set value($$value) {
              changePwd.repeat = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          if (changePwd.newPassword && !changePwdMatch()) {
            $$renderer4.push(`<!--[0--><div class="notification is-danger is-light py-2 px-3 mt-2 svelte-177ibf8"><span class="icon-text svelte-177ibf8"><span class="icon svelte-177ibf8"><i class="fa-solid fa-triangle-exclamation svelte-177ibf8"></i></span> <span class="svelte-177ibf8">Passwords do not match.</span></span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (forcedChangeError) {
            $$renderer4.push(`<!--[0--><div class="notification is-danger is-light py-2 px-3 mt-2 svelte-177ibf8"><span class="icon-text svelte-177ibf8"><span class="icon svelte-177ibf8"><i class="fa-solid fa-triangle-exclamation svelte-177ibf8"></i></span> <span class="svelte-177ibf8">${escape_html(forcedChangeError)}</span></span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Modal_1($$renderer3, {
          title: forcedChangeTitle,
          body: forcedChangeBody,
          closeOnEscape: false,
          closeOnBackground: false,
          onaccept: async () => {
            await submitForcedChange();
          },
          oncancel: () => {
            cancelForcedChange();
          },
          get show() {
            return mustChangePassword;
          },
          set show($$value) {
            mustChangePassword = $$value;
            $$settled = false;
          },
          forcedChangeTitle,
          forcedChangeBody,
          $$slots: { forcedChangeTitle: true, forcedChangeBody: true }
        });
      }
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
const listAccessMethod = [
  { value: "Public", id: 0 },
  { value: "Basic", id: 1 },
  { value: "Bearer", id: 2 },
  { value: "Basic & Bearer", id: 3 }
];
const listHTTPMethods = {
  GET: { color: "primary", icon: "fa-brands fa-get-pocket" },
  POST: { color: "link", icon: "fa-solid fa-signs-post" },
  DELETE: { color: "danger", icon: "fa-solid fa-trash" },
  PUT: { color: "info", icon: "fa-solid fa-file-pen" },
  WS: { color: "warning", icon: "fa-solid fa-tower-broadcast" }
};
const Environment = [
  {
    id: "dev",
    value: `Development`,
    color: " has-text-danger ",
    background: "danger",
    icon: " fa-solid fa-bug "
  },
  {
    id: "qa",
    value: `Quality`,
    color: " has-text-warning ",
    background: "warning",
    icon: " fa-solid fa-eye "
  },
  {
    id: "prd",
    value: `Production`,
    color: " has-text-success ",
    background: "success",
    icon: " fa-solid fa-check "
  }
];
const defaultEndpoint = {
  enabled: false,
  endpoint: "",
  access: 0,
  method: "GET",
  handler: "NA",
  mcp: {},
  cache_time: 0,
  ctrl: {
    admin: true,
    users: [],
    log: {}
  },
  resource: "",
  code: "",
  idapp: 0,
  description: "",
  idendpoint: 0,
  cors: {},
  headers_test: {},
  data_test: {
    query: [
      {
        enabled: false,
        key: "",
        value: ""
      }
    ],
    body: {
      selection: 0
    },
    headers: {},
    auth: {
      selection: 0
    }
  },
  latest_updater: null,
  environment: "dev",
  json_schema: {
    in: {
      enabled: false,
      schema: {
        type: "object",
        properties: {},
        additionalProperties: true
      }
    },
    out: {
      enabled: false,
      schema: {
        type: "object",
        properties: {},
        additionalProperties: true
      }
    }
  }
};
const defaultValuesIntervalTask = (task) => {
  const baseTask = {
    idtask: null,
    idendpoint: "",
    iduser: null,
    idapp: "",
    enabled: false,
    interval: 300,
    datestart: "",
    dateend: "",
    next_run: "",
    last_run: "",
    exec_time_limit: 30,
    failed_attempts: 0,
    status: 0,
    params: {},
    allow_concurrent: false,
    idkey: null,
    schedule_mode: "interval",
    cron: "",
    timezone: "",
    window_start: "",
    window_end: "",
    window_days: "",
    max_failed_attempts: 10,
    history_limit: 50,
    note: ""
  };
  const incoming = Object.fromEntries(
    Object.entries(task || {}).filter(([, v]) => v !== void 0)
  );
  const merged = {
    ...baseTask,
    ...incoming
  };
  merged.enabled = !!merged.enabled;
  merged.allow_concurrent = !!merged.allow_concurrent;
  return merged;
};
const IntervalTaskStatus = {
  0: {
    label: "Waiting",
    background: "light",
    icon: " fa-solid fa-clock ",
    description: "Waiting for its next run."
  },
  1: {
    label: "Running",
    background: "info",
    icon: " fa-solid fa-play ",
    description: "The task is running right now."
  },
  2: {
    label: "OK",
    background: "success",
    icon: " fa-solid fa-circle-check ",
    description: "The last run finished successfully."
  },
  3: {
    label: "Error",
    background: "danger",
    icon: " fa-solid fa-triangle-exclamation ",
    description: "The last run failed. Check the recorded response."
  },
  4: {
    label: "Timeout",
    background: "warning",
    icon: " fa-solid fa-hourglass-end ",
    description: "The run exceeded its time limit and was aborted."
  }
};
const IntervalTaskStatusFallback = {
  label: "Unknown",
  background: "light",
  icon: " fa-solid fa-circle-question ",
  description: "Unknown status."
};
function getIntervalTaskRuntimeStatus(value) {
  return Number(value) === 1 ? IntervalTaskStatus[1] : IntervalTaskStatus[0];
}
function getIntervalTaskLastResultStatus(value, response) {
  const numericStatus = Number(value);
  if (numericStatus === 2 && response && typeof response === "object" && !Array.isArray(response) && response.success === false) {
    return IntervalTaskStatus[3];
  }
  return numericStatus >= 2 && numericStatus <= 4 ? IntervalTaskStatus[numericStatus] : null;
}
const defaultValuesBot = (bot) => {
  const baseBot = {
    idbot: null,
    idapp: "",
    name: "",
    description: "",
    provider: "telegram",
    token: "",
    code: "",
    enabled: true,
    environment: "prd",
    params: {}
  };
  return {
    ...baseBot,
    ...bot || {}
  };
};
const BotRuntimeStatus = {
  STOPPED: {
    label: "Stopped",
    color: " has-text-grey ",
    background: "light",
    icon: " fa-solid fa-circle-stop ",
    needsAction: false,
    description: "The bot is not running."
  },
  STARTING: {
    label: "Starting",
    color: " has-text-info ",
    background: "info",
    icon: " fa-solid fa-play ",
    needsAction: false,
    description: "The worker is starting and validating the token against the provider."
  },
  RUNNING: {
    label: "Running",
    color: " has-text-success ",
    background: "success",
    icon: " fa-solid fa-circle-check ",
    needsAction: false,
    description: "The bot is up and receiving updates."
  },
  BACKOFF: {
    label: "Retrying",
    color: " has-text-warning ",
    background: "warning",
    icon: " fa-solid fa-clock-rotate-left ",
    needsAction: false,
    description: "A recoverable failure (network, DNS, provider 429/5xx). The bot stays enabled and is retried automatically. No action is needed."
  },
  QUARANTINED: {
    label: "Quarantined",
    color: " has-text-warning ",
    background: "warning",
    icon: " fa-solid fa-hourglass-half ",
    needsAction: false,
    description: "Recoverable failures persist, so the bot moved to slow probing (15/30/60 min). It stays enabled and keeps retrying indefinitely: it recovers on its own once the cause clears."
  },
  DISABLED_ERROR: {
    label: "Disabled (error)",
    color: " has-text-danger ",
    background: "danger",
    icon: " fa-solid fa-triangle-exclamation ",
    needsAction: true,
    description: "Repeated permanent failures (revoked token or code that does not compile). Fix the token or the code and save: the bot is re-enabled automatically."
  }
};
const BotRuntimeStatusFallback = BotRuntimeStatus.STOPPED;
function SaveDeploy($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      left = [],
      onsavedeploy = () => {
      },
      oncancel = () => {
      },
      deploying = { show: false, error: false, message: "" }
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        let r01 = function($$renderer4) {
          $$renderer4.push(`<div class="field has-addons"><p class="control"><button class="button is-small is-warning"><span class="icon is-small"><i class="fa-solid fa-rocket"></i></span> <span>Save &amp; Deploy</span></button></p> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-xmark"></i></span> <span>Cancel</span></button></p></div>`);
        };
        Level($$renderer3, { left, right: [r01] });
      }
      $$renderer3.push(`<!----> `);
      Modal($$renderer3, {
        get show() {
          return deploying.show;
        },
        set show($$value) {
          deploying.show = $$value;
          $$settled = false;
        },
        get showCloseButton() {
          return deploying.error;
        },
        set showCloseButton($$value) {
          deploying.error = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="box"><p>${escape_html(deploying.message)}</p> <br/> `);
          if (deploying.error) {
            $$renderer4.push(`<!--[0--><progress class="progress is-small is-danger" max="100" value="10">Loading...</progress>`);
          } else {
            $$renderer4.push(`<!--[-1--><progress class="progress is-small is-primary" max="100">Loading...</progress>`);
          }
          $$renderer4.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { left, deploying });
  });
}
function TextArea($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      label = "Text Area Label",
      value = "",
      placeholder = "Text area placeholder"
    } = $$props;
    $$renderer2.push(`<div class="tabs is-boxed is-small margin_correct svelte-1hcg3rv"><ul><li class="is-active"><a class="no_cursor svelte-1hcg3rv"><span>${escape_html(label)}</span></a></li></ul></div> <div class="field"><div class="control"><textarea class="textarea is-small"${attr("placeholder", placeholder)}>`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div></div>`);
    bind_props($$props, { label, value, placeholder });
  });
}
function Basic($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let uf = new uFetch();
    let { idapp = void 0, onsavedeploy = () => {
    } } = $$props;
    let deploying = { show: false, message: "", error: false };
    let app = { app: "", enabled: false, description: "" };
    function clearDataVars() {
      console.log("clearDataVars No hay datos");
    }
    async function SaveApp() {
      try {
        let request = await uf.post({ url: url_paths.app, data: snapshot(app) });
        let response = await request.json();
        if (request.status == 200 && response) {
          app = { ...response };
          deploying.show = false;
        } else {
          deploying.error = true;
          deploying.message = `Error: ${response.message || request.statusText}`;
          clearDataVars();
        }
      } catch (error) {
        console.error(error);
        deploying.error = true;
        deploying.message = `Error: ${error.message}`;
      } finally {
        onsavedeploy(app);
      }
    }
    function backup_restore_app($$renderer3) {
      if (store_get($$store_subs ??= {}, "$userStore", userStore)) {
        $$renderer3.push(`<!--[0--><div class="field has-addons"><p class="control"><button class="button is-small is-info is-dark"><span>Application: ${escape_html(app.app)}</span></button></p> <p class="control file"><input class="input is-small" type="file" accept=".json"/></p> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-upload"></i></span> <span>Restore</span></button></p> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-download"></i></span> <span>Backup</span></button></p></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div>`);
      SaveDeploy($$renderer3, {
        left: [backup_restore_app],
        onsavedeploy: async () => {
          await SaveApp();
        },
        oncancel: () => {
        },
        get deploying() {
          return deploying;
        },
        set deploying($$value) {
          deploying = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="columns"><div class="column"><div class="field has-addons"><p class="control"><a class="button is-static is-small">Application</a></p> <p class="control">`);
      if (app) {
        $$renderer3.push(`<!--[0--><input class="input is-small" type="text" placeholder="Application name"${attr("value", app.app)}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></p></div></div> <div class="column"><div class="field has-addons"><p class="control"><a class="button is-static is-small">UUID App</a></p> <p class="control">`);
      if (app) {
        $$renderer3.push(`<!--[0--><input class="input is-small" size="50" type="text" readonly="" placeholder="UUID App"${attr("value", app.idapp)}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></p></div></div> <div class="column"><div class="field has-addons"><p class="control"><a class="button is-static is-small">JWT Key</a></p> <p class="control is-expanded">`);
      if (app) {
        $$renderer3.push(`<!--[0--><input class="input is-small" type="text" readonly="" placeholder="JWT Key"${attr("value", app.jwt_key)} title="Signing key used to mint the API keys of this application."/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></p> <p class="control"><button class="button is-small" title="Generate a new JWT signing key"><span class="icon is-small"><i class="fa-solid fa-rotate"></i></span> <span>Generate</span></button></p></div></div> <div class="column"><div class="field has-addons"><p class="control"><a class="button is-static is-small">Enabled</a></p> <p class="control">`);
      if (app) {
        $$renderer3.push(`<!--[0--><input type="button"${attr("value", app.enabled)}${attr_class(clsx(app.enabled ? "button is-success is-selected is-small" : "button is-danger is-small"))}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></p></div></div></div> `);
      TextArea($$renderer3, {
        label: "Description",
        get value() {
          return app.description;
        },
        set value($$value) {
          app.description = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { idapp });
  });
}
const HTTP_STATUS_TEXT = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required"
};
function httpStatusText(code2) {
  return HTTP_STATUS_TEXT[String(code2)] ?? "Unknown Status";
}
function Dashboard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { idapp = void 0 } = $$props;
    let data_request_series = [];
    let data_logs_per_minute = [];
    let data_status_class = [];
    let data_status_summary = [];
    let data_top_endpoints = [];
    let data_unused_endpoints = [];
    let data_top_error_endpoints = [];
    let data_error_requests = [];
    let loading_error_requests = false;
    let data_cpu = [];
    let data_memory = [];
    let cpuUsage = void 0;
    let memoryUsage = void 0;
    let selectedEnvironment = "prd";
    let selectedHours = 12;
    let selectedStatusClasses = ["5xx"];
    const STATUS_CODE_RANGES = {
      "1xx": [100, 199],
      "2xx": [200, 299],
      "3xx": [300, 399],
      "4xx": [400, 499],
      "5xx": [500, 599]
    };
    function topErrorsTooltipFormatter(params) {
      const points = Array.isArray(params) ? params : [params];
      return points.map((p) => {
        const date = new Date(p.value[0]);
        const pad = (n) => String(n).padStart(2, "0");
        const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        return `URL: ${p.seriesName}<br/>${formattedDate}<br/>Errores: ${p.value[1]}`;
      }).join("<br/><br/>");
    }
    const STATUS_CLASSES = [
      { key: "success", name: "Success", color: "#48c78e" },
      { key: "client_error", name: "Client Error", color: "#ffe08a" },
      { key: "server_error", name: "Server Error", color: "#f14668" },
      { key: "redirect", name: "Redirect", color: "#3e8ed0" },
      { key: "info", name: "Info", color: "#3298dc" }
    ];
    function handleHoursChange(e) {
      let value = Math.floor(Number(e.target.value));
      selectedHours = Number.isFinite(value) && value > 1 ? value : 12;
    }
    function matchesSelection(data_endpoint) {
      return idapp && data_endpoint?.idapp == idapp && data_endpoint?.environment == selectedEnvironment;
    }
    function formatData(data_endpoint) {
      if (matchesSelection(data_endpoint)) {
        let now = new Date(data_endpoint.dateTime || Date.now());
        let label = data_endpoint.method ? `${data_endpoint.method} ${data_endpoint.resource || data_endpoint.url || ""}`.trim() : `Endpoint ${data_endpoint.idendpoint}`;
        return {
          name: now.toISOString(),
          value: [now, data_endpoint?.responseTime],
          other: label
        };
      }
    }
    function insertSortedPoint(dataArray, point) {
      const t = new Date(point.value[0]).getTime();
      let i = dataArray.length - 1;
      while (i >= 0 && new Date(dataArray[i].value[0]).getTime() > t) {
        i--;
      }
      const result = [...dataArray];
      result.splice(i + 1, 0, point);
      return result;
    }
    function upsertSeriesPoint(seriesArray, idendpoint, label, point) {
      const index = seriesArray.findIndex((series) => series.idendpoint === idendpoint);
      if (index === -1) {
        return [
          ...seriesArray,
          {
            idendpoint,
            name: label,
            showSymbol: true,
            symbolSize: 4,
            data: [point]
          }
        ];
      }
      const updated = [...seriesArray];
      updated[index] = {
        ...updated[index],
        data: insertSortedPoint(updated[index].data, point)
      };
      return updated;
    }
    function incrementMinutePoint(dataArray, dateValue) {
      const minuteDate = new Date(dateValue || Date.now());
      minuteDate.setSeconds(0, 0);
      const t = minuteDate.getTime();
      let i = dataArray.length - 1;
      while (i >= 0 && new Date(dataArray[i].value[0]).getTime() > t) {
        i--;
      }
      if (i >= 0 && new Date(dataArray[i].value[0]).getTime() === t) {
        const updated2 = [...dataArray];
        updated2[i] = {
          ...updated2[i],
          value: [updated2[i].value[0], updated2[i].value[1] + 1]
        };
        return updated2;
      }
      const updated = [...dataArray];
      updated.splice(i + 1, 0, {
        name: minuteDate.toISOString(),
        value: [minuteDate, 1],
        other: "Nada"
      });
      return updated;
    }
    function incrementBucketPoint(dataArray, dateValue, granularity) {
      const bucketDate = new Date(dateValue || Date.now());
      {
        bucketDate.setMinutes(0, 0, 0);
      }
      const t = bucketDate.getTime();
      let i = dataArray.length - 1;
      while (i >= 0 && new Date(dataArray[i].value[0]).getTime() > t) {
        i--;
      }
      if (i >= 0 && new Date(dataArray[i].value[0]).getTime() === t) {
        const updated2 = [...dataArray];
        updated2[i] = {
          ...updated2[i],
          value: [updated2[i].value[0], updated2[i].value[1] + 1]
        };
        return updated2;
      }
      const updated = [...dataArray];
      updated.splice(i + 1, 0, {
        name: bucketDate.toISOString(),
        value: [bucketDate, 1],
        other: "Nada"
      });
      return updated;
    }
    function statusClassForCode(status_code) {
      const code2 = Number(status_code);
      if (code2 < 200) return "info";
      if (code2 < 300) return "success";
      if (code2 < 400) return "redirect";
      if (code2 < 500) return "client_error";
      return "server_error";
    }
    function incrementStatusSummary(dataArray, statusCode) {
      const code2 = String(statusCode);
      const index = dataArray.findIndex((d) => d.name === code2);
      if (index === -1) {
        return [...dataArray, { name: code2, value: 1 }];
      }
      const updated = [...dataArray];
      updated[index] = { ...updated[index], value: updated[index].value + 1 };
      return updated;
    }
    function createLeadingTrailingThrottle(intervalMs, flush) {
      let cooling = false;
      let pending = false;
      let timer = null;
      function trigger() {
        if (!cooling) {
          flush();
          cooling = true;
          timer = setTimeout(tick, intervalMs);
        } else {
          pending = true;
        }
      }
      function tick() {
        if (pending) {
          flush();
          pending = false;
          timer = setTimeout(tick, intervalMs);
        } else {
          cooling = false;
          timer = null;
        }
      }
      function cancel() {
        if (timer) clearTimeout(timer);
        cooling = false;
        pending = false;
        timer = null;
      }
      return { trigger, cancel };
    }
    function createTrailingThrottle(intervalMs, flush) {
      let timer = null;
      function trigger() {
        if (!timer) {
          timer = setTimeout(
            () => {
              flush();
              timer = null;
            },
            intervalMs
          );
        }
      }
      function cancel() {
        if (timer) clearTimeout(timer);
        timer = null;
      }
      return { trigger, cancel };
    }
    let pendingEndpointEvents = [];
    let pendingAggregateEvents = [];
    function flushEndpointCharts() {
      const events = pendingEndpointEvents;
      pendingEndpointEvents = [];
      for (const event of events) {
        let point = formatData(event);
        if (point) {
          data_request_series = upsertSeriesPoint(data_request_series, event.idendpoint, point.other, point);
        }
        if (Number(event.statusCode) >= 400) {
          data_top_error_endpoints = data_top_error_endpoints.map((series) => series.idendpoint === event.idendpoint ? {
            ...series,
            data: incrementBucketPoint(series.data, event.dateTime)
          } : series);
        }
      }
    }
    function flushAggregateCharts() {
      const events = pendingAggregateEvents;
      pendingAggregateEvents = [];
      for (const event of events) {
        data_logs_per_minute = incrementMinutePoint(data_logs_per_minute, event.dateTime);
        let status_class = statusClassForCode(event.statusCode);
        data_status_class = data_status_class.map((series, index) => STATUS_CLASSES[index].key === status_class ? {
          ...series,
          data: incrementMinutePoint(series.data, event.dateTime)
        } : series);
        data_status_summary = incrementStatusSummary(data_status_summary, event.statusCode);
      }
    }
    const endpointThrottle = createLeadingTrailingThrottle(2e3, flushEndpointCharts);
    const aggregateThrottle = createTrailingThrottle(5e3, flushAggregateCharts);
    let error_requests_request_id = 0;
    async function loadErrorRequests() {
      if (!idapp || selectedStatusClasses.length === 0) {
        data_error_requests = [];
        loading_error_requests = false;
        return;
      }
      const request_id = ++error_requests_request_id;
      loading_error_requests = true;
      try {
        let logs = await getLogs(
          {
            idapp,
            environment: selectedEnvironment,
            last_hours: selectedHours,
            status_code: selectedStatusClasses.join(","),
            lightweight: true,
            order: "timestamp",
            orderDirection: "DESC",
            limit: 500
          },
          store_get($$store_subs ??= {}, "$userStore", userStore).token
        );
        if (request_id !== error_requests_request_id) return;
        data_error_requests = Array.isArray(logs) ? logs : [];
      } catch (error) {
        console.error(error);
        if (request_id === error_requests_request_id) {
          data_error_requests = [];
        }
      } finally {
        if (request_id === error_requests_request_id) {
          loading_error_requests = false;
        }
      }
    }
    const tableRefreshThrottle = createTrailingThrottle(5e3, loadErrorRequests);
    let unsubscribe_dy;
    let unsubscribe_com;
    onDestroy(() => {
      tableRefreshThrottle.cancel();
      unsubscribe_dy();
      unsubscribe_com();
      endpointThrottle.cancel();
      aggregateThrottle.cancel();
    });
    function statusCodeFilter($$renderer3) {
      $$renderer3.push(`<span class="mr-2">Status codes:</span> <!--[-->`);
      const each_array = ensure_array_like(Object.keys(STATUS_CODE_RANGES));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cls = each_array[$$index];
        $$renderer3.push(`<label class="checkbox mr-2"><input type="checkbox"${attr("checked", selectedStatusClasses.includes(cls), true)}/> ${escape_html(cls)}</label>`);
      }
      $$renderer3.push(`<!--]--> `);
      if (loading_error_requests) {
        $$renderer3.push(`<!--[0--><span class="icon is-small has-text-info" title="Loading requests…"><i class="fas fa-spinner fa-pulse"></i></span>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="field is-flex is-justify-content-flex-end is-align-items-center"><div class="mr-2">`);
      Basic$1($$renderer3, {
        label: "Hours",
        type: "number",
        min: 2,
        step: 5,
        onchange: handleHoursChange,
        get value() {
          return selectedHours;
        },
        set value($$value) {
          selectedHours = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> `);
      BasicSelect($$renderer3, {
        label: "Environment",
        options: [
          { id: "dev", value: "Development" },
          { id: "qa", value: "QA" },
          { id: "prd", value: "Production", label: "Production" }
        ],
        class: "is-small",
        get option() {
          return selectedEnvironment;
        },
        set option($$value) {
          selectedEnvironment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="columns is-multiline is-mobile"><div class="column is-half-desktop is-full-tablet">`);
      if (ChartWidgets.TimeSeries) {
        $$renderer3.push("<!--[-->");
        ChartWidgets.TimeSeries($$renderer3, {
          title: `CPU Usage ${stringify(cpuUsage)}%`,
          get data() {
            return data_cpu;
          },
          set data($$value) {
            data_cpu = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="help has-text-centered">Real-time server CPU usage percentage</p></div> <div class="column is-half-desktop is-full-tablet">`);
      if (ChartWidgets.TimeSeries) {
        $$renderer3.push("<!--[-->");
        ChartWidgets.TimeSeries($$renderer3, {
          title: `Memory Usage ${stringify(memoryUsage)}%`,
          get data() {
            return data_memory;
          },
          set data($$value) {
            data_memory = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="help has-text-centered">Real-time server memory usage percentage</p></div> <div class="column is-half-desktop is-full-tablet">`);
      if (ChartWidgets.TimeSeries) {
        $$renderer3.push("<!--[-->");
        ChartWidgets.TimeSeries($$renderer3, {
          title: "Response Time per Request",
          get series() {
            return data_request_series;
          },
          set series($$value) {
            data_request_series = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="help has-text-centered">Response time (ms) of each completed request for the selected app and environment, last ${escape_html(selectedHours)}
			hours</p></div> <div class="column is-half-desktop is-full-tablet">`);
      if (ChartWidgets.TimeSeries) {
        $$renderer3.push("<!--[-->");
        ChartWidgets.TimeSeries($$renderer3, {
          title: "Requests per minute",
          get data() {
            return data_logs_per_minute;
          },
          set data($$value) {
            data_logs_per_minute = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="help has-text-centered">Number of requests received per minute over the last ${escape_html(selectedHours)} hours</p></div> <div class="column is-half-desktop is-full-tablet">`);
      if (ChartWidgets.TimeSeries) {
        $$renderer3.push("<!--[-->");
        ChartWidgets.TimeSeries($$renderer3, {
          title: `Requests by Status per Minute (${stringify(selectedHours)}h)`,
          get series() {
            return data_status_class;
          },
          set series($$value) {
            data_status_class = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="help has-text-centered">Number of requests per minute over the last ${escape_html(selectedHours)} hours, broken down by HTTP status class</p></div> <div class="column is-half-desktop is-full-tablet">`);
      if (ChartWidgets.Base) {
        $$renderer3.push("<!--[-->");
        ChartWidgets.Base($$renderer3, {
          title: "Status Code Distribution",
          option: {
            tooltip: { trigger: "item", formatter: "{b}: {c} requests ({d}%)" },
            legend: {
              orient: "vertical",
              left: "left",
              tooltip: {
                show: true,
                formatter: (params) => `${params.name} — ${httpStatusText(params.name)}`
              }
            }
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "70%"],
              label: { show: false },
              labelLine: { show: false },
              data: data_status_summary
            }
          ]
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="help has-text-centered">Total distribution of HTTP status codes for the selected app and environment</p></div> <div class="column is-half-desktop is-full-tablet">`);
      if (ChartWidgets.Base) {
        $$renderer3.push("<!--[-->");
        ChartWidgets.Base($$renderer3, {
          title: "Top Endpoints (last 7 days)",
          option: {
            tooltip: {},
            yAxis: {
              type: "category",
              data: data_top_endpoints.map((d) => d.name)
            },
            xAxis: { type: "value" }
          },
          series: [
            { type: "bar", data: data_top_endpoints.map((d) => d.value) }
          ]
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="help has-text-centered">Most-used endpoints for the selected app and environment in the last 7 days</p></div> <div class="column is-half-desktop is-full-tablet">`);
      if (ChartWidgets.TimeSeries) {
        $$renderer3.push("<!--[-->");
        ChartWidgets.TimeSeries($$renderer3, {
          title: `Top 10 Endpoints with Most Errors (${stringify(selectedHours)}h)`,
          tooltipFormatter: topErrorsTooltipFormatter,
          get series() {
            return data_top_error_endpoints;
          },
          set series($$value) {
            data_top_error_endpoints = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="help has-text-centered">Endpoints with the most errors (status code >= 400) per hour in the last ${escape_html(selectedHours)} hours, for
			the selected app and environment</p></div> <div class="column is-full"><p class="title is-6">Request Log by Status Code (${escape_html(selectedStatusClasses.length ? selectedStatusClasses.join(", ") : "no status selected")}, last ${escape_html(selectedHours)}h)</p> `);
      Table($$renderer3, {
        RawDataTable: data_error_requests,
        columns: {
          timestamp: {
            label: "Date/Time",
            decorator: {
              component: DateTime_1,
              props: { format: "yyyy-MM-dd HH:mm:ss" }
            }
          },
          method: { label: "Method" },
          url: { label: "URL" },
          status_code: { label: "Status" },
          response_time: { label: "Time (ms)" },
          trace_id: { label: "Trace ID" },
          id: { hidden: true },
          idapp: { hidden: true },
          idendpoint: { hidden: true },
          log_level: { hidden: true }
        },
        left_items: [statusCodeFilter],
        showSelectionButton: false,
        showNewButton: false,
        showEditButton: false,
        showDeleteButton: false,
        fileNameExport: "requests_by_status"
      });
      $$renderer3.push(`<!----> <p class="help has-text-centered">One row per request received by the selected app and environment in the last ${escape_html(selectedHours)} hours,
			keeping only the status code classes checked above (up to the 500 most recent, newest first). Check
			or uncheck a class to query the server again; with none checked nothing is loaded. The list also
			refreshes on its own — at most once every 5 seconds — when a new request matching those classes
			arrives. Copy a Trace ID to follow that request end to end in the endpoint's logs.</p></div> <div class="column is-half-desktop is-full-tablet"><p class="title is-6">Unused Endpoints (last 7 days)</p> `);
      if (data_unused_endpoints.length) {
        $$renderer3.push(`<!--[0--><ul><!--[-->`);
        const each_array_1 = ensure_array_like(data_unused_endpoints);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let ep = each_array_1[$$index_1];
          $$renderer3.push(`<li>${escape_html(ep.resource)} (${escape_html(ep.method)})</li>`);
        }
        $$renderer3.push(`<!--]--></ul>`);
      } else {
        $$renderer3.push(`<!--[-1--><p class="help">No unused endpoints in this window.</p>`);
      }
      $$renderer3.push(`<!--]--> <p class="help has-text-centered">Endpoints with zero requests in the last 7 days for the selected environment</p></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { idapp });
  });
}
function Variable($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      idapp = "-",
      isReadOnly = false,
      showCode = false,
      appVars = [],
      title = "",
      environment = "",
      onchange = () => {
      },
      oncopy = () => {
      }
    } = $$props;
    let new_var_name = "";
    let search_var = "";
    let classAnimationCopyName = "";
    let appVarsInternal = {};
    let appVarsFiltered = derived(() => {
      let term = search_var.trim().toLowerCase();
      if (!term || !Array.isArray(appVars) || appVars.length === 0) return appVars;
      return appVars.filter((item) => {
        let name = item && item.name ? String(item.name).toLowerCase() : "";
        let value = item && item.value != null && item.value !== "" ? String(item.value).toLowerCase() : "";
        return name.includes(term) || value.includes(term);
      });
    });
    function internalOnchange(name, vars) {
      if (!equalObjs(appVarsInternal[name], vars)) {
        appVarsInternal[name] = vars;
        onchange(snapshot(appVars));
      }
    }
    function left_header($$renderer3, appvar) {
      $$renderer3.push(`<span><div class="field has-addons">`);
      if (!appvar.edit_name) {
        $$renderer3.push(`<!--[0--><p class="control"><a class="button is-static is-small">${escape_html(appvar.name)}</a></p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (!isReadOnly) {
        $$renderer3.push("<!--[0-->");
        if (appvar.edit_name) {
          $$renderer3.push(`<!--[0--><p class="control"><input class="input is-success is-small" type="text" placeholder="Edit variable name"${attr("value", appvar.name)}/></p> <p class="control"><button class="button is-small is-outlined is-success" title="Apply"><span class="icon is-small"><i class="fa-solid fa-check"></i></span></button></p> <p class="control"><button class="button is-small is-outlined is-danger" title="Cancel"><span class="icon is-small"><i class="fa-solid fa-xmark"></i></span></button></p>`);
        } else {
          $$renderer3.push(`<!--[-1--><p class="control"><button class="button is-small" title="Edit variable name"><span class="icon is-small"><i class="fa-solid fa-pen"></i></span></button></p>`);
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <p class="control"><button class="button is-small" title="Copy Name"><span class="icon is-small has-text-info"><i${attr_class(`fa-solid fa-copy ${classAnimationCopyName == appvar.name ? " fa-shake " : ""}`)}></i></span></button></p></div></span>`);
    }
    function right_header($$renderer3, appvar) {
      $$renderer3.push(`<span>`);
      if (!isReadOnly) {
        $$renderer3.push(`<!--[0--><div class="field has-addons"><p class="control"><button class="button is-small is-outlined is-link" title="Copy to another environment"><span class="icon is-small"><i class="fa-regular fa-clone"></i></span></button></p> <p class="control"><button class="button is-small is-outlined is-warning" title="Save &amp; Deploy"><span class="icon is-small"><i class="fa-solid fa-rocket"></i></span></button></p> <p class="control"><button class="button is-small is-outlined is-danger" title="Delete variable"><span class="icon is-small"><i class="fa-solid fa-trash"></i></span></button></p></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></span>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (appVars) {
        $$renderer3.push(`<!--[0--><div class="box">`);
        {
          let l01 = function($$renderer4) {
            $$renderer4.push(`<!---->${escape_html(title)}`);
          }, r01 = function($$renderer4) {
            $$renderer4.push(`<div><div class="field has-addons">`);
            if (!isReadOnly) {
              $$renderer4.push(`<!--[0--><div class="control"><button class="button is-small is-static">$_VAR_</button></div> <div class="control"><input class="input is-small" type="text" placeholder="New app variable"${attr("value", new_var_name)}/></div> <div class="control"><button class="button is-success is-small">New</button></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> <div class="control"><input class="input is-small" type="text" placeholder="Search variable"${attr("value", search_var)}/></div> <div class="control"><button class="button is-small is-static" title="Search" type="button"><span class="icon is-small"><i class="fa-solid fa-magnifying-glass"></i></span></button></div></div></div>`);
          };
          Level($$renderer3, {
            left: [l01],
            right: [r01]
          });
        }
        $$renderer3.push(`<!----> `);
        const each_array = ensure_array_like(appVarsFiltered());
        if (each_array.length !== 0) {
          $$renderer3.push("<!--[-->");
          for (let i = 0, $$length = each_array.length; i < $$length; i++) {
            let av = each_array[i];
            {
              let left_Editor = function($$renderer4) {
                left_header($$renderer4, av);
              }, right_Editor = function($$renderer4) {
                right_header($$renderer4);
              };
              EditorCode($$renderer3, {
                showSelectLang: true,
                left: left_Editor,
                right: right_Editor,
                showCode,
                showFormat: true,
                isReadOnly,
                onchange: (e) => {
                  internalOnchange(av.name, e.code);
                },
                get code() {
                  return av.value;
                },
                set code($$value) {
                  av.value = $$value;
                  $$settled = false;
                },
                get lang() {
                  return av.type;
                },
                set lang($$value) {
                  av.type = $$value;
                  $$settled = false;
                },
                left_Editor,
                right_Editor,
                $$slots: { left_Editor: true, right_Editor: true }
              });
            }
            $$renderer3.push(`<!----> <hr class="reset_margin svelte-2c3sku"/>`);
          }
        } else {
          $$renderer3.push("<!--[!-->");
          if (search_var.trim()) {
            $$renderer3.push(`<!--[0--><div class="icon-text" style="margin-top: 10px;"><span class="icon has-text-warning"><i class="fa-solid fa-magnifying-glass"></i></span> <span>No variables match the search criteria.</span></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { idapp, isReadOnly, showCode, appVars, title, environment });
  });
}
function Select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      onchange = () => {
      },
      option = "NA",
      css_class = " is-small ",
      options = [{ id: "TEST", value: `TEST`, enabled: true }]
    } = $$props;
    function handleClick() {
      onchange(option);
    }
    $$renderer2.push(`<div class="control"><div${attr_class(`select ${stringify(css_class)}`)}>`);
    $$renderer2.select({ value: option, onchange: handleClick }, ($$renderer3) => {
      if (options && options.length > 0) {
        $$renderer3.push(`<!--[0--><!--[-->`);
        const each_array = ensure_array_like(options);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let h = each_array[$$index];
          $$renderer3.option({ value: h.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(h.value)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</div></div>`);
    bind_props($$props, { option, css_class, options });
  });
}
function Variables($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let noty = new Notifications$1();
    let {
      idapp = 0,
      environment = "*",
      isReadOnly = false,
      onchange = () => {
      }
    } = $$props;
    let ShowDialogCopyEndpoint = false;
    let var_replace_copy = false;
    let var_to_copy = {};
    let Datavars = {};
    let DataAppVars = [];
    let env_dev = derived(() => {
      return DataAppVars && Array.isArray(DataAppVars) ? DataAppVars.filter((item) => {
        return item.environment == "dev";
      }) : [];
    });
    let env_qa = derived(() => {
      return DataAppVars && Array.isArray(DataAppVars) ? DataAppVars.filter((item) => {
        return item.environment == "qa";
      }) : [];
    });
    let env_prd = derived(() => {
      return DataAppVars && Array.isArray(DataAppVars) ? DataAppVars.filter((item) => {
        return item.environment == "prd";
      }) : [];
    });
    let available_environments_list = derived(() => {
      return Environment && Array.isArray(Environment) ? Environment.filter((el) => {
        return el.id != var_to_copy.environment;
      }) : [];
    });
    let reloadVarsTimeout;
    onDestroy(() => {
      clearTimeout(reloadVarsTimeout);
    });
    async function SaveAppVarCopyReplace() {
      try {
        let payload = [
          {
            idappvar: var_to_copy.idvar,
            target_env: var_to_copy.env_destination
          }
        ];
        let migrate_data = await migrateAppVars(payload);
        if (Array.isArray(migrate_data) && migrate_data.length > 0) {
          let result = migrate_data[0];
          if (result.status === "success") {
            noty.push({
              message: result.message || `Variable ${var_to_copy.name} successfully migrated/replaced in the ${var_to_copy.env_destination} environment`,
              color: "success"
            });
          } else if (result.status === "ignored") {
            noty.push({
              message: result.message || `Variable ${var_to_copy.name} is already in the ${var_to_copy.env_destination} environment`,
              color: "info"
            });
          } else {
            noty.push({
              message: `Variable ${var_to_copy.name} could not be migrated: ${result.message || result.status}`,
              color: "danger"
            });
          }
        } else {
          noty.push({
            message: `Unexpected response migrating variable ${var_to_copy.name}`,
            color: "danger"
          });
        }
      } catch (error) {
        console.error(error);
        noty.push({
          message: `Error migrating variable: ${error.message}`,
          color: "danger"
        });
      }
      await GetData();
    }
    async function GetData() {
      try {
        DataAppVars = await GetAppVars(idapp, store_get($$store_subs ??= {}, "$userStore", userStore).token);
      } catch (error) {
        console.error(error);
        DataAppVars = [];
      }
    }
    function internalOnchange() {
      onchange(snapshot(Datavars));
    }
    function internalOncopy(v) {
      ShowDialogCopyEndpoint = true;
      var_to_copy = v;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div>`);
      if (environment == "dev" || environment == "*") {
        $$renderer3.push(`<!--[0--><div class="column">`);
        Variable($$renderer3, {
          environment: "dev",
          isReadOnly,
          title: "DEVELOPMENT",
          onchange: (x) => {
            internalOnchange();
          },
          oncopy: (x) => {
            internalOncopy(x);
          },
          get idapp() {
            return idapp;
          },
          set idapp($$value) {
            idapp = $$value;
            $$settled = false;
          },
          get appVars() {
            return env_dev();
          },
          set appVars($$value) {
            env_dev($$value);
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (environment == "qa" || environment == "*") {
        $$renderer3.push(`<!--[0--><div class="column">`);
        Variable($$renderer3, {
          environment: "qa",
          isReadOnly,
          title: "QUALITY",
          onchange: (x) => {
            internalOnchange();
          },
          oncopy: (x) => {
            internalOncopy(x);
          },
          get idapp() {
            return idapp;
          },
          set idapp($$value) {
            idapp = $$value;
            $$settled = false;
          },
          get appVars() {
            return env_qa();
          },
          set appVars($$value) {
            env_qa($$value);
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (environment == "prd" || environment == "*") {
        $$renderer3.push(`<!--[0--><div class="column">`);
        Variable($$renderer3, {
          environment: "prd",
          isReadOnly,
          title: "PRODUCTION",
          onchange: (x) => {
            internalOnchange();
          },
          oncopy: (x) => {
            internalOncopy(x);
          },
          get idapp() {
            return idapp;
          },
          set idapp($$value) {
            idapp = $$value;
            $$settled = false;
          },
          get appVars() {
            return env_prd();
          },
          set appVars($$value) {
            env_prd($$value);
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        let titleModal = function($$renderer4) {
          $$renderer4.push(`<span>${escape_html(`Copy ${var_to_copy.name}`)}</span>`);
        }, bodyDialogModal = function($$renderer4) {
          $$renderer4.push(`<div>Copy or replace the variable to another environment.</div> <br/> <div class="field has-addons"><p class="control"><a class="button is-small is-static">Copy to:</a></p> <p class="control">`);
          Select($$renderer4, {
            options: available_environments_list(),
            onchange: (e) => {
              var_to_copy.env_destination = e;
              if (DataAppVars && Array.isArray(DataAppVars)) {
                let var_exists = DataAppVars.find((item) => {
                  return item.name == var_to_copy.name && item.environment == var_to_copy.env_destination;
                });
                if (var_exists && var_exists.idvar) {
                  var_to_copy.idvar_destination = var_exists.idvar;
                }
              }
            }
          });
          $$renderer4.push(`<!----></p></div> `);
          if (!var_to_copy.env_destination || var_to_copy.env_destination == "") {
            $$renderer4.push(`<!--[0--><div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>Select an environment to copy.</span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (var_to_copy && var_to_copy.idvar_destination) {
            $$renderer4.push(`<!--[0--><label class="checkbox"><input type="checkbox"${attr("checked", var_replace_copy, true)}/> I agree to copy and/or replace the application variable to the <strong>${escape_html(var_to_copy.env_destination)}</strong> environment.</label> `);
            {
              $$renderer4.push(`<!--[0--><br/> <div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>You must agree to continue.</span></div>`);
            }
            $$renderer4.push(`<!--]-->`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Modal_1($$renderer3, {
          title: titleModal,
          body: bodyDialogModal,
          onaccept: async () => {
            if (var_to_copy.idvar_destination && !var_replace_copy) {
              noty.push({
                message: "You must agree to replace the variable.",
                color: "danger"
              });
              return;
            }
            await SaveAppVarCopyReplace();
            ShowDialogCopyEndpoint = false;
          },
          oncancel: () => {
            var_to_copy = {};
          },
          get show() {
            return ShowDialogCopyEndpoint;
          },
          set show($$value) {
            ShowDialogCopyEndpoint = $$value;
            $$settled = false;
          },
          titleModal,
          bodyDialogModal,
          $$slots: { titleModal: true, bodyDialogModal: true }
        });
      }
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { idapp, environment, isReadOnly });
  });
}
function Application_variables($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { idapp = 0, onsavedeploy = () => {
    } } = $$props;
    const permEnv = getDefaultEnvironment();
    const currentUser = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore)?.user);
    const canEdit = derived(() => currentUserHasPermission(currentUser(), permEnv, "appvars", "edit"));
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div>APP VARIABLES `);
      Variables($$renderer3, {
        environment: "*",
        isReadOnly: !canEdit(),
        get idapp() {
          return idapp;
        },
        set idapp($$value) {
          idapp = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { idapp });
  });
}
function CellPath($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let timeoutIsRunning;
    let env_params = derived(() => {
      return Environment && Array.isArray(Environment) ? Environment.find((item) => {
        return row.environment == item.id;
      }) : [];
    });
    let unsubscribe;
    onDestroy(() => {
      clearTimeout(timeoutIsRunning);
      unsubscribe();
    });
    $$renderer2.push(`<td>`);
    if (env_params()) {
      $$renderer2.push(`<!--[0--><span class="icon-text"><span${attr_class(`icon ${" has-text-black-ter "}`)}><i${attr_class(`fa-solid fa-gear ${""}`)}></i></span> <span>${escape_html(value)}</span></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></td>`);
    bind_props($$props, { value, row });
  });
}
function CellAccess($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let labelx = derived(() => {
      let l;
      if (listAccessMethod && Array.isArray(listAccessMethod)) {
        l = listAccessMethod.find((item) => {
          return item.id == value;
        });
      }
      return l ? l.value : "Unknown";
    });
    $$renderer2.push(`<td><div class="tags has-addons">`);
    if (value == 0) {
      $$renderer2.push(`<!--[0--><span class="tag is-success"><span class="icon"><i class="fa-solid fa-lock-open"></i></span></span> <span class="tag">Public</span>`);
    } else {
      $$renderer2.push(`<!--[-1--><span class="tag is-danger"><span class="icon"><i class="fa-solid fa-lock"></i></span></span> <span class="tag">${escape_html(labelx())}</span>`);
    }
    $$renderer2.push(`<!--]--></div></td>`);
    bind_props($$props, { value, row });
  });
}
function Icon_label($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { color = "", label = " Label ", icon = "fas fa-home" } = $$props;
    $$renderer2.push(`<span class="icon-text"><span${attr_class(`icon has-text-${stringify(color)}`)}><i${attr_class(clsx(icon))}></i></span> <span>${escape_html(label)}</span></span>`);
    bind_props($$props, { color, label, icon });
  });
}
function CellMethod($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = "", row = void 0 } = $$props;
    let css_class_method = "";
    let css_icon = "fas fa-home";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<td>`);
      if (value != null) {
        $$renderer3.push("<!--[0-->");
        Icon_label($$renderer3, {
          get color() {
            return css_class_method;
          },
          set color($$value) {
            css_class_method = $$value;
            $$settled = false;
          },
          get label() {
            return value;
          },
          set label($$value) {
            value = $$value;
            $$settled = false;
          },
          get icon() {
            return css_icon;
          },
          set icon($$value) {
            css_icon = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></td>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { value, row });
  });
}
function CellHandler($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { value = void 0, row = void 0 } = $$props;
    let label = "";
    let css_class = "";
    let css_icon = "fas fa-home";
    let error_function = derived(() => {
      let r = { valid: true };
      if (row.handler == "FUNCTION") {
        if (row.environment == "prd") {
          r.valid = searchFunction(row.code, store_get($$store_subs ??= {}, "$listFunctionStorePRD", listFunctionStorePRD));
        } else if (row.environment == "qa") {
          r.valid = searchFunction(row.code, store_get($$store_subs ??= {}, "$listFunctionStoreQA", listFunctionStoreQA));
        } else if (row.environment == "dev") {
          r.valid = searchFunction(row.code, store_get($$store_subs ??= {}, "$listFunctionStoreDev", listFunctionStoreDev));
        }
        r.message = r.valid ? "" : `The function ${row.code} does not exist.`;
      }
      return r;
    });
    function searchFunction(name_function, store_data) {
      let r = false;
      if (store_data && Array.isArray(store_data)) {
        r = store_data.some((item) => {
          return item.id == name_function;
        });
      }
      return r;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<td>`);
      if (row.method !== "WS") {
        $$renderer3.push("<!--[0-->");
        if (!error_function().valid) {
          $$renderer3.push(`<!--[0--><div class="icon-text"><span class="icon has-text-danger"><i class="fas fa-exclamation-triangle fa-beat"></i></span> <span>Error: ${escape_html(error_function().message)}</span></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        Icon_label($$renderer3, {
          get color() {
            return css_class;
          },
          set color($$value) {
            css_class = $$value;
            $$settled = false;
          },
          get label() {
            return label;
          },
          set label($$value) {
            label = $$value;
            $$settled = false;
          },
          get icon() {
            return css_icon;
          },
          set icon($$value) {
            css_icon = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></td>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { value, row });
  });
}
function CellMCPTool($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    $$renderer2.push(`<td>`);
    if (value?.enabled && value?.name) {
      $$renderer2.push(`<!--[0--><span class="icon-text"${attr("title", value.name)}><span${attr_class(`icon ${value.enabled ? "has-text-success" : "has-text-danger"}`)}><i class="fa-solid fa-hammer"></i></span></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></td>`);
    bind_props($$props, { value, row });
  });
}
function CellCacheTime($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let value_cache = {};
    const unsubscribe = storeCacheSize.subscribe((cache_data) => {
      if (row && cache_data) {
        if (cache_data[row.idendpoint] > 0) {
          value_cache.bytes = cache_data[row.idendpoint];
        } else {
          value_cache.bytes = 0;
        }
      }
    });
    onDestroy(unsubscribe);
    $$renderer2.push(`<td>`);
    if (row.method !== "WS" && value > 0) {
      $$renderer2.push(`<!--[0--><div class="field has-addons"><div class="control">`);
      if (row && value_cache && value_cache.bytes && value_cache.bytes > 0) {
        $$renderer2.push(`<!--[0--><a class="button is-small has-text-success is-static"><span class="icon"><i class="fa-solid fa-clock bolt fa-beat-fade" style="--fa-beat-fade-opacity: 0.1; --fa-beat-fade-scale: 1.25;"></i></span> <span>${escape_html(value_cache.bytes)} KB</span></a>`);
      } else {
        $$renderer2.push(`<!--[-1--><a class="button is-small is-static"><span class="icon"><i class="fa-solid fa-clock"></i></span> <span>0 KB</span></a>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="control"><a class="button is-small is-static">${escape_html(value)} seg.</a></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></td>`);
    bind_props($$props, { value, row });
  });
}
function CellCountStatusCode($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let value_count_status_code = {};
    const unsubscribe = storeCountResponseStatusCode.subscribe((ListCountStatusCode) => {
      if (row && row.idendpoint) {
        value_count_status_code = ListCountStatusCode[row.idendpoint];
      }
    });
    onDestroy(() => {
      unsubscribe();
    });
    $$renderer2.push(`<td>`);
    if (row.method !== "WS") {
      $$renderer2.push("<!--[0-->");
      if (value_count_status_code) {
        $$renderer2.push(`<!--[0--><div class="field is-grouped is-grouped-multiline"><!--[-->`);
        const each_array = ensure_array_like(Object.keys(value_count_status_code));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let statusCode = each_array[$$index];
          $$renderer2.push(`<div class="control"><div class="tags has-addons">`);
          if (statusCode >= 100 && statusCode < 200) {
            $$renderer2.push(`<!--[0--><span class="tag is-info">${escape_html(statusCode)}</span>`);
          } else if (statusCode >= 200 && statusCode < 300) {
            $$renderer2.push(`<!--[1--><span class="tag is-success">${escape_html(statusCode)}</span>`);
          } else if (statusCode >= 300 && statusCode < 400) {
            $$renderer2.push(`<!--[2--><span class="tag is-primary">${escape_html(statusCode)}</span>`);
          } else if (statusCode >= 400 && statusCode < 500) {
            $$renderer2.push(`<!--[3--><span class="tag is-warning">${escape_html(statusCode)}</span>`);
          } else if (statusCode >= 500 && statusCode < 600) {
            $$renderer2.push(`<!--[4--><span class="tag is-danger">${escape_html(statusCode)}</span>`);
          } else {
            $$renderer2.push(`<!--[-1--><span class="tag is-dark">${escape_html(statusCode)}</span>`);
          }
          $$renderer2.push(`<!--]--> <span class="tag is-dark">${escape_html(value_count_status_code[statusCode])}</span></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></td>`);
    bind_props($$props, { value, row });
  });
}
function CellEnv($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let timeoutIsRunning;
    let env_params = derived(() => {
      return Environment && Array.isArray(Environment) ? Environment.find((item) => {
        return row.environment == item.id;
      }) : [];
    });
    let unsubscribe;
    onDestroy(() => {
      clearTimeout(timeoutIsRunning);
      unsubscribe();
    });
    $$renderer2.push(`<td>`);
    if (env_params()) {
      $$renderer2.push(`<!--[0--><span class="icon-text"><span${attr_class(`icon ${stringify(env_params().color)}`)}><i${attr_class(clsx(env_params().icon))}></i></span></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></td>`);
    bind_props($$props, { value, row });
  });
}
const endpointColumns = {
  enabled: {
    label: "Enabled",
    decorator: {
      component: Boolean$1,
      props: {
        custom: {
          ontrue: { label: "Enabled" },
          onfalse: { label: "Unabled" },
          editInline: true
        }
      }
    }
  },
  environment: { label: "Env", decorator: { component: CellEnv } },
  endpoint: { label: "Endpoint", decorator: { component: CellPath } },
  access: { label: "Access", decorator: { component: CellAccess } },
  method: { decorator: { component: CellMethod }, label: "Method" },
  handler: { decorator: { component: CellHandler }, label: "Handler" },
  mcp: { decorator: { component: CellMCPTool }, label: "MCP Tool" },
  cache_time: { label: "Cache Time", decorator: { component: CellCacheTime } },
  ctrl: { hidden: true, label: "Users" },
  resource: { hidden: true },
  code: { label: "Code", hidden: true },
  idapp: { hidden: true },
  rowkey: {
    decorator: { component: CellCountStatusCode },
    label: "Status Code"
  },
  app: { hidden: true },
  namespace: { hidden: true },
  name: { hidden: true },
  version: { hidden: true },
  description: { hidden: true },
  vars: { hidden: true },
  idendpoint: { hidden: true },
  cors: { hidden: true },
  headers_test: { hidden: true },
  data_test: { hidden: true },
  latest_updater: { hidden: true },
  price_by_request: { hidden: true },
  price_kb_request: { hidden: true },
  custom_data: { hidden: true },
  keywords: { hidden: true },
  cache_size: { hidden: true },
  docs: { hidden: true },
  title: { hidden: true },
  json_schema: { hidden: true },
  price_kb_response: { hidden: true },
  createdAt: { hidden: true },
  timeout: { hidden: true },
  updatedAt: {
    decorator: { component: DateTime_1 },
    label: "Updated At"
  },
  price_total: { hidden: true }
};
function App_vars_selector($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      freeTyping = false,
      placeholder = "$_VAR_NAME",
      classIcon = "",
      label = "Application Variable",
      value = "",
      environment = "",
      onselect = () => {
      }
    } = $$props;
    let options_app_vars = derived(() => Array.isArray(store_get($$store_subs ??= {}, "$listAppVars", listAppVars)) ? store_get($$store_subs ??= {}, "$listAppVars", listAppVars).filter((item) => item.environment === environment).map((item) => ({ name: item.name, value: item.name, code: item.value })) : []);
    let value_selected = derived(() => options_app_vars().find((item) => item.name === value));
    function onselectInternal(val) {
      value = val;
      onselect(val);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Predictive($$renderer3, {
        freeTyping,
        placeholder,
        classIcon,
        label,
        options: options_app_vars(),
        onselect: (selected) => {
          onselectInternal(selected.value);
        },
        get selectedValue() {
          return value;
        },
        set selectedValue($$value) {
          value = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (value_selected()) {
        $$renderer3.push(`<!--[0--><details><summary>View value</summary> <br/> `);
        JSONView($$renderer3, { jsonObject: value_selected().code });
        $$renderer3.push(`<!----></details>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      freeTyping,
      placeholder,
      classIcon,
      label,
      value,
      environment
    });
  });
}
function Fetch($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { endpoint = {}, onchange = () => {
    } } = $$props;
    let tabList = [{ label: "Url", isActive: true, component: tab_url }];
    function getData() {
      return {
        code: endpoint.code,
        data_test: snapshot(endpoint.data_test)
      };
    }
    function fnOnChange() {
      onchange(getData());
    }
    function tab_url($$renderer3) {
      $$renderer3.push(`<div><label class="label">Url to make the request. The operation is similar to a proxy</label> `);
      App_vars_selector($$renderer3, {
        freeTyping: true,
        placeholder: "http://your.url/path",
        classIcon: "fa-solid fa-globe",
        label: "Url",
        environment: endpoint.environment,
        onselect: (selected) => {
          fnOnChange();
        },
        get value() {
          return endpoint.code;
        },
        set value($$value) {
          endpoint.code = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function Js_predefined_vars($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="content is-small">`);
    {
      $$renderer2.push(`<!--[0--><progress class="progress is-small is-primary" max="100">Loading...</progress>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function tab_pred_vars$2($$renderer) {
  Js_predefined_vars($$renderer);
}
function Js($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { endpoint = {}, onchange = () => {
    } } = $$props;
    let internal_code = endpoint?.code ?? "";
    function getData() {
      return {
        code: internal_code,
        data_test: snapshot(endpoint.data_test)
      };
    }
    function fnOnChange() {
      endpoint.code = internal_code;
      onchange(getData());
    }
    let tabList = [
      {
        label: "Code",
        isActive: true,
        classIcon: " fa-brands fa-node-js ",
        component: tab_code
      },
      { label: "Modules and functions", component: tab_pred_vars$2 }
    ];
    function tab_code($$renderer3) {
      EditorCode($$renderer3, {
        lang: "js",
        showFormat: true,
        onchange: (c) => {
          fnOnChange();
        },
        get code() {
          return internal_code;
        },
        set code($$value) {
          internal_code = $$value;
          $$settled = false;
        }
      });
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function Params_json_selector($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      freeTyping = void 0,
      placeholder = void 0,
      classIcon = void 0,
      label = void 0,
      custom = void 0,
      appvar = void 0,
      environment = void 0,
      langEditor = void 0,
      onselect = () => {
      }
    } = $$props;
    function handleCodeChange(event) {
      console.log("handleCodeChange", event);
      custom = event.code;
      appvar = "";
      onselect({ custom: event.code, appvar: "" });
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="box"><div class="buttons has-addons"><button${attr_class(`button is-small ${"is-active is-primary"}`)}>Use Custom Parameters</button> <button${attr_class(`button is-small ${""}`)}>Use App Variable</button></div> `);
      {
        $$renderer3.push("<!--[0-->");
        EditorCode($$renderer3, {
          isReadOnly: false,
          lang: langEditor,
          showFormat: true,
          code: custom,
          onchange: handleCodeChange
        });
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, {
      freeTyping,
      placeholder,
      classIcon,
      label,
      custom,
      appvar,
      environment,
      langEditor
    });
  });
}
function Soap($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { endpoint = void 0, onchange = () => {
    } } = $$props;
    let code_desc = JSON.stringify({ "describe()": true });
    let code_sample_options = { wsdl_options: { strictSSL: true, rejectUnauthorized: false } };
    let tabList = [
      {
        label: "Parameters",
        isActive: true,
        classIcon: " fa-solid fa-soap ",
        component: tab_parameters
      },
      { label: "Information", isActive: false, component: tab_infor }
    ];
    let jsonParams = {
      wsdl: "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",
      endpoint: "https://www.dataaccess.com/webservicesserver/numberconversion.wso",
      functionName: "NumberToDollars",
      BasicAuthSecurity: { User: "any", Password: "any" },
      RequestArgs: { dNum: 236.08 }
    };
    function fnOnChange() {
      onchange({ code: endpoint.code });
    }
    function tab_parameters($$renderer3) {
      $$renderer3.push(`<div><div><div>Service connection parameters.</div></div> `);
      Params_json_selector($$renderer3, {
        environment: endpoint.environment,
        onselect: (selected) => {
          fnOnChange();
          console.log(">>>>>> AppVarsSelector Editor", selected, endpoint.custom_data, endpoint.code);
        },
        get custom() {
          return endpoint.custom_data;
        },
        set custom($$value) {
          endpoint.custom_data = $$value;
          $$settled = false;
        },
        get appvar() {
          return endpoint.code;
        },
        set appvar($$value) {
          endpoint.code = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (endpoint.method === "GET") {
        $$renderer3.push(`<!--[0--><div class="block"><div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>Warning</span></div> <p class="block">The GET method is recommended only for simple requests where there are no input
					parameters, or failing which the parameters are key-value.</p></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    function tab_infor($$renderer3) {
      $$renderer3.push(`<div>Enter the parameters in json format like the following example: `);
      JSONView($$renderer3, {
        get jsonObject() {
          return jsonParams;
        },
        set jsonObject($$value) {
          jsonParams = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div style="margin-top: 1em;">The variables with the following: <ul class="list_params svelte-1w6nj1w"><li><strong>wsdl:</strong> URL where the wsdl is located. (Required)</li> <li><strong>endpoint:</strong> URL of the actual endpoint. This is not usually required except in
					specific cases. (Optional)</li> <li><strong>functionName:</strong> Function or method to call. Required when the method used
					is <strong>GET</strong>, in the <strong>POST</strong> method it can be passed as a parameter.</li> <li><strong>BasicAuthSecurity:</strong> Only if required. BearerSecurity is also supported.</li> <li><strong>RequestArgs:</strong> When you use the <strong>GET</strong> method, this parameter
					is replaced by the data sent in the Query. When using <strong>POST</strong> the parameter can
					be sent directly in the Body.</li> <li><strong>options:</strong> additional options passed to soap client. By example: `);
      JSONView($$renderer3, {
        get jsonObject() {
          return code_sample_options;
        },
        set jsonObject($$value) {
          code_sample_options = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></li></ul> <br/> <div class="block"><div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>Warning: The parameters configured here will override those that the user sends through
						the service.</span></div></div> <br/> <div class="block"><div class="icon-text"><span class="icon has-text-success"><i class="fas fa-info-circle"></i></span> <span>If you want to <strong>get description</strong> of the SOAP service, you can send the
						following JSON request: <code>${escape_html(code_desc)}</code></span></div></div></div></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function Sql($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      endpoint = { endpoint: "", method: "", environment: "" },
      onchange = () => {
      }
    } = $$props;
    let cnx_custom = {};
    let cnx_appvar = "";
    let sample_bind_post = {
      bind: {
        your_param_01: "0002081614",
        your_param_02: 123,
        your_param_03: "ABC"
      }
    };
    let sample_replace_post = { replacements: { your_param_01: ["0002081614", "986535OKE"] } };
    let tabList = [
      {
        label: "Query",
        isActive: true,
        classIcon: " fa-solid fa-database ",
        component: tab_query
      },
      { label: "Pass Parameters", component: tab_pass_params },
      { label: "Connection Parameters", component: tab_cnx_params }
    ];
    let query_code = "SELECT 1;";
    function fnOnChange() {
      onchange(getData());
    }
    function getData() {
      let data = {
        code: query_code,
        custom_data: cnx_appvar && typeof cnx_appvar === "string" && cnx_appvar.trim().length > 0 ? cnx_appvar : cnx_custom,
        data_test: snapshot(endpoint.data_test)
      };
      console.log(data);
      return data;
    }
    function tab_query($$renderer3) {
      $$renderer3.push(`<div><div><div class="content is-small">The parameters must have a name like <span style="font-style: oblique; font-weight: bold;">$nameparameter</span> to bind, or <span style="font-style: oblique; font-weight: bold;">:nameparameter</span> to
				replacements. The values ​​you send in the request. For more information you can consult the <a href="https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter">sequelize</a> documentation.</div></div></div> `);
      EditorCode($$renderer3, {
        isReadOnly: false,
        lang: "sql",
        showFormat: true,
        onchange: (c) => {
          fnOnChange();
        },
        get code() {
          return query_code;
        },
        set code($$value) {
          query_code = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    function tab_pass_params($$renderer3) {
      $$renderer3.push(`<div class="content is-small"><p>In sequelize you can pass parameters using <strong>"bind"</strong> or <strong>"replacements"</strong> depending on the case. You can refer to <a href="https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter">Sequelize Parameters</a> for more details.</p> `);
      if (endpoint.method === "GET") {
        $$renderer3.push(`<!--[0--><div class="block"><div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>GET Method - Warning</span></div> <p class="block">The GET method is recommended only for simple requests where there is no input parameters,
					or failing that the parameters are key-value on query request, which will be used to join
					with the variables of the SQL query.</p> <div class="block">If you send a parameter that is not present in the query you will get an error similar to: <code>Column index out of range</code></div></div>`);
      } else if (endpoint.method === "POST") {
        $$renderer3.push(`<!--[1--><div class="block"><div class="icon-text"><span class="icon has-text-info"><i class="fa-solid fa-circle-exclamation"></i></span> <span>When you use the POST method, the input parameters must be sent in the BODY in JSON
						format, using the following example:</span></div> <br/> `);
        JSONView($$renderer3, {
          get jsonObject() {
            return sample_bind_post;
          },
          set jsonObject($$value) {
            sample_bind_post = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> <br/> <div class="icon-text"><span class="icon has-text-info"><i class="fa-solid fa-circle-exclamation"></i></span> <span>You can also use "replacements" used by sequelize., for example:</span></div> <br/> `);
        JSONView($$renderer3, {
          get jsonObject() {
            return sample_replace_post;
          },
          set jsonObject($$value) {
            sample_replace_post = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div> <div class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-circle-exclamation"></i></span> <span>Only "bind" or "replacements" can be used at the same time.</span></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    function tab_cnx_params($$renderer3) {
      $$renderer3.push(`<div><div class="content is-small">Configuration parameters used by sequelize, visit <a href="https://sequelize.org/">https://sequelize.org/</a> for more information.</div></div> <br/> `);
      Params_json_selector($$renderer3, {
        onselect: (selected) => {
          console.log("SQL AppVarsSelector Editor", selected, cnx_custom, cnx_appvar);
          fnOnChange();
        },
        get custom() {
          return cnx_custom;
        },
        set custom($$value) {
          cnx_custom = $$value;
          $$settled = false;
        },
        get appvar() {
          return cnx_appvar;
        },
        set appvar($$value) {
          cnx_appvar = $$value;
          $$settled = false;
        },
        get environment() {
          return endpoint.environment;
        },
        set environment($$value) {
          endpoint.environment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function CellPromptType($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let ListTypes = [
      { value: "AI Message", id: "ai" },
      { value: "Human Message", id: "human" },
      { value: "System Message", id: "system" },
      { value: "Placeholder", id: "placeholder" },
      //	{ value: 'Tool Message', id: 'tool', enabled: false },
      { value: "User Message", id: "user" }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<td>`);
      BasicSelect($$renderer3, {
        isExpanded: true,
        options: ListTypes,
        onselect: (e) => {
          console.log("Cambia", e, value);
        },
        get option() {
          return value;
        },
        set option($$value) {
          value = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></td>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { value, row });
  });
}
function CellPrompt($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0, onchangecell = () => {
    } } = $$props;
    $$renderer2.push(`<td><textarea class="textarea is-small" placeholder="Prompt" rows="2">`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></td>`);
    bind_props($$props, { value, row });
  });
}
function Chat($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class_content = "is-small",
      onmessage = () => {
      },
      currentChat = {
        id: 1,
        name: "Ana Pérez",
        preview: "Hola, ¿cómo estás?",
        time: "12:30",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        active: true
      },
      messages = [
        {
          type: "ia",
          sender: "Ana Pérez",
          prompt: "Hola, ¿cómo estás?",
          time: "12:30"
        },
        {
          type: "user",
          prompt: "¡Hola! Todo bien, ¿y tú?",
          time: "12:31",
          status: "read"
        },
        {
          type: "ia",
          sender: "Ana Pérez",
          prompt: "Muy bien, gracias. ¿Qué tal el trabajo?",
          time: "12:32"
        },
        {
          type: "user",
          prompt: "Bien, bastante ocupado últimamente. ¿Y tú?",
          time: "12:33",
          status: "read"
        },
        {
          type: "ia",
          sender: "Ana Pérez",
          prompt: "Igual, pero me encanta lo que hago. ¿Tienes planes para el fin de semana?",
          time: "12:34"
        }
      ]
    } = $$props;
    let messageInput = "";
    let messages_list = derived(() => messages);
    $$renderer2.push(`<div class="content svelte-154642"><div class="svelte-154642"><!--[-->`);
    const each_array = ensure_array_like(
      // Desplazar al final cuando los mensajes cambian
      messages_list()
    );
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let message = each_array[$$index];
      if (message.type === "ia") {
        $$renderer2.push(`<!--[0--><div class="is-flex is-justify-content-flex-start padding_msg svelte-154642"><span${attr_class(`box w_message_in content ${stringify(class_content)}`, "svelte-154642")}>${escape_html(message.prompt)}</span></div>`);
      } else if (message.type === "user") {
        $$renderer2.push(`<!--[1--><div class="is-flex is-justify-content-flex-end padding_msg svelte-154642"><span${attr_class(`box w_message_out content ${stringify(class_content)}`, "svelte-154642")}>${escape_html(message.prompt)}</span></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <div class="content sep svelte-154642"><div class="field has-addons svelte-154642"><div${attr_class(`control ${stringify(class_content)} is-expanded`, "svelte-154642")}><input class="input svelte-154642"${attr("value", messageInput)}/></div> <div class="control svelte-154642"><button class="button svelte-154642"><span${attr_class(`icon ${stringify(class_content)} has-text-success`, "svelte-154642")}><i class="fas fa-paper-plane svelte-154642"></i></span></button></div></div></div></div>`);
    bind_props($$props, { class_content, currentChat, messages });
  });
}
function Ia_chat_tester($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { url = "", init_prompts = [] } = $$props;
    let messages = [];
    async function fnSendMessage(e) {
      console.log(e, snapshot(init_prompts));
      const prompt = e.message;
      messages.push({ type: "user", prompt });
      messages = [...messages];
      const uF = new uFetch();
      let response = await uF.post({
        url,
        data: {
          prompt: { history: snapshot(messages), user: prompt, init_prompts }
        }
      });
      if (response.status == 200) {
        let data = await response.json();
        console.log("Respuesta chat", data);
        messages.push({ type: "ia", prompt: data.output });
      } else if (response.status == 404) {
        messages.push({ type: "ia", prompt: "Server not exists" });
      } else if (response.status == 500) {
        messages.push({ type: "ia", prompt: response.statusText });
      } else {
        console.log(response);
      }
      messages = [...messages];
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div>`);
      Basic$1($$renderer3, {
        label: "Agent URL",
        placeholder: "Enter chat URL",
        get value() {
          return url;
        },
        set value($$value) {
          url = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Chat($$renderer3, {
        onmessage: fnSendMessage,
        get messages() {
          return messages;
        },
        set messages($$value) {
          messages = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { url, init_prompts });
  });
}
function Agentia($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      idapp = void 0,
      endpoint = { endpoint: "", method: "", environment: "" },
      onchange = () => {
      }
    } = $$props;
    let columns = {
      //enabled: { label: 'Enabled App' },
      enabled: {
        label: "Enabled",
        decorator: {
          component: Boolean$1,
          props: {
            custom: {
              ontrue: { label: "Enabled" },
              onfalse: { label: "Unabled" },
              editInline: true
            }
          }
        }
      },
      type: { label: "Type", decorator: { component: CellPromptType } },
      prompt: { decorator: { component: CellPrompt }, label: "Prompt" }
    };
    let cnx_param_var = "";
    const example_config_model = {
      modelProvider: "ollama",
      model: "qwen3:0.6b",
      temperature: 0.1,
      baseUrl: "http://localhost:11434",
      timeout: 6e4 * 30
      // 30 minutos
    };
    let example_agent_options = {
      verbose: false,
      returnIntermediateSteps: false,
      maxIterations: 5
      // opcional, aumenta si necesitas más pasos
    };
    let mcpsevers_example = {
      server_name_1: {
        type: "http",
        url: "http://server_mcp.com:3030/api/mcp/server/prd"
      },
      server_name_2: { type: "streamable", url: "http://other_server.com/api/tools" },
      server_03: {
        type: "http",
        url: "http://localhost:3000/api/mcp",
        headers: {
          Apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJjbGllbnRlIjoiZW1wczVzYSIsInNlcnZpY2lvIjoiRGV1ZG9yZXNQYXJ0aRRhcyIsImlhdCI6MTUxNjIzOTAyMn0.Lo0Kg9gOmYvjQXVi9rA_NdzQqQ7w1yFJn7tmPZeN1VI"
        }
      },
      weather: {
        url: "http://localhost:8000/mcp/",
        transport: "streamable_http"
      }
    };
    let tabList = [
      {
        label: "Model",
        isActive: true,
        classIcon: " fa-solid fa-robot ",
        component: tab_model
      },
      { label: "MCP servers", component: tab_mcp_servers },
      { label: "Prompts", component: tab_prompts },
      { label: "Chat Tester", component: tab_chat_tester }
    ];
    let agent_options = {};
    let model = "";
    let provider = "";
    let mcpServers = {};
    let prompts = [];
    let timeoutChange;
    function fnOnChange() {
      onchange(getData());
    }
    function getData() {
      let data = { code: getCode(), data_test: snapshot(endpoint.data_test) };
      return data;
    }
    function getCode() {
      let conf = {};
      let outcode = {};
      conf = cnx_param_var;
      try {
        outcode.config = conf;
        outcode.agent_options = agent_options;
        outcode.model = model;
        outcode.provider = provider;
        outcode.mcpServers = mcpServers;
        outcode.init_prompts = prompts;
        return JSON.stringify(outcode);
      } catch (error) {
        return code;
      }
    }
    function resetPromts() {
      prompts = [...prompts];
    }
    onDestroy(() => {
      clearTimeout(timeoutChange);
    });
    function tab_model($$renderer3) {
      $$renderer3.push(`<div><div class="content">Open Fusion API uses Langchain in the background to provide AI tools.</div> <div>`);
      App_vars_selector($$renderer3, {
        onselect: (selected) => {
          fnOnChange();
        },
        get value() {
          return model;
        },
        set value($$value) {
          model = $$value;
          $$settled = false;
        },
        get environment() {
          return endpoint.environment;
        },
        set environment($$value) {
          endpoint.environment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="content"><details><summary>Example</summary> <code>${html(jsonToHtmlString(example_config_model))}</code></details></div></div> <div><br/> <div class="content">Agent options:</div></div> `);
      EditorCode($$renderer3, {
        isReadOnly: false,
        lang: "json",
        showFormat: true,
        onchange: (c) => {
          fnOnChange();
        },
        get code() {
          return agent_options;
        },
        set code($$value) {
          agent_options = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="content"><details><summary>Example</summary> <code>${html(jsonToHtmlString(example_agent_options))}</code></details></div> <br/> <div class="content">For more information about the model configuration, visit the <a href="https://js.langchain.com/docs/how_to/chat_models_universal_init/">Langchain documentation</a>.</div></div>`);
    }
    function tab_prompts($$renderer3) {
      {
        let lt01 = function($$renderer4) {
          $$renderer4.push(`<!---->List of initial Prompt to be executed at agent startup.`);
        };
        Table($$renderer3, {
          showNewButton: "true",
          showDeleteButton: "true",
          columns,
          left_items: [lt01],
          ondeleterow: (data) => {
            if (confirm("Do you want to delete the prompt selected?")) {
              prompts = prompts.filter((item) => {
                return !data.rows.some((element) => element.internal_hash_row == item.internal_hash_row);
              });
              resetPromts();
            }
          },
          onnewrow: () => {
            prompts.push({ enabled: true, type: "system", prompt: "" });
            resetPromts();
          },
          get RawDataTable() {
            return prompts;
          },
          set RawDataTable($$value) {
            prompts = $$value;
            $$settled = false;
          },
          lt01,
          $$slots: { lt01: true }
        });
      }
    }
    function tab_mcp_servers($$renderer3) {
      $$renderer3.push(`<div><div class="content">List of MCP servers to use:</div></div> <br/> `);
      App_vars_selector($$renderer3, {
        onselect: (selected) => {
          fnOnChange();
        },
        get value() {
          return mcpServers;
        },
        set value($$value) {
          mcpServers = $$value;
          $$settled = false;
        },
        get environment() {
          return endpoint.environment;
        },
        set environment($$value) {
          endpoint.environment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="content"><details><summary>Example</summary> <code>${html(jsonToHtmlString(mcpsevers_example))}</code></details></div> <div><div class="content is-small">To connect to MCP servers you can consult the <a href="https://github.com/langchain-ai/langchain-mcp-adapters?tab=readme-ov-file#client-1">documentation</a>.</div></div>`);
    }
    function tab_chat_tester($$renderer3) {
      $$renderer3.push(`<div>`);
      Ia_chat_tester($$renderer3, {
        url: endpoint.endpoint,
        get init_prompts() {
          return prompts;
        },
        set init_prompts($$value) {
          prompts = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { idapp, endpoint });
  });
}
function SqlBulkInsert($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      endpoint = { endpoint: "", method: "", environment: "" },
      onchange = () => {
      }
    } = $$props;
    let cnx_custom = {};
    let cnx_appvar = "";
    let tabList = [
      {
        label: "Parameters",
        isActive: true,
        classIcon: " fa-solid fa-database ",
        component: tab_tablename
      },
      { label: "Connection Parameters", component: tab_cnx_params }
    ];
    let data_example = {
      data: [
        { field01: 1, field02: "demo", field03: /* @__PURE__ */ new Date() },
        { field01: 2, field02: "test", field03: /* @__PURE__ */ new Date() },
        { field01: 5, field02: "app", field03: /* @__PURE__ */ new Date() },
        { field01: 12, field02: "red", field03: /* @__PURE__ */ new Date() },
        { field01: 20, field02: "dog", field03: /* @__PURE__ */ new Date() },
        { field01: 3, field02: "edwinspire", field03: /* @__PURE__ */ new Date() }
      ]
    };
    let table_name = "";
    function fnOnChange() {
      onchange(getData());
    }
    function getData() {
      let data = {
        code: table_name,
        custom_data: cnx_appvar && typeof cnx_appvar === "string" && cnx_appvar.trim().length > 0 ? cnx_appvar : cnx_custom,
        ignoreDuplicates: endpoint.custom_data?.ignoreDuplicates ?? false,
        data_test: snapshot(endpoint.data_test)
      };
      return data;
    }
    function tab_tablename($$renderer3) {
      Basic$1($$renderer3, {
        label: "Table Name",
        type: "text",
        placeholder: "Table Name",
        onchange: () => {
          fnOnChange();
        },
        get value() {
          return table_name;
        },
        set value($$value) {
          table_name = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="content is-small"><h4>Bulk INSERT</h4> <div>Performs a bulk insert into a SQL database table.</div> <div>The necessary parameters are the "table name" and an array with the data.<br/> The data you send must contain a JSON where the key must contain the exact name of the database
			field. <br/> <details><summary>For example, the following JSON represents a list of rows to be inserted:</summary> `);
      JSONView($$renderer3, {
        get jsonObject() {
          return data_example;
        },
        set jsonObject($$value) {
          data_example = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></details></div> <div><span class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle fa-fade"></i></span> <span class="label is-small">Depending on the database engine you may have a <strong>lock</strong> on the table during
					the bulk insert process.</span></span></div></div>`);
    }
    function tab_cnx_params($$renderer3) {
      $$renderer3.push(`<div><div class="content is-small">Configuration parameters used by sequelize, visit <a href="https://sequelize.org/">https://sequelize.org/</a> for more information.</div> <div><span class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle fa-fade"></i></span> <span class="label is-small">ignoreDuplicates parameter only: MySQL, MariaDB, SQLite >= 3.24.0 &amp; Postgres >= 9.5</span></span></div></div> `);
      Params_json_selector($$renderer3, {
        onselect: (selected) => {
          fnOnChange();
        },
        get custom() {
          return cnx_custom;
        },
        set custom($$value) {
          cnx_custom = $$value;
          $$settled = false;
        },
        get appvar() {
          return cnx_appvar;
        },
        set appvar($$value) {
          cnx_appvar = $$value;
          $$settled = false;
        },
        get environment() {
          return endpoint.environment;
        },
        set environment($$value) {
          endpoint.environment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function SqlHana($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { endpoint = {}, onchange = () => {
    } } = $$props;
    let cnx_sample = {
      host: "<host-name>",
      port: "<port>",
      user: "SYSTEM",
      password: "manager",
      pooling: true
    };
    let sample_bind_post = {
      bind: {
        value_01: 1234,
        list_your_values: ["0002000157", "0002000158"]
      }
    };
    let tabList = [
      {
        label: "Query",
        isActive: true,
        classIcon: " fa-solid fa-database ",
        component: tab_query
      },
      { label: "Pass Parameters", component: tab_pass_params },
      { label: "Connection Parameters", component: tab_cnx_params }
    ];
    let query_code = "";
    let cnx_custom = {};
    let cnx_appvar = "";
    function fnOnChange() {
      console.log("fnOnChange HANA");
      onchange(getData());
    }
    function getData() {
      let data = {
        code: query_code,
        custom_data: cnx_appvar && typeof cnx_appvar === "string" && cnx_appvar.trim().length > 0 ? cnx_appvar : cnx_custom,
        data_test: snapshot(endpoint.data_test)
      };
      console.log(data);
      return data;
    }
    function tab_query($$renderer3) {
      $$renderer3.push(`<div><div><div><div class="content is-small"><span style="font-style: oblique; font-weight: bold;">$nameparameter</span> to bind, or <span style="font-style: oblique; font-weight: bold;">:nameparameter</span> to use
					array bind. The values ​​you send in the request. For more information go to the "Pass parameters"
					tab.</div></div></div> `);
      EditorCode($$renderer3, {
        isReadOnly: false,
        lang: "sql",
        showFormat: true,
        onchange: (c) => {
          fnOnChange();
        },
        get code() {
          return query_code;
        },
        set code($$value) {
          query_code = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    function tab_pass_params($$renderer3) {
      $$renderer3.push(`<div><div class="content is-small"><p>This "handler" uses <a href="https://help.sap.com/docs/HANA_SERVICE_CF/1efad1691c1f496b8b580064a6536c2d/a5c332936d9f47d8b820a4ecc427352c.html">@sap/hana-client internally</a>. However, the way the parameters are passed is a little different in order to facilitate
				its use.</p> <div class="block"><h4>Parameter name</h4> <div class="block">If in the query you use the parameter with the prefix <strong>"$"</strong> (<code>$param_name</code>), it is expected that this variable corresponds to a value that will be injected into
					the query. <br/> <div class="block">For example the following query: <br/> <code>SELECT * FROM YOUR_TABLE WHERE FIELD_01 = $value_01;</code> <br/> Internally the query becomes:: <br/> <code>SELECT * FROM YOUR_TABLE WHERE FIELD_01 = ?;</code></div></div> <div class="block">If in the query you use the parameter with the prefix <strong>":"</strong> (<code>:param_name</code>), this variable is expected to contain an array of values ​​that will be injected into
					the query. <br/> <div class="block">For example the following query: <br/> <code>SELECT * FROM YOUR_TABLE WHERE FIELD_01 = $value_01 AND FIELD_02 IN (:list_your_values);</code> <br/> The parameters you must send should look like the following example: <br/> `);
      JSONView($$renderer3, {
        get jsonObject() {
          return sample_bind_post;
        },
        set jsonObject($$value) {
          sample_bind_post = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <br/> Internally the query becomes: <br/> <code>SELECT * FROM YOUR_TABLE WHERE FIELD_01 = ? AND FIELD_02 IN (?, ?);</code></div></div> <div class="icon-text"><span class="icon has-text-warning"><i class="fa-solid fa-circle-exclamation"></i></span> <span>Note that parameter names when sent in the request should not include the prefix.</span></div> <div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>If you send a parameter that is not present in the query you will get an error similar
						to: <code>There are missing parameters.</code></span></div></div> `);
      if (endpoint.method === "GET") {
        $$renderer3.push(`<!--[0--><div class="block"><div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>GET Method - Warning</span></div> <div class="block">The GET method is recommended only for simple requests where there is no input
						parameters, or failing that the parameters are key-value on query request, which will be
						used to bind with the variables of the SQL query.</div></div>`);
      } else if (endpoint.method === "POST") {
        $$renderer3.push(`<!--[1--><div class="block"><div class="icon-text"><span class="icon has-text-info"><i class="fa-solid fa-circle-exclamation"></i></span> <span>When you use the POST method, the input parameters must be sent in the BODY in JSON
							format, using the following example:</span></div> <br/> `);
        JSONView($$renderer3, {
          get jsonObject() {
            return sample_bind_post;
          },
          set jsonObject($$value) {
            sample_bind_post = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div>`);
    }
    function tab_cnx_params($$renderer3) {
      $$renderer3.push(`<div><div><div class="content is-small">Configuration parameters used by @sap/hana-client, visit <a href="https://help.sap.com/docs/HANA_SERVICE_CF/1efad1691c1f496b8b580064a6536c2d/4fe9978ebac44f35b9369ef5a4a26f4c.html">@sap/hana-client</a> for more information. <div class="content is-small"><details><summary>By example, in most cases the following connection parameters are sufficient:</summary> `);
      JSONView($$renderer3, {
        get jsonObject() {
          return cnx_sample;
        },
        set jsonObject($$value) {
          cnx_sample = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></details></div></div></div> `);
      Params_json_selector($$renderer3, {
        onselect: (selected) => {
          fnOnChange();
        },
        get custom() {
          return cnx_custom;
        },
        set custom($$value) {
          cnx_custom = $$value;
          $$settled = false;
        },
        get appvar() {
          return cnx_appvar;
        },
        set appvar($$value) {
          cnx_appvar = $$value;
          $$settled = false;
        },
        get environment() {
          return endpoint.environment;
        },
        set environment($$value) {
          endpoint.environment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function Text($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let notify = new Notifications$1();
    let { endpoint = {}, onchange = () => {
    } } = $$props;
    const mimeTypes = [
      {
        id: "text/plain",
        value: "text/plain",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/html",
        value: "text/html",
        enabled: true,
        editor: "html"
      },
      {
        id: "text/css",
        value: "text/css",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/javascript",
        value: "text/javascript",
        enabled: true,
        editor: "js"
      },
      {
        id: "text/xml",
        value: "text/xml",
        enabled: true,
        editor: "xml"
      },
      {
        id: "application/wsdl+xml",
        value: "application/wsdl+xml",
        enabled: true,
        editor: "xml"
      },
      {
        id: "text/csv",
        value: "text/csv",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/markdown",
        value: "text/markdown",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/cache-manifest",
        value: "text/cache-manifest",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/calendar",
        value: "text/calendar",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/vnd.sun.j2me.app-descriptor",
        value: "text/vnd.sun.j2me.app-descriptor",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/vnd.wap.wml",
        value: "text/vnd.wap.wml",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/vnd.wap.wmlscript",
        value: "text/vnd.wap.wmlscript",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-asm",
        value: "text/x-asm",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-c",
        value: "text/x-c",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-fortran",
        value: "text/x-fortran",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-java-source",
        value: "text/x-java-source",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-markdown",
        value: "text/x-markdown",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-nfo",
        value: "text/x-nfo",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-opml",
        value: "text/x-opml",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-pascal",
        value: "text/x-pascal",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-script",
        value: "text/x-script",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-script.perl",
        value: "text/x-script.perl",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-script.python",
        value: "text/x-script.python",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-server-parsed-html",
        value: "text/x-server-parsed-html",
        enabled: true,
        editor: "html"
      },
      {
        id: "text/x-setext",
        value: "text/x-setext",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-sfv",
        value: "text/x-sfv",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-uuencode",
        value: "text/x-uuencode",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-vcalendar",
        value: "text/x-vcalendar",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-vcard",
        value: "text/x-vcard",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/troff",
        value: "text/troff",
        enabled: true,
        editor: "text"
      },
      {
        id: "text/x-component",
        value: "text/x-component",
        enabled: true,
        editor: "text"
      }
    ];
    let tabList = [{ label: "Payload", isActive: true, component: tab_payload }];
    let payload = "";
    let custom_data = { mimeType: "text/plain" };
    let file_selected = void 0;
    let langEditor = derived(() => mimeTypes.find((m) => m.id === custom_data.mimeType)?.editor ?? "text");
    function getData() {
      return {
        code: payload,
        custom_data,
        data_test: snapshot(endpoint.data_test),
        File: file_selected
      };
    }
    function fnOnChange() {
      onchange(getData());
    }
    function tab_payload($$renderer3) {
      $$renderer3.push(`<div><div><div><div class="content is-small">Plain Text that will be returned by the Endpoint.</div></div></div> `);
      EditorCode($$renderer3, {
        lang: langEditor(),
        showFormat: true,
        onchange: (c) => {
          fnOnChange();
        },
        get code() {
          return payload;
        },
        set code($$value) {
          payload = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    function left_buttons($$renderer3) {
      $$renderer3.push(`<div class="field has-addons"><p class="control"><button${attr_class(`button is-small ${!custom_data.isBase64 ? "is-primary" : ""}`)}><span class="icon is-small"><i class="fa fa-file-alt"></i></span> <span>As Text Plain</span></button></p> <p class="control"><button${attr_class(`button is-small ${custom_data.isBase64 ? "is-primary" : ""}`)}><span class="icon is-small"><i class="fas fa-file-invoice"></i></span> <span>As File</span></button></p></div>`);
    }
    function right_predictive($$renderer3) {
      $$renderer3.push(`<div>`);
      Basic$1($$renderer3, {
        accept: "*",
        label: "Load from file",
        showUploadButton: false,
        type: "file",
        title: "Select file",
        placeholder: "Select file",
        onchange: (c) => {
          const selectedFile = c.target.files[0];
          if (!selectedFile) {
            custom_data.fileName = "";
            file_selected = void 0;
            return;
          }
          const MAX_SIZE = 1048576;
          if (selectedFile.size > MAX_SIZE) {
            notify.push({
              message: "The selected file exceeds the 1MB limit.",
              color: "danger"
            });
            file_selected = void 0;
            custom_data.fileName = "";
            c.target.value = "";
            return;
          }
          const mimeType = selectedFile.type || "application/octet-stream";
          const isText = mimeType.startsWith("text/") || mimeType === "application/json" || mimeType === "application/javascript" || mimeType === "application/xml";
          if (isText) {
            const reader = new FileReader();
            reader.onload = (e) => {
              payload = e.target.result;
              custom_data.isBase64 = false;
              custom_data.fileName = void 0;
              file_selected = void 0;
              c.target.value = "";
              custom_data.mimeType = mimeType;
              fnOnChange();
            };
            reader.readAsText(selectedFile);
            return;
          }
          file_selected = selectedFile;
          custom_data.fileName = selectedFile.name;
          custom_data.mimeType = mimeType;
          custom_data.isBase64 = true;
          fnOnChange();
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Level($$renderer3, { left: [left_buttons], right: [right_predictive] });
      $$renderer3.push(`<!----> `);
      Predictive($$renderer3, {
        label: "MIME Type",
        options: mimeTypes.map((m) => ({ ...m, name: m.value })),
        freeTyping: true,
        onselect: () => {
          fnOnChange();
        },
        get selectedValue() {
          return custom_data.mimeType;
        },
        set selectedValue($$value) {
          custom_data.mimeType = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (custom_data && custom_data.isBase64) {
        $$renderer3.push("<!--[0-->");
        if (custom_data.fileName) {
          $$renderer3.push(`<!--[0--><div class="buttons has-addons"><button class="button is-small is-static">Filename</button> <button class="button is-small">${escape_html(custom_data.fileName)}</button></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
        Tab($$renderer3, {
          get tabs() {
            return tabList;
          },
          set tabs($$value) {
            tabList = $$value;
            $$settled = false;
          }
        });
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function tab_pred_vars$1($$renderer) {
  Js_predefined_vars($$renderer);
}
function Mongodb($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      endpoint = { endpoint: "", method: "", environment: "" },
      onchange = () => {
      }
    } = $$props;
    let cnx_custom = {};
    let cnx_appvar = "";
    let tabList = [
      {
        label: "Code",
        isActive: true,
        classIcon: " fa-brands fa-node-js ",
        component: tab_code
      },
      { label: "Modules and functions", component: tab_pred_vars$1 },
      { label: "Connection Parameters", component: tab_cnx_params }
    ];
    let js_code = "// JS Code";
    let cnx_param_sample = {
      host: "localhost",
      port: 27017,
      dbName: "my_db",
      user: "",
      pass: "",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    };
    function fnOnChange() {
      onchange(getData());
    }
    function getData() {
      let data = {
        code: js_code,
        custom_data: cnx_appvar && typeof cnx_appvar === "string" && cnx_appvar.trim().length > 0 ? cnx_appvar : cnx_custom,
        data_test: snapshot(endpoint.data_test)
      };
      return data;
    }
    function tab_code($$renderer3) {
      $$renderer3.push(`<div><div><div class="content is-small">For more information you can consult the <a href="https://mongoosejs.com/">MONGOOSE</a> and <a href="https://www.mongodb.com/products/updates/version-release">MongoDB</a> documentation.</div> <div class="content is-small">The mongose ​​instance with the connection is called <code>mongooseInstance</code> and you can
				use it within the code.</div></div></div> `);
      EditorCode($$renderer3, {
        isReadOnly: false,
        lang: "js",
        showFormat: true,
        onchange: (c) => {
          fnOnChange();
        },
        get code() {
          return js_code;
        },
        set code($$value) {
          js_code = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    function tab_cnx_params($$renderer3) {
      $$renderer3.push(`<div><div class="content is-small">Configuration parameters used by mongoosejs, visit <a href="https://mongoosejs.com/">Mongoose</a> for more information. <br/> <details><summary>Example of configuration parameters:</summary> `);
      JSONView($$renderer3, { jsonObject: cnx_param_sample });
      $$renderer3.push(`<!----></details> <br/> `);
      Params_json_selector($$renderer3, {
        onselect: (selected) => {
          console.log("SQL AppVarsSelector Editor", selected, cnx_custom, cnx_appvar);
          fnOnChange();
        },
        get custom() {
          return cnx_custom;
        },
        set custom($$value) {
          cnx_custom = $$value;
          $$settled = false;
        },
        get appvar() {
          return cnx_appvar;
        },
        set appvar($$value) {
          cnx_appvar = $$value;
          $$settled = false;
        },
        get environment() {
          return endpoint.environment;
        },
        set environment($$value) {
          endpoint.environment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function CustomFunction($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { endpoint = {}, onchange = () => {
    } } = $$props;
    let functions = derived(() => {
      let r = [];
      switch (endpoint.environment) {
        case "dev":
          r = store_get($$store_subs ??= {}, "$listFunctionStoreDev", listFunctionStoreDev);
          break;
        case "qa":
          r = store_get($$store_subs ??= {}, "$listFunctionStoreQA", listFunctionStoreQA);
          break;
        case "prd":
          r = store_get($$store_subs ??= {}, "$listFunctionStorePRD", listFunctionStorePRD);
          break;
      }
      return r;
    });
    let tabList = [{ label: "Function", isActive: true, component: tab_fn }];
    function getData() {
      return {
        code: endpoint.code,
        data_test: snapshot(endpoint.data_test)
      };
    }
    function fnOnChange() {
      onchange(getData());
    }
    function tab_fn($$renderer3) {
      $$renderer3.push(`<div class="content is-small">Use the selected function to return a response.</div> <div class="field is-horizontal"><div class="field-label is-normal"><label class="label is-small">Function</label></div> <div class="field-body"><div class="field is-narrow">`);
      Select($$renderer3, {
        options: functions(),
        onchange: (s) => {
          fnOnChange();
        },
        get option() {
          return endpoint.code;
        },
        set option($$value) {
          endpoint.code = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<!--[-->`);
      {
        Tab($$renderer3, {
          get tabs() {
            return tabList;
          },
          set tabs($$value) {
            tabList = $$value;
            $$settled = false;
          }
        });
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { endpoint });
  });
}
function Methods_select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { disabled = false, option = {}, onselect } = $$props;
    let methods = [];
    const unsubscribe = listMethodStore.subscribe((value) => {
      methods = value;
    });
    onDestroy(unsubscribe);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (methods) {
        $$renderer3.push("<!--[0-->");
        BasicSelect($$renderer3, {
          label: "Method",
          onselect,
          get disabled() {
            return disabled;
          },
          set disabled($$value) {
            disabled = $$value;
            $$settled = false;
          },
          get options() {
            return methods;
          },
          set options($$value) {
            methods = $$value;
            $$settled = false;
          },
          get option() {
            return option;
          },
          set option($$value) {
            option = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { disabled, option });
  });
}
function Endpoint($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      endpoint = { method: "X", access: 0, handler: "?", environment: "?" },
      app = {},
      validateResource = false,
      availableURL = false,
      oncopy = () => {
      }
    } = $$props;
    let notify = new Notifications$1();
    let environment_list = Environment;
    let handlers = [];
    let new_keyword = "";
    let ShowDialogCopyEndpoint = false;
    let list_keywords = derived(() => {
      return endpoint && endpoint.keywords ? endpoint.keywords.split(",") : [];
    });
    let available_environments_list = derived(() => {
      return environment_list && Array.isArray(environment_list) ? environment_list.filter((el) => {
        return el.id != endpoint.environment;
      }) : [];
    });
    let endpoint_copied = void 0;
    let endpoint_env_copy = "";
    let endpoint_replace_copy = false;
    const unsubscribe = listHandlerStore.subscribe((value) => {
      handlers = value;
    });
    onDestroy(unsubscribe);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div>`);
      {
        let enabled_endpoint = function($$renderer4) {
          Basic$1($$renderer4, {
            label: "Enabled",
            type: "checkbox",
            placeholder: "Enabled",
            get value() {
              return endpoint.enabled;
            },
            set value($$value) {
              endpoint.enabled = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            label: "Title",
            type: "text",
            placeholder: "Title",
            get value() {
              return endpoint.title;
            },
            set value($$value) {
              endpoint.title = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!---->`);
        }, copy_endpoint = function($$renderer4) {
          if (endpoint.idendpoint && endpoint.idendpoint.length > 0) {
            $$renderer4.push(`<!--[0--><div class="field has-addons"><p class="control"><button class="button is-small is-info"><span class="icon is-small"><i class="fa-solid fa-copy"></i></span> <span>Copy endpoint to</span></button></p></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Level($$renderer3, {
          left: [enabled_endpoint],
          right: [copy_endpoint]
        });
      }
      $$renderer3.push(`<!----> <input class="input" type="hidden" placeholder="Name"${attr("value", endpoint.idendpoint)}/> <div class="field is-expanded"><div class="field has-addons"><p class="control"><a class="button is-small is-static">API Resource:</a></p> <p class="control"><a class="button is-small is-static">${escape_html(endpoint.method == "WS" ? "/ws/" : "/api/")}${escape_html(app.app)}</a></p> <p class="control is-expanded"><input class="input is-small" type="text" placeholder="Resourse"${attr("disabled", endpoint.handler == "MCP", true)}${attr("value", endpoint.resource)}/></p> <p class="control"><a class="button is-small is-static">/</a></p> <p class="control">`);
      if (endpoint && endpoint.environment) {
        $$renderer3.push("<!--[0-->");
        Select($$renderer3, {
          onselect: (e) => {
          },
          get options() {
            return environment_list;
          },
          set options($$value) {
            environment_list = $$value;
            $$settled = false;
          },
          get option() {
            return endpoint.environment;
          },
          set option($$value) {
            endpoint.environment = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></p></div> <div class="help">`);
      if (validateResource) {
        $$renderer3.push(`<!--[0--><div class="icon-text is-small"><span class="icon has-text-success"><i class="fas fa-check-square"></i></span> <span>Url Success</span></div>`);
      } else {
        $$renderer3.push(`<!--[-1--><div class="icon-text is-small"><span class="icon has-text-danger"><i class="fas fa-ban"></i></span> <span>Url Invalid</span></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      if (validateResource && availableURL) {
        $$renderer3.push(`<!--[0--><div class="icon-text is-small"><span class="icon has-text-success"><i class="fas fa-check-square"></i></span> <span>Available URL</span></div>`);
      } else if (validateResource && !availableURL) {
        $$renderer3.push(`<!--[1--><div class="icon-text is-small"><span class="icon has-text-danger"><i class="fas fa-ban"></i></span> <span>Url not available</span></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div> <hr/> <div class="fixed-grid has-2-cols"><div class="grid"><div class="cell">`);
      if (endpoint?.handler) {
        $$renderer3.push("<!--[0-->");
        BasicSelect($$renderer3, {
          label: "Handler",
          onselect: (e) => {
            console.log("endpoint", e);
            if (e.value == "MCP") {
              endpoint.method = "POST";
              endpoint.resource = "/mcp/server";
            } else if (e.value == "AGENT_IA") {
              endpoint.method = "POST";
            } else if (e.value == "TELEGRAM_BOT") {
              endpoint.method = "POST";
            } else if (e.value == "SQL_BULK_I") {
              endpoint.method = "POST";
            }
          },
          get options() {
            return handlers;
          },
          set options($$value) {
            handlers = $$value;
            $$settled = false;
          },
          get option() {
            return endpoint.handler;
          },
          set option($$value) {
            endpoint.handler = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="cell">`);
      if (endpoint && endpoint.access !== void 0) {
        $$renderer3.push("<!--[0-->");
        BasicSelect($$renderer3, {
          label: "Access",
          options: listAccessMethod,
          onselect: (e) => {
            console.log("endpoint", endpoint);
          },
          get option() {
            return endpoint.access;
          },
          set option($$value) {
            endpoint.access = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="cell">`);
      if (endpoint?.method) {
        $$renderer3.push("<!--[0-->");
        Methods_select($$renderer3, {
          get option() {
            return endpoint.method;
          },
          set option($$value) {
            endpoint.method = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="cell"><div class="field"><div class="field is-horizontal"><div class="field-body"><div class="field is-expanded"><div class="field has-addons"><p class="control"><a class="button is-small is-static">Timeout Cache:</a></p> <p class="control"><input class="input is-small" type="number" min="0" step="1"${attr("value", endpoint.cache_time)}/></p> <p class="control"><a class="button is-small is-static">seconds.</a></p></div></div></div></div></div></div> <div class="cell"><div class="field"><div class="field is-horizontal"><div class="field-body"><div class="field is-expanded"><div class="field has-addons"><p class="control"><a class="button is-small is-static">Timeout Endpoint:</a></p> <p class="control"><input class="input is-small" type="number" min="0" step="1"${attr("value", endpoint.timeout)}/></p> <p class="control"><a class="button is-small is-static">seconds.</a></p></div></div></div></div></div></div></div></div> <hr/> <div class="field"><label class="label is-small">Keywords</label> <div class="control">`);
      Basic$1($$renderer3, {
        label: "Add Keyword",
        onchange: () => {
          if (new_keyword && new_keyword.trim().length > 0) {
            let keywords_array = endpoint.keywords ? endpoint.keywords.split(",").map((k) => k.trim()) : [];
            if (!keywords_array.includes(new_keyword.trim())) {
              keywords_array.push(new_keyword.trim());
              endpoint.keywords = keywords_array.join(",");
            }
            new_keyword = "";
          }
        },
        get value() {
          return new_keyword;
        },
        set value($$value) {
          new_keyword = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="field is-grouped is-grouped-multiline"><!--[-->`);
      const each_array = ensure_array_like(list_keywords());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let kw = each_array[$$index];
        $$renderer3.push(`<div class="control"><div class="tags has-addons"><a class="tag">${escape_html(kw)}</a>   <a class="tag is-delete is-danger"></a></div></div>`);
      }
      $$renderer3.push(`<!--]--></div></div></div> <hr/> <div class="field"><label class="label is-small">Description</label> <div class="control"><textarea class="textarea is-small" placeholder="Textarea">`);
      const $$body = escape_html(endpoint.description);
      if ($$body) {
        $$renderer3.push(`${$$body}`);
      }
      $$renderer3.push(`</textarea></div></div></div> `);
      {
        let titleModal = function($$renderer4) {
          $$renderer4.push(`<span>Copy endpoint to...</span>`);
        }, bodyDialogModal = function($$renderer4) {
          $$renderer4.push(`<div>Copy the endpoint to another environment including all configuration and testing parameters.</div> <br/> <div class="field has-addons"><p class="control"><a class="button is-small is-static">Copy to:</a></p> <p class="control">`);
          Select($$renderer4, {
            options: available_environments_list(),
            onchange: (e) => {
              if (app && app.endpoints) {
                let endpoint_find = app.endpoints.find((ep) => {
                  return ep.environment == endpoint_env_copy && ep.handler == endpoint.handler && ep.method == endpoint.method && ep.resource == endpoint.resource;
                });
                endpoint_copied = { ...endpoint };
                endpoint_copied.environment = endpoint_env_copy;
                endpoint_copied.idendpoint = null;
                endpoint_copied.endpoint = createEndpoint(endpoint_copied.method, app.app, endpoint_copied.resource, endpoint_copied.environment);
                if (endpoint_find) {
                  endpoint_copied.idendpoint = endpoint_find.idendpoint;
                }
              } else {
                endpoint_copied = {};
              }
            },
            get option() {
              return endpoint_env_copy;
            },
            set option($$value) {
              endpoint_env_copy = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></p></div> `);
          if (endpoint_copied && endpoint_copied.idendpoint && endpoint_copied.idendpoint.length > 0) {
            $$renderer4.push(`<!--[0--><label class="checkbox"><input type="checkbox"${attr("checked", endpoint_replace_copy, true)}/> I agree to replace all data on the endpoint.</label> `);
            {
              $$renderer4.push(`<!--[0--><br/> <div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>You are required to accept the replacement in order to continue.</span></div>`);
            }
            $$renderer4.push(`<!--]-->`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (endpoint_env_copy == "") {
            $$renderer4.push(`<!--[0--><div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>Select an environment to copy.</span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> <br/> <div>If you use application variables you must copy or create them individually.</div>`);
        };
        Modal_1($$renderer3, {
          title: titleModal,
          body: bodyDialogModal,
          onaccept: async () => {
            const is_new = !endpoint_copied.idendpoint || endpoint_copied.idendpoint.length === 0;
            if (is_new || endpoint_replace_copy) {
              if (endpoint_env_copy && endpoint_env_copy !== "") {
                try {
                  let result = await EndpointSave(endpoint_copied);
                  if (result && result.result && result.result.idapp == app.idapp) {
                    oncopy(result.result);
                    notify.push({
                      message: "Copied successfully to " + endpoint_env_copy,
                      color: "success"
                    });
                  } else {
                    notify.push({
                      message: "Error copying endpoint: " + (result.message || "Unknown error"),
                      color: "danger"
                    });
                  }
                } catch (error) {
                  console.error("Error copying endpoint: ", error);
                  notify.push({
                    message: "Error copying endpoint: " + error.message,
                    color: "danger"
                  });
                }
                ShowDialogCopyEndpoint = false;
              }
            } else {
              notify.push({
                message: "You must accept overwriting the endpoint data.",
                color: "success"
              });
            }
          },
          get show() {
            return ShowDialogCopyEndpoint;
          },
          set show($$value) {
            ShowDialogCopyEndpoint = $$value;
            $$settled = false;
          },
          titleModal,
          bodyDialogModal,
          $$slots: { titleModal: true, bodyDialogModal: true }
        });
      }
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint, app, validateResource, availableURL });
  });
}
function Authorizations($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { users = {} } = $$props;
    let table_users = [];
    let data_users = [];
    let columns = {
      auth: {
        label: "Authorization",
        decorator: {
          component: Boolean$1,
          props: {
            ontrue: { label: "Enabled" },
            onfalse: { label: "Unabled" },
            editInline: true
          }
        }
      },
      iduser: { label: "iduser", hidden: true },
      enabled: {
        label: "Enabled",
        decorator: {
          component: Boolean$1,
          props: {
            ontrue: { label: "Enabled" },
            onfalse: { label: "Unabled" },
            editInline: false
          }
        }
      },
      name: { label: "name" },
      username: { label: "username" },
      email: { label: "email" }
    };
    let timeoutChageAuth;
    const unsubscribe = storeUsersList.subscribe((value) => {
      data_users = value;
      buildTableUsers();
    });
    function defaultValue() {
      if (users == null) {
        users = [];
      }
    }
    function buildTableUsers() {
      defaultValue();
      if (data_users && Array.isArray(data_users)) {
        table_users = data_users.map((u) => {
          return { auth: users.includes(u.iduser), ...u };
        });
      }
    }
    onDestroy(() => {
      clearTimeout(timeoutChageAuth);
      unsubscribe();
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Table($$renderer3, {
        get RawDataTable() {
          return table_users;
        },
        set RawDataTable($$value) {
          table_users = $$value;
          $$settled = false;
        },
        get columns() {
          return columns;
        },
        set columns($$value) {
          columns = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { users });
  });
}
function Loglevel_select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { level = 0, ondata = (d) => {
    } } = $$props;
    let options = [
      { id: 0, value: `Disabled`, enabled: true },
      { id: 1, value: `Basic`, enabled: true },
      { id: 2, value: `Normal`, enabled: true },
      { id: 3, value: `Full`, enabled: true }
    ];
    $$renderer2.push(`<div>`);
    if (level >= 0) {
      $$renderer2.push(`<!--[0--><span><div class="field is-horizontal"><div class="field-body"><div class="field"><div class="control"><div class="select is-fullwidth is-small">`);
      $$renderer2.select({ value: level }, ($$renderer3) => {
        if (options && options.length > 0) {
          $$renderer3.push(`<!--[0--><!--[-->`);
          const each_array = ensure_array_like(options);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let h = each_array[$$index];
            $$renderer3.option({ value: h.id }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(h.value)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      });
      $$renderer2.push(`</div></div> <span class="help is-success"><div>`);
      if (level == 0) {
        $$renderer2.push(`<!--[0-->Does not save any log.`);
      } else if (level == 1) {
        $$renderer2.push(`<!--[1-->Save the minimum data.`);
      } else if (level == 2) {
        $$renderer2.push(`<!--[2-->Save the most useful data.`);
      } else if (level == 3) {
        $$renderer2.push(`<!--[3-->Saves all request and response data.`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></span></div></div></div></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { level });
  });
}
function Logs$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let uF = new uFetch(url_paths.getLogs);
    let {
      endpoint = {},
      log = {
        status_info: 1,
        status_success: 1,
        status_redirect: 1,
        status_client_error: 2,
        status_server_error: 3
      },
      ondata = (d) => {
      }
    } = $$props;
    let dataLogs = [];
    let datatraceLogs = [];
    let trace_id = "";
    let columns_trace = {
      response_data: { hidden: false },
      request_data: { hidden: true },
      idapp: { hidden: true },
      idendpoint: { hidden: true },
      idlog: { hidden: true },
      id: { hidden: true }
    };
    let columns_logs = {
      trace_id: { hidden: false },
      response_data: { hidden: false, decorator: { component: TreeView } },
      req_headers: { hidden: false, decorator: { component: TreeView } },
      res_headers: { hidden: false, decorator: { component: TreeView } },
      request_data: { hidden: true },
      idapp: { hidden: true },
      idendpoint: { hidden: true },
      idlog: { hidden: true },
      id: { hidden: true }
    };
    const now = DateTime.local();
    const formattedNow = now.toFormat("yyyy-MM-dd'T'HH:mm");
    const nowMinus24 = now.minus({ hours: 24 });
    const start = nowMinus24.toFormat("yyyy-MM-dd'T'HH:mm");
    let active_tab = 0;
    let params = {
      start_date: start,
      end_date: formattedNow,
      idendpoint: endpoint.idendpoint || "ffffffff-ffff-ffff-ffff-ffffffffffff",
      //	level: null,
      limit: 1e3,
      timezone: DateTime.local().z
    };
    let tabs = [
      {
        label: "Parametrization",
        classIcon: "fa-solid fa-rectangle-list",
        slot: "parameterization",
        isActive: true,
        component: tab_param
      },
      {
        label: "Registered logs",
        classIcon: "fa-solid fa-file-lines",
        slot: "logs",
        isActive: false,
        component: tab_logs
      },
      {
        label: "Trace Logs",
        classIcon: "fa-solid fa-file-lines",
        slot: "logs",
        isActive: false,
        component: tab_trace_logs
      }
    ];
    async function fetchLogs() {
      try {
        params.idendpoint = endpoint.idendpoint || "ffffffff-ffff-ffff-ffff-ffffffffffff";
        let req = await uF.get({ data: params });
        dataLogs = await req.json();
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }
    async function fetchTraceLogs() {
      try {
        let req = await uF.get({ data: { trace_id } });
        datatraceLogs = await req.json();
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }
    function tab_param($$renderer3) {
      $$renderer3.push(`<div class="content is-small"><table class="table is-fullwidth is-hoverable" style="background-color: transparent;"><thead><tr><th style="width: 30%;">Log Level</th><th style="width: 15%; text-align: center;">Status Codes</th><th>Description</th></tr></thead><tbody><tr><td class="is-vcentered">`);
      if (log.status_info >= 0) {
        $$renderer3.push("<!--[0-->");
        Loglevel_select($$renderer3, {
          get level() {
            return log.status_info;
          },
          set level($$value) {
            log.status_info = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></td><td class="is-vcentered has-text-centered"><span class="tag is-info is-light has-text-weight-bold"><span class="icon is-small mr-1"><i class="fa-solid fa-circle-info"></i></span> 1XX</span></td><td><details><summary class="has-text-weight-bold is-clickable mb-2">Informational</summary> <p class="has-text-grey mb-3">They indicate that the request has been received and is being processed.</p> <div class="tags"><span class="tag is-info is-light">100 Continue</span> <span class="tag is-info is-light">101 Switching Protocols</span> <span class="tag is-info is-light">102 Processing</span></div></details></td></tr><tr><td class="is-vcentered">`);
      if (log.status_success >= 0) {
        $$renderer3.push("<!--[0-->");
        Loglevel_select($$renderer3, {
          get level() {
            return log.status_success;
          },
          set level($$value) {
            log.status_success = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></td><td class="is-vcentered has-text-centered"><span class="tag is-success is-light has-text-weight-bold"><span class="icon is-small mr-1"><i class="fa-solid fa-circle-check"></i></span> 2XX</span></td><td><details><summary class="has-text-weight-bold is-clickable mb-2">Success</summary> <p class="has-text-grey mb-3">The request has been received, understood and processed correctly.</p> <div class="tags"><span class="tag is-success is-light">200 OK</span> <span class="tag is-success is-light">201 Created</span> <span class="tag is-success is-light">202 Accepted</span> <span class="tag is-success is-light">203 Non-Authoritative</span> <span class="tag is-success is-light">204 No Content</span> <span class="tag is-success is-light">205 Reset Content</span> <span class="tag is-success is-light">206 Partial Content</span> <span class="tag is-success is-light">207 Multi-Status</span> <span class="tag is-success is-light">208 Already Reported</span> <span class="tag is-success is-light">226 IM Used</span></div></details></td></tr><tr><td class="is-vcentered">`);
      if (log.status_redirect >= 0) {
        $$renderer3.push("<!--[0-->");
        Loglevel_select($$renderer3, {
          get level() {
            return log.status_redirect;
          },
          set level($$value) {
            log.status_redirect = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></td><td class="is-vcentered has-text-centered"><span class="tag is-link is-light has-text-weight-bold"><span class="icon is-small mr-1"><i class="fa-solid fa-share"></i></span> 3XX</span></td><td><details><summary class="has-text-weight-bold is-clickable mb-2">Redirection</summary> <p class="has-text-grey mb-3">The customer must take additional actions to complete the request.</p> <div class="tags"><span class="tag is-link is-light">300 Multiple Choices</span> <span class="tag is-link is-light">301 Moved Permanently</span> <span class="tag is-link is-light">302 Found</span> <span class="tag is-link is-light">303 See Other</span> <span class="tag is-link is-light">304 Not Modified</span> <span class="tag is-link is-light">305 Use Proxy</span> <span class="tag is-link is-light">307 Temporary Redirect</span> <span class="tag is-link is-light">308 Permanent Redirect</span></div></details></td></tr><tr><td class="is-vcentered">`);
      if (log.status_client_error >= 0) {
        $$renderer3.push("<!--[0-->");
        Loglevel_select($$renderer3, {
          get level() {
            return log.status_client_error;
          },
          set level($$value) {
            log.status_client_error = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></td><td class="is-vcentered has-text-centered"><span class="tag is-warning is-light has-text-weight-bold"><span class="icon is-small mr-1"><i class="fa-solid fa-triangle-exclamation"></i></span> 4XX</span></td><td><details><summary class="has-text-weight-bold is-clickable mb-2">Client error</summary> <p class="has-text-grey mb-3">The request contains an error or cannot be processed.</p> <div class="tags"><span class="tag is-warning is-light">400 Bad Request</span> <span class="tag is-warning is-light">401 Unauthorized</span> <span class="tag is-warning is-light">402 Payment Required</span> <span class="tag is-warning is-light">403 Forbidden</span> <span class="tag is-warning is-light">404 Not Found</span> <span class="tag is-warning is-light">405 Method Not Allowed</span> <span class="tag is-warning is-light">406 Not Acceptable</span> <span class="tag is-warning is-light">407 Proxy Auth Required</span> <span class="tag is-warning is-light">408 Request Timeout</span> <span class="tag is-warning is-light">409 Conflict</span> <span class="tag is-warning is-light">410 Gone</span> <span class="tag is-warning is-light">411 Length Required</span> <span class="tag is-warning is-light">412 Precondition Failed</span> <span class="tag is-warning is-light">413 Payload Too Large</span> <span class="tag is-warning is-light">414 URI Too Long</span> <span class="tag is-warning is-light">415 Unsupported Media Type</span> <span class="tag is-warning is-light">416 Range Not Satisfiable</span> <span class="tag is-warning is-light">417 Expectation Failed</span> <span class="tag is-warning is-light">418 I'm a teapot</span> <span class="tag is-warning is-light">421 Misdirected Request</span> <span class="tag is-warning is-light">422 Unprocessable Entity</span> <span class="tag is-warning is-light">423 Locked</span> <span class="tag is-warning is-light">424 Failed Dependency</span> <span class="tag is-warning is-light">425 Too Early</span> <span class="tag is-warning is-light">426 Upgrade Required</span> <span class="tag is-warning is-light">428 Precondition Required</span> <span class="tag is-warning is-light">429 Too Many Requests</span> <span class="tag is-warning is-light">431 Request Header Fields Too Large</span> <span class="tag is-warning is-light">451 Unavailable For Legal Reasons</span></div></details></td></tr><tr><td class="is-vcentered">`);
      if (log.status_server_error >= 0) {
        $$renderer3.push("<!--[0-->");
        Loglevel_select($$renderer3, {
          get level() {
            return log.status_server_error;
          },
          set level($$value) {
            log.status_server_error = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></td><td class="is-vcentered has-text-centered"><span class="tag is-danger is-light has-text-weight-bold"><span class="icon is-small mr-1"><i class="fa-solid fa-server"></i></span> 5XX</span></td><td><details><summary class="has-text-weight-bold is-clickable mb-2">Server error</summary> <p class="has-text-grey mb-3">The server was unable to fulfill an apparently valid request.</p> <div class="tags"><span class="tag is-danger is-light">500 Internal Server Error</span> <span class="tag is-danger is-light">501 Not Implemented</span> <span class="tag is-danger is-light">502 Bad Gateway</span> <span class="tag is-danger is-light">503 Service Unavailable</span> <span class="tag is-danger is-light">504 Gateway Timeout</span> <span class="tag is-danger is-light">505 HTTP Version Not Supported</span> <span class="tag is-danger is-light">506 Variant Also Negotiates</span> <span class="tag is-danger is-light">507 Insufficient Storage</span> <span class="tag is-danger is-light">508 Loop Detected</span> <span class="tag is-danger is-light">510 Not Extended</span> <span class="tag is-danger is-light">511 Network Auth Required</span></div></details></td></tr></tbody></table></div>`);
    }
    function tab_logs($$renderer3) {
      {
        let rt1 = function($$renderer4) {
          $$renderer4.push(`<div class="field has-addons has-addons-centered"><span class="control"><input class="input is-small" type="datetime-local" placeholder="Start"${attr("value", params.start_date)}/></span> <span class="control"><a class="button is-static is-small">Start</a></span></div>`);
        }, rt2 = function($$renderer4) {
          $$renderer4.push(`<div class="field has-addons has-addons-centered"><span class="control"><input class="input is-small" type="datetime-local" placeholder="Start"${attr("value", params.end_date)}/></span> <span class="control"><a class="button is-static is-small">End</a></span></div>`);
        }, rt3 = function($$renderer4) {
          $$renderer4.push(`<div class="field has-addons has-addons-centered"><span class="control"><input class="input is-small" type="number" placeholder="Limit"${attr("value", params.limit)}/></span> <span class="control"><a class="button is-static is-small">Limit</a></span></div>`);
        };
        Table($$renderer3, {
          right_items: [rt1, rt2, rt3],
          onsearch: fetchLogs,
          get columns() {
            return columns_logs;
          },
          set columns($$value) {
            columns_logs = $$value;
            $$settled = false;
          },
          get RawDataTable() {
            return dataLogs;
          },
          set RawDataTable($$value) {
            dataLogs = $$value;
            $$settled = false;
          },
          rt1,
          rt2,
          rt3,
          $$slots: { rt1: true, rt2: true, rt3: true }
        });
      }
    }
    function tab_trace_logs($$renderer3) {
      {
        let rt1 = function($$renderer4) {
          $$renderer4.push(`<div class="field has-addons has-addons-centered"><span class="control"><a class="button is-static is-small">Trace ID</a></span> <span class="control"><input class="input is-small" type="text" placeholder="Trace ID"${attr("value", trace_id)}/></span> <span class="control"><button class="button is-small" aria-label="Search trace logs" title="Search trace logs"><span class="icon is-small"><i class="fa-solid fa-magnifying-glass"></i></span></button></span></div>`);
        };
        Table($$renderer3, {
          columns: columns_trace,
          left_items: [rt1],
          onsearch: fetchTraceLogs,
          get RawDataTable() {
            return datatraceLogs;
          },
          set RawDataTable($$value) {
            datatraceLogs = $$value;
            $$settled = false;
          },
          rt1,
          $$slots: { rt1: true }
        });
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabs;
        },
        set tabs($$value) {
          tabs = $$value;
          $$settled = false;
        },
        get active() {
          return active_tab;
        },
        set active($$value) {
          active_tab = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint, log });
  });
}
function Endpoint_bkp($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let uF = new uFetch(url_paths.getEndpointBackups);
    let { idendpoint = void 0, onselect = (d) => {
    } } = $$props;
    let dataBackups = [];
    let selectionType = 1;
    let columns = { hash: { hidden: true }, idendpoint: { hidden: true } };
    let data_backup = void 0;
    let class_search = derived(() => {
      return data_backup && data_backup?.data?.idendpoint == idendpoint ? "is-link" : "";
    });
    async function fetchData() {
      if (idendpoint) {
        selectionType = 1;
        try {
          let req = await uF.get({ data: { idendpoint } });
          dataBackups = await req.json();
          console.log("Fetched Backups:", dataBackups);
        } catch (error) {
          console.error("Error fetching logs:", error);
        }
      } else {
        dataBackups = [];
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        let restoreBackup = function($$renderer4) {
          $$renderer4.push(`<button${attr_class(`button is-small ${stringify(class_search())}`)}><span>Restore Backup ${escape_html(data_backup?.idbackup || "")}</span> <span class="icon"><i class="fa-regular fa-circle-up"></i></span></button>`);
        };
        Table($$renderer3, {
          columns,
          left_items: [restoreBackup],
          onsearch: fetchData,
          onselectrows: (selected) => {
            if (selected.rows && selected.rows.length == 1) {
              data_backup = selected.rows[0];
            } else {
              data_backup = null;
            }
          },
          get RawDataTable() {
            return dataBackups;
          },
          set RawDataTable($$value) {
            dataBackups = $$value;
            $$settled = false;
          },
          get selectionType() {
            return selectionType;
          },
          set selectionType($$value) {
            selectionType = $$value;
            $$settled = false;
          },
          restoreBackup,
          $$slots: { restoreBackup: true }
        });
      }
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { idendpoint });
  });
}
function inputToken($$renderer) {
  $$renderer.push(`<span>The constant $BOT is an instance of Grammy.</span>`);
}
function tab_pred_vars($$renderer) {
  Js_predefined_vars($$renderer);
}
function TelegramBot($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { endpoint = {}, onchange = () => {
    } } = $$props;
    let internal_code = "";
    function getData() {
      return {
        code: snapshot(internal_code),
        data_test: snapshot(endpoint.data_test)
      };
    }
    function fnOnChange() {
      onchange(getData());
    }
    let tabList = [
      {
        label: "Bot Code",
        isActive: true,
        classIcon: " fa-brands fa-node-js ",
        component: tab_code
      },
      { label: "Modules and functions", component: tab_pred_vars }
    ];
    function tab_code($$renderer3) {
      if (endpoint?.custom_data) {
        $$renderer3.push("<!--[0-->");
        Basic$1($$renderer3, {
          label: "Telegram Bot Token",
          placeholder: "Telegram Bot Token",
          onchange: (v) => {
            endpoint.custom_data.token = v;
            onchange(endpoint);
          },
          get value() {
            return endpoint.custom_data.token;
          },
          set value($$value) {
            endpoint.custom_data.token = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      EditorCode($$renderer3, {
        left: inputToken,
        lang: "js",
        showFormat: true,
        onchange: (c) => {
          fnOnChange();
        },
        get code() {
          return internal_code;
        },
        set code($$value) {
          internal_code = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Tab($$renderer3, {
        get tabs() {
          return tabList;
        },
        set tabs($$value) {
          tabList = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { endpoint });
  });
}
function Mcp($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { mcp = {} } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Basic$1($$renderer3, {
        label: "Enabled",
        type: "checkbox",
        get value() {
          return mcp.enabled;
        },
        set value($$value) {
          mcp.enabled = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Basic$1($$renderer3, {
        label: "Name",
        placeholder: "Name",
        required: true,
        get value() {
          return mcp.name;
        },
        set value($$value) {
          mcp.name = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Basic$1($$renderer3, {
        label: "Title",
        placeholder: "Title",
        get value() {
          return mcp.title;
        },
        set value($$value) {
          mcp.title = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="field"><p class="control label_descrip svelte-oxwmp6"><a class="button is-static is-small">Tool Description</a></p> <div class="control"><textarea class="textarea is-small" placeholder="Tool description">`);
      const $$body = escape_html(mcp.description);
      if ($$body) {
        $$renderer3.push(`${$$body}`);
      }
      $$renderer3.push(`</textarea></div></div> <div class="block"><div class="content is-small"><div class="icon-text"><span class="icon has-text-warning"><i class="fas fa-exclamation-triangle"></i></span> <span>Warning</span></div> For the tool to work correctly, you must configure the JSON Schema to validate and indicate to
		the AI what the input parameters are.</div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { mcp });
  });
}
function Endpoint_label($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      environment = "?",
      endpoint = "?",
      method = "?",
      handler = "?"
    } = $$props;
    let handler_params = derived(() => {
      return getHandlerParams(handler);
    });
    let env_selected = derived(() => {
      let data = Environment && Array.isArray(Environment) ? Environment.find((item) => {
        return item.id == environment;
      }) : [];
      return data;
    });
    $$renderer2.push(`<nav class="level"><div class="level-left"><div class="level-item"><h4 class="subtitle is-5"><div class="icon-text" style="cursor: pointer;" title="Copy to clipboard"><span${attr_class(`icon ${"has-text-info"}`)}><i${attr_class(`fa-solid ${"fa-copy"}`)}></i></span> <span>${escape_html(endpoint)}</span></div></h4></div></div> <div class="level-right"><span class="level-item"><div class="field is-grouped is-grouped-multiline"><div class="control"><div class="tags has-addons"><span class="tag is-dark">Method</span> <span${attr_class(`tag is-${stringify(listHTTPMethods[method]?.color)}`)}>${escape_html(method)}</span></div></div> <div class="control"><div class="tags has-addons"><span class="tag is-dark">Handler</span> <span${attr_class(`tag is-${stringify(handler_params()?.css_class)}`)}>${escape_html(handler_params()?.value)}</span></div></div> <div class="control"><div class="tags has-addons"><span class="tag is-dark">Env</span> <span${attr_class(`tag is-${stringify(env_selected()?.background)}`)}>${escape_html(env_selected()?.value)}</span></div></div></div></span></div></nav>`);
    bind_props($$props, { environment, endpoint, method, handler });
  });
}
function Editor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { showEditor = false, onsave = (d) => {
    }, oncopy = () => {
    } } = $$props;
    let noty = new Notifications$1();
    let endpoint = structuredClone(defaultEndpoint);
    let app = {};
    let idendpoint = void 0;
    let markdown_docs = "";
    let deploying = { show: false, message: "", error: false };
    function setData(data) {
      app = data.app || {};
      idendpoint = data.idendpoint || void 0;
      setValuesEndpoint();
    }
    function normalizeEndpoint(ep) {
      if (!ep) return ep;
      const jsonFields = [
        "json_schema",
        "mcp",
        "ctrl",
        "data_test",
        "cors",
        "headers_test"
      ];
      for (const field of jsonFields) {
        if (typeof ep[field] === "string") {
          const val = ep[field].trim();
          if (val === "" || val === "null" || val === "undefined") {
            ep[field] = {};
          } else {
            try {
              ep[field] = JSON.parse(val);
            } catch (e) {
              console.error(`Error parsing ${field}:`, e);
              try {
                noty.push({
                  message: `Field '${field}' has invalid JSON format in database: ${e.message}`,
                  color: "warning"
                });
              } catch (err) {
                console.error("Failed to show notification:", err);
              }
              ep[field] = {};
            }
          }
        }
      }
      ep.json_schema ??= {};
      ep.json_schema.in ??= {};
      ep.json_schema.in.enabled ??= false;
      ep.json_schema.in.schema ??= {};
      ep.json_schema.out ??= {};
      ep.json_schema.out.enabled ??= false;
      ep.json_schema.out.schema ??= {};
      ep.custom_data ??= {};
      ep.mcp ??= {};
      ep.ctrl ??= {};
      ep.ctrl.users ??= [];
      ep.ctrl.log ??= {};
      ep.data_test ??= {};
      return ep;
    }
    async function setValuesEndpoint() {
      if (app && app.endpoints && idendpoint) {
        let ep_found = app.endpoints.find((ep) => ep.idendpoint == idendpoint);
        if (ep_found) {
          let merged = mergeSourceOverwrite(structuredClone(defaultEndpoint), ep_found);
          endpoint = normalizeEndpoint(merged);
          endpoint.handler;
          await getHandlerDocsRequest();
        } else {
          clearValues();
        }
      } else {
        clearValues();
      }
    }
    async function saveEndpoint() {
      deploying.show = true;
      deploying.message = "Saving Endpoint...";
      deploying.error = false;
      try {
        let endpoint_out = endpoint;
        let resp = await EndpointSave(endpoint_out, store_get($$store_subs ??= {}, "$userStore", userStore).token);
        let response = resp.result;
        if (response && response.idapp == app.idapp) {
          deploying.show = false;
          noty.push({
            message: "Endpoint saved and deployed successfully.",
            color: "success"
          });
          onsave();
        } else {
          deploying.error = true;
          deploying.message = `Error: ${resp.message}`;
        }
      } catch (error) {
        console.error(error);
        deploying.error = true;
        deploying.message = `Error: ${error.message}`;
      }
    }
    let validateResource = false;
    let availableURL = false;
    let tabList = [
      {
        name: "endpoint",
        label: "Endpoint",
        isActive: true,
        component: tab_endpoint,
        classIcon: " fa-solid fa-network-wired "
      },
      {
        name: "docs",
        label: "Documentation",
        component: tab_docs,
        classIcon: " fa-solid fa-book "
      },
      {
        name: "config",
        label: "Configuration",
        component: tab_config,
        classIcon: " fa-solid fa-screwdriver-wrench "
      },
      {
        name: "app_vars",
        label: "Application Variables",
        component: tab_app_vars,
        classIcon: " fa-solid fa-square-root-variable "
      },
      {
        name: "json_schema",
        label: "JSON Schema",
        component: tab_json_schema
      },
      {
        name: "auth",
        label: "Authorizations",
        component: tab_auth,
        classIcon: " fa-solid fa-key "
      },
      {
        name: "cors",
        label: "CORS",
        component: tab_cors,
        classIcon: " fa-solid fa-earth-americas "
      },
      {
        name: "mcp",
        label: "MCP",
        component: tab_mcp,
        classIcon: " fa-solid fa-robot "
      },
      {
        name: "custom_data",
        label: "Custom Data",
        component: tab_custom_data,
        classIcon: " fa-regular fa-hand "
      },
      {
        name: "price",
        label: "Price",
        component: tab_price,
        classIcon: " fa-solid fa-tag "
      },
      {
        name: "tester",
        label: "Tester",
        component: tab_tester,
        classIcon: " fa-solid fa-microscope "
      },
      {
        name: "backups",
        label: "Backups",
        component: tab_backups,
        classIcon: " fa-solid fa-list-check "
      },
      { name: "logs", label: "Logs", component: tab_log }
    ];
    const HANDLER_TABS = {
      MCP: /* @__PURE__ */ new Set(["endpoint", "docs", "tester", "backups", "logs"]),
      NOAPPLY: /* @__PURE__ */ new Set(["endpoint"]),
      "No Handler": /* @__PURE__ */ new Set(["endpoint"]),
      NA: /* @__PURE__ */ new Set(["endpoint"]),
      TELEGRAM_BOT: /* @__PURE__ */ new Set([
        "endpoint",
        "config",
        "docs",
        "app_vars",
        "auth",
        "price",
        "tester",
        "backups",
        "logs"
      ]),
      FUNCTION: /* @__PURE__ */ new Set([
        "endpoint",
        "config",
        "docs",
        "auth",
        "cors",
        "mcp",
        "price",
        "tester",
        "backups",
        "logs",
        "json_schema"
      ]),
      SOAP: /* @__PURE__ */ new Set([
        "endpoint",
        "config",
        "docs",
        "auth",
        "cors",
        "price",
        "tester",
        "backups",
        "logs",
        "json_schema",
        "app_vars",
        "mcp"
      ]),
      SQL_BULK_I: /* @__PURE__ */ new Set([
        "endpoint",
        "config",
        "docs",
        "auth",
        "cors",
        "price",
        "tester",
        "backups",
        "logs",
        "json_schema",
        "app_vars",
        "mcp"
      ]),
      SQL: /* @__PURE__ */ new Set([
        "endpoint",
        "config",
        "docs",
        "auth",
        "cors",
        "price",
        "tester",
        "backups",
        "logs",
        "json_schema",
        "app_vars",
        "mcp"
      ]),
      HANA: /* @__PURE__ */ new Set([
        "endpoint",
        "config",
        "docs",
        "auth",
        "cors",
        "price",
        "tester",
        "backups",
        "logs",
        "json_schema",
        "app_vars",
        "mcp"
      ])
    };
    let derivedtabList = derived(() => {
      if (!app.app) return [];
      const allowed = HANDLER_TABS[endpoint?.handler];
      if (!allowed) return tabList;
      return tabList.filter((tab) => allowed.has(tab.name));
    });
    function clearValues() {
      let ep = structuredClone(defaultEndpoint);
      ep.idapp = app.idapp;
      endpoint = normalizeEndpoint(ep);
    }
    function onChangeValueHandler(v) {
      console.trace("onChangeValueHandler", v);
      if (v) {
        endpoint.data_test = v.data_test;
        endpoint.code = v.code;
        endpoint.docs = v.docs;
        endpoint.File = v.File;
        if (v.custom_data) {
          endpoint.custom_data = v.custom_data;
        }
      }
    }
    function getResultLimited(valor, maxLength = 1e3) {
      let cadena;
      try {
        if (typeof valor === "string") {
          cadena = valor;
        } else if (valor === null) {
          cadena = "null";
        } else if (valor === void 0) {
          cadena = "undefined";
        } else if (typeof valor === "function") {
          cadena = valor.toString();
        } else if (typeof valor === "object") {
          try {
            cadena = JSON.stringify(valor, null, 2);
          } catch (jsonError) {
            cadena = Object.prototype.toString.call(valor);
          }
        } else {
          cadena = String(valor);
        }
      } catch (error) {
        cadena = "[Error al convertir valor]";
      }
      return cadena.substring(0, maxLength);
    }
    async function getHandlerDocsRequest() {
      if (endpoint?.handler) {
        try {
          let res = await getHandlerDocs(endpoint.handler);
          if (res && res.markdown) {
            markdown_docs = res.markdown;
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    function tab_docs($$renderer3) {
      Viewer($$renderer3, {
        content_class: " is-small ",
        get markdown() {
          return markdown_docs;
        },
        set markdown($$value) {
          markdown_docs = $$value;
          $$settled = false;
        }
      });
    }
    function tab_endpoint($$renderer3) {
      if (endpoint && app) {
        $$renderer3.push("<!--[0-->");
        Endpoint($$renderer3, {
          oncopy: (ep) => {
            oncopy(ep);
          },
          get endpoint() {
            return endpoint;
          },
          set endpoint($$value) {
            endpoint = $$value;
            $$settled = false;
          },
          get app() {
            return app;
          },
          set app($$value) {
            app = $$value;
            $$settled = false;
          },
          get validateResource() {
            return validateResource;
          },
          set validateResource($$value) {
            validateResource = $$value;
            $$settled = false;
          },
          get availableURL() {
            return availableURL;
          },
          set availableURL($$value) {
            availableURL = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_app_vars($$renderer3) {
      if (endpoint && endpoint.idapp) {
        $$renderer3.push("<!--[0-->");
        Variables($$renderer3, {
          environment: endpoint.environment,
          isReadOnly: true,
          get idapp() {
            return endpoint.idapp;
          },
          set idapp($$value) {
            endpoint.idapp = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_json_schema($$renderer3) {
      function json_schema_in($$renderer4) {
        Basic$1($$renderer4, {
          label: "Enabled",
          type: "checkbox",
          placeholder: "Enabled",
          get value() {
            return endpoint.json_schema.in.enabled;
          },
          set value($$value) {
            endpoint.json_schema.in.enabled = $$value;
            $$settled = false;
          }
        });
        $$renderer4.push(`<!----> `);
        EditorCode($$renderer4, {
          lang: "json",
          showFormat: true,
          onchange: (datajs) => {
          },
          get code() {
            return endpoint.json_schema.in.schema;
          },
          set code($$value) {
            endpoint.json_schema.in.schema = $$value;
            $$settled = false;
          }
        });
        $$renderer4.push(`<!---->`);
      }
      function json_schema_out($$renderer4) {
        Basic$1($$renderer4, {
          label: "Enabled",
          type: "checkbox",
          placeholder: "Enabled",
          get value() {
            return endpoint.json_schema.out.enabled;
          },
          set value($$value) {
            endpoint.json_schema.out.enabled = $$value;
            $$settled = false;
          }
        });
        $$renderer4.push(`<!----> `);
        EditorCode($$renderer4, {
          lang: "json",
          showFormat: true,
          onchange: (datajs) => {
          },
          get code() {
            return endpoint.json_schema.out.schema;
          },
          set code($$value) {
            endpoint.json_schema.out.schema = $$value;
            $$settled = false;
          }
        });
        $$renderer4.push(`<!---->`);
      }
      Tab($$renderer3, {
        tabs: [
          {
            label: "In",
            isActive: true,
            component: json_schema_in,
            classIcon: " fa-solid fa-arrow-right-to-bracket "
          },
          {
            label: "Out",
            component: json_schema_out,
            classIcon: " fa-solid fa-arrow-right-from-bracket "
          }
        ]
      });
      $$renderer3.push(`<!----> <div class="block"><div class="content is-small"><div class="icon-text"><span class="icon has-text-info"><i class="fas fa-info-circle"></i></span> <span>Info</span></div> While JSON is probably the most popular format for exchanging data, JSON Schema is the
			vocabulary that enables JSON data consistency, validity, and interoperability at scale. <p>More information about <a href="https://json-schema.org/">JSON Schema</a> can be found in the
				official documentation.</p></div></div>`);
    }
    function tab_custom_data($$renderer3) {
      if (endpoint?.custom_data) {
        $$renderer3.push("<!--[0-->");
        EditorCode($$renderer3, {
          lang: "json",
          showFormat: true,
          onchange: (datajs) => {
          },
          get code() {
            return endpoint.custom_data;
          },
          set code($$value) {
            endpoint.custom_data = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_price($$renderer3) {
      Basic$1($$renderer3, {
        label: "Price by Request (in credits)",
        type: "number",
        step: "1",
        min: "0",
        placeholder: "Price by Request",
        get value() {
          return endpoint.price_by_request;
        },
        set value($$value) {
          endpoint.price_by_request = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Basic$1($$renderer3, {
        label: "Price by KB on request (in credits)",
        type: "number",
        step: "1",
        min: "0",
        placeholder: "Price by Request",
        get value() {
          return endpoint.price_kb_request;
        },
        set value($$value) {
          endpoint.price_kb_request = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Basic$1($$renderer3, {
        label: "Price by KB on response (in credits)",
        type: "number",
        step: "1",
        min: "0",
        placeholder: "Price by Request",
        get value() {
          return endpoint.price_kb_response;
        },
        set value($$value) {
          endpoint.price_kb_response = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    function tab_config($$renderer3) {
      if (endpoint) {
        $$renderer3.push(`<!--[0--><div>`);
        if (endpoint?.handler == "JS") {
          $$renderer3.push("<!--[0-->");
          Js($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "TELEGRAM_BOT") {
          $$renderer3.push("<!--[1-->");
          TelegramBot($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "SOAP") {
          $$renderer3.push("<!--[2-->");
          Soap($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "SQL") {
          $$renderer3.push("<!--[3-->");
          Sql($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "HANA") {
          $$renderer3.push("<!--[4-->");
          SqlHana($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "SQL_BULK_I") {
          $$renderer3.push("<!--[5-->");
          SqlBulkInsert($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "FETCH") {
          $$renderer3.push("<!--[6-->");
          Fetch($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "FUNCTION") {
          $$renderer3.push("<!--[7-->");
          CustomFunction($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "TEXT") {
          $$renderer3.push("<!--[8-->");
          Text($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "MONGODB") {
          $$renderer3.push("<!--[9-->");
          Mongodb($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "AGENT_IA") {
          $$renderer3.push("<!--[10-->");
          Agentia($$renderer3, {
            onchange: onChangeValueHandler,
            get endpoint() {
              return endpoint;
            },
            set endpoint($$value) {
              endpoint = $$value;
              $$settled = false;
            }
          });
        } else if (endpoint?.handler == "NOAPPLY" || endpoint?.handler == "No Handler" || endpoint?.handler == "NA") {
          $$renderer3.push(`<!--[11--><div>No Handler</div>`);
        } else {
          $$renderer3.push(`<!--[-1--><div>No Handler</div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_auth($$renderer3) {
      if (endpoint && endpoint.ctrl) {
        $$renderer3.push("<!--[0-->");
        Authorizations($$renderer3, {
          get users() {
            return endpoint.ctrl.users;
          },
          set users($$value) {
            endpoint.ctrl.users = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_log($$renderer3) {
      if (endpoint?.ctrl?.log) {
        $$renderer3.push("<!--[0-->");
        Logs$1($$renderer3, {
          get log() {
            return endpoint.ctrl.log;
          },
          set log($$value) {
            endpoint.ctrl.log = $$value;
            $$settled = false;
          },
          get endpoint() {
            return endpoint;
          },
          set endpoint($$value) {
            endpoint = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_mcp($$renderer3) {
      if (endpoint?.mcp) {
        $$renderer3.push("<!--[0-->");
        Mcp($$renderer3, {
          get mcp() {
            return endpoint.mcp;
          },
          set mcp($$value) {
            endpoint.mcp = $$value;
            $$settled = false;
          },
          get endpoint() {
            return endpoint;
          },
          set endpoint($$value) {
            endpoint = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_cors($$renderer3) {
      if (endpoint) {
        $$renderer3.push(`<!--[0--><div><div class="block"><div class="buttons is-small"><button class="button is-small" title="Remove per-endpoint CORS: use the deployment-wide default policy"><span class="icon is-small"><i class="fas fa-times"></i></span> <span>Default (deployment-wide)</span></button> <button class="button is-small" title="Allow any cross-origin request"><span class="icon is-small"><i class="fas fa-globe"></i></span> <span>Allow all origins</span></button></div></div> `);
        EditorCode($$renderer3, {
          lang: "json",
          showFormat: true,
          onchange: () => {
            onChangeValueHandler();
          },
          get code() {
            return endpoint.cors;
          },
          set code($$value) {
            endpoint.cors = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> <div class="block"><div class="content is-small"><div class="icon-text"><span class="icon has-text-info"><i class="fas fa-info-circle"></i></span> <span>Info</span></div> <p>Set a list of allowed origins <code>["https://app.example.com"]</code> or an object like <code>{"origin": ["https://app.example.com"], "credentials": true}</code> to restrict cross-origin browser access. Empty <code>{}</code> uses the deployment-wide default policy. Requests from
						an Origin outside the allowlist are denied and receive no <code>Access-Control-Allow-Origin</code> header.</p></div></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function endpoint_path($$renderer3) {
      Endpoint_label($$renderer3, {
        get endpoint() {
          return endpoint.endpoint;
        },
        set endpoint($$value) {
          endpoint.endpoint = $$value;
          $$settled = false;
        },
        get environment() {
          return endpoint.environment;
        },
        set environment($$value) {
          endpoint.environment = $$value;
          $$settled = false;
        },
        get method() {
          return endpoint.method;
        },
        set method($$value) {
          endpoint.method = $$value;
          $$settled = false;
        },
        get handler() {
          return endpoint.handler;
        },
        set handler($$value) {
          endpoint.handler = $$value;
          $$settled = false;
        }
      });
    }
    function tab_backups($$renderer3) {
      if (endpoint && endpoint.idendpoint) {
        $$renderer3.push("<!--[0-->");
        Endpoint_bkp($$renderer3, {
          onselect: (backup) => {
            if (backup && backup.idendpoint == endpoint.idendpoint) {
              let snap = backup;
              endpoint = normalizeEndpoint(snap);
              noty.push({
                message: `Endpoint ${backup.name} loaded from backup. Save to persist.`,
                color: "success"
              });
            }
          },
          get idendpoint() {
            return endpoint.idendpoint;
          },
          set idendpoint($$value) {
            endpoint.idendpoint = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_tester($$renderer3) {
      $$renderer3.push(`<div>`);
      RESTTester($$renderer3, {
        method: endpoint.method,
        url: endpoint.endpoint,
        methodDisabled: true,
        onchange: (d) => {
          endpoint.data_test = d.data;
          if (d.last_response) {
            endpoint.data_test.last_response = {
              data: getResultLimited(d.last_response.data),
              sizeKBResponse: d.last_response.sizeKBResponse,
              MimeType: d.last_response.MimeType
            };
          }
        },
        get data() {
          return endpoint.data_test;
        },
        set data($$value) {
          endpoint.data_test = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      SlideFullScreen($$renderer3, {
        get show() {
          return showEditor;
        },
        set show($$value) {
          showEditor = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          SaveDeploy($$renderer4, {
            left: [endpoint_path],
            onsavedeploy: async () => {
              if (!validateResource) {
                deploying.show = true;
                deploying.error = true;
                deploying.message = "URL is invalid.";
              } else if (!availableURL) {
                deploying.show = true;
                deploying.error = true;
                deploying.message = "URL already exists.";
              } else if (endpoint.handler == "FUNCTION" && (!endpoint.code || endpoint.code.length < 1)) {
                deploying.show = true;
                deploying.error = true;
                deploying.message = "You have not selected a function.";
              } else {
                await saveEndpoint();
              }
            },
            oncancel: () => {
              idendpoint = void 0;
              showEditor = false;
            },
            get deploying() {
              return deploying;
            },
            set deploying($$value) {
              deploying = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Tab($$renderer4, {
            onselect: () => {
            },
            get tabs() {
              return derivedtabList();
            },
            set tabs($$value) {
              derivedtabList($$value);
              $$settled = false;
            }
          });
          $$renderer4.push(`<!---->`);
        },
        $$slots: { default: true }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { showEditor, setData });
  });
}
function Endpoints($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { idapp = 0, onsavedeploy = () => {
    } } = $$props;
    let notify = new Notifications$1();
    let EndpointEditorWidget = void 0;
    let app = { app: "", enabled: false, description: "" };
    let showMigrateModal = false;
    let migrateTargetEnv = "";
    const permEnv = getDefaultEnvironment();
    const currentUser = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore)?.user);
    const canCreate = derived(() => currentUserHasPermission(currentUser(), permEnv, "endpoints", "create"));
    const canEdit = derived(() => currentUserHasPermission(currentUser(), permEnv, "endpoints", "edit"));
    const canDelete = derived(() => currentUserHasPermission(currentUser(), permEnv, "endpoints", "delete"));
    let migrateConfirmCheck = false;
    let selectedEndpointsForMigration = [];
    let showEndpointEdit = false;
    let TableSelectionType = 0;
    let serverAPIVersion = "Loading...";
    let serverAPILastVersion = "";
    let serverDDBB = "?";
    let reloadEndpointsTimeout;
    let reloadAppVarsTimeout;
    onDestroy(() => {
      clearTimeout(reloadEndpointsTimeout);
      clearTimeout(reloadAppVarsTimeout);
    });
    function normalizeVersion(value) {
      let v = typeof value === "string" ? value.trim() : "";
      if (!v || v === "Loading..." || v === "Unknown") return "";
      return v.replace(/^v/i, "");
    }
    let hayVersionDistinta = derived(() => {
      const instalada = normalizeVersion(serverAPIVersion);
      const publicada = normalizeVersion(serverAPILastVersion);
      return instalada !== "" && publicada !== "" && instalada !== publicada;
    });
    let avisoVersionTitulo = derived(() => {
      const base = `Versión instalada ${serverAPIVersion} · última publicada ${serverAPILastVersion}`;
      return base;
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div><div>`);
      {
        let lt01 = function($$renderer4) {
          $$renderer4.push(`<div class="control"><div class="tags has-addons"><span class="tag is-dark">Server API</span> <span class="tag is-success">${escape_html(serverAPIVersion)}</span></div></div> <div class="control"><div class="tags has-addons"><span class="tag is-dark">DataBase</span> <span class="tag is-link">${escape_html(serverDDBB)}</span></div></div> `);
          if (hayVersionDistinta()) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"${attr("title", avisoVersionTitulo())}><span class="tag is-dark"><span class="icon is-small mr-1 has-text-warning"><i class="fa-solid fa-bell fa-shake"></i></span> Update</span> <span class="tag is-warning">${escape_html(serverAPILastVersion)} `);
            {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--></span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        }, rt1 = function($$renderer4) {
          $$renderer4.push(`<span><button class="button is-small" title="Clear Cache"><span class="icon is-small"><i class="fa-solid fa-eraser"></i></span> <span>Cache</span></button></span>`);
        }, rt2 = function($$renderer4) {
          $$renderer4.push(`<span><button title="Generate Documentation" class="button is-small"><span class="icon is-small"><i class="fa-solid fa-file-export"></i></span> <span>Doc</span></button></span>`);
        }, rt3 = function($$renderer4) {
          $$renderer4.push(`<span><button class="button is-small" title="Migrate selected endpoints to another environment"><span class="icon is-small"><i class="fa-solid fa-route"></i></span> <span>Migrate</span></button></span>`);
        };
        Table($$renderer3, {
          showEditRow: "true",
          showNewButton: canCreate(),
          showEditButton: canEdit(),
          showDeleteButton: canDelete(),
          columns: endpointColumns,
          left_items: [lt01],
          right_items: [rt3, rt2, rt1],
          ondeleterow: (data) => {
            if (confirm("Do you want to delete the endpoints selected? - NO IMPLEMENTED")) {
              app.endpoints = app.endpoints.filter((item) => {
                return !data.rows.some((element) => element.idendpoint == item.idendpoint);
              });
            }
          },
          onnewrow: () => {
            if (idapp && idapp.length > 5) {
              showEndpointEdit = true;
              EndpointEditorWidget.setData({ app });
            } else {
              notify.push({ message: "Not app selected", color: "warning" });
            }
          },
          oneditrow: (data) => {
            data.idendpoint;
            showEndpointEdit = true;
            EndpointEditorWidget.setData({ app, idendpoint: data.idendpoint });
          },
          get RawDataTable() {
            return app.endpoints;
          },
          set RawDataTable($$value) {
            app.endpoints = $$value;
            $$settled = false;
          },
          get selectionType() {
            return TableSelectionType;
          },
          set selectionType($$value) {
            TableSelectionType = $$value;
            $$settled = false;
          },
          lt01,
          rt1,
          rt2,
          rt3,
          $$slots: { lt01: true, rt1: true, rt2: true, rt3: true }
        });
      }
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div> `);
      Modal($$renderer3, {
        get show() {
          return showMigrateModal;
        },
        set show($$value) {
          showMigrateModal = $$value;
          $$settled = false;
        },
        get showCloseButton() {
          return showMigrateModal;
        },
        set showCloseButton($$value) {
          showMigrateModal = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="box"><h3 class="title is-4">Migrate Endpoints</h3> <div class="content"><p class="has-text-weight-bold">You have selected ${escape_html(selectedEndpointsForMigration.length)} endpoint${escape_html(selectedEndpointsForMigration.length === 1 ? "" : "s")} for migration.</p> <div class="field"><label class="label" for="migrate-target-environment">Target Environment</label> <div class="control"><div class="select is-fullwidth is-small">`);
          $$renderer4.select({ id: "migrate-target-environment", value: migrateTargetEnv }, ($$renderer5) => {
            $$renderer5.option({ value: "", disabled: true }, ($$renderer6) => {
              $$renderer6.push(`Select an environment...`);
            });
            $$renderer5.option({ value: "qa" }, ($$renderer6) => {
              $$renderer6.push(`QA (Quality Assurance)`);
            });
            $$renderer5.option({ value: "dev" }, ($$renderer6) => {
              $$renderer6.push(`DEV (Development)`);
            });
            $$renderer5.option({ value: "prd" }, ($$renderer6) => {
              $$renderer6.push(`PRD (Production)`);
            });
          });
          $$renderer4.push(`</div></div></div> <div class="notification is-warning is-light"><span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span> <strong>Warning:</strong> This is a risky operation. The existing code in the target environment
				for the selected endpoints will be completely replaced. Please proceed with caution.</div> <div class="field"><div class="control"><label class="checkbox"><input type="checkbox"${attr("checked", migrateConfirmCheck, true)}/> Are you sure you want to migrate the selected endpoints to the <strong>${escape_html("selected")}</strong> environment?</label></div></div></div> <div class="buttons is-right mt-5"><button class="button is-small">Cancel</button> <button class="button is-small is-primary"${attr("disabled", !migrateConfirmCheck, true)}><span class="icon"><i class="fa-solid fa-check"></i></span> <span>Accept</span></button></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      if (idapp) {
        $$renderer3.push("<!--[0-->");
        Editor($$renderer3, {
          oncopy: async (eps) => {
            onsavedeploy();
          },
          onsave: async (e) => {
            onsavedeploy();
          },
          get showEditor() {
            return showEndpointEdit;
          },
          set showEditor($$value) {
            showEndpointEdit = $$value;
            $$settled = false;
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { idapp });
  });
}
function CellTaskStatus($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0, currentState = false } = $$props;
    let response = derived(() => row?.last_response ?? row?.response);
    let recordedStatus = derived(() => getIntervalTaskLastResultStatus(value, response()) || IntervalTaskStatus[Number(value)] || IntervalTaskStatusFallback);
    let status = derived(() => currentState ? getIntervalTaskRuntimeStatus(value) : recordedStatus());
    let lastResultStatus = derived(() => currentState ? getIntervalTaskLastResultStatus(value, response()) : null);
    let nextIn = derived(() => {
      if (!row?.next_run) return "";
      const seconds = Math.round((new Date(row.next_run).getTime() - Date.now()) / 1e3);
      if (!Number.isFinite(seconds)) return "";
      if (seconds <= 0) return "now";
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
      return `${Math.round(seconds / 3600)}h`;
    });
    let title = derived(() => [
      status().description,
      lastResultStatus() ? `Último resultado: ${lastResultStatus().label}` : "",
      row?.failed_attempts ? `Fallos consecutivos: ${row.failed_attempts}` : "",
      row?.last_exec_time ? `Última duración: ${row.last_exec_time} ms` : ""
    ].filter(Boolean).join("\n"));
    $$renderer2.push(`<td><div class="tags has-addons"${attr("title", title())}><span${attr_class(`tag is-${stringify(status().background)}`)}><span class="icon is-small"><i${attr_class(clsx(status().icon))}></i></span> <span>${escape_html(status().label)}</span></span> `);
    if (row?.failed_attempts > 0) {
      $$renderer2.push(`<!--[0--><span class="tag is-dark">${escape_html(row.failed_attempts)} fails</span>`);
    } else if (nextIn() && status() === IntervalTaskStatus[0]) {
      $$renderer2.push(`<!--[1--><span class="tag is-dark">next ${escape_html(nextIn())}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></td>`);
    bind_props($$props, { value, row });
  });
}
function CellTaskSchedule($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let isCron = derived(() => value === "cron");
    let label = derived(() => isCron() ? row?.cron || "Invalid cron" : `Every ${row?.interval ?? 300}s`);
    let title = derived(() => isCron() ? `Cron${row?.timezone ? ` (${row.timezone})` : ""}` : `Fixed interval: ${row?.interval ?? 300} seconds`);
    $$renderer2.push(`<td><span class="icon-text"${attr("title", title())}><span class="icon has-text-grey"><i${attr_class(clsx(isCron() ? "fa-solid fa-calendar-days" : "fa-solid fa-repeat"))}></i></span> <span>${escape_html(label())}</span></span></td>`);
    bind_props($$props, { value, row });
  });
}
function History($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { task = {} } = $$props;
    const uF = new uFetch(url_paths.getIntervalTaskRuns);
    let dataRuns = [];
    let loading = false;
    let columns = {
      idrun: { hidden: true },
      idtask: { hidden: true },
      started_at: {
        label: "Started",
        decorator: { component: DateTime_1 }
      },
      finished_at: {
        label: "Finished",
        decorator: { component: DateTime_1 }
      },
      duration_ms: { label: "Duration (ms)" },
      status: { label: "Status", decorator: { component: CellTaskStatus } },
      http_status: { label: "HTTP" },
      error: { label: "Error" },
      response: { hidden: true }
    };
    async function fetchData() {
      if (!task?.idtask) {
        dataRuns = [];
        return;
      }
      loading = true;
      try {
        const req = await uF.get({ data: { idtask: task.idtask, limit: 200 } });
        const jresp = await req.json();
        dataRuns = Array.isArray(jresp) ? jresp : [];
      } catch (error) {
        console.error("Error fetching interval task runs:", error);
        dataRuns = [];
      } finally {
        loading = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="mb-2"><span class="tag is-link is-light">Task ${escape_html(task?.idtask ?? "?")}</span> <span class="tag is-light">[${escape_html(task?.method ?? "")}] ${escape_html(task?.url ?? "")}</span> <span class="tag is-light">History limit: ${escape_html(task?.history_limit ?? 50)}</span> `);
      if (loading) {
        $$renderer3.push(`<!--[0--><span class="tag is-info is-light">Loading…</span>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      Table($$renderer3, {
        columns,
        onsearch: fetchData,
        get RawDataTable() {
          return dataRuns;
        },
        set RawDataTable($$value) {
          dataRuns = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { task, fetchData });
  });
}
function tab_guide($$renderer) {
  $$renderer.push(`<div class="content is-small"><h4>How to schedule an endpoint</h4> <ol><li>Select an existing endpoint and keep the new task disabled.</li> <li>Choose <strong>Interval</strong> for every N seconds or <strong>Cron</strong> for calendar times.</li> <li>Set an API Key when the endpoint is private and does not belong to the system app.</li> <li>Save, select the task, run it once with <strong>Run now</strong>, and inspect History.</li> <li>Enable it only after the test succeeds.</li></ol> <h4>Schedule fields</h4> <p>A cron example for weekdays at 07:00 is <code>0 7 * * 1-5</code>. Timezone and execution
			window are optional. Date Start and Date End restrict the task's lifetime; they do not change
			its frequency.</p> <h4>Parameters and failures</h4> <p>Use <code>${escape_html(JSON.stringify({ data: { id: 42 }, headers: { "x-source": "scheduler" } }))}</code> in Parameters. Failed executions use exponential backoff and the task is disabled after Max failed
			attempts. Reset attempts only after correcting the cause.</p></div>`);
}
function Interval_tasks($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { idapp = void 0, onchange = () => {
    } } = $$props;
    const uF = new uFetch();
    const permEnv = getDefaultEnvironment();
    const currentUser = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore)?.user);
    const canCreate = derived(() => currentUserHasPermission(currentUser(), permEnv, "interval_tasks", "create"));
    const canEdit = derived(() => currentUserHasPermission(currentUser(), permEnv, "interval_tasks", "edit"));
    const canDelete = derived(() => currentUserHasPermission(currentUser(), permEnv, "interval_tasks", "delete"));
    let showEditor = false;
    let runNowPending = false;
    let historyTask = {};
    let selectedRow = defaultValuesIntervalTask({});
    let optionsEndpoints = [];
    let optionsApiKeys = [];
    let activeTab = 0;
    const TAB_HISTORY = 2;
    let tabList = [
      {
        name: "config",
        label: "Configuration",
        component: tab_config,
        classIcon: "fa-solid fa-sliders"
      },
      {
        name: "params",
        label: "Parameters",
        component: tab_params,
        classIcon: "fa-solid fa-code"
      },
      {
        name: "history",
        label: "History",
        component: tab_history,
        classIcon: "fa-solid fa-clock-rotate-left",
        disabled: true
      },
      {
        name: "guide",
        label: "Guide",
        component: tab_guide,
        classIcon: "fa-solid fa-book"
      }
    ];
    function resetTabs() {
      activeTab = 0;
      tabList[TAB_HISTORY].disabled = !selectedRow.idtask;
    }
    const scheduleModes = [
      { id: "interval", value: "Interval (every N seconds)" },
      { id: "cron", value: "Cron (time expression)" }
    ];
    let selectionType = 1;
    let DataTableTasks = [];
    const latestRuntimeEvents = /* @__PURE__ */ new Map();
    let runtimeEventGeneration = 0;
    const runtimeEventFields = [
      "status",
      "last_run",
      "next_run",
      "last_exec_time",
      "last_response",
      "failed_attempts",
      "task_enabled"
    ];
    function applyRuntimeEvent(task, ev) {
      const updated = { ...task };
      for (const field of runtimeEventFields) {
        if (ev[field] !== void 0) updated[field] = ev[field];
      }
      if (ev.enabled !== void 0) updated.task_enabled = ev.enabled;
      if (ev.started_at && ev.last_run === void 0) updated.last_run = ev.started_at;
      if (ev.duration_ms !== void 0 && ev.duration_ms !== null) {
        updated.last_exec_time = Math.round(ev.duration_ms);
      }
      return updated;
    }
    let columns = {
      idtask: { hidden: true },
      idendpoint: { hidden: true },
      iduser: { hidden: true },
      idapp: { hidden: true },
      idkey: { hidden: true },
      task_enabled: {
        label: "Enabled Task",
        decorator: {
          component: Boolean$1,
          props: {
            ontrue: { label: "Enabled" },
            onfalse: { label: "Unabled" },
            editInline: false
          }
        }
      },
      endpoint_enabled: {
        label: "Enabled Endpoint",
        decorator: {
          component: Boolean$1,
          props: {
            ontrue: { label: "Enabled" },
            onfalse: { label: "Unabled" },
            editInline: false
          }
        }
      },
      method: { label: "method", decorator: { component: CellMethod } },
      url: { label: "url" },
      status: {
        label: "Status",
        decorator: { component: CellTaskStatus, props: { currentState: true } }
      },
      schedule_mode: {
        label: "Schedule",
        decorator: { component: CellTaskSchedule }
      },
      interval: { hidden: true },
      cron: { hidden: true },
      allow_concurrent: {
        label: "Concurrent",
        decorator: {
          component: Boolean$1,
          props: {
            ontrue: { label: "Allowed" },
            onfalse: { label: "Blocked" },
            editInline: false
          }
        }
      },
      datestart: {
        label: "datestart",
        decorator: { component: DateTime_1 }
      },
      dateend: {
        label: "dateend",
        decorator: { component: DateTime_1 }
      },
      last_run: {
        label: "last_run",
        decorator: { component: DateTime_1 }
      },
      next_run: {
        label: "next_run",
        decorator: { component: DateTime_1 }
      },
      params: {},
      exec_time_limit: {},
      failed_attempts: {},
      max_failed_attempts: { label: "Max fails" },
      last_exec_time: {},
      last_response: {},
      timezone: { hidden: true },
      window_start: { label: "Window from" },
      window_end: { label: "Window to" },
      window_days: { label: "Days" },
      history_limit: { hidden: true },
      note: { hidden: true },
      access: { hidden: true },
      app: { hidden: true },
      resource: { hidden: true },
      environment: { hidden: true },
      app_enabled: { hidden: true }
    };
    let runtime = derived(() => selectedRow.idtask ? DataTableTasks.find((t) => String(t.idtask) === String(selectedRow.idtask)) || null : null);
    let runtimeStatus = derived(() => runtime() ? getIntervalTaskRuntimeStatus(runtime().status) : null);
    let lastResultStatus = derived(() => runtime() ? getIntervalTaskLastResultStatus(runtime().status, runtime().last_response) : null);
    let nextIn = derived(() => {
      if (!runtime()?.next_run) return "";
      const seconds = Math.round((new Date(runtime().next_run).getTime() - Date.now()) / 1e3);
      if (!Number.isFinite(seconds)) return "";
      if (seconds <= 0) return "now";
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
      return `${Math.round(seconds / 3600)}h`;
    });
    let lastResponse = derived(() => {
      const value = runtime()?.last_response;
      if (value === null || value === void 0 || value === "") return "";
      if (typeof value === "string") return value;
      try {
        return JSON.stringify(value, null, 2);
      } catch (error) {
        return String(value);
      }
    });
    function formatMoment(value) {
      if (!value) return "—";
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
    }
    async function loadTasks() {
      if (idapp) {
        const requestedGeneration = runtimeEventGeneration;
        let resp = await uF.get({ url: url_paths.getListIntervalTasksByIdApp, data: { idapp } });
        let jresp = await resp.json();
        let status_sys_endp = await restoreSystemEndpoints(false, store_get($$store_subs ??= {}, "$userStore", userStore).token);
        statusSystemEndpointsStore.set(status_sys_endp);
        if (Array.isArray(jresp)) {
          DataTableTasks = jresp.map((task) => {
            const ev = latestRuntimeEvents.get(String(task.idtask));
            if (!ev || ev.generation <= requestedGeneration) return task;
            return applyRuntimeEvent(task, ev);
          });
        } else {
          DataTableTasks = [];
        }
      } else {
        console.log("idapp not found");
      }
    }
    function normalizeParams(row) {
      if (typeof row.params === "string") {
        try {
          row.params = JSON.parse(row.params || "{}");
        } catch (error) {
          row.params = {};
        }
      } else if (!row.params || typeof row.params !== "object") {
        row.params = {};
      }
      return row;
    }
    async function deleteTasks(tasks) {
      let idtasks = tasks.map((t) => {
        return t.idtask;
      });
      let resp = await uF.DELETE({ url: url_paths.deleteIntervalTasksByIdTask, data: idtasks });
      await resp.json();
      await loadTasks();
    }
    function tab_config($$renderer3) {
      $$renderer3.push(`<div>`);
      Predictive($$renderer3, {
        label: "Url",
        placeholder: "Select the endpoint this task will call",
        classLabel: "is-small",
        classInput: "is-small",
        get options() {
          return optionsEndpoints;
        },
        set options($$value) {
          optionsEndpoints = $$value;
          $$settled = false;
        },
        get selectedValue() {
          return selectedRow.idendpoint;
        },
        set selectedValue($$value) {
          selectedRow.idendpoint = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="columns"><div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "boolean",
        label: "Enabled",
        get value() {
          return selectedRow.enabled;
        },
        set value($$value) {
          selectedRow.enabled = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "boolean",
        label: "Allow concurrent",
        get value() {
          return selectedRow.allow_concurrent;
        },
        set value($$value) {
          selectedRow.allow_concurrent = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-third">`);
      BasicSelect($$renderer3, {
        label: "API Key (auth)",
        get options() {
          return optionsApiKeys;
        },
        set options($$value) {
          optionsApiKeys = $$value;
          $$settled = false;
        },
        get option() {
          return selectedRow.idkey;
        },
        set option($$value) {
          selectedRow.idkey = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <div class="columns"><div class="column is-one-third">`);
      BasicSelect($$renderer3, {
        label: "Schedule mode",
        options: scheduleModes,
        get option() {
          return selectedRow.schedule_mode;
        },
        set option($$value) {
          selectedRow.schedule_mode = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> `);
      if (selectedRow.schedule_mode === "cron") {
        $$renderer3.push(`<!--[0--><div class="column is-one-third">`);
        Basic$1($$renderer3, {
          type: "text",
          label: "Cron: ",
          placeholder: "0 7 * * 1-5",
          get value() {
            return selectedRow.cron;
          },
          set value($$value) {
            selectedRow.cron = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push(`<!--[-1--><div class="column is-one-third">`);
        Basic$1($$renderer3, {
          type: "number",
          label: "Interval (s): ",
          placeholder: "300",
          min: 1,
          step: 1,
          get value() {
            return selectedRow.interval;
          },
          set value($$value) {
            selectedRow.interval = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--> <div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "number",
        label: "Exec time limit (s): ",
        placeholder: "30",
        min: 1,
        step: 1,
        get value() {
          return selectedRow.exec_time_limit;
        },
        set value($$value) {
          selectedRow.exec_time_limit = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <p class="label is-small mb-2">Execution window (optional)</p> <div class="columns"><div class="column is-one-quarter">`);
      Basic$1($$renderer3, {
        type: "text",
        label: "Timezone (IANA): ",
        placeholder: "America/Guayaquil",
        get value() {
          return selectedRow.timezone;
        },
        set value($$value) {
          selectedRow.timezone = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-quarter">`);
      Basic$1($$renderer3, {
        type: "text",
        label: "Window start (HH:MM): ",
        placeholder: "08:00",
        pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$",
        get value() {
          return selectedRow.window_start;
        },
        set value($$value) {
          selectedRow.window_start = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-quarter">`);
      Basic$1($$renderer3, {
        type: "text",
        label: "Window end (HH:MM): ",
        placeholder: "18:00",
        pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$",
        get value() {
          return selectedRow.window_end;
        },
        set value($$value) {
          selectedRow.window_end = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-quarter">`);
      Basic$1($$renderer3, {
        type: "text",
        label: "Days (1=Mon .. 7=Sun): ",
        placeholder: "1,2,3,4,5",
        pattern: "^[1-7](,[1-7])*$",
        get value() {
          return selectedRow.window_days;
        },
        set value($$value) {
          selectedRow.window_days = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <div class="columns"><div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "datetime-local",
        label: "Date Start: ",
        placeholder: "Optional start date",
        get value() {
          return selectedRow.datestart;
        },
        set value($$value) {
          selectedRow.datestart = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "datetime-local",
        label: "Date End: ",
        placeholder: "Optional end date",
        get value() {
          return selectedRow.dateend;
        },
        set value($$value) {
          selectedRow.dateend = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "text",
        label: "Note: ",
        placeholder: "Daily customer synchronization",
        get value() {
          return selectedRow.note;
        },
        set value($$value) {
          selectedRow.note = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <p class="label is-small mb-2">Failure handling</p> <div class="columns"><div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "number",
        label: "Max failed attempts: ",
        placeholder: "10",
        min: 1,
        step: 1,
        get value() {
          return selectedRow.max_failed_attempts;
        },
        set value($$value) {
          selectedRow.max_failed_attempts = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "number",
        label: "History limit: ",
        placeholder: "50",
        min: 0,
        step: 1,
        get value() {
          return selectedRow.history_limit;
        },
        set value($$value) {
          selectedRow.history_limit = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-third"></div></div></div>`);
    }
    function tab_params($$renderer3) {
      EditorCode($$renderer3, {
        lang: "json",
        showFormat: true,
        get code() {
          return selectedRow.params;
        },
        set code($$value) {
          selectedRow.params = $$value;
          $$settled = false;
        }
      });
    }
    function tab_history($$renderer3) {
      if (activeTab === TAB_HISTORY && selectedRow.idtask) {
        $$renderer3.push("<!--[0-->");
        History($$renderer3, { task: selectedRow });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        let taskActions = function($$renderer4) {
          $$renderer4.push(`<div class="field has-addons"><p class="control"><button class="button is-small"${attr("disabled", !historyTask?.idtask, true)} title="Despierta el planificador y ejecuta la tarea inmediatamente"><span class="icon is-small"><i class="fa-solid fa-bolt"></i></span> <span>Run now</span></button></p> <p class="control"><button class="button is-small"${attr("disabled", !historyTask?.idtask, true)} title="Reinicia el contador de fallos y reactiva la tarea si el backoff la deshabilitó"><span class="icon is-small"><i class="fa-solid fa-rotate-left"></i></span> <span>Reset attempts</span></button></p></div>`);
        };
        Table($$renderer3, {
          showEditRow: true,
          showNewButton: canCreate(),
          showDeleteButton: canDelete(),
          showEditButton: canEdit(),
          right_items: [taskActions],
          oneditrow: (r) => {
            selectedRow = normalizeParams(defaultValuesIntervalTask(r));
            selectedRow.enabled = !!r.task_enabled;
            resetTabs();
            showEditor = true;
          },
          onnewrow: () => {
            selectedRow = normalizeParams(defaultValuesIntervalTask({}));
            resetTabs();
            showEditor = true;
          },
          onselectrows: (selected) => {
            historyTask = selected?.rows?.length === 1 ? selected.rows[0] : {};
          },
          ondeleterow: async (r) => {
            if (r.rows.length > 0 && confirm("Are you sure you want to delete this task?")) {
              await deleteTasks(r.rows);
            }
          },
          get RawDataTable() {
            return DataTableTasks;
          },
          set RawDataTable($$value) {
            DataTableTasks = $$value;
            $$settled = false;
          },
          get columns() {
            return columns;
          },
          set columns($$value) {
            columns = $$value;
            $$settled = false;
          },
          get selectionType() {
            return selectionType;
          },
          set selectionType($$value) {
            selectionType = $$value;
            $$settled = false;
          },
          taskActions,
          $$slots: { taskActions: true }
        });
      }
      $$renderer3.push(`<!----> `);
      if (idapp) {
        $$renderer3.push("<!--[0-->");
        SlideFullScreen($$renderer3, {
          get show() {
            return showEditor;
          },
          set show($$value) {
            showEditor = $$value;
            $$settled = false;
          },
          children: ($$renderer4) => {
            {
              let r01 = function($$renderer5) {
                $$renderer5.push(`<div class="field has-addons">`);
                if (selectedRow.idtask) {
                  $$renderer5.push(`<!--[0--><p class="control"><button${attr_class("button is-small is-warning", void 0, { "is-loading": runNowPending })}${attr("disabled", !runtime()?.task_enabled || Number(runtime()?.status) === 1 && !runtime()?.allow_concurrent, true)}${attr("title", !runtime()?.task_enabled ? "Enable and save the task before running it" : Number(runtime()?.status) === 1 && !runtime()?.allow_concurrent ? "The task is already running and does not allow concurrency" : "Runs the last saved configuration immediately")}><span class="icon is-small"><i class="fa-solid fa-bolt"></i></span> <span>Run now</span></button></p>`);
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> <p class="control"><button class="button is-small is-link"><span class="icon is-small"><i class="fa-solid fa-rocket"></i></span> <span>Save &amp; Deploy</span></button></p> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-xmark"></i></span> <span>Cancel</span></button></p></div>`);
              };
              Level($$renderer4, { left: [], right: [r01] });
            }
            $$renderer4.push(`<!----> `);
            if (runtime() && runtimeStatus()) {
              $$renderer4.push(`<!--[0--><div class="box py-3"><div class="level is-mobile mb-2"><div class="level-left"><span class="icon-text"><span class="icon"><i${attr_class(clsx(runtimeStatus().icon), "svelte-3ulh1c")}></i></span> <span class="has-text-weight-semibold">Runtime status</span></span></div> <div class="level-right"><div class="tags"><span${attr_class(`tag is-${stringify(runtimeStatus().background)}`, "svelte-3ulh1c")}>${escape_html(runtimeStatus().label)}</span> `);
              if (lastResultStatus()) {
                $$renderer4.push(`<!--[0--><span${attr_class(`tag is-${stringify(lastResultStatus().background)}`, "svelte-3ulh1c")}>Last result: ${escape_html(lastResultStatus().label)}</span>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></div></div></div> <p class="help mb-3">${escape_html(runtimeStatus().description)}</p> <div class="columns is-multiline is-mobile mb-0"><div class="column is-one-quarter"><p class="heading">Last run</p> <p>${escape_html(formatMoment(runtime().last_run))}</p></div> <div class="column is-one-quarter"><p class="heading">Next run</p> <p>${escape_html(formatMoment(runtime().next_run))}${escape_html(nextIn() ? ` (in ${nextIn()})` : "")}</p></div> <div class="column is-one-quarter"><p class="heading">Last duration</p> <p>${escape_html(runtime().last_exec_time ? `${runtime().last_exec_time} ms` : "—")}</p></div> <div class="column is-one-quarter"><p class="heading">Failed attempts</p> <p${attr_class("", void 0, {
                "has-text-danger": Number(runtime().max_failed_attempts ?? 0) > 0 && Number(runtime().failed_attempts ?? 0) >= Number(runtime().max_failed_attempts)
              })}>${escape_html(runtime().failed_attempts ?? 0)} / ${escape_html(runtime().max_failed_attempts ?? 0)}</p></div></div> `);
              if (lastResponse()) {
                $$renderer4.push(`<!--[0--><p class="heading">Last response</p> <pre class="is-size-7 last-response svelte-3ulh1c">${escape_html(lastResponse())}</pre>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> <div>`);
            Tab($$renderer4, {
              get tabs() {
                return tabList;
              },
              set tabs($$value) {
                tabList = $$value;
                $$settled = false;
              },
              get active() {
                return activeTab;
              },
              set active($$value) {
                activeTab = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { idapp });
  });
}
function CellBotStatus($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let status = derived(() => BotRuntimeStatus[value] || BotRuntimeStatusFallback);
    let retryIn = derived(() => {
      if (!row?.next_retry_at) return "";
      const seconds = Math.round((new Date(row.next_retry_at).getTime() - Date.now()) / 1e3);
      if (!Number.isFinite(seconds) || seconds <= 0) return "now";
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
      return `${Math.round(seconds / 3600)}h`;
    });
    let title = derived(() => [
      status().description,
      row?.last_error_type ? `Last error: ${row.last_error_type}` : "",
      row?.failure_count ? `Consecutive failures: ${row.failure_count}` : ""
    ].filter(Boolean).join("\n"));
    $$renderer2.push(`<td><div class="tags has-addons"${attr("title", title())}><span${attr_class(`tag is-${stringify(status().background)}`)}><span class="icon is-small"><i${attr_class(clsx(status().icon))}></i></span> <span>${escape_html(status().label)}</span></span> `);
    if (retryIn() && (value === "BACKOFF" || value === "QUARANTINED")) {
      $$renderer2.push(`<!--[0--><span class="tag is-dark">retry ${escape_html(retryIn())}</span>`);
    } else if (row?.failure_count > 0 && value !== "RUNNING") {
      $$renderer2.push(`<!--[1--><span class="tag is-dark">${escape_html(row.failure_count)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></td>`);
    bind_props($$props, { value, row });
  });
}
function Bot_bkp($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let uF = new uFetch(url_paths.getBotBackups);
    let { idbot = void 0, onselect = (d) => {
    } } = $$props;
    let dataBackups = [];
    let selectionType = 1;
    let columns = {
      hash: { hidden: true },
      idbot: { hidden: true },
      data: { hidden: true }
    };
    let data_backup = void 0;
    let class_search = derived(() => {
      return data_backup && data_backup?.data?.idbot == idbot ? "is-link" : "";
    });
    async function fetchData() {
      if (idbot) {
        selectionType = 1;
        try {
          let req = await uF.get({ data: { idbot, lightweight: false } });
          dataBackups = await req.json();
        } catch (error) {
          console.error("Error fetching bot backups:", error);
        }
      } else {
        dataBackups = [];
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        let restoreBackup = function($$renderer4) {
          $$renderer4.push(`<button${attr_class(`button is-small ${stringify(class_search())}`)}><span>Restore Backup ${escape_html(data_backup?.idbackup || "")}</span> <span class="icon"><i class="fa-regular fa-circle-up"></i></span></button>`);
        };
        Table($$renderer3, {
          columns,
          left_items: [restoreBackup],
          onsearch: fetchData,
          onselectrows: (selected) => {
            if (selected.rows && selected.rows.length == 1) {
              data_backup = selected.rows[0];
            } else {
              data_backup = null;
            }
          },
          get RawDataTable() {
            return dataBackups;
          },
          set RawDataTable($$value) {
            dataBackups = $$value;
            $$settled = false;
          },
          get selectionType() {
            return selectionType;
          },
          set selectionType($$value) {
            selectionType = $$value;
            $$settled = false;
          },
          restoreBackup,
          $$slots: { restoreBackup: true }
        });
      }
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { idbot });
  });
}
function Bot_logs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { idbot = void 0, hours = 24 } = $$props;
    let uF = new uFetch(url_paths.getBotLogs);
    let dataLogs = [];
    let columns = {
      id: { hidden: true },
      idbot: { hidden: true },
      idapp: { hidden: true },
      trace_id: { hidden: true },
      timestamp: { label: "Time" },
      provider: { label: "Provider" },
      environment: { label: "Env" },
      event: { label: "Event" },
      log_level: { label: "Level" },
      status_code: { label: "Status" },
      error_type: { label: "Error type" },
      message: { label: "Message" },
      stack: { hidden: true },
      provider_response: { hidden: true },
      runtime_status_snapshot: { label: "Runtime status" },
      failure_count_snapshot: { hidden: true },
      duration_ms: { label: "Duration (ms)" },
      user_agent: { label: "Source" },
      metadata: { hidden: true }
    };
    let inputHours = hours;
    async function fetchLogs() {
      if (idbot) {
        try {
          let req = await uF.get({ data: { idbot, last_hours: inputHours } });
          let jresp = await req.json();
          if (jresp && jresp.success && Array.isArray(jresp.data)) {
            dataLogs = jresp.data;
          } else {
            dataLogs = [];
          }
        } catch (error) {
          console.error("Error fetching bot logs:", error);
          dataLogs = [];
        }
      } else {
        dataLogs = [];
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="field has-addons mb-3"><p class="control"><input class="input is-small" type="number" min="1" max="72"${attr("value", inputHours)} style="width:70px"/></p> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-rotate"></i></span> <span>Hours</span></button></p></div> `);
      Table($$renderer3, {
        columns,
        onsearch: fetchLogs,
        get RawDataTable() {
          return dataLogs;
        },
        set RawDataTable($$value) {
          dataLogs = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { idbot });
  });
}
function Bots($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { idapp = void 0, onchange = () => {
    } } = $$props;
    let notify = new Notifications$1();
    const uF = new uFetch();
    const permEnv = getDefaultEnvironment();
    const currentUser = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore)?.user);
    const canCreate = derived(() => currentUserHasPermission(currentUser(), permEnv, "bots", "create"));
    const canEdit = derived(() => currentUserHasPermission(currentUser(), permEnv, "bots", "edit"));
    const canDelete = derived(() => currentUserHasPermission(currentUser(), permEnv, "bots", "delete"));
    let showEditor = false;
    let selectedRow = defaultValuesBot({});
    let DataTableBots = [];
    let customToken = "";
    let optionsEnvironment = Environment.map((e) => {
      return { name: e.value, value: e.id };
    });
    let health = null;
    let activeTab = 0;
    const TAB_BACKUPS = 3;
    const TAB_LOGS = 4;
    let tabList = [
      {
        name: "general",
        label: "General",
        component: tab_general,
        classIcon: "fa-solid fa-sliders"
      },
      {
        name: "params",
        label: "Params (JSON)",
        component: tab_params,
        classIcon: "fa-solid fa-code"
      },
      {
        name: "code",
        label: "Code",
        component: tab_code,
        classIcon: "fa-solid fa-file-code"
      },
      {
        name: "backups",
        label: "Backups",
        component: tab_backups,
        classIcon: "fa-solid fa-list-check",
        disabled: true
      },
      {
        name: "logs",
        label: "Logs",
        component: tab_logs,
        classIcon: "fa-solid fa-scroll",
        disabled: true
      }
    ];
    function resetTabs() {
      activeTab = 0;
      tabList[TAB_BACKUPS].disabled = !selectedRow.idbot;
      tabList[TAB_LOGS].disabled = !selectedRow.idbot;
    }
    function normalizeParams(row) {
      if (typeof row.params === "string") {
        try {
          row.params = JSON.parse(row.params || "{}");
        } catch (error) {
          row.params = {};
        }
      } else if (!row.params || typeof row.params !== "object") {
        row.params = {};
      }
      return row;
    }
    let healthStatus = derived(() => health ? BotRuntimeStatus[health.runtime_status] || BotRuntimeStatusFallback : null);
    function formatMoment(value) {
      if (!value) return "—";
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
    }
    let columns = {
      idbot: { hidden: true },
      idapp: { hidden: true },
      name: { label: "Name" },
      description: { label: "Description" },
      enabled: {
        label: "Enabled",
        decorator: {
          component: Boolean$1,
          props: {
            // El decorador solo dibuja el icono con etiqueta si recibe `custom`;
            // sin ese envoltorio cae al checkbox mudo.
            custom: {
              ontrue: { label: "Enabled" },
              onfalse: { label: "Disabled" },
              editInline: false
            }
          }
        }
      },
      runtime_status: { label: "Status", decorator: { component: CellBotStatus } },
      last_error_type: { label: "Last error" },
      environment: { label: "Environment" },
      createdAt: {
        label: "Created",
        decorator: { component: DateTime_1 }
      },
      updatedAt: {
        label: "Updated",
        decorator: { component: DateTime_1 }
      },
      // El detalle de la salud vive en el editor; en la lista solo estorbaría.
      provider: { hidden: true },
      params: { hidden: true },
      failure_count: { hidden: true },
      last_error_message: { hidden: true },
      last_failure_at: { hidden: true },
      next_retry_at: { hidden: true },
      last_started_at: { hidden: true },
      last_healthy_at: { hidden: true },
      disabled_by: { hidden: true },
      disabled_reason: { hidden: true }
    };
    async function loadBots() {
      if (idapp) {
        try {
          let resp = await uF.get({ url: `${url_paths.bots}/prd`, data: { idapp } });
          let jresp = await resp.json();
          let status_sys_endp = await restoreSystemEndpoints(false, store_get($$store_subs ??= {}, "$userStore", userStore).token);
          statusSystemEndpointsStore.set(status_sys_endp);
          if (jresp && jresp.success && Array.isArray(jresp.data)) {
            DataTableBots = jresp.data;
          } else {
            DataTableBots = [];
            if (jresp && jresp.error) {
              notify.push({ message: jresp.error, color: "danger" });
            }
          }
        } catch (error) {
          console.error("loadBots error >>>>>>>>>>>>>", error);
          notify.push({
            message: error.message || "Failed to load bots",
            color: "danger"
          });
          DataTableBots = [];
        }
      } else {
        console.log("idapp not found");
      }
    }
    async function getBot(idbot) {
      try {
        let resp = await uF.get({
          url: `${url_paths.bots}/prd`,
          data: { idbot, include_code: true, include_token: true }
        });
        let jresp = await resp.json();
        if (jresp && jresp.success && jresp.data) {
          if (Array.isArray(jresp.data)) {
            return jresp.data.length > 0 ? jresp.data[0] : null;
          }
          return jresp.data;
        }
        if (jresp && jresp.error) {
          notify.push({ message: jresp.error, color: "danger" });
        }
        return null;
      } catch (error) {
        console.error("getBot error >>>>>>>>>>>>>", error);
        notify.push({
          message: error.message || "Failed to load bot details",
          color: "danger"
        });
        return null;
      }
    }
    async function deleteBots(bots) {
      try {
        for (let bot of bots) {
          let resp = await uF.DELETE({ url: `${url_paths.bots}/${bot.idbot}/prd` });
          let jresp = await resp.json();
          if (jresp && !jresp.success && jresp.error) {
            notify.push({ message: jresp.error, color: "danger" });
          }
        }
        notify.push({ message: "Bot(s) deleted successfully", color: "success" });
        await loadBots();
      } catch (error) {
        console.error("deleteBots error >>>>>>>>>>>>>", error);
        notify.push({
          message: error.message || "Failed to delete bot(s)",
          color: "danger"
        });
      }
    }
    const unsubBotStatus = storeBotStatusChanged.subscribe((evt) => {
      if (!evt || !evt.idbot) return;
      const idx = DataTableBots.findIndex((r) => r.idbot === evt.idbot);
      if (idx !== -1) {
        const row = { ...DataTableBots[idx] };
        for (const key of Object.keys(evt)) {
          if (key === "ts" || key === "idbot" || key === "idapp") continue;
          row[key] = evt[key];
        }
        DataTableBots[idx] = row;
      }
      if (showEditor && selectedRow.idbot === evt.idbot) {
        health = { ...health, ...evt };
      }
    });
    const unsubBotChanged = storeBotChanged.subscribe((evt) => {
      if (!evt) return;
      if (evt.idapp && evt.idapp !== idapp) return;
      loadBots();
    });
    onDestroy(() => {
      unsubBotStatus();
      unsubBotChanged();
    });
    function tab_general($$renderer3) {
      $$renderer3.push(`<div class="columns"><div class="column is-one-third">`);
      Basic$1($$renderer3, {
        label: "Name:",
        get value() {
          return selectedRow.name;
        },
        set value($$value) {
          selectedRow.name = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-third">`);
      Basic$1($$renderer3, {
        type: "boolean",
        label: "Enabled",
        get value() {
          return selectedRow.enabled;
        },
        set value($$value) {
          selectedRow.enabled = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="column is-one-third">`);
      Predictive($$renderer3, {
        label: "Environment",
        classLabel: "is-small",
        classInput: "is-small",
        get options() {
          return optionsEnvironment;
        },
        set options($$value) {
          optionsEnvironment = $$value;
          $$settled = false;
        },
        get selectedValue() {
          return selectedRow.environment;
        },
        set selectedValue($$value) {
          selectedRow.environment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <div class="columns"><div class="column is-full">`);
      Params_json_selector($$renderer3, {
        label: "Token:",
        freeTyping: true,
        placeholder: "Bot Token or $_VAR_NAME",
        onselect: (selected) => {
          if (selected.appvar) {
            selectedRow.token = selected.appvar;
          } else {
            selectedRow.token = selected.custom;
          }
        },
        get environment() {
          return selectedRow.environment;
        },
        set environment($$value) {
          selectedRow.environment = $$value;
          $$settled = false;
        },
        get custom() {
          return customToken;
        },
        set custom($$value) {
          customToken = $$value;
          $$settled = false;
        },
        get appvar() {
          return selectedRow.token;
        },
        set appvar($$value) {
          selectedRow.token = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <div class="columns"><div class="column is-full">`);
      TextArea$1($$renderer3, {
        label: "Description:",
        get value() {
          return selectedRow.description;
        },
        set value($$value) {
          selectedRow.description = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div>`);
    }
    function tab_params($$renderer3) {
      $$renderer3.push(`<p class="help">Parameters passed to the bot at runtime.</p> `);
      EditorCode($$renderer3, {
        lang: "json",
        showFormat: true,
        get code() {
          return selectedRow.params;
        },
        set code($$value) {
          selectedRow.params = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    function tab_code($$renderer3) {
      $$renderer3.push(`<p class="help">The constant $BOT is an instance of Grammy.</p> `);
      EditorCode($$renderer3, {
        lang: "js",
        showFormat: true,
        get code() {
          return selectedRow.code;
        },
        set code($$value) {
          selectedRow.code = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    function tab_backups($$renderer3) {
      if (activeTab === TAB_BACKUPS && selectedRow.idbot) {
        $$renderer3.push(`<!--[0--><p class="help mb-3">Every save and every deletion stores a version. Restoring one loads it into this form;
			nothing changes until you press <strong>Save &amp; Deploy</strong>.</p> `);
        Bot_bkp($$renderer3, {
          onselect: (backup) => {
            if (backup && backup.idbot == selectedRow.idbot) {
              selectedRow = normalizeParams(defaultValuesBot(snapshot(backup)));
              notify.push({
                message: `Bot ${selectedRow.name} loaded from backup. Save to persist.`,
                color: "success"
              });
            }
          },
          get idbot() {
            return selectedRow.idbot;
          },
          set idbot($$value) {
            selectedRow.idbot = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function tab_logs($$renderer3) {
      if (activeTab === TAB_LOGS && selectedRow.idbot) {
        $$renderer3.push(`<!--[0--><p class="help mb-3">Lifecycle events (starts, stops, errors, retries) for this bot. Default window is 24 hours.</p> `);
        Bot_logs($$renderer3, {
          get idbot() {
            return selectedRow.idbot;
          },
          set idbot($$value) {
            selectedRow.idbot = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Table($$renderer3, {
        showEditRow: true,
        showNewButton: canCreate(),
        showDeleteButton: canDelete(),
        showEditButton: canEdit(),
        oneditrow: async (r) => {
          let fullBot = await getBot(r.idbot);
          selectedRow = normalizeParams(defaultValuesBot(fullBot || r));
          health = fullBot || r;
          resetTabs();
          if (health?.disabled_by === "system" && selectedRow.enabled === false) {
            selectedRow.enabled = true;
          }
          showEditor = true;
        },
        onnewrow: () => {
          selectedRow = normalizeParams(defaultValuesBot({ idapp }));
          health = null;
          resetTabs();
          showEditor = true;
        },
        ondeleterow: async (r) => {
          if (r.rows.length > 0 && confirm("Are you sure you want to delete the selected bot(s)?")) {
            await deleteBots(r.rows);
          }
        },
        get RawDataTable() {
          return DataTableBots;
        },
        set RawDataTable($$value) {
          DataTableBots = $$value;
          $$settled = false;
        },
        get columns() {
          return columns;
        },
        set columns($$value) {
          columns = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (idapp) {
        $$renderer3.push("<!--[0-->");
        SlideFullScreen($$renderer3, {
          get show() {
            return showEditor;
          },
          set show($$value) {
            showEditor = $$value;
            $$settled = false;
          },
          children: ($$renderer4) => {
            {
              let r01 = function($$renderer5) {
                $$renderer5.push(`<div class="field has-addons"><p class="control"><button class="button is-small is-link"><span class="icon is-small"><i class="fa-solid fa-rocket"></i></span> <span>Save &amp; Deploy</span></button></p> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-xmark"></i></span> <span>Cancel</span></button></p></div>`);
              };
              Level($$renderer4, { left: [], right: [r01] });
            }
            $$renderer4.push(`<!----> <div>`);
            if (health && healthStatus()) {
              $$renderer4.push(`<!--[0--><div class="box"><div class="level is-mobile mb-2"><div class="level-left"><div class="level-item"><span class="icon-text"><span${attr_class(`icon ${stringify(healthStatus().color)}`)}><i${attr_class(clsx(healthStatus().icon))}></i></span> <span class="has-text-weight-semibold">Runtime status: ${escape_html(healthStatus().label)}</span></span></div></div> <div class="level-right"><div class="level-item">`);
              if (healthStatus().needsAction) {
                $$renderer4.push(`<!--[0--><span class="tag is-danger">Needs attention</span>`);
              } else {
                $$renderer4.push(`<!--[-1--><span class="tag is-light">No action needed</span>`);
              }
              $$renderer4.push(`<!--]--></div></div></div> <p class="help mb-3">${escape_html(healthStatus().description)}</p> `);
              if (health.disabled_by === "system") {
                $$renderer4.push(`<!--[0--><div class="notification is-warning is-light py-2 px-3 mb-3"><span class="icon-text"><span class="icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span> <span>The system disabled this bot${escape_html(health.disabled_reason ? ` (${health.disabled_reason})` : "")}. Fix the token or the code and save: it has already been switched back
									to <strong>Enabled</strong> for you.</span></span></div>`);
              } else if (health.disabled_by === "user") {
                $$renderer4.push(`<!--[1--><p class="help mb-3">This bot was disabled manually. It will not start again until you enable it.</p>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--> <div class="columns is-multiline is-mobile mb-0"><div class="column is-one-quarter"><p class="heading">Consecutive failures</p> <p>${escape_html(health.failure_count ?? 0)}</p></div> <div class="column is-one-quarter"><p class="heading">Last error type</p> <p>${escape_html(health.last_error_type || "—")}</p></div> <div class="column is-one-quarter"><p class="heading">Last failure</p> <p>${escape_html(formatMoment(health.last_failure_at))}</p></div> <div class="column is-one-quarter"><p class="heading">Next retry</p> <p>${escape_html(formatMoment(health.next_retry_at))}</p></div> <div class="column is-one-quarter"><p class="heading">Last started</p> <p>${escape_html(formatMoment(health.last_started_at))}</p></div> <div class="column is-one-quarter"><p class="heading">Last healthy</p> <p>${escape_html(formatMoment(health.last_healthy_at))}</p></div> <div class="column is-one-quarter"><p class="heading">Disabled by</p> <p>${escape_html(health.disabled_by || "—")}</p></div> <div class="column is-one-quarter"><p class="heading">Provider</p> <p>${escape_html(health.provider || "—")}</p></div></div> `);
              if (health.last_error_message) {
                $$renderer4.push(`<!--[0--><div><p class="heading">Last error message</p> <pre class="is-size-7">${escape_html(health.last_error_message)}</pre></div>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            Tab($$renderer4, {
              get tabs() {
                return tabList;
              },
              set tabs($$value) {
                tabList = $$value;
                $$settled = false;
              },
              get active() {
                return activeTab;
              },
              set active($$value) {
                activeTab = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { idapp });
  });
}
function CellStatusCode($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0 } = $$props;
    let statusClass = derived(() => {
      const code2 = Number(value);
      if (!Number.isFinite(code2) || code2 < 100) return "is-light";
      if (code2 < 200) return "is-info";
      if (code2 < 300) return "is-success";
      if (code2 < 400) return "is-warning";
      if (code2 < 500) return "is-danger";
      return "is-danger";
    });
    let messageObj = derived(() => {
      const m = row?.message;
      if (!m) return null;
      if (typeof m === "string") {
        try {
          return JSON.parse(m);
        } catch {
          return null;
        }
      }
      return m;
    });
    let isAttack = derived(() => messageObj()?.type === "posible_ataque");
    let titleText = derived(() => [
      `HTTP ${value ?? ""} ${httpStatusText(value)}`,
      isAttack() ? "Possible attack detected" : ""
    ].filter(Boolean).join("\n"));
    $$renderer2.push(`<td><div class="tags has-addons"${attr("titletext", titleText())}>`);
    if (value != null && value !== "") {
      $$renderer2.push(`<!--[0--><span${attr_class(`tag ${stringify(statusClass())}`)}>${escape_html(value)}</span>`);
    } else {
      $$renderer2.push(`<!--[-1--><span class="tag is-light">—</span>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (isAttack()) {
      $$renderer2.push(`<!--[0--><span class="tag is-dark" title="Possible attack detected"><span class="icon is-small"><i class="fa-solid fa-shield-halved"></i></span></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></td>`);
    bind_props($$props, { value, row });
  });
}
function CellTraceId($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, row = void 0, onOpenTrace = void 0 } = $$props;
    $$renderer2.push(`<td>`);
    if (value) {
      $$renderer2.push(`<!--[0--><div class="is-flex is-align-items-center" style="gap: 0.4rem;"><span class="is-size-7 has-text-grey" style="word-break: break-all; overflow-wrap: anywhere;"${attr("title", value)}>${escape_html(value)}</span> <button class="button is-small is-text" title="Copy trace ID"><span class="icon is-small"><i class="fa-regular fa-copy"></i></span></button> <button class="button is-small is-link is-outlined" title="View trace detail"><span class="icon is-small"><i class="fa-solid fa-diagram-project"></i></span></button></div>`);
    } else {
      $$renderer2.push(`<!--[-1--><span>—</span>`);
    }
    $$renderer2.push(`<!--]--></td>`);
    bind_props($$props, { value, row });
  });
}
function jsonBlock($$renderer, data, label) {
  JSONView($$renderer, { jsonObject: data, label, maxHeight: 340, showBox: false });
}
function Request_detail($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { show = false, row = void 0, appName = "" } = $$props;
    let isAttack = derived(() => row?.message?.type === "posible_ataque");
    let hasMessage = derived(() => row?.message != null && String(row.message).trim() !== "");
    let jsonFields = derived(() => [
      "req_headers",
      "res_headers",
      "query",
      "body",
      "params",
      "response_data"
    ].filter((k) => row?.[k] != null && String(row[k] ?? "").trim() !== ""));
    let formattedDate = derived(() => {
      if (!row?.timestamp) return "—";
      const t = DateTime.fromISO(row.timestamp);
      return t.isValid ? t.toFormat("yyyy-MM-dd HH:mm:ss") : String(row.timestamp);
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Modal($$renderer3, {
        showCloseButton: true,
        get show() {
          return show;
        },
        set show($$value) {
          show = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="box"><div class="level is-mobile mb-3"><div class="level-left"><div><p class="heading">Request detail</p> <p class="is-size-6 is-family-monospace has-text-grey">${escape_html(row?.id ? String(row.id).slice(0, 8) : "")}</p></div></div> <div class="level-right">`);
          if (isAttack()) {
            $$renderer4.push(`<!--[0--><span class="tag is-danger"><span class="icon is-small"><i class="fa-solid fa-shield-halved"></i></span> <span>Possible attack</span></span>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--></div></div> <div class="field is-grouped is-grouped-multiline mb-3"><div class="control"><div class="tags has-addons"><span class="tag is-light">Date</span> <span class="tag">${escape_html(formattedDate())}</span></div></div> `);
          if (row?.method) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">Method</span> <span class="tag is-info">${escape_html(row.method)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.status_code != null && row.status_code !== "") {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">Status</span> <span class="tag is-dark"${attr("title", httpStatusText(row.status_code))}>${escape_html(row.status_code)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.environment) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">Env</span> <span class="tag">${escape_html(row.environment)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (appName) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">App</span> <span class="tag">${escape_html(appName)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.idapp) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">idapp</span> <span class="tag">${escape_html(row.idapp)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.idendpoint) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">idendpoint</span> <span class="tag">${escape_html(row.idendpoint)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.log_level != null) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">Log level</span> <span class="tag">${escape_html(row.log_level)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.response_time != null) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">Time</span> <span class="tag">${escape_html(row.response_time)} ms</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.client) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">Client IP</span> <span class="tag">${escape_html(row.client)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.trace_id) {
            $$renderer4.push(`<!--[0--><div class="control"><div class="tags has-addons"><span class="tag is-light">Trace ID</span> <span class="tag" style="word-break: break-all;">${escape_html(row.trace_id)}</span></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--></div> `);
          if (row?.url) {
            $$renderer4.push(`<!--[0--><div class="mb-2"><p class="heading">Resource</p> <p class="is-family-code is-size-7" style="word-break: break-all;">${escape_html(row.url)}</p></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (row?.user_agent) {
            $$renderer4.push(`<!--[0--><div class="mb-2"><p class="heading">User agent</p> <p class="is-size-7 has-text-grey" style="word-break: break-all;">${escape_html(row.user_agent)}</p></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (hasMessage()) {
            $$renderer4.push(`<!--[0--><div class="mb-3">`);
            jsonBlock($$renderer4, row.message, "Message");
            $$renderer4.push(`<!----></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (jsonFields().length > 0) {
            $$renderer4.push(`<!--[0--><!--[-->`);
            const each_array = ensure_array_like(jsonFields());
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let field = each_array[$$index];
              $$renderer4.push(`<div class="mb-3">`);
              jsonBlock($$renderer4, row[field], field);
              $$renderer4.push(`<!----></div>`);
            }
            $$renderer4.push(`<!--]-->`);
          } else {
            $$renderer4.push(`<!--[-1--><p class="has-text-grey is-italic is-size-7">No request/response payload stored for this log entry.</p>`);
          }
          $$renderer4.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { show, row, appName });
  });
}
function Trace_view($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { show = false, trace_id = "" } = $$props;
    let errors = [];
    let slowest = [];
    function fmtTs(v) {
      if (v == null) return "—";
      const d = DateTime.fromISO(String(v));
      return d.isValid ? d.toFormat("yyyy-MM-dd HH:mm:ss") : String(v);
    }
    function fmtMs(v) {
      if (v == null) return "—";
      if (Number.isFinite(Number(v))) return `${Number(v).toLocaleString("en-US")} ms`;
      return String(v);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Modal($$renderer3, {
        showCloseButton: true,
        closeOnEscape: true,
        get show() {
          return show;
        },
        set show($$value) {
          show = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<div style="width: 95vw; max-width: 1100px; max-height: 88vh; overflow-y: auto;"><div class="box"><div class="level is-mobile mb-3"><div class="level-left"><div><p class="heading">Trace</p> <p class="is-family-monospace is-size-7 has-text-grey" style="word-break: break-all;">${escape_html(trace_id || "—")}</p></div></div> <div class="level-right"><button class="button is-small is-light" title="Copy trace ID"><span class="icon is-small"><i class="fa-regular fa-copy"></i></span> <span>Copy</span></button></div></div> `);
          {
            $$renderer4.push(`<!--[-1--><p class="has-text-grey is-italic is-size-7">No trace data.</p>`);
          }
          $$renderer4.push(`<!--]--></div> `);
          {
            $$renderer4.push(`<!--[0--><div class="box"><p class="heading mb-2">Errors</p> `);
            if (errors.length === 0) {
              $$renderer4.push(`<!--[0--><p class="has-text-grey is-italic is-size-7">No error hops for this trace.</p>`);
            } else {
              $$renderer4.push(`<!--[-1--><div class="table-container"><table class="table is-fullwidth is-narrow is-striped is-hoverable"><thead><tr><th>Date/Time</th><th>Status</th><th>Method</th><th>Endpoint</th><th class="has-text-right">Time (ms)</th><th>Message</th></tr></thead><tbody><!--[-->`);
              const each_array_1 = ensure_array_like(errors);
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let err = each_array_1[$$index_1];
                $$renderer4.push(`<tr><td class="is-size-7">${escape_html(fmtTs(err.timestamp))}</td><td class="is-size-7"><span class="tag is-danger"${attr("title", httpStatusText(err.status_code))}>${escape_html(err.status_code ?? "—")}</span></td><td class="is-size-7">${escape_html(err.method ?? "—")}</td><td class="is-size-7" style="word-break: break-all;">${escape_html(err.url ?? "—")}</td><td class="has-text-right is-size-7">${escape_html(fmtMs(err.response_time))}</td><td class="is-size-7" style="word-break: break-all;">${escape_html(err.message ?? "—")}</td></tr>`);
              }
              $$renderer4.push(`<!--]--></tbody></table></div>`);
            }
            $$renderer4.push(`<!--]--></div> <div class="box"><p class="heading mb-2">Slowest hops</p> `);
            if (slowest.length === 0) {
              $$renderer4.push(`<!--[0--><p class="has-text-grey is-italic is-size-7">No slow hops recorded for this trace.</p>`);
            } else {
              $$renderer4.push(`<!--[-1--><div class="table-container"><table class="table is-fullwidth is-narrow is-striped is-hoverable"><thead><tr><th>Endpoint</th><th>Method</th><th class="has-text-right">Hits</th><th class="has-text-right">Avg (ms)</th><th class="has-text-right">Min (ms)</th><th class="has-text-right">Max (ms)</th></tr></thead><tbody><!--[-->`);
              const each_array_2 = ensure_array_like(slowest);
              for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                let hop = each_array_2[$$index_2];
                $$renderer4.push(`<tr><td class="is-size-7" style="word-break: break-all;">${escape_html(hop.url ?? hop.idendpoint ?? "—")}</td><td class="is-size-7">${escape_html(hop.method ?? "—")}</td><td class="has-text-right is-size-7">${escape_html(hop.hits ?? "—")}</td><td class="has-text-right is-size-7">${escape_html(fmtMs(hop.avg_response_time))}</td><td class="has-text-right is-size-7">${escape_html(fmtMs(hop.min_response_time))}</td><td class="has-text-right is-size-7">${escape_html(fmtMs(hop.max_response_time))}</td></tr>`);
              }
              $$renderer4.push(`<!--]--></tbody></table></div>`);
            }
            $$renderer4.push(`<!--]--></div>`);
          }
          $$renderer4.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { show, trace_id });
  });
}
function Logs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { idapp = void 0 } = $$props;
    let includeAllApps = false;
    let environment = "prd";
    let timeMode = "preset";
    let presetHours = 24;
    let startDate = "";
    let endDate = "";
    let statusClasses = [];
    let method = "";
    let logLevel = "";
    let idendpoint = "";
    let traceId = "";
    let eventName = "";
    let limit = 500;
    let fullDetail = true;
    let logs = [];
    let loading = false;
    let endpointsOptions = [];
    let appNameById = {};
    let showDetail = false;
    let selectedRow = null;
    let selectedAppName = "";
    let showTrace = false;
    let traceToInspect = "";
    const ENVIRONMENTS = [
      { id: "prd", value: "Production" },
      { id: "qa", value: "QA" },
      { id: "dev", value: "Development" }
    ];
    const METHODS2 = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
    const LOG_LEVELS = [
      { id: "", value: "All levels" },
      { id: "1", value: "1 — Basic" },
      { id: "2", value: "2 — Normal" },
      { id: "3", value: "3 — Full" }
    ];
    const STATUS_CODE_RANGES = {
      "1xx": [100, 199],
      "2xx": [200, 299],
      "3xx": [300, 399],
      "4xx": [400, 499],
      "5xx": [500, 599]
    };
    let reloadTimer = null;
    onDestroy(() => {
      clearTimeout(reloadTimer);
    });
    function onRowClick({ row }) {
      selectedRow = row;
      selectedAppName = appNameById[row?.idapp] ?? row?.idapp ?? "";
      showDetail = true;
    }
    function openTrace({ row }) {
      traceToInspect = row?.trace_id || "";
      if (traceToInspect) showTrace = true;
    }
    function handleHoursChange(e) {
      const value = Math.floor(Number(e.target.value));
      presetHours = Number.isFinite(value) && value > 0 ? value : 24;
    }
    function handleLimitChange(e) {
      const value = Math.floor(Number(e.target.value));
      limit = Number.isFinite(value) && value > 0 && value <= 999999 ? value : 1e3;
    }
    function handleExactCodesInput(e) {
      e.currentTarget.value;
    }
    let columns = {
      timestamp: {
        label: "Date/Time",
        decorator: {
          component: DateTime_1,
          props: { format: "yyyy-MM-dd HH:mm:ss" }
        }
      },
      status_code: { label: "Status", decorator: { component: CellStatusCode } },
      method: { label: "Method" },
      url: { label: "Resource" },
      app_name: { label: "App" },
      client: { label: "Client IP" },
      response_time: { label: "Time (ms)" },
      trace_id: {
        label: "Trace ID",
        decorator: { component: CellTraceId, props: { onOpenTrace: openTrace } }
      },
      log_level: { label: "Level" },
      id: { hidden: true },
      idapp: { hidden: true },
      idendpoint: { hidden: true },
      user_agent: { hidden: true },
      req_headers: { hidden: true },
      res_headers: { hidden: true },
      response_data: { hidden: true },
      message: { hidden: true }
    };
    function tableStatus($$renderer3) {
      $$renderer3.push(`<span class="is-size-7 has-text-grey">${escape_html(`${logs.length} records`)}</span> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    function realtimeToggle($$renderer3) {
      $$renderer3.push(`<button${attr_class(`button is-small ${"is-link is-outlined"}`)} title="Auto-reload this table when new requests matching the current filters arrive (websocket)"><span class="icon is-small"><i${attr_class(`fa-solid ${"fa-circle"}`)}></i></span> <span>${escape_html("Realtime OFF")}</span></button>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="box p-3 mb-3"><div class="field is-grouped is-grouped-multiline"><div class="control"><label class="checkbox"><input type="checkbox"${attr("checked", includeAllApps, true)}/> All apps</label></div> <div class="control">`);
      BasicSelect($$renderer3, {
        label: "Environment",
        options: ENVIRONMENTS,
        get option() {
          return environment;
        },
        set option($$value) {
          environment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="control">`);
      BasicSelect($$renderer3, {
        label: "Endpoint",
        options: [{ id: "", value: "All endpoints" }, ...endpointsOptions],
        get option() {
          return idendpoint;
        },
        set option($$value) {
          idendpoint = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="control">`);
      BasicSelect($$renderer3, {
        label: "Method",
        options: [
          { id: "", value: "All methods" },
          ...METHODS2.map((m) => ({ id: m, value: m }))
        ],
        get option() {
          return method;
        },
        set option($$value) {
          method = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="control">`);
      BasicSelect($$renderer3, {
        label: "Log level",
        options: LOG_LEVELS,
        get option() {
          return logLevel;
        },
        set option($$value) {
          logLevel = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="control">`);
      Basic$1($$renderer3, {
        label: "Trace ID",
        type: "text",
        placeholder: "Search by trace_id",
        isExpanded: false,
        get value() {
          return traceId;
        },
        set value($$value) {
          traceId = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="control">`);
      Basic$1($$renderer3, {
        label: "Event",
        type: "text",
        placeholder: "message.event (e.g. bot_running)",
        isExpanded: false,
        get value() {
          return eventName;
        },
        set value($$value) {
          eventName = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <div class="field is-grouped is-grouped-multiline"><div class="control">`);
      BasicSelect($$renderer3, {
        label: "Window",
        options: [
          { id: "preset", value: "Last hours" },
          { id: "range", value: "Date range" }
        ],
        get option() {
          return timeMode;
        },
        set option($$value) {
          timeMode = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> `);
      if (timeMode === "preset") {
        $$renderer3.push(`<!--[0--><div class="control">`);
        Basic$1($$renderer3, {
          label: "Hours",
          type: "number",
          min: "1",
          step: "1",
          onchange: handleHoursChange,
          get value() {
            return presetHours;
          },
          set value($$value) {
            presetHours = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div> <div class="control is-flex is-align-items-center" style="gap: 0.25rem;"><!--[-->`);
        const each_array = ensure_array_like([1, 6, 12, 24, 48, 72, 168]);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let h = each_array[$$index];
          $$renderer3.push(`<button${attr_class(`button is-small ${presetHours === h ? "is-info" : "is-light"}`)}>${escape_html(h < 24 ? `${h}h` : h === 24 ? "24h" : h === 48 ? "2d" : h === 72 ? "3d" : "7d")}</button>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push(`<!--[-1--><div class="control">`);
        Basic$1($$renderer3, {
          label: "Start",
          type: "datetime-local",
          get value() {
            return startDate;
          },
          set value($$value) {
            startDate = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div> <div class="control">`);
        Basic$1($$renderer3, {
          label: "End",
          type: "datetime-local",
          get value() {
            return endDate;
          },
          set value($$value) {
            endDate = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--></div> <div class="field is-grouped is-grouped-multiline mb-1"><span class="mr-2 is-align-self-center">Status codes:</span> <!--[-->`);
      const each_array_1 = ensure_array_like(Object.keys(STATUS_CODE_RANGES));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let cls = each_array_1[$$index_1];
        $$renderer3.push(`<label class="checkbox mr-2 is-align-self-center"><input type="checkbox"${attr("checked", statusClasses.includes(cls), true)}/> ${escape_html(cls)}</label>`);
      }
      $$renderer3.push(`<!--]--> <div class="control">`);
      Basic$1($$renderer3, {
        label: "Exact codes",
        type: "text",
        placeholder: "404, 5xx, 502,429",
        oninput: handleExactCodesInput,
        isExpanded: false
      });
      $$renderer3.push(`<!----></div> <div class="control"><label class="checkbox is-align-self-center" title="Load the full request/response payload so the attack badge, client IP, headers and message column are available"><input type="checkbox"${attr("checked", fullDetail, true)}/> Full detail</label></div> <div class="control">`);
      Basic$1($$renderer3, {
        label: "Limit",
        type: "number",
        min: "1",
        max: "999999",
        step: "100",
        onchange: handleLimitChange,
        get value() {
          return limit;
        },
        set value($$value) {
          limit = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="control"><button class="button is-small"${attr("disabled", loading, true)}><span class="icon is-small"><i class="fa-solid fa-rotate"></i></span> <span>Refresh</span></button></div></div> <p class="help">Requests ending on 401/429 (or any status selected above) are marked by the API with <code>message.type = "posible_ataque"</code>; the shield badge shows up when the full payload is
		loaded. Click a row for the request/response detail, or the trace icon to follow a trace end to
		end.</p></div>  `);
      Table($$renderer3, {
        columns,
        left_items: [tableStatus],
        right_items: [realtimeToggle],
        showSelectionButton: false,
        showNewButton: false,
        showEditButton: false,
        showDeleteButton: false,
        showExportButton: true,
        fileNameExport: "openfusion_logs",
        onclickrow: onRowClick,
        get RawDataTable() {
          return logs;
        },
        set RawDataTable($$value) {
          logs = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <p class="help has-text-centered mt-2">Newest first, filtered by the criteria above (up to the most recent ${escape_html(limit)} records).</p> `);
      Request_detail($$renderer3, {
        get show() {
          return showDetail;
        },
        set show($$value) {
          showDetail = $$value;
          $$settled = false;
        },
        get row() {
          return selectedRow;
        },
        set row($$value) {
          selectedRow = $$value;
          $$settled = false;
        },
        get appName() {
          return selectedAppName;
        },
        set appName($$value) {
          selectedAppName = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Trace_view($$renderer3, {
        get show() {
          return showTrace;
        },
        set show($$value) {
          showTrace = $$value;
          $$settled = false;
        },
        get trace_id() {
          return traceToInspect;
        },
        set trace_id($$value) {
          traceToInspect = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { idapp });
  });
}
function CellToken($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = "" } = $$props;
    $$renderer2.push(`<td><div class="is-flex is-align-items-center" style="gap: 0.5rem;"><span style="word-break: break-all; max-width: 250px;">`);
    if (value && value.length > 20) {
      $$renderer2.push(`<!--[1-->${escape_html(value.substring(0, 20))}...`);
    } else {
      $$renderer2.push(`<!--[-1-->${escape_html(value)}`);
    }
    $$renderer2.push(`<!--]--></span> `);
    if (value && value.length > 10) {
      $$renderer2.push(`<!--[0--><button class="button is-small is-ghost"${attr("title", "View more")}${attr("aria-label", "View more")}><span class="icon is-small has-text-grey"><i${attr_class(clsx("fa-solid fa-eye"))}></i></span></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (value) {
      $$renderer2.push(`<!--[0--><button class="button is-small is-ghost" title="Copy token" aria-label="Copy token"><span${attr_class(`icon is-small ${"has-text-info"}`)}><i${attr_class(clsx("fa-regular fa-copy"))}></i></span></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></td>`);
  });
}
function Apikeys($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { idapp = void 0, onchange = () => {
    } } = $$props;
    const uF = new uFetch();
    const permEnv = getDefaultEnvironment();
    const currentUser = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore)?.user);
    const canCreate = derived(() => currentUserHasPermission(currentUser(), permEnv, "apiclients", "create"));
    const canEdit = derived(() => currentUserHasPermission(currentUser(), permEnv, "apiclients", "edit"));
    const canDelete = derived(() => currentUserHasPermission(currentUser(), permEnv, "apiclients", "delete"));
    let showEditor = false;
    let selectedRow = {
      idkey: "",
      idclient: "",
      enabled: true,
      startAt: "",
      endAt: "",
      description: "",
      token: "",
      idapp
    };
    const todayISO = () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const nextMonthISO = () => {
      const d = /* @__PURE__ */ new Date();
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().split("T")[0];
    };
    let optionsClients = [{ name: "dsdf", value: "dsdf" }];
    let DataTableAPIs = [];
    let columns = {
      idkey: { hidden: true },
      idclient: { hidden: true },
      idapp: { hidden: true },
      enabled: {
        label: "Enabled",
        decorator: {
          component: Boolean$1,
          props: {
            ontrue: { label: "Enabled" },
            onfalse: { label: "Unabled" },
            editInline: false
          }
        }
      },
      startAt: {
        label: "datestart",
        decorator: { component: DateTime_1 }
      },
      endAt: {
        label: "dateend",
        decorator: { component: DateTime_1 }
      },
      last_run: {
        label: "last_run",
        decorator: { component: DateTime_1 }
      },
      token: { label: "Token", decorator: { component: CellToken } },
      params: {},
      exec_time_limit: {},
      failed_attempts: {},
      status: {},
      last_exec_time: {},
      last_response: {},
      app: { hidden: true },
      resource: { hidden: true },
      environment: { hidden: true },
      app_enabled: { hidden: true }
    };
    async function loadAPIKeys() {
      if (idapp) {
        let jresp = await GetAPIKeys(idapp, store_get($$store_subs ??= {}, "$userStore", userStore).token);
        if (Array.isArray(jresp)) {
          DataTableAPIs = jresp;
        } else {
          DataTableAPIs = [];
        }
        let clients = await GetAPIClients();
        if (Array.isArray(clients)) {
          optionsClients = clients.map((c) => {
            return {
              name: `${c.username} - ${c.first_name} ${c.last_name} - ${c.email} - ${c.document_id}`,
              value: c.idclient
            };
          });
        } else {
          optionsClients = [];
        }
      } else {
        console.log("idapp not found");
      }
    }
    async function deleteTasks(tasks) {
      let idtasks = tasks.map((t) => {
        return t.idtask;
      });
      console.log("deleteTasks >>>>>>>>>>>>>", idtasks, url_paths.deleteIntervalTasksByIdTask);
      let resp = await uF.DELETE({ url: url_paths.deleteIntervalTasksByIdTask, data: idtasks });
      await resp.json();
      await loadAPIKeys();
    }
    function fnDefaulValues() {
      selectedRow = {
        idkey: "",
        idclient: "",
        enabled: true,
        startAt: todayISO(),
        endAt: nextMonthISO(),
        description: "",
        token: "",
        idapp
      };
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        let lt01 = function($$renderer4) {
          $$renderer4.push(`<div class="buttons are-small"></div>`);
        };
        Table($$renderer3, {
          left_items: [lt01],
          showEditRow: true,
          showNewButton: canCreate(),
          showDeleteButton: canDelete(),
          showEditButton: canEdit(),
          oneditrow: (r) => {
            selectedRow.idkey = r.idkey || "";
            selectedRow.enabled = r.enabled;
            selectedRow.startAt = r.startAt || "";
            selectedRow.endAt = r.endAt || "";
            selectedRow.idclient = r.idclient || "";
            selectedRow.token = r.token || "";
            selectedRow.description = r.description || "";
            selectedRow.idapp = idapp;
            showEditor = true;
          },
          onnewrow: () => {
            fnDefaulValues();
            console.log("TABLE > NEW ", selectedRow);
            showEditor = true;
          },
          ondeleterow: async (r) => {
            console.log("TABLE > DELETE ", r);
            if (r.rows.length > 0 && confirm("Are you sure you want to delete this task?")) {
              await deleteTasks(r.rows);
            }
          },
          get RawDataTable() {
            return DataTableAPIs;
          },
          set RawDataTable($$value) {
            DataTableAPIs = $$value;
            $$settled = false;
          },
          get columns() {
            return columns;
          },
          set columns($$value) {
            columns = $$value;
            $$settled = false;
          },
          lt01,
          $$slots: { lt01: true }
        });
      }
      $$renderer3.push(`<!----> `);
      if (idapp && selectedRow) {
        $$renderer3.push("<!--[0-->");
        SlideFullScreen($$renderer3, {
          get show() {
            return showEditor;
          },
          set show($$value) {
            showEditor = $$value;
            $$settled = false;
          },
          children: ($$renderer4) => {
            {
              let r01 = function($$renderer5) {
                $$renderer5.push(`<div class="field has-addons">`);
                if (selectedRow.idkey) {
                  $$renderer5.push(`<!--[0--><p class="control"><button class="button is-small is-warning is-light" title="Re-sign the token with the current application JWT key"><span class="icon is-small"><i class="fa-solid fa-rotate"></i></span> <span>Regenerate JWT</span></button></p>`);
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> <p class="control"><button class="button is-small is-link"><span class="icon is-small"><i class="fa-solid fa-rocket"></i></span> <span>Save &amp; Deploy</span></button></p> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-xmark"></i></span> <span>Cancel</span></button></p></div>`);
              };
              Level($$renderer4, { left: [], right: [r01] });
            }
            $$renderer4.push(`<!----> <div>`);
            Predictive($$renderer4, {
              label: "API Client",
              classLabel: "is-small",
              classInput: "is-small",
              onselect: (e) => {
                console.log(e, selectedRow);
              },
              get options() {
                return optionsClients;
              },
              set options($$value) {
                optionsClients = $$value;
                $$settled = false;
              },
              get selectedValue() {
                return selectedRow.idclient;
              },
              set selectedValue($$value) {
                selectedRow.idclient = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> <div class="columns"><div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "boolean",
              label: "Enabled",
              get value() {
                return selectedRow.enabled;
              },
              set value($$value) {
                selectedRow.enabled = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "date",
              label: "Date Start: ",
              get value() {
                return selectedRow.startAt;
              },
              set value($$value) {
                selectedRow.startAt = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "date",
              label: "Date End: ",
              get value() {
                return selectedRow.endAt;
              },
              set value($$value) {
                selectedRow.endAt = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-full">`);
            TextArea$1($$renderer4, {
              label: "Description",
              get value() {
                return selectedRow.description;
              },
              set value($$value) {
                selectedRow.description = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div></div>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { idapp });
  });
}
function Users($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let notify = new Notifications$1();
    const permEnv = getDefaultEnvironment();
    const currentUser = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore)?.user);
    const canCreate = derived(() => currentUserHasPermission(currentUser(), permEnv, "apiclients", "create"));
    const canEdit = derived(() => currentUserHasPermission(currentUser(), permEnv, "apiclients", "edit"));
    let showEditor = false;
    let showChangePassword = false;
    let isEditing = false;
    let DataTableUsers = [];
    let selectedRow = getDefaultValues();
    let passwordData = { newPassword: "", repeatNewPassword: "" };
    const optionsDocumentType = [
      { id: "passport", value: "Passport" },
      { id: "id_card", value: "ID Card" },
      { id: "driver_license", value: "Driver License" },
      { id: "social_security", value: "Social Security" },
      { id: "tax_id", value: "Tax ID" },
      { id: "other", value: "Other" },
      { id: "unknown", value: "Unknown" }
    ];
    const optionsStatus = [
      { id: "initial", value: "Initial" },
      { id: "active", value: "Active" },
      { id: "suspended", value: "Suspended" },
      { id: "inactive", value: "Inactive" }
    ];
    let columns = {
      idclient: { hidden: true },
      username: { label: "Username" },
      name: { label: "Name" },
      email: { label: "Email" },
      status: { label: "Status" },
      enabled: {
        label: "Enabled",
        decorator: {
          component: Boolean$1,
          props: {
            custom: {
              ontrue: { label: "Enabled" },
              onfalse: { label: "Disabled" },
              editInline: false
            }
          }
        }
      },
      document_type: { hidden: true },
      document_id: { hidden: true },
      phone: { hidden: true },
      startAt: { hidden: true },
      endAt: { hidden: true },
      last_login: { hidden: true },
      exp_time: { hidden: true },
      custom_data: { hidden: true },
      change_password: { hidden: true },
      createdAt: {
        label: "Created",
        decorator: { component: DateTime_1 }
      },
      updatedAt: {
        label: "Updated",
        decorator: { component: DateTime_1 }
      }
    };
    function getDefaultValues() {
      return {
        idclient: "",
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        document_type: "unknown",
        document_id: "",
        phone: "",
        password: "",
        repeatPassword: "",
        startAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        endAt: "",
        enabled: true,
        exp_time: 3600,
        status: "initial"
      };
    }
    let passwordMatch = derived(() => passwordData.newPassword === passwordData.repeatNewPassword);
    async function changePassword() {
      if (!passwordData.newPassword || !passwordData.repeatNewPassword) {
        notify.push({
          message: "Please fill in both password fields",
          color: "warning"
        });
        return;
      }
      if (passwordData.newPassword !== passwordData.repeatNewPassword) {
        notify.push({ message: "Passwords do not match", color: "warning" });
        return;
      }
      try {
        let result = await ChangeAPIClientPassword({
          username: selectedRow.username,
          newPassword: passwordData.newPassword
        });
        if (result && result.success) {
          notify.push({ message: "Password changed successfully", color: "success" });
          showChangePassword = false;
          passwordData = { newPassword: "", repeatNewPassword: "" };
        } else {
          let msg = result?.error || result?.message || "Failed to change password";
          notify.push({ message: msg, color: "danger" });
        }
      } catch (error) {
        console.error("changePassword error:", error);
        notify.push({
          message: error.message || "Failed to change password",
          color: "danger"
        });
      }
    }
    function openEditor(row = null) {
      if (row) {
        isEditing = true;
        selectedRow = {
          idclient: row.idclient || "",
          username: row.username || "",
          first_name: row.first_name || "",
          last_name: row.last_name || "",
          email: row.email || "",
          document_type: row.document_type || "unknown",
          document_id: row.document_id || "",
          phone: row.phone || "",
          password: "",
          repeatPassword: "",
          startAt: row.startAt ? new Date(row.startAt).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          endAt: row.endAt ? new Date(row.endAt).toISOString().split("T")[0] : "",
          enabled: row.enabled !== false,
          exp_time: row.exp_time || 3600,
          status: row.status || "initial"
        };
      } else {
        isEditing = false;
        selectedRow = getDefaultValues();
      }
      showEditor = true;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Table($$renderer3, {
        showEditRow: true,
        showNewButton: canCreate(),
        showDeleteButton: false,
        showEditButton: canEdit(),
        oneditrow: (r) => {
          openEditor(r);
        },
        onnewrow: () => {
          openEditor(null);
        },
        get RawDataTable() {
          return DataTableUsers;
        },
        set RawDataTable($$value) {
          DataTableUsers = $$value;
          $$settled = false;
        },
        get columns() {
          return columns;
        },
        set columns($$value) {
          columns = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (showEditor) {
        $$renderer3.push("<!--[0-->");
        SlideFullScreen($$renderer3, {
          get show() {
            return showEditor;
          },
          set show($$value) {
            showEditor = $$value;
            $$settled = false;
          },
          children: ($$renderer4) => {
            {
              let r01 = function($$renderer5) {
                $$renderer5.push(`<div class="field has-addons"><p class="control"><button class="button is-small is-link"><span class="icon is-small"><i class="fa-solid fa-rocket"></i></span> <span>Save &amp; Deploy</span></button></p> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-xmark"></i></span> <span>Cancel</span></button></p></div>`);
              };
              Level($$renderer4, { left: [], right: [r01] });
            }
            $$renderer4.push(`<!----> <div><div class="columns"><div class="column is-one-third">`);
            Basic$1($$renderer4, {
              label: "Username:",
              disabled: isEditing,
              get value() {
                return selectedRow.username;
              },
              set value($$value) {
                selectedRow.username = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "boolean",
              label: "Enabled",
              get value() {
                return selectedRow.enabled;
              },
              set value($$value) {
                selectedRow.enabled = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            BasicSelect($$renderer4, {
              label: "Status",
              options: optionsStatus,
              get option() {
                return selectedRow.status;
              },
              set option($$value) {
                selectedRow.status = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-one-half">`);
            Basic$1($$renderer4, {
              label: "First Name:",
              get value() {
                return selectedRow.first_name;
              },
              set value($$value) {
                selectedRow.first_name = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-half">`);
            Basic$1($$renderer4, {
              label: "Last Name:",
              get value() {
                return selectedRow.last_name;
              },
              set value($$value) {
                selectedRow.last_name = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-full">`);
            Basic$1($$renderer4, {
              label: "Email:",
              type: "email",
              get value() {
                return selectedRow.email;
              },
              set value($$value) {
                selectedRow.email = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-one-third">`);
            BasicSelect($$renderer4, {
              label: "Document Type",
              options: optionsDocumentType,
              get option() {
                return selectedRow.document_type;
              },
              set option($$value) {
                selectedRow.document_type = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              label: "Document ID:",
              get value() {
                return selectedRow.document_id;
              },
              set value($$value) {
                selectedRow.document_id = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              label: "Phone:",
              get value() {
                return selectedRow.phone;
              },
              set value($$value) {
                selectedRow.phone = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "date",
              label: "Start Date:",
              get value() {
                return selectedRow.startAt;
              },
              set value($$value) {
                selectedRow.startAt = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "date",
              label: "End Date:",
              get value() {
                return selectedRow.endAt;
              },
              set value($$value) {
                selectedRow.endAt = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "number",
              label: "Exp Time (seconds):",
              get value() {
                return selectedRow.exp_time;
              },
              set value($$value) {
                selectedRow.exp_time = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> `);
            if (!isEditing) {
              $$renderer4.push(`<!--[0--><div class="columns"><div class="column is-one-half">`);
              Basic$1($$renderer4, {
                type: "password",
                label: "Password:",
                get value() {
                  return selectedRow.password;
                },
                set value($$value) {
                  selectedRow.password = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----></div> <div class="column is-one-half">`);
              Basic$1($$renderer4, {
                type: "password",
                label: "Repeat Password:",
                get value() {
                  return selectedRow.repeatPassword;
                },
                set value($$value) {
                  selectedRow.repeatPassword = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----></div></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (!isEditing && selectedRow.password && selectedRow.repeatPassword && selectedRow.password !== selectedRow.repeatPassword) {
              $$renderer4.push(`<!--[0--><div class="notification is-warning is-light py-2 px-3 mb-3"><span class="icon-text"><span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>Passwords do not match.</span></span></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (isEditing) {
              $$renderer4.push(`<!--[0--><div class="buttons are-small mt-4"><button class="button is-warning is-outlined"><span class="icon is-small"><i class="fa-solid fa-key"></i></span> <span>Change Password</span></button></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--></div>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        let titleModal = function($$renderer4) {
          $$renderer4.push(`<span>Change Password: ${escape_html(selectedRow.username)}</span>`);
        }, bodyDialogModal = function($$renderer4) {
          Basic$1($$renderer4, {
            type: "password",
            label: "New Password",
            get value() {
              return passwordData.newPassword;
            },
            set value($$value) {
              passwordData.newPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            type: "password",
            label: "Repeat New Password",
            get value() {
              return passwordData.repeatNewPassword;
            },
            set value($$value) {
              passwordData.repeatNewPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          if (!passwordMatch() && passwordData.newPassword && passwordData.repeatNewPassword) {
            $$renderer4.push(`<!--[0--><div class="notification is-warning is-light py-2 px-3"><span class="icon-text"><span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>You must repeat the new password twice.</span></span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Modal_1($$renderer3, {
          title: titleModal,
          body: bodyDialogModal,
          onaccept: async () => {
            await changePassword();
          },
          oncancel: () => {
            showChangePassword = false;
            passwordData = { newPassword: "", repeatNewPassword: "" };
          },
          get show() {
            return showChangePassword;
          },
          set show($$value) {
            showChangePassword = $$value;
            $$settled = false;
          },
          titleModal,
          bodyDialogModal,
          $$slots: { titleModal: true, bodyDialogModal: true }
        });
      }
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function PermissionEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { ctrl = {} } = $$props;
    const environments = ["dev", "qa", "prd"];
    const resources = [
      {
        key: "users",
        label: "Users",
        actions: ["read", "create", "edit", "delete"]
      },
      {
        key: "apiclients",
        label: "API Clients",
        actions: ["read", "create", "edit", "delete"]
      },
      {
        key: "endpoints",
        label: "Endpoints",
        actions: ["read", "create", "edit", "delete"]
      },
      {
        key: "apps",
        label: "Applications",
        actions: ["read", "create", "edit", "delete"]
      },
      {
        key: "appvars",
        label: "App Variables",
        actions: ["read", "create", "edit", "delete"]
      },
      {
        key: "bots",
        label: "Bots",
        actions: ["read", "create", "edit", "delete"]
      },
      {
        key: "interval_tasks",
        label: "Interval Tasks",
        actions: ["read", "create", "edit", "delete"]
      },
      { key: "logs", label: "Logs", actions: ["read"] },
      {
        key: "settings",
        label: "Settings",
        actions: ["read", "edit"]
      }
    ];
    let activeTab = "prd";
    function getPermission(environment, resource, action) {
      return ctrl?.env?.[environment]?.[resource]?.[action] === true;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="permission-editor svelte-rkf1is"><div class="field mb-4"><label class="checkbox"><input type="checkbox"${attr("checked", ctrl.as_admin === true, true)}/> <strong>Super Admin</strong> <span class="tag is-info is-light ml-2">Bypass all permissions</span></label></div> `);
      if (ctrl.as_admin !== true) {
        $$renderer3.push("<!--[0-->");
        Tab($$renderer3, {
          tabs: environments.map((e) => ({ id: e, label: e.toUpperCase() })),
          get selected() {
            return activeTab;
          },
          set selected($$value) {
            activeTab = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> <div class="permission-grid mt-3"><table class="table is-fullwidth is-bordered is-narrow svelte-rkf1is"><thead><tr><th class="svelte-rkf1is">Resource</th><th class="has-text-centered svelte-rkf1is">Read</th><th class="has-text-centered svelte-rkf1is">Create</th><th class="has-text-centered svelte-rkf1is">Edit</th><th class="has-text-centered svelte-rkf1is">Delete</th></tr></thead><tbody><!--[-->`);
        const each_array = ensure_array_like(resources);
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let res = each_array[$$index_1];
          $$renderer3.push(`<tr><td><strong>${escape_html(res.label)}</strong></td><!--[-->`);
          const each_array_1 = ensure_array_like(["read", "create", "edit", "delete"]);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let act = each_array_1[$$index];
            $$renderer3.push(`<td class="has-text-centered">`);
            if (res.actions.includes(act)) {
              $$renderer3.push(`<!--[0--><input type="checkbox"${attr("checked", getPermission(activeTab, res.key, act), true)}/>`);
            } else {
              $$renderer3.push(`<!--[-1--><span class="has-text-grey-light">—</span>`);
            }
            $$renderer3.push(`<!--]--></td>`);
          }
          $$renderer3.push(`<!--]--></tr>`);
        }
        $$renderer3.push(`<!--]--></tbody></table></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { ctrl });
  });
}
function System_users($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let notify = new Notifications$1();
    let showEditor = false;
    let showChangePassword = false;
    let showResetPassword = false;
    let isEditing = false;
    let DataTableUsers = [];
    let selectedRow = getDefaultValues();
    let passwordData = { oldPassword: "", newPassword: "", repeatNewPassword: "" };
    let resetPwdData = { newPassword: "", repeat: "" };
    const environment = getDefaultEnvironment();
    const currentUser = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore)?.user);
    const canCreate = derived(() => currentUserHasPermission(currentUser(), environment, "users", "create"));
    const canEdit = derived(() => currentUserHasPermission(currentUser(), environment, "users", "edit"));
    const canDelete = derived(() => currentUserHasPermission(currentUser(), environment, "users", "delete"));
    let columns = {
      iduser: { hidden: true },
      username: { label: "Username" },
      fullname: { label: "Name" },
      email: { label: "Email" },
      enabled: {
        label: "Enabled",
        decorator: {
          component: Boolean$1,
          props: {
            custom: {
              ontrue: { label: "Enabled" },
              onfalse: { label: "Disabled" },
              editInline: false
            }
          }
        }
      },
      ctrl: { hidden: true },
      start_date: { hidden: true },
      end_date: { hidden: true },
      exp_time: { hidden: true },
      last_login: {
        label: "Last Login",
        decorator: { component: DateTime_1 }
      },
      createdAt: {
        label: "Created",
        decorator: { component: DateTime_1 }
      }
    };
    function getDefaultValues() {
      return {
        iduser: 0,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        repeatPassword: "",
        enabled: true,
        start_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        end_date: "",
        exp_time: 3600,
        ctrl: { as_admin: false, env: {} }
      };
    }
    let passwordMatch = derived(() => passwordData.newPassword === passwordData.repeatNewPassword);
    async function changePassword() {
      if (!passwordData.newPassword || !passwordData.repeatNewPassword) {
        notify.push({
          message: "Please fill in both password fields",
          color: "warning"
        });
        return;
      }
      if (passwordData.newPassword !== passwordData.repeatNewPassword) {
        notify.push({ message: "Passwords do not match", color: "warning" });
        return;
      }
      try {
        let result = await ChangeSystemUserPassword({
          username: selectedRow.username,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        });
        if (result && result.success) {
          notify.push({ message: "Password changed successfully", color: "success" });
          showChangePassword = false;
          passwordData = { oldPassword: "", newPassword: "", repeatNewPassword: "" };
        } else {
          let msg = result?.error || result?.message || "Failed to change password";
          notify.push({ message: msg, color: "danger" });
        }
      } catch (error) {
        console.error("changePassword error:", error);
        notify.push({
          message: error.message || "Failed to change password",
          color: "danger"
        });
      }
    }
    async function resetPassword() {
      if (!resetPwdData.newPassword || !resetPwdData.repeat) {
        notify.push({
          message: "Please fill in both password fields",
          color: "warning"
        });
        return;
      }
      if (resetPwdData.newPassword !== resetPwdData.repeat) {
        notify.push({ message: "Passwords do not match", color: "warning" });
        return;
      }
      try {
        let result = await ResetSystemUserPassword({
          iduser: selectedRow.iduser,
          newPassword: resetPwdData.newPassword
        });
        if (result && result.success) {
          notify.push({
            message: "Temporary password set. The user must change it on next login.",
            color: "success"
          });
          showResetPassword = false;
          resetPwdData = { newPassword: "", repeat: "" };
        } else {
          let msg = result?.error || result?.message || "Failed to reset password";
          notify.push({ message: msg, color: "danger" });
        }
      } catch (error) {
        console.error("resetPassword error:", error);
        notify.push({
          message: error.message || "Failed to reset password",
          color: "danger"
        });
      }
    }
    function openEditor(row = null) {
      if (row) {
        isEditing = true;
        selectedRow = {
          iduser: row.iduser || 0,
          username: row.username || "",
          first_name: row.first_name || "",
          last_name: row.last_name || "",
          email: row.email || "",
          password: "",
          repeatPassword: "",
          enabled: row.enabled !== false,
          start_date: row.start_date ? new Date(row.start_date).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          end_date: row.end_date ? new Date(row.end_date).toISOString().split("T")[0] : "",
          exp_time: row.exp_time || 3600,
          ctrl: row.ctrl ? JSON.parse(JSON.stringify(row.ctrl)) : { as_admin: false, env: {} }
        };
      } else {
        isEditing = false;
        selectedRow = getDefaultValues();
      }
      showEditor = true;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Table($$renderer3, {
        showEditRow: true,
        showNewButton: canCreate(),
        showDeleteButton: false,
        showEditButton: canEdit(),
        oneditrow: (r) => {
          openEditor(r);
        },
        onnewrow: () => {
          openEditor(null);
        },
        get RawDataTable() {
          return DataTableUsers;
        },
        set RawDataTable($$value) {
          DataTableUsers = $$value;
          $$settled = false;
        },
        get columns() {
          return columns;
        },
        set columns($$value) {
          columns = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (showEditor) {
        $$renderer3.push("<!--[0-->");
        SlideFullScreen($$renderer3, {
          get show() {
            return showEditor;
          },
          set show($$value) {
            showEditor = $$value;
            $$settled = false;
          },
          children: ($$renderer4) => {
            {
              let r01 = function($$renderer5) {
                $$renderer5.push(`<div class="field has-addons">`);
                if (canCreate() || canEdit()) {
                  $$renderer5.push(`<!--[0--><p class="control"><button class="button is-small is-link"><span class="icon is-small"><i class="fa-solid fa-rocket"></i></span> <span>Save &amp; Deploy</span></button></p>`);
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> `);
                if (isEditing && canDelete()) {
                  $$renderer5.push(`<!--[0--><p class="control"><button class="button is-small is-danger is-outlined"><span class="icon is-small"><i class="fa-solid fa-trash"></i></span> <span>Delete</span></button></p>`);
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> <p class="control"><button class="button is-small"><span class="icon is-small"><i class="fa-solid fa-xmark"></i></span> <span>Cancel</span></button></p></div>`);
              };
              Level($$renderer4, { left: [], right: [r01] });
            }
            $$renderer4.push(`<!----> <div><div class="columns"><div class="column is-one-third">`);
            Basic$1($$renderer4, {
              label: "Username:",
              disabled: isEditing,
              get value() {
                return selectedRow.username;
              },
              set value($$value) {
                selectedRow.username = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "boolean",
              label: "Enabled",
              get value() {
                return selectedRow.enabled;
              },
              set value($$value) {
                selectedRow.enabled = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-third">`);
            Basic$1($$renderer4, {
              type: "number",
              label: "Exp Time (seconds):",
              get value() {
                return selectedRow.exp_time;
              },
              set value($$value) {
                selectedRow.exp_time = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-one-half">`);
            Basic$1($$renderer4, {
              label: "First Name:",
              get value() {
                return selectedRow.first_name;
              },
              set value($$value) {
                selectedRow.first_name = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-half">`);
            Basic$1($$renderer4, {
              label: "Last Name:",
              get value() {
                return selectedRow.last_name;
              },
              set value($$value) {
                selectedRow.last_name = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-full">`);
            Basic$1($$renderer4, {
              label: "Email:",
              type: "email",
              get value() {
                return selectedRow.email;
              },
              set value($$value) {
                selectedRow.email = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-one-half">`);
            Basic$1($$renderer4, {
              type: "date",
              label: "Start Date:",
              get value() {
                return selectedRow.start_date;
              },
              set value($$value) {
                selectedRow.start_date = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-half">`);
            Basic$1($$renderer4, {
              type: "date",
              label: "End Date:",
              get value() {
                return selectedRow.end_date;
              },
              set value($$value) {
                selectedRow.end_date = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="columns"><div class="column is-one-half">`);
            Basic$1($$renderer4, {
              type: "password",
              label: isEditing ? "New Password (optional):" : "Password:",
              get value() {
                return selectedRow.password;
              },
              set value($$value) {
                selectedRow.password = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="column is-one-half">`);
            Basic$1($$renderer4, {
              type: "password",
              label: isEditing ? "Repeat Password (optional):" : "Repeat Password:",
              get value() {
                return selectedRow.repeatPassword;
              },
              set value($$value) {
                selectedRow.repeatPassword = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> `);
            if (selectedRow.password && selectedRow.repeatPassword && selectedRow.password !== selectedRow.repeatPassword) {
              $$renderer4.push(`<!--[0--><div class="notification is-warning is-light py-2 px-3 mb-3"><span class="icon-text"><span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>Passwords do not match.</span></span></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (isEditing) {
              $$renderer4.push(`<!--[0--><p class="help">Leave empty to keep the current password. If filled, it becomes the definitive password (no forced change on next login).</p>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (isEditing) {
              $$renderer4.push(`<!--[0--><div class="buttons are-small mt-4">`);
              if (canEdit()) {
                $$renderer4.push(`<!--[0--><button class="button is-warning"><span class="icon is-small"><i class="fa-solid fa-rotate"></i></span> <span>Reset Password (temporary)</span></button>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--> <button class="button is-warning is-outlined"><span class="icon is-small"><i class="fa-solid fa-key"></i></span> <span>Change Password</span></button></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> <hr/> <h6 class="title is-6">Permissions</h6> `);
            PermissionEditor($$renderer4, {
              get ctrl() {
                return selectedRow.ctrl;
              },
              set ctrl($$value) {
                selectedRow.ctrl = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        let titleModal = function($$renderer4) {
          $$renderer4.push(`<span>Change Password: ${escape_html(selectedRow.username)}</span>`);
        }, bodyDialogModal = function($$renderer4) {
          Basic$1($$renderer4, {
            type: "password",
            label: "Current Password",
            get value() {
              return passwordData.oldPassword;
            },
            set value($$value) {
              passwordData.oldPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            type: "password",
            label: "New Password",
            get value() {
              return passwordData.newPassword;
            },
            set value($$value) {
              passwordData.newPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            type: "password",
            label: "Repeat New Password",
            get value() {
              return passwordData.repeatNewPassword;
            },
            set value($$value) {
              passwordData.repeatNewPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          if (!passwordMatch() && passwordData.newPassword && passwordData.repeatNewPassword) {
            $$renderer4.push(`<!--[0--><div class="notification is-warning is-light py-2 px-3"><span class="icon-text"><span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>You must repeat the new password twice.</span></span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Modal_1($$renderer3, {
          title: titleModal,
          body: bodyDialogModal,
          onaccept: async () => {
            await changePassword();
          },
          oncancel: () => {
            showChangePassword = false;
            passwordData = { oldPassword: "", newPassword: "", repeatNewPassword: "" };
          },
          get show() {
            return showChangePassword;
          },
          set show($$value) {
            showChangePassword = $$value;
            $$settled = false;
          },
          titleModal,
          bodyDialogModal,
          $$slots: { titleModal: true, bodyDialogModal: true }
        });
      }
      $$renderer3.push(`<!----> `);
      {
        let resetTitleModal = function($$renderer4) {
          $$renderer4.push(`<span>Reset Password (temporary): ${escape_html(selectedRow.username)}</span>`);
        }, resetBodyDialogModal = function($$renderer4) {
          $$renderer4.push(`<div class="notification is-warning is-light py-2 px-3"><span class="icon-text"><span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>The user will need to change this password on their next login.</span></span></div> `);
          Basic$1($$renderer4, {
            type: "password",
            label: "Temporary Password",
            get value() {
              return resetPwdData.newPassword;
            },
            set value($$value) {
              resetPwdData.newPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            type: "password",
            label: "Repeat Temporary Password",
            get value() {
              return resetPwdData.repeat;
            },
            set value($$value) {
              resetPwdData.repeat = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          if (resetPwdData.newPassword && resetPwdData.newPassword !== resetPwdData.repeat) {
            $$renderer4.push(`<!--[0--><div class="notification is-warning is-light py-2 px-3"><span class="icon-text"><span class="icon"><i class="fa-solid fa-triangle-exclamation"></i></span> <span>Passwords do not match.</span></span></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        Modal_1($$renderer3, {
          title: resetTitleModal,
          body: resetBodyDialogModal,
          onaccept: async () => {
            await resetPassword();
          },
          oncancel: () => {
            showResetPassword = false;
            resetPwdData = { newPassword: "", repeat: "" };
          },
          get show() {
            return showResetPassword;
          },
          set show($$value) {
            showResetPassword = $$value;
            $$settled = false;
          },
          resetTitleModal,
          resetBodyDialogModal,
          $$slots: { resetTitleModal: true, resetBodyDialogModal: true }
        });
      }
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function logoIcon($$renderer) {
  $$renderer.push(`<img${attr("src", Logo)} alt="Open Fusion API" style="width: 32px; height: 32px; object-fit: contain; display: block; margin: auto;"/>`);
}
function Application($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let notify = new Notifications$1();
    let idapp = 0;
    let loading = false;
    let options = [];
    let menu_item_selected = "";
    let show_dialog_change_pwd = false;
    let loading_full_backup = false;
    let loading_full_restore = false;
    const wsClient = new OpenFusionWebsocketClient(url_paths.wsServerEvents);
    const defaultPasswordChange = {
      username: "",
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: ""
    };
    let password_change = defaultPasswordChange;
    let changepwd_compare_verify = derived(() => {
      return password_change.newPassword == password_change.repeatNewPassword;
    });
    const permEnv = getDefaultEnvironment();
    const currentUser = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore)?.user);
    let menu = derived(() => {
      const sections = [];
      if (currentUserHasPermission(currentUser(), permEnv, "apps", "read")) {
        const appItems = [
          {
            label: "New",
            icon: " fa-solid fa-plus ",
            onclick: () => {
              idapp = 0;
              menu_item_selected = "/basic";
            }
          },
          {
            label: "Dashboard",
            icon: " fa-solid fa-chart-area ",
            onclick: () => {
              menu_item_selected = "/dashboard";
            }
          },
          {
            label: "Basic",
            icon: " fa-solid fa-file ",
            onclick: () => {
              menu_item_selected = "/basic";
            }
          }
        ];
        if (currentUserHasPermission(currentUser(), permEnv, "endpoints", "read")) {
          appItems.push({
            label: "Endpoints",
            icon: " fa-solid fa-network-wired ",
            onclick: () => {
              menu_item_selected = "/endpoints";
            }
          });
        }
        if (currentUserHasPermission(currentUser(), permEnv, "appvars", "read")) {
          appItems.push({
            label: "Variables",
            icon: " fa-solid fa-square-root-variable ",
            onclick: () => {
              menu_item_selected = "/appvars";
            }
          });
        }
        if (currentUserHasPermission(currentUser(), permEnv, "apiclients", "read")) {
          appItems.push({
            label: "API Keys",
            icon: " fa-solid fa-key ",
            onclick: () => {
              menu_item_selected = "/apikeys";
            }
          });
        }
        if (currentUserHasPermission(currentUser(), permEnv, "bots", "read")) {
          appItems.push({
            label: "Bots",
            icon: " fa-solid fa-robot ",
            onclick: () => {
              menu_item_selected = "/bots";
            }
          });
        }
        if (currentUserHasPermission(currentUser(), permEnv, "interval_tasks", "read")) {
          appItems.push({
            label: "Tasks",
            icon: " fa-solid fa-list-check ",
            onclick: () => {
              menu_item_selected = "/interval_tasks";
            }
          });
        }
        appItems.push({
          label: "Logs",
          icon: " fa-solid fa-scroll ",
          onclick: () => {
            menu_item_selected = "/logs";
          }
        });
        sections.push({ title: "Application", items: appItems });
      }
      const adminItems = [];
      if (currentUserHasPermission(currentUser(), permEnv, "users", "read")) {
        adminItems.push({
          label: "System Users",
          icon: " fa-solid fa-user-gear ",
          onclick: () => {
            menu_item_selected = "/system-users";
          }
        });
      }
      if (currentUserHasPermission(currentUser(), permEnv, "apiclients", "read")) {
        adminItems.push({
          label: "API Clients",
          icon: " fa-solid fa-users ",
          onclick: () => {
            menu_item_selected = "/users";
          }
        });
      }
      if (adminItems.length > 0) {
        sections.push({ title: "Administration", items: adminItems });
      }
      return sections;
    });
    async function getListAppsInternal() {
      try {
        loading = true;
        let apps = await getListApps(store_get($$store_subs ??= {}, "$userStore", userStore).token);
        if (apps && Array.isArray(apps) && apps.length > 0) {
          options = apps.map((item) => {
            return { name: item.app, value: item.idapp };
          });
        } else {
          options = [];
        }
        let status_sys_endp = await restoreSystemEndpoints(false, store_get($$store_subs ??= {}, "$userStore", userStore).token);
        statusSystemEndpointsStore.set(status_sys_endp);
      } catch (error) {
        console.error(error);
        notify.push({ message: error.message, color: "danger" });
      } finally {
        loading = false;
      }
    }
    onDestroy(() => {
      wsClient.close();
    });
    function user($$renderer3) {
      $$renderer3.push(`<input hidden="" type="file" accept=".json"/> <button class="button is-small is-info is-outlined" title="Download a full backup of all applications"${attr("disabled", loading_full_backup, true)}><span class="icon is-small"><i${attr_class(`fa-solid ${"fa-download"}`)}></i></span> <span>Backup All</span></button> <button class="button is-small is-warning is-outlined" title="Restore all applications from a full backup file"${attr("disabled", loading_full_restore, true)}><span class="icon is-small"><i${attr_class(`fa-solid ${"fa-upload"}`)}></i></span> <span>Restore All</span></button> <div class="dropdown is-hoverable"><div class="dropdown-trigger"><button${attr("title", store_get($$store_subs ??= {}, "$statusSystemEndpointsStore", statusSystemEndpointsStore).message)}${attr_class(`button is-small ${store_get($$store_subs ??= {}, "$statusSystemEndpointsStore", statusSystemEndpointsStore).valid ? "" : "is-danger"} `)} aria-haspopup="true" aria-controls="dropdown-menu3"><span class="icon is-small">`);
      if (store_get($$store_subs ??= {}, "$statusSystemEndpointsStore", statusSystemEndpointsStore).valid) {
        $$renderer3.push(`<!--[0--><i class="fa-solid fa-check"></i>`);
      } else {
        $$renderer3.push(`<!--[-1--><i class="fa-solid fa-triangle-exclamation fa-fade"></i>`);
      }
      $$renderer3.push(`<!--]--></span> <span>System Endpoints ${escape_html(store_get($$store_subs ??= {}, "$statusSystemEndpointsStore", statusSystemEndpointsStore).valid ? "Ready" : "Error")}</span> <span class="icon is-small"><i class="fa-solid fa-angle-down" aria-hidden="true"></i></span></button></div> <div class="dropdown-menu" role="menu"><div class="dropdown-content"><a href="#" class="dropdown-item"><div class="icon-text"><span class="icon"><i class="fa-solid fa-rotate-left"></i></span> <span>Restore</span></div></a></div></div></div> <div class="dropdown is-hoverable"><div class="dropdown-trigger"><button class="button is-small is-success is-outlined" aria-haspopup="true" aria-controls="dropdown-menu3"><span class="icon is-small"><i class="fa-solid fa-user"></i></span> <span>${escape_html(store_get($$store_subs ??= {}, "$userStore", userStore)?.user?.username)}</span> <span class="icon is-small"><i class="fa-solid fa-angle-down" aria-hidden="true"></i></span></button></div> <div class="dropdown-menu" role="menu"><div class="dropdown-content"><a href="#" class="dropdown-item"><div class="icon-text"><span class="icon"><i class="fa-solid fa-key"></i></span> <span>Password</span></div></a> <hr class="dropdown-divider"/>  <div class="dropdown-item"><div class="icon-text"><span class="icon has-text-danger"><i class="fa-solid fa-arrow-right-from-bracket"></i></span> <span>Logout</span></div></div></div></div></div>`);
    }
    function select_app($$renderer3) {
      $$renderer3.push(`<div class="is-flex is-align-items-center" style="gap: 0.5rem;">`);
      Predictive($$renderer3, {
        label: "Application",
        classLabel: "is-small",
        classInput: "is-small",
        onselect: async (e) => {
          if (store_get($$store_subs ??= {}, "$userStore", userStore)) {
            storeCacheSize.set({});
            storeEndpointOnComplete.set({});
            storeCountResponseStatusCode.set({});
            storeEndpointOnStart.set({});
            idapp = e.value;
          } else {
            notify.push({ message: "You do not have authorization", color: "warning" });
          }
        },
        get options() {
          return options;
        },
        set options($$value) {
          options = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (loading) {
        $$renderer3.push(`<!--[0--><span class="icon is-small has-text-grey"><i class="fa-solid fa-spinner fa-spin"></i></span>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      App($$renderer3, {
        logoIcon,
        logoText: "OpenFusionAPI",
        menu: menu(),
        topLeftNavBar: [select_app],
        topRightNavBar: [user],
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->`);
          {
            if (menu_item_selected == "/basic") {
              $$renderer4.push("<!--[0-->");
              Basic($$renderer4, {
                idapp,
                onsavedeploy: async () => {
                  await getListAppsInternal();
                }
              });
            } else if (menu_item_selected == "/appvars") {
              $$renderer4.push("<!--[1-->");
              Application_variables($$renderer4, { idapp });
            } else if (menu_item_selected == "/endpoints") {
              $$renderer4.push("<!--[2-->");
              Endpoints($$renderer4, { idapp });
            } else if (menu_item_selected == "/interval_tasks") {
              $$renderer4.push("<!--[3-->");
              Interval_tasks($$renderer4, { idapp });
            } else if (menu_item_selected == "/apikeys") {
              $$renderer4.push("<!--[4-->");
              Apikeys($$renderer4, {
                get idapp() {
                  return idapp;
                },
                set idapp($$value) {
                  idapp = $$value;
                  $$settled = false;
                }
              });
            } else if (menu_item_selected == "/bots") {
              $$renderer4.push("<!--[5-->");
              Bots($$renderer4, {
                get idapp() {
                  return idapp;
                },
                set idapp($$value) {
                  idapp = $$value;
                  $$settled = false;
                }
              });
            } else if (menu_item_selected == "/system-users") {
              $$renderer4.push("<!--[6-->");
              System_users($$renderer4);
            } else if (menu_item_selected == "/users") {
              $$renderer4.push("<!--[7-->");
              Users($$renderer4);
            } else if (menu_item_selected == "/logs") {
              $$renderer4.push("<!--[8-->");
              Logs($$renderer4, { idapp });
            } else {
              $$renderer4.push("<!--[-1-->");
              Dashboard($$renderer4, { idapp });
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!---->`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      {
        let titleModal = function($$renderer4) {
          $$renderer4.push(`<span>${escape_html(`Change Password: ${password_change.username}`)}</span>`);
        }, bodyDialogModal = function($$renderer4) {
          Basic$1($$renderer4, {
            label: "Current password",
            type: "password",
            get value() {
              return password_change.oldPassword;
            },
            set value($$value) {
              password_change.oldPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            label: "New Password",
            type: "password",
            get value() {
              return password_change.newPassword;
            },
            set value($$value) {
              password_change.newPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Basic$1($$renderer4, {
            label: "Repeat new Password",
            type: "password",
            get value() {
              return password_change.repeatNewPassword;
            },
            set value($$value) {
              password_change.repeatNewPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> <div>`);
          if (!changepwd_compare_verify()) {
            $$renderer4.push(`<!--[0--><span class="icon-text has-text-warning is-small"><span class="icon"><i class="fas fa-exclamation-triangle"></i></span> <span>You must repeat the new password twice.</span></span>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--></div>`);
        };
        Modal_1($$renderer3, {
          title: titleModal,
          body: bodyDialogModal,
          onaccept: async () => {
            if (password_change.newPassword == password_change.repeatNewPassword) {
              let result = await changeUserPassword(password_change, store_get($$store_subs ??= {}, "$userStore", userStore).token);
              if (result.success) {
                password_change = { ...defaultPasswordChange };
                show_dialog_change_pwd = false;
                notify.push({ message: "Successful update", color: "success" });
              } else {
                notify.push({ message: result.error, color: "danger" });
              }
            } else {
              notify.push({
                message: "You must repeat the new password twice.",
                color: "danger"
              });
            }
          },
          oncancel: () => {
            password_change = { ...defaultPasswordChange };
          },
          get show() {
            return show_dialog_change_pwd;
          },
          set show($$value) {
            show_dialog_change_pwd = $$value;
            $$settled = false;
          },
          titleModal,
          bodyDialogModal,
          $$slots: { titleModal: true, bodyDialogModal: true }
        });
      }
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function OpenFusionAPI($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let page = "login";
    let sessionExpired = false;
    let failedLogins = 0;
    let tokenExpiryWarningShown = false;
    let jwtWatcherInterval = null;
    function startJwtWatcher() {
      stopJwtWatcher();
      tokenExpiryWarningShown = false;
      jwtWatcherInterval = setInterval(
        () => {
          const userData = (
            /** @type {any} */
            get(userStore)
          );
          const token = userData?.token;
          if (!token) return;
          logJwtExpiration(token);
          const minutesLeft = getJwtExpiresInMinutes(token);
          if (minutesLeft <= 0) {
            if (page === "main" && !sessionExpired) {
              sessionExpired = true;
              failedLogins = 0;
            }
          } else if (isJwtExpiringSoon(token, 5) && !tokenExpiryWarningShown) {
            tokenExpiryWarningShown = true;
            Notifications2.push({
              message: `⚠️ Tu sesión expirará en aproximadamente ${Math.floor(minutesLeft)} minuto${Math.floor(minutesLeft) !== 1 ? "s" : ""}. Guarda tu trabajo.`,
              color: "warning",
              duration: 12e4
              // 2 minutos
            });
          }
          if (!isJwtExpiringSoon(token, 5)) {
            tokenExpiryWarningShown = false;
          }
        },
        3e4
      );
    }
    function stopJwtWatcher() {
      if (jwtWatcherInterval !== null) {
        clearInterval(jwtWatcherInterval);
        jwtWatcherInterval = null;
      }
    }
    Notifications2($$renderer2);
    $$renderer2.push(`<!----> `);
    if (page === "main") {
      $$renderer2.push("<!--[0-->");
      Application($$renderer2);
      $$renderer2.push(`<!----> `);
      if (sessionExpired) {
        $$renderer2.push(`<!--[0--><div class="overlay-container svelte-6vnx1m">`);
        Login($$renderer2, {
          isOverlay: true,
          onlogin: (login) => {
            if (login && login.login) {
              sessionExpired = false;
              failedLogins = 0;
              startJwtWatcher();
            }
          },
          onfail: () => {
            failedLogins++;
            if (failedLogins >= 3) {
              sessionExpired = false;
              page = "login";
              failedLogins = 0;
            }
          }
        });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      Login($$renderer2, {
        onlogin: (login) => {
          console.log("LOGIN", login);
          if (login && login.login) {
            page = "main";
            startJwtWatcher();
          } else {
            page = "login";
          }
        }
      });
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    OpenFusionAPI($$renderer2);
  });
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
