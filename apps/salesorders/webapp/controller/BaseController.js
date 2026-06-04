/*!
 * App-level base controller. Extends the shared reuse BaseController (which itself is full of
 * jQuery.sap.* debt) and pins the formatter onto the controller for view binding.
 */
jQuery.sap.declare("com.meridian.salesorders.controller.BaseController");
jQuery.sap.require("com.meridian.lib.reuse.BaseController");
jQuery.sap.require("com.meridian.salesorders.model.formatter");

com.meridian.lib.reuse.BaseController.extend("com.meridian.salesorders.controller.BaseController", {
	formatter: com.meridian.salesorders.model.formatter
});
