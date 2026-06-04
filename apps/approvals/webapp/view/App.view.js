/*!
 * Root JS view (migration AP-01: convert to XML). Builds an sap.m.App and nests the
 * Approvals JS view as its only page. No routing - single screen app.
 */
sap.ui.jsview("com.meridian.approvals.view.App", {

	getControllerName: function () {
		return null;
	},

	createContent: function () {
		this.setDisplayBlock(true);
		var oApp = new sap.m.App(this.createId("approvalsApp"));
		oApp.addPage(sap.ui.view({
			id: this.createId("approvalsPage"),
			viewName: "com.meridian.approvals.view.Approvals",
			type: sap.ui.core.mvc.ViewType.JS
		}));
		return oApp;
	}
});
