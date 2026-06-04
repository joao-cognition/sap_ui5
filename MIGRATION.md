# Migration Plan — UI5 (freestyle) → SAP Fiori / SAPUI5 evergreen

This document is the source of truth for the batch modernization effort. It inventories the
technical debt per app and maps each item to a concrete migration target. It is written so an
automated agent (or a developer) can pick up discrete, verifiable work items.

## Target architecture

- **Framework**: single pinned SAPUI5 **evergreen (1.120.x LTS)** across all apps, theme `sap_horizon`.
- **App structure**: Component-based, descriptor-driven (`manifest.json` schema `1.65.0`+),
  `sap.ui.core.routing` for navigation, async everywhere (`data-sap-ui-async="true"`,
  `"sap.ui.core": { "rootView": { "async": true } }`, routing `"async": true`).
- **Views**: XML views only (no JS/JSON views).
- **Modules**: `sap.ui.define` / `sap.ui.require` only. **Zero** `jQuery.sap.*` and **zero** globals.
- **Controls**: `sap.m` / `sap.f` / `sap.ui.layout` only. **No** `sap.ui.commons`.
- **Data**: OData **V4** (`sap.ui.model.odata.v4.ODataModel`) where the backend supports it;
  otherwise V2 via `sap.ui.model.odata.v2.ODataModel` with **no** hand-rolled `jQuery.ajax`.
- **Tooling**: `@ui5/cli` (ui5-tooling), `@ui5/linter`, eslint flat config, `@sap/ux-ui5-tooling`.
- **Tests**: QUnit unit tests + OPA5 integration journeys, `karma-ui5` runner.
- **Types**: progressive TypeScript adoption via `@sapui5/types` + `ui5-tsinterface`.

## Cross-cutting technical debt (applies to every app)

| ID | Debt | Where | Target |
|----|------|-------|--------|
| X-01 | Four different UI5 versions pinned per app (1.38 / 1.52 / 1.71) | each `index.html` | single evergreen 1.120.x |
| X-02 | Three legacy themes (`sap_bluecrystal`, `sap_goldreflection`, `sap_belize`) | each `index.html` | `sap_horizon` |
| X-03 | Synchronous bootstrap (`data-sap-ui-async="false"` / omitted) | each `index.html` | `data-sap-ui-async="true"` + async preloads |
| X-04 | `jQuery.sap.*` deprecated API (`require`, `declare`, `log`, `domById`, `delayedCall`, `properties`) | everywhere | `sap.ui.define` / `sap/base/*` / `sap/ui/core/*` |
| X-05 | Global functions & `sap.ui.getCore().byId()` lookups | controllers | `this.byId()`, proper view scoping |
| X-06 | No eslint / no `.ui5lintrc` / no CI | repo root | eslint flat config + `@ui5/linter` + CI |
| X-07 | Legacy `grunt-openui5` build, no ui5-tooling | `Gruntfile.js` | `@ui5/cli` + `ui5.yaml` |
| X-08 | No QUnit / no OPA5 tests anywhere | all apps | unit + integration test suites |
| X-09 | Inline styles & per-app hand-written CSS | views + `css/style.css` | theme-compliant, CSS classes, fewer overrides |
| X-10 | i18n duplicated per app, hardcoded English strings in code | controllers | central i18n, no hardcoded UI strings |

## Per-app debt inventory

### `com.meridian.salesorders` (the "least bad" app — start here)
- **SO-01** `manifest.json` uses old `sap.ui5` descriptor, no `routing.config.async`, models declared but routing wired manually in code.
- **SO-02** `BaseController` extends with `jQuery.sap.log` and `jQuery.sap.delayedCall`.
- **SO-03** OData V2 model created in `Component.js` with sync metadata load (`loadMetadataAsync: false`).
- **SO-04** Formatter uses deprecated `sap.ui.core.format.NumberFormat.getCurrencyInstance` options + global.
- **SO-05** XML view uses deprecated `sap.m.Table` `growingThreshold` patterns and inline `class` styling.
- **Target**: reference implementation for the new pattern. Convert routing to async, V2 model via manifest `dataSources`, add OPA journey "open order → see items".

### `com.meridian.approvals`
- **AP-01** Views are **JS views** (`*.view.js`) — must be converted to XML.
- **AP-02** `manifest.json` is **partial** (no `sap.app.dataSources`, no `models`); model built in code.
- **AP-03** Data fetched with **hand-rolled `jQuery.ajax`** (`util/ServiceClient.js`) against the OData URL, response parsed manually with `JSON.parse`.
- **AP-04** Approve/Reject actions issue raw `$.ajax` POST with `X-CSRF-Token` fetched manually.
- **AP-05** Uses `sap.ui.getCore().getEventBus()` global channel for cross-view comms.
- **Target**: XML views, `ODataModel` V2 with `submitChanges`/`callFunction`, manifest dataSources, remove ServiceClient.

### `com.meridian.materials` (worst offender)
- **MM-01** **No Component** — `index.html` calls `sap.ui.view({type:JSON})` directly (no `Component.js`, no `manifest.json`).
- **MM-02** Bootstrap is **synchronous** and pinned to **UI5 1.38.42** with `sap.ui.commons` + `sap.ui.table` legacy libs.
- **MM-03** View is a **JSON view** (`Materials.view.json`).
- **MM-04** Uses `sap.ui.commons.Button`, `sap.ui.commons.TextField`, `sap.ui.commons.layout.MatrixLayout`.
- **MM-05** `jQuery.sap.require` to pull in libs at runtime; `jQuery.sap.syncStyleClass`.
- **MM-06** Data via `jQuery.sap.sjax` (synchronous XHR!).
- **Target**: full rebuild as Component-based app, XML view, `sap.m`/`sap.ui.table` (the supported one), async, V2 model.

### `com.meridian.partners`
- **BP-01** OData access via custom `service/ODataHelper.js` wrapping `jQuery.ajax`, manual `$batch` string building.
- **BP-02** Deprecated `jQuery.sap.properties` for reading config, `jQuery.sap.getModulePath`.
- **BP-03** `sap.m` controls instantiated in JS (no XML) inside the controller's `onInit`.
- **BP-04** Manual two-way binding emulation via change handlers.
- **Target**: XML view + declarative binding, `ODataModel` V2, delete ODataHelper.

## Suggested migration batches (for the agent)

1. **Batch 0 — tooling baseline**: add `ui5.yaml` per app, root `@ui5/cli` workspace, eslint flat config, `@ui5/linter`. Make every app start under `ui5 serve`. (No behavior change.)
2. **Batch 1 — bootstrap & versions**: unify to evergreen + `sap_horizon`, async bootstrap, fix `index.html` for all apps. Resolve X-01/02/03.
3. **Batch 2 — kill globals**: codemod `jQuery.sap.*` → modern modules; remove `sap.ui.getCore()` lookups. Resolve X-04/05.
4. **Batch 3 — views**: convert `approvals` JS views and `materials` JSON view to XML; replace `sap.ui.commons`. Resolve AP-01, MM-*.
5. **Batch 4 — data layer**: remove `ServiceClient.js` and `ODataHelper.js`; use `ODataModel` + manifest `dataSources`. Resolve AP-03/04, BP-01.
6. **Batch 5 — descriptors & routing**: complete every `manifest.json`, async routing. Resolve SO-01, AP-02.
7. **Batch 6 — tests**: QUnit + OPA5 per app. Resolve X-08.

Each batch must keep the FLP sandbox (`flp/flpSandbox.html`) green and every app loadable.
