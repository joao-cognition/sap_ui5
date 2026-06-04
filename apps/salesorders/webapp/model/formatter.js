/*!
 * App formatter. Delegates to the shared reuse formatter and adds an amount formatter.
 * Classic module style + global namespace object. Migration X-04 / X-10.
 */
jQuery.sap.declare("com.meridian.salesorders.model.formatter");
jQuery.sap.require("com.meridian.lib.reuse.formatter");

com.meridian.salesorders.model.formatter = {

	statusState: com.meridian.lib.reuse.formatter.statusState,
	statusIcon: com.meridian.lib.reuse.formatter.statusIcon,
	shortDate: com.meridian.lib.reuse.formatter.shortDate,

	// returns just the numeric part, parsed with parseFloat (loses precision on big decimals)
	amountOnly: function (sValue) {
		if (sValue === undefined || sValue === null || sValue === "") {
			return "";
		}
		return parseFloat(sValue).toFixed(2);
	}
};
