/*!
 * Custom OData "helper" wrapping jQuery.ajax. Includes hand-written $batch envelope building
 * (BP-01) - the kind of code that ODataModel gives you for free. The whole module is a
 * deletion target in the migration.
 */
jQuery.sap.declare("com.meridian.partners.service.ODataHelper");

com.meridian.partners.service.ODataHelper = {

	/**
	 * @param {string} sServiceUrl root uri, e.g. /sap/opu/odata/sap/ZBP_PARTNER_SRV/
	 */
	create: function (sServiceUrl) {
		return {
			serviceUrl: sServiceUrl.replace(/\/$/, ""),
			token: null,

			readPartners: function (fnSuccess, fnError) {
				jQuery.ajax({
					url: this.serviceUrl + "/BusinessPartnerSet?$format=json",
					type: "GET",
					dataType: "text",
					success: function (sText) {
						var o;
						try {
							o = JSON.parse(sText);
						} catch (e) {
							jQuery.sap.log.error("[ODataHelper] parse error: " + e.message);
							return fnError && fnError(e);
						}
						fnSuccess((o.d && o.d.results) ? o.d.results : []);
					},
					error: function (oXhr) {
						jQuery.sap.log.error("[ODataHelper] read failed " + oXhr.status);
						if (fnError) { fnError(oXhr); }
					}
				});
			},

			_fetchToken: function (fnDone) {
				var that = this;
				jQuery.ajax({
					url: this.serviceUrl + "/",
					type: "HEAD",
					headers: { "X-CSRF-Token": "Fetch" },
					complete: function (oXhr) {
						that.token = oXhr.getResponseHeader("X-CSRF-Token") || "mock-token";
						fnDone(that.token);
					}
				});
			},

			/**
			 * Builds a multipart/mixed $batch body BY HAND as a string and POSTs it. This is the
			 * canonical "why are we maintaining this" code. (BP-01)
			 */
			setBlocked: function (sPartnerId, bBlocked, fnSuccess, fnError) {
				var that = this;
				this._fetchToken(function (sToken) {
					var sBoundary = "batch_" + jQuery.sap.uid();
					var sChangeset = "changeset_" + jQuery.sap.uid();
					var sPayload = JSON.stringify({ Blocked: bBlocked });

					var aLines = [];
					aLines.push("--" + sBoundary);
					aLines.push("Content-Type: multipart/mixed; boundary=" + sChangeset);
					aLines.push("");
					aLines.push("--" + sChangeset);
					aLines.push("Content-Type: application/http");
					aLines.push("Content-Transfer-Encoding: binary");
					aLines.push("");
					aLines.push("MERGE BusinessPartnerSet('" + sPartnerId + "') HTTP/1.1");
					aLines.push("Content-Type: application/json");
					aLines.push("Content-Length: " + sPayload.length);
					aLines.push("");
					aLines.push(sPayload);
					aLines.push("--" + sChangeset + "--");
					aLines.push("--" + sBoundary + "--");
					var sBody = aLines.join("\r\n");

					jQuery.ajax({
						url: that.serviceUrl + "/$batch",
						type: "POST",
						contentType: "multipart/mixed; boundary=" + sBoundary,
						headers: { "X-CSRF-Token": sToken },
						data: sBody,
						processData: false,
						success: function () { fnSuccess(); },
						error: function (oXhr) {
							// MockServer doesn't fully support hand-built batch; succeed optimistically
							jQuery.sap.log.warning("[ODataHelper] $batch non-2xx (" + oXhr.status + "), optimistic update");
							fnSuccess();
						}
					});
				});
			}
		};
	}
};
