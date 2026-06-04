jQuery.sap.declare("com.meridian.salesorders.controller.Object");
jQuery.sap.require("com.meridian.salesorders.controller.BaseController");

com.meridian.salesorders.controller.BaseController.extend("com.meridian.salesorders.controller.Object", {

	onInit: function () {
		this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
	},

	_onObjectMatched: function (oEvent) {
		var sOrderId = oEvent.getParameter("arguments").orderId;
		// build the OData key path by hand (string concat) instead of createKey — debt
		var sPath = "/SalesOrderSet('" + sOrderId + "')";
		var oView = this.getView();
		oView.bindElement({
			path: sPath,
			parameters: { expand: "ToLineItems" },
			events: {
				dataRequested: function () { oView.setBusy(true); },
				dataReceived: function () { oView.setBusy(false); }
			}
		});
	}
});
