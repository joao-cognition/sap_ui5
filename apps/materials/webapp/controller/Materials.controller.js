/*!
 * Materials controller. Reads data with jQuery.sap.sjax - a SYNCHRONOUS XHR that blocks the
 * UI thread (MM-06). Filters client-side by mutating the JSON model. Reads the commons
 * TextField via byId. Everything classic, no sap.ui.define. Migration MM-04/MM-05/MM-06.
 */
jQuery.sap.declare("com.meridian.materials.controller.Materials");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ui.model.json.JSONModel");

sap.ui.core.mvc.Controller.extend("com.meridian.materials.controller.Materials", {

	SERVICE_URL: "/sap/opu/odata/sap/ZMM_MATERIAL_SRV",

	onInit: function () {
		this._oModel = new sap.ui.model.json.JSONModel({ materials: [] });
		this.getView().setModel(this._oModel);
		this._aAll = [];
		this._loadSync();
	},

	/**
	 * SYNCHRONOUS read. jQuery.sap.sjax blocks until the response arrives. This is the single
	 * worst pattern in the suite and the headline migration target (MM-06).
	 */
	_loadSync: function () {
		var oResult = jQuery.sap.sjax({
			url: this.SERVICE_URL + "/MaterialSet?$format=json",
			type: "GET",
			dataType: "json"
		});

		if (!oResult.success) {
			jQuery.sap.log.error("[materials] sync read failed: " + oResult.status);
			return;
		}

		// dig the results out of the OData JSON envelope; fall back to raw array
		var oData = oResult.data;
		var aResults = (oData && oData.d && oData.d.results) ? oData.d.results : (oData.d || oData);
		this._aAll = aResults || [];
		this._oModel.setProperty("/materials", this._aAll);
	},

	onReload: function () {
		// clears the commons text field via the global core lookup, then re-reads synchronously
		var oField = this.byId("searchField");
		if (oField) {
			oField.setValue("");
		}
		this._loadSync();
	},

	onSearch: function () {
		var oField = this.byId("searchField");
		var sQuery = (oField.getValue() || "").toLowerCase();
		if (!sQuery) {
			this._oModel.setProperty("/materials", this._aAll);
			return;
		}
		// client-side filter by mutating a copy of the cached array (no OData $filter) - debt
		var aFiltered = [];
		for (var i = 0; i < this._aAll.length; i++) {
			var oMat = this._aAll[i];
			if ((oMat.MaterialID || "").toLowerCase().indexOf(sQuery) > -1 ||
				(oMat.Description || "").toLowerCase().indexOf(sQuery) > -1) {
				aFiltered.push(oMat);
			}
		}
		this._oModel.setProperty("/materials", aFiltered);
	}
});
