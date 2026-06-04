/*!
 * Sales Orders component (AMD / sap.ui.define).
 *
 * The OData V2 model and routing are now configured declaratively in the
 * manifest (sap.app.dataSources + sap.ui5.models + routing.config.async=true),
 * so this component only has to start the local MockServer before the base
 * init runs - that way the model's $metadata request is intercepted.
 */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"com/meridian/lib/reuse/library"
], function (UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("com.meridian.salesorders.Component", {

		metadata: {
			manifest: "json"
		},

		SERVICE_URL: "/sap/opu/odata/sap/ZSD_SALESORDER_SRV/",

		/**
		 * The OData model is declared in the manifest, which means UI5 instantiates
		 * it (and fires its $metadata request) while running the base Component
		 * constructor - before init() would run. So the MockServer has to be started
		 * here, before the super constructor, to intercept that first request.
		 */
		constructor: function () {
			this._startMockServer();
			UIComponent.apply(this, arguments);
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			// Initialise the (async) router so the default route is displayed.
			this.getRouter().initialize();
		},

		_startMockServer: function () {
			// Resolve the /mock folder relative to this app's resource root so the
			// same MockServer config works from the app index.html and from the
			// QUnit / OPA5 test entry points (which live under different folders).
			var sAppRoot = sap.ui.require.toUrl("com/meridian/salesorders");
			var sMockBase = sAppRoot + "/../../../mock";

			var oMockServer = new MockServer({ rootUri: this.SERVICE_URL });
			MockServer.config({ autoRespond: true, autoRespondAfter: 200 });
			oMockServer.simulate(sMockBase + "/metadata.xml", {
				sMockdataBaseUrl: sMockBase,
				bGenerateMissingMockData: true
			});
			oMockServer.start();
			this._oMockServer = oMockServer;
		},

		destroy: function () {
			if (this._oMockServer) {
				this._oMockServer.stop();
			}
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
