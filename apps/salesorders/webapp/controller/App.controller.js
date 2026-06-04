jQuery.sap.declare("com.meridian.salesorders.controller.App");
jQuery.sap.require("com.meridian.salesorders.controller.BaseController");

com.meridian.salesorders.controller.BaseController.extend("com.meridian.salesorders.controller.App", {
	onInit: function () {
		// busy indicator handling done the old way against the root view
		this.getView().addStyleClass("sapUiSizeCompact");
	}
});
