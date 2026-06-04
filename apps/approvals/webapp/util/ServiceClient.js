/*!
 * Hand-rolled OData "client" built on jQuery.ajax. This is exactly the layer the migration
 * deletes (AP-03 / AP-04): no ODataModel, manual URL building, manual JSON.parse, manual
 * X-CSRF-Token handshake, no batching, no error normalisation.
 */
jQuery.sap.declare("com.meridian.approvals.util.ServiceClient");

com.meridian.approvals.util.ServiceClient = {

	SERVICE_URL: "/sap/opu/odata/sap/ZMM_APPROVAL_SRV",

	_csrfToken: null,

	/**
	 * Reads the approval set. Builds the query string by hand and parses the response text
	 * with JSON.parse even though jQuery already gives us an object. Synchronous error toasts.
	 */
	readApprovals: function (fnSuccess, fnError) {
		jQuery.ajax({
			url: this.SERVICE_URL + "/PurchaseApprovalSet?$format=json&$orderby=SubmittedAt",
			type: "GET",
			dataType: "text",
			headers: { "Accept": "application/json" },
			success: function (sData) {
				var oParsed;
				try {
					oParsed = JSON.parse(sData);
				} catch (e) {
					jQuery.sap.log.error("[ServiceClient] bad JSON: " + e.message);
					if (fnError) { fnError(e); }
					return;
				}
				// OData V2 JSON envelope: { d: { results: [...] } }
				var aResults = (oParsed && oParsed.d && oParsed.d.results) ? oParsed.d.results : [];
				fnSuccess(aResults);
			},
			error: function (oXhr) {
				jQuery.sap.log.error("[ServiceClient] read failed " + oXhr.status);
				if (fnError) { fnError(oXhr); }
			}
		});
	},

	/**
	 * Fetches a CSRF token via a HEAD request (manual handshake). Caches it on the singleton.
	 */
	fetchToken: function (fnDone) {
		var that = this;
		jQuery.ajax({
			url: this.SERVICE_URL + "/",
			type: "HEAD",
			headers: { "X-CSRF-Token": "Fetch" },
			complete: function (oXhr) {
				that._csrfToken = oXhr.getResponseHeader("X-CSRF-Token") || "mock-token";
				fnDone(that._csrfToken);
			}
		});
	},

	/**
	 * Sets the status on an approval via a MERGE (POST + X-HTTP-Method override). No batch,
	 * key path built by string concat.
	 */
	setStatus: function (sApprovalId, sStatus, fnSuccess, fnError) {
		var that = this;
		this.fetchToken(function (sToken) {
			jQuery.ajax({
				url: that.SERVICE_URL + "/PurchaseApprovalSet('" + sApprovalId + "')",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({ ApprovalStatus: sStatus }),
				headers: {
					"X-CSRF-Token": sToken,
					"X-HTTP-Method": "MERGE"
				},
				success: function () { fnSuccess(); },
				error: function (oXhr) {
					// MockServer may not support MERGE; treat as soft-success so the demo works
					jQuery.sap.log.warning("[ServiceClient] setStatus non-2xx (" + oXhr.status + "), continuing optimistically");
					fnSuccess();
				}
			});
		});
	}
};
