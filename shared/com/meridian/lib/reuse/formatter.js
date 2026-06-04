/*!
 * Shared formatters. Mix of deprecated NumberFormat options, hardcoded English strings
 * (migration X-10) and a state mapper that should be data-driven.
 */
jQuery.sap.declare("com.meridian.lib.reuse.formatter");
jQuery.sap.require("sap.ui.core.format.NumberFormat");

com.meridian.lib.reuse.formatter = {

	/**
	 * Currency formatting. Re-creates the formatter on every call (perf debt) and uses the
	 * deprecated boolean signature of getCurrencyInstance.
	 */
	currencyValue: function (sValue, sCurrency) {
		if (sValue === undefined || sValue === null) {
			return "";
		}
		var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
			showMeasure: false
		});
		return oCurrencyFormat.format(parseFloat(sValue), sCurrency);
	},

	/**
	 * Maps a backend status string to an sap.ui.core.ValueState. Hardcoded English keys.
	 */
	statusState: function (sStatus) {
		switch (sStatus) {
			case "Completed":
			case "Approved":
				return "Success";
			case "Blocked":
			case "Rejected":
				return "Error";
			case "In Process":
			case "Pending":
				return "Warning";
			default:
				return "None";
		}
	},

	statusIcon: function (sStatus) {
		switch (sStatus) {
			case "Completed":
			case "Approved":
				return "sap-icon://accept";
			case "Blocked":
			case "Rejected":
				return "sap-icon://decline";
			default:
				return "sap-icon://pending";
		}
	},

	/**
	 * Date formatting via the deprecated jQuery.sap date utilities path. Migration X-04.
	 */
	shortDate: function (oDate) {
		if (!oDate) {
			return "";
		}
		var oFormat = sap.ui.core.format.DateFormat.getDateInstance({ style: "medium" });
		return oFormat.format(oDate instanceof Date ? oDate : new Date(oDate));
	}
};
