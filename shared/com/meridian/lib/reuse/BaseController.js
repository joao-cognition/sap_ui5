/*!
 * Shared base controller used by salesorders (1.120) and partners (1.71).
 *
 * Modernised to AMD (sap.ui.define) with proper imports instead of the legacy
 * jQuery.sap.* facade. Backward compatibility is preserved by also registering
 * the class on the global com.meridian.lib.reuse.BaseController namespace so the
 * partners app can keep doing `com.meridian.lib.reuse.BaseController.extend(...)`.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/base/Log",
	"sap/m/MessageToast"
], function (Controller, History, Log, MessageToast) {
	"use strict";

	var BaseController = Controller.extend("com.meridian.lib.reuse.BaseController", {

		/**
		 * Returns the router for the owner component.
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Resolve an i18n text.
		 */
		getText: function (sKey, aArgs) {
			var sText = this.getResourceBundle().getText(sKey, aArgs);
			Log.debug("[reuse] i18n " + sKey + " -> " + sText);
			return sText;
		},

		/**
		 * Generic nav-back using the History singleton.
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		/**
		 * Toast helper.
		 */
		toast: function (sMessage) {
			MessageToast.show(sMessage);
		},

		/**
		 * Debounced refresh using the standard timer APIs.
		 */
		scheduleRefresh: function (fnCallback) {
			if (this._iRefreshTimer) {
				clearTimeout(this._iRefreshTimer);
			}
			this._iRefreshTimer = setTimeout(fnCallback.bind(this), 400);
		},

		/**
		 * Looks a control up globally across the whole core.
		 * @deprecated Global core lookups are discouraged - prefer this.byId(sId)
		 * which scopes the lookup to the current view. Kept only for backward
		 * compatibility with code that relied on cross-view lookups.
		 */
		byGlobalId: function (sId) {
			return sap.ui.getCore().byId(sId);
		}
	});

	// Backward-compat: register the class on the legacy global namespace so the
	// partners app (loaded via jQuery.sap.require) can extend it.
	var oGlobal = (typeof window !== "undefined" ? window : this);
	oGlobal.com = oGlobal.com || {};
	oGlobal.com.meridian = oGlobal.com.meridian || {};
	oGlobal.com.meridian.lib = oGlobal.com.meridian.lib || {};
	oGlobal.com.meridian.lib.reuse = oGlobal.com.meridian.lib.reuse || {};
	oGlobal.com.meridian.lib.reuse.BaseController = BaseController;

	return BaseController;
});
