# AGENTS.md — libOpenFusionAPIGUI

Repo: `@rdsslab/libopenfusionapigui`. GUI de `libOpenFusionAPI`. `src/` + `dist/` (svelte-package), ambos en git.

## Build / version (orden obligatorio, no saltar pasos)

- `npm run build` = `node ./set_version.js` (valida semver de 3 partes; falla si no) → `vite build` → `npm run package` (`svelte-kit sync && svelte-package && publint`).
- `set_version.js` hace `npm version patch --no-git-tag-version`; actualiza `package.json` y `package-lock.json` juntos (no tocar a mano el lock separado).
- `npm run package` genera `dist/`; `dist/` **sí se versiona** (`.gitignore` dice explícitamente; ver línea 12 de `.gitignore`). El consumidor usa `dist/` por URL git.
- Import rewrite en `dist`: `$lib/…` → `./…`; `dist/` debe regenerarse siempre que `src/` cambie.
- `dev` / `dev_proxy` corren en 5173; backend en 3000. Login: `superopenfusionapi` / `Sup3r@0penFusion!` (`#login-username`, `#login-password`).

## Estructura de trabajo

- `src/lib/OpenFusionAPI/Application/` = widgets (endpoints, variables, etc.).
- `dist/OpenFusionAPI/` = paquete publicado (`exports` apunta a `./dist/index.js`).
- `tests/` = Playwright E2E (`tests/rest-tester-ui.spec.js`; 14 tests pasado en 1.1 min). Pruebas de GUI hechas con `node` vía `DISPLAY=:10.0`; usar `headless: false` cuando se requiere ver diálogos `confirm()`.

## Convenciones específicas (no obvias por nombre)

- `Modal` (`@rdsslab/svelte-components`) **no destruye contenido al cerrarse**; solo alterna `is-active`. Eso hace que `<select>` y estados dentro del diálogo sobrevivan entre aperturas (bug recurrente: variables `variables.svelte` y endpoints `endpoint.svelte`; arreglado con reset explícito en `internalOncopy` / `openCopyDialog`).
- `Save & Deploy` y `Delete` usan `confirm()` nativo; Playwright debe aceptar con `page.on('dialog', d => d.accept())`.
- Endpoint delete API: `DELETE /api/system/api/endpoint/prd` con JSON body `{idendpoint: ...}`; query-only DELETE falla con `FST_ERR_CTP_EMPTY_JSON_BODY`.
- `data_test` (Tester) tiene forma canónica; `normalizeDataTest` en backend + `ensureDataTestShape` / `unwrapNestedDataTest` en GUI. No envolver Tester vacío como body crudo.
- `restoreSystemEndpoints(false, ...)` fue removido de widgets; solo queda en `Application/index.svelte` (boot, línea 231) y botón manual (`restore: true`, línea 508) — para evitar delay de `PUT /api/system/restore/prd` en cada pantalla.

## Comandos útiles

```bash
npm run build        # bump + build + package
npm run check        # svelte-check
npm run lint         # prettier + eslint
npm run package      # solo svelte-package + publint (si src no cambió pero dist sí)
node ./dev/test/version_sync_test.js   # backend (verifica package.json ⇄ getVersion.js ⇄ CHANGELOG)
```

## Tests / verificación

- E2E de item 1 (restore): `e2e_item1.mjs`; exactamente un `PUT system/restore/prd` al boot, cero en navegación.
- E2E de item 2 (data_test): `e2e_roundtrip.mjs`, `e2e_reopen.mjs`; verificado con Playwright headed (`DISPLAY=:10.0`).
- RESTTester suite: `tests/rest-tester-ui.spec.js` (14 passed).

## Mapeo con Graphify (graphify-out/)

- El reposo se mapeó con **graphify** en `./graphify-out/`: interactivo `graph.html`, `GRAPH_REPORT.md` audit y datos cr (`graph.json`).
- Pasa `/graphify query "< pregunta del interés del momento>"` en el archivo de `graphify-out/`; si no hay prelimваемого, usa `/graphify explain "Nombre del nodo"`.
- Actualizar con `--update` (solo ficheros cambiados) o reconstruir completo con `graphify .`. No hace falta API key: el corpus es código y se extrae por AST.

## Notas de release / commit

- GUI: commits con `fix(...)` o `chore(release):`; `dist/` debe incluirse en el mismo commit que `src/` cuando hay cambios de código (o inmediatamente después con `npm run package`).
- Backend (`libOpenFusionAPI`): `package.json` + `CHANGELOG.md`; `version_sync_test.js` vigila que la entrada más reciente del CHANGELOG coincida con `package.json`; no hay archivo de versión separado (lees de `package.json` directamente).
