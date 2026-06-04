/*!
 * Tiny message helper that wraps sap.m.MessageBox. Loaded via jQuery.sap.require and
 * registers a GLOBAL error handler on the core message manager. Migration X-04 / X-05.
 */
jQuery.sap.declare("com.meridian.lib.reuse.messages");
jQuery.sap.require("sap.m.MessageBox");

com.meridian.lib.reuse.messages = {

	error: function (sText) {
		sap.m.MessageBox.error(sText || "An unexpected error occurred.");
	},

	success: function (sText) {
		sap.m.MessageBox.success(sText || "Done.");
	},

	confirm: function (sText, fnOnConfirm) {
		sap.m.MessageBox.confirm(sText, {
			onClose: function (sAction) {
				if (sAction === sap.m.MessageBox.Action.OK && typeof fnOnConfirm === "function") {
					fnOnConfirm();
				}
			}
		});
	},

	/**
	 * Attaches a catch-all handler to the global message processor. Apps call this once at
	 * startup. The handler reads window.MERIDIAN_REUSE_LOADED — global coupling.
	 */
	attachGlobalErrorHandler: function () {
		if (!window.MERIDIAN_REUSE_LOADED) {
			jQuery.sap.log.warning("[reuse] library not loaded yet");
		}
		sap.ui.getCore().getMessageManager().registerObject(sap.ui.getCore(), true);
	}
};
