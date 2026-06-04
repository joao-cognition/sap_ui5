# Meridian Manufacturing — SAP UI5 Frontend Suite

> Internal "ZUI5_MERIDIAN" frontend monorepo. Custom Fiori-like apps built on top of
> on-premise SAP Gateway (OData V2). Originally bootstrapped in 2016 on SAPUI5 1.38,
> incrementally patched ever since. Runs on the SAP Fiori Launchpad on ABAP Platform.

This repository contains the **freestyle (custom) SAPUI5 applications** maintained by the
Meridian Digital Core team. These are *not* standard SAP delivered Fiori apps — they were
hand-built against custom `Z*` OData services and have accumulated significant technical debt.

## Apps in this monorepo

| App | Namespace | UI5 ver (bootstrapped) | Theme | Backend service |
|-----|-----------|------------------------|-------|-----------------|
| Sales Orders | `com.meridian.salesorders` | 1.71.69 | `sap_belize` | `ZSD_SALESORDER_SRV` |
| Purchase Approvals | `com.meridian.approvals` | 1.52.x | `sap_bluecrystal` | `ZMM_APPROVAL_SRV` |
| Material Master | `com.meridian.materials` | 1.38.42 | `sap_goldreflection` | `ZMM_MATERIAL_SRV` |
| Business Partners | `com.meridian.partners` | 1.71.x | `sap_belize` | `ZBP_PARTNER_SRV` |
| Reuse Library | `com.meridian.lib.reuse` | n/a | n/a | n/a |

> ⚠️ Yes, the apps are pinned to **four different UI5 versions and three different themes**.
> This is intentional and reflects the real production state. See `MIGRATION.md`.

## Repository layout

```
.
├── apps/
│   ├── salesorders/webapp     # XML views, Component-based, OData V2, manifest.json (partial)
│   ├── approvals/webapp       # JS views, manual jQuery.ajax, partial manifest
│   ├── materials/webapp       # NO Component, sap.ui.commons, JSON view, sync bootstrap
│   └── partners/webapp        # manual OData helper, deprecated jQuery.sap.* everywhere
├── shared/                    # com.meridian.lib.reuse reuse library
├── mock/                      # OData V2 mock service (metadata.xml + JSON)
├── flp/flpSandbox.html        # Fiori Launchpad sandbox (all apps as tiles)
├── Gruntfile.js               # legacy grunt-openui5 build (no ui5-tooling)
└── package.json               # legacy toolchain
```

## Running locally

There is no modern dev server. Historically devs used the SAP Web IDE, or a static
HTTP server pointed at the repo root plus a CORS proxy to the Gateway system.

For local demo without a backend, a sapui5 mockserver is wired against `mock/metadata.xml`:

```bash
npm install
# serve repo root over http (apps reference the public OpenUI5 CDN for the framework)
npx http-server -p 8080 -c-1 .
# then open:
#   http://localhost:8080/flp/flpSandbox.html              (launchpad)
#   http://localhost:8080/apps/salesorders/webapp/         (standalone)
```

> The legacy `grunt` build (`grunt serve`) is kept for reference but the `grunt-openui5`
> plugin no longer installs cleanly on Node 18+. This is one of the migration items.

## Status

This codebase is slated for a **batch modernization to SAP Fiori / SAPUI5 evergreen**.
See `MIGRATION.md` for the full technical-debt inventory and the target architecture.
