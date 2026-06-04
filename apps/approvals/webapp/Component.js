/*!
 * Approvals component. No OData model is created here (the app talks to the backend via raw
 * jQuery.ajax in util/ServiceClient). The component only starts the local MockServer so the
 * ajax calls resolve offline, and seeds an empty JSONModel. Migration AP-02/AP-03.
 */
jQuery.sap.declare("com.meridian.approvals.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.ui.core.util.MockServer");

jQuery.sap.registerResourcePath("com.meridian.lib.reuse", "../../../shared/com/meridian/lib/reuse");
jQuery.sap.require("com.meridian.lib.reuse.library");

sap.ui.core.UIComponent.extend("com.meridian.approvals.Component", {

	metadata: {
		manifest: "json"
	},

	SERVICE_URL: "/sap/opu/odata/sap/ZMM_APPROVAL_SRV/",

	init: function () {
		this._startMockServer();
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		// view-state model, populated later by the controller via ServiceClient
		this.setModel(new sap.ui.model.json.JSONModel({ approvals: [], busy: false }), "data");
	},

	_startMockServer: function () {
		var oMockServer = new sap.ui.core.util.MockServer({ rootUri: this.SERVICE_URL });
		sap.ui.core.util.MockServer.config({ autoRespond: true, autoRespondAfter: 250 });
		oMockServer.simulate("../../../mock/metadata.xml", {
			sMockdataBaseUrl: "../../../mock",
			bGenerateMissingMockData: true
		});
		oMockServer.start();
		this._oMockServer = oMockServer;
	},

	destroy: function () {
		if (this._oMockServer) {
			this._oMockServer.stop();
		}
		sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
	}
});
