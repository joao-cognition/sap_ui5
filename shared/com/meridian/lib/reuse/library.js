/*!
 * Meridian reuse library.
 *
 * Modernised to AMD (sap.ui.define). Initialises the library via
 * sap.ui.getCore().initLibrary (still supported in 1.120 and works on the older
 * 1.52 / 1.71 runtimes that the approvals / partners apps are still pinned to).
 *
 * Backward compatibility: the legacy apps load this file through
 * jQuery.sap.require("com.meridian.lib.reuse.library"), so we keep registering
 * the global namespace object. We intentionally avoid depending on modules that
 * only exist on newer UI5 versions (e.g. sap/ui/core/Lib) so this file keeps
 * loading on 1.52 / 1.71.
 */
sap.ui.define([], function () {
	"use strict";

	sap.ui.getCore().initLibrary({
		name: "com.meridian.lib.reuse",
		version: "0.9.3",
		dependencies: ["sap.ui.core", "sap.m"],
		types: [],
		interfaces: [],
		controls: [],
		elements: []
	});

	// Backward-compat: ensure the global namespace exists for legacy apps that
	// still reference com.meridian.lib.reuse.* directly. (window.MERIDIAN_REUSE_LOADED
	// has been removed - it was a global-coupling anti-pattern.)
	var oGlobal = (typeof window !== "undefined" ? window : this);
	oGlobal.com = oGlobal.com || {};
	oGlobal.com.meridian = oGlobal.com.meridian || {};
	oGlobal.com.meridian.lib = oGlobal.com.meridian.lib || {};
	oGlobal.com.meridian.lib.reuse = oGlobal.com.meridian.lib.reuse || {};

	return oGlobal.com.meridian.lib.reuse;
});
