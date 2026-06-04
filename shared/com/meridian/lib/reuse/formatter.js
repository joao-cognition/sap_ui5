/*!
 * Shared formatters.
 *
 * Modernised to AMD (sap.ui.define) with explicit NumberFormat / DateFormat
 * imports. The factory returns the formatter object and also registers it on the
 * legacy global namespace so the approvals (1.52) and partners (1.71) apps keep
 * working. Only modules available on those older runtimes are imported.
 */
sap.ui.define([
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/DateFormat"
], function (NumberFormat, DateFormat) {
	"use strict";

	var oFormatter = {

		/**
		 * Currency formatting.
		 */
		currencyValue: function (sValue, sCurrency) {
			if (sValue === undefined || sValue === null) {
				return "";
			}
			var oCurrencyFormat = NumberFormat.getCurrencyInstance({
				showMeasure: false
			});
			return oCurrencyFormat.format(parseFloat(sValue), sCurrency);
		},

		/**
		 * Maps a backend status string to an sap.ui.core.ValueState.
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
		 * Date formatting via the standard DateFormat API.
		 */
		shortDate: function (oDate) {
			if (!oDate) {
				return "";
			}
			var oDateFormat = DateFormat.getDateInstance({ style: "medium" });
			return oDateFormat.format(oDate instanceof Date ? oDate : new Date(oDate));
		}
	};

	// Backward-compat: register on the legacy global namespace.
	var oGlobal = (typeof window !== "undefined" ? window : this);
	oGlobal.com = oGlobal.com || {};
	oGlobal.com.meridian = oGlobal.com.meridian || {};
	oGlobal.com.meridian.lib = oGlobal.com.meridian.lib || {};
	oGlobal.com.meridian.lib.reuse = oGlobal.com.meridian.lib.reuse || {};
	oGlobal.com.meridian.lib.reuse.formatter = oFormatter;

	return oFormatter;
});
