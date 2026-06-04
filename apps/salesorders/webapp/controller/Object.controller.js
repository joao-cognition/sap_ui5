sap.ui.define([
	"com/meridian/salesorders/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.meridian.salesorders.controller.Object", {

		onInit: function () {
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var sOrderId = oEvent.getParameter("arguments").orderId;
			var oView = this.getView();
			var sPath = oView.getModel().createKey("SalesOrderSet", { OrderID: sOrderId });
			oView.bindElement({
				path: "/" + sPath,
				parameters: { expand: "ToLineItems" },
				events: {
					dataRequested: function () { oView.setBusy(true); },
					dataReceived: function () { oView.setBusy(false); }
				}
			});
		}
	});
});
