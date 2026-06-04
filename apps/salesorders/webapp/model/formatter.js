sap.ui.define([
	"com/meridian/lib/reuse/formatter",
	"sap/ui/core/format/NumberFormat"
], function (reuseFormatter, NumberFormat) {
	"use strict";

	var oAmountFormat = NumberFormat.getFloatInstance({ decimals: 2 });

	return {
		statusState: reuseFormatter.statusState,
		statusIcon: reuseFormatter.statusIcon,
		shortDate: reuseFormatter.shortDate,

		amountOnly: function (sValue) {
			if (sValue === undefined || sValue === null || sValue === "") {
				return "";
			}
			return oAmountFormat.format(parseFloat(sValue));
		}
	};
});
