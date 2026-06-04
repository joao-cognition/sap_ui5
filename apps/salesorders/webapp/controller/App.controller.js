sap.ui.define([
	"com/meridian/salesorders/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.meridian.salesorders.controller.App", {
		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
	});
});
