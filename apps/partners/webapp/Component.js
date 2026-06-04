/*!
 * Business Partners component. Reads config via the deprecated jQuery.sap.properties +
 * jQuery.sap.getModulePath (BP-02). No OData model - the app uses service/ODataHelper.js
 * (jQuery.ajax + manual $batch). Starts the local MockServer so those calls resolve. 
 */
jQuery.sap.declare("com.meridian.partners.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.ui.core.util.MockServer");

jQuery.sap.registerResourcePath("com.meridian.lib.reuse", "../../../shared/com/meridian/lib/reuse");
jQuery.sap.require("com.meridian.lib.reuse.library");

sap.ui.core.UIComponent.extend("com.meridian.partners.Component", {

	metadata: {
		manifest: "json"
	},

	init: function () {
		// read a .properties config file with deprecated jQuery.sap APIs - BP-02
		var sPath = jQuery.sap.getModulePath("com.meridian.partners.config", "/settings.properties");
		var oProps = jQuery.sap.properties({ url: sPath });
		this._sServiceUrl = oProps.getProperty("serviceUrl", "/sap/opu/odata/sap/ZBP_PARTNER_SRV/");
		this._iPageSize = parseInt(oProps.getProperty("pageSize", "50"), 10);

		this._startMockServer(this._sServiceUrl);
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		this.setModel(new sap.ui.model.json.JSONModel({ partners: [], busy: false }), "data");
	},

	getServiceUrl: function () {
		return this._sServiceUrl;
	},

	_startMockServer: function (sServiceUrl) {
		var oMockServer = new sap.ui.core.util.MockServer({ rootUri: sServiceUrl });
		sap.ui.core.util.MockServer.config({ autoRespond: true, autoRespondAfter: 200 });
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
