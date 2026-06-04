/*!
 * Shared base controller used by salesorders, approvals and partners.
 * Full of deprecated jQuery.sap.* calls and global core lookups. Migration items X-04 / X-05.
 */
jQuery.sap.declare("com.meridian.lib.reuse.BaseController");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ui.core.routing.History");

sap.ui.core.mvc.Controller.extend("com.meridian.lib.reuse.BaseController", {

	/**
	 * Returns the router. Uses the deprecated component-router lookup pattern.
	 */
	getRouter: function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	getModel: function (sName) {
		return this.getView().getModel(sName);
	},

	setModel: function (oModel, sName) {
		return this.getView().setModel(oModel, sName);
	},

	getResourceBundle: function () {
		// reaches into the owner component's i18n model
		return this.getOwnerComponent().getModel("i18n").getResourceBundle();
	},

	/**
	 * Resolve an i18n text. Logs via the deprecated jQuery.sap.log facade.
	 */
	getText: function (sKey, aArgs) {
		var sText = this.getResourceBundle().getText(sKey, aArgs);
		jQuery.sap.log.debug("[reuse] i18n " + sKey + " -> " + sText);
		return sText;
	},

	/**
	 * Generic nav-back. Uses the deprecated History singleton + global hash changer.
	 */
	onNavBack: function () {
		var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash();
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getRouter().navTo("worklist", {}, true);
		}
	},

	/**
	 * Toast helper. Pulls MessageToast lazily via jQuery.sap.require (sync!) — migration X-04.
	 */
	toast: function (sMessage) {
		jQuery.sap.require("sap.m.MessageToast");
		sap.m.MessageToast.show(sMessage);
	},

	/**
	 * Debounced refresh using the deprecated jQuery.sap.delayedCall.
	 */
	scheduleRefresh: function (fnCallback) {
		if (this._iRefreshTimer) {
			jQuery.sap.clearDelayedCall(this._iRefreshTimer);
		}
		this._iRefreshTimer = jQuery.sap.delayedCall(400, this, fnCallback);
	},

	/**
	 * Looks a control up GLOBALLY across the whole core — works across views/apps but is
	 * exactly the pattern we want gone. Migration item X-05.
	 */
	byGlobalId: function (sId) {
		return sap.ui.getCore().byId(sId);
	}
});
