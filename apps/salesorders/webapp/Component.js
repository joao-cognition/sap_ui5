/*!
 * Sales Orders component. Classic (non-sap.ui.define) module style. Creates the OData V2
 * model in code with SYNCHRONOUS metadata load and initialises routing manually instead of
 * letting the manifest do it. Migration items SO-01 / SO-03 / X-04.
 */
jQuery.sap.declare("com.meridian.salesorders.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.odata.v2.ODataModel");
jQuery.sap.require("sap.ui.core.util.MockServer");

// pull the shared reuse library in at runtime (sync require) — debt X-04
jQuery.sap.registerResourcePath("com.meridian.lib.reuse", "../../../shared/com/meridian/lib/reuse");
jQuery.sap.require("com.meridian.lib.reuse.library");
jQuery.sap.require("com.meridian.lib.reuse.messages");

sap.ui.core.UIComponent.extend("com.meridian.salesorders.Component", {

	metadata: {
		manifest: "json"
	},

	// service URL of the on-prem Gateway service (intercepted locally by MockServer)
	SERVICE_URL: "/sap/opu/odata/sap/ZSD_SALESORDER_SRV/",

	init: function () {
		// start the local mock so the app runs without the Gateway box
		this._startMockServer();

		// call base init
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		// OData V2 model built in CODE (not in manifest). Metadata loaded SYNCHRONOUSLY.
		var oModel = new sap.ui.model.odata.v2.ODataModel(this.SERVICE_URL, {
			loadMetadataAsync: false,
			defaultBindingMode: "TwoWay",
			useBatch: false
		});
		oModel.setSizeLimit(500);
		this.setModel(oModel);

		// register global error handler from the reuse lib
		com.meridian.lib.reuse.messages.attachGlobalErrorHandler();

		// routing initialised manually (manifest has the routes but we kick it off here)
		this.getRouter().initialize();
	},

	_startMockServer: function () {
		var sServiceUrl = this.SERVICE_URL;
		var oMockServer = new sap.ui.core.util.MockServer({ rootUri: sServiceUrl });
		sap.ui.core.util.MockServer.config({ autoRespond: true, autoRespondAfter: 200 });
		// metadata + mock data live in the repo /mock folder, three levels up from webapp
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
