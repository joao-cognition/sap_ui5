/*!
 * Meridian reuse library. Initialised the old way with jQuery.sap.declare /
 * sap.ui.getCore().initLibrary. Migration item X-04 (drop jQuery.sap).
 */
jQuery.sap.declare("com.meridian.lib.reuse.library");

sap.ui.getCore().initLibrary({
	name: "com.meridian.lib.reuse",
	version: "0.9.3",
	dependencies: ["sap.ui.core", "sap.m"],
	types: [],
	interfaces: [],
	controls: [],
	elements: []
});

// Global flag read in several apps via window.* — anti-pattern, migration item X-05.
window.MERIDIAN_REUSE_LOADED = true;
