sap.ui.define([
	"com/meridian/lib/reuse/BaseController",
	"com/meridian/salesorders/model/formatter"
], function (ReuseBaseController, formatter) {
	"use strict";

	return ReuseBaseController.extend("com.meridian.salesorders.controller.BaseController", {
		formatter: formatter
	});
});
