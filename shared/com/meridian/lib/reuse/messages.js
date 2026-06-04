/*!
 * Tiny message helper that wraps sap.m.MessageBox.
 *
 * Modernised to AMD (sap.ui.define). The window.MERIDIAN_REUSE_LOADED global flag
 * has been removed. attachGlobalErrorHandler now prefers the modern
 * sap/ui/core/Messaging API when it is available (1.118+) and transparently falls
 * back to the deprecated core MessageManager on older runtimes.
 *
 * Only sap/m/MessageBox is imported statically because this file is still loaded
 * by the approvals (1.52) and partners (1.71) apps via jQuery.sap.require, and
 * sap/ui/core/Messaging / sap/base/Log do not exist on those versions. Those
 * modern modules are therefore required lazily, guarded by an errback.
 */
sap.ui.define([
	"sap/m/MessageBox"
], function (MessageBox) {
	"use strict";

	var oMessages = {

		error: function (sText) {
			MessageBox.error(sText || "An unexpected error occurred.");
		},

		success: function (sText) {
			MessageBox.success(sText || "Done.");
		},

		confirm: function (sText, fnOnConfirm) {
			MessageBox.confirm(sText, {
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK && typeof fnOnConfirm === "function") {
						fnOnConfirm();
					}
				}
			});
		},

		/**
		 * Registers a managed object on the message processor so that
		 * model/validation messages surface centrally. Prefers the modern
		 * Messaging module, falling back to the deprecated MessageManager.
		 *
		 * @param {sap.ui.base.ManagedObject} [oObject] Object to register
		 *   (e.g. the app Component). The modern Messaging.registerObject API
		 *   requires a ManagedObject, so callers on 1.118+ must pass one. On
		 *   older runtimes the deprecated MessageManager is used with the core,
		 *   preserving the previous behaviour for the legacy apps.
		 */
		attachGlobalErrorHandler: function (oObject) {
			sap.ui.require(["sap/ui/core/Messaging"], function (Messaging) {
				if (oObject) {
					Messaging.registerObject(oObject, true);
					return;
				}
				// The modern Messaging.registerObject requires a ManagedObject;
				// there is no global equivalent to the old "register the core"
				// behaviour. Warn rather than fail silently so a caller that
				// relied on the no-argument form is not left without handling.
				sap.ui.require(["sap/base/Log"], function (Log) {
					Log.warning(
						"attachGlobalErrorHandler called without a ManagedObject; on UI5 1.118+ " +
						"Messaging.registerObject requires one (e.g. the app Component), so no " +
						"object was registered.",
						"com.meridian.lib.reuse.messages"
					);
				});
			}, function () {
				// Older UI5 runtimes (< 1.118) - use the deprecated MessageManager.
				var oCore = sap.ui.getCore();
				oCore.getMessageManager().registerObject(oObject || oCore, true);
			});
		}
	};

	// Backward-compat: register on the legacy global namespace.
	var oGlobal = (typeof window !== "undefined" ? window : this);
	oGlobal.com = oGlobal.com || {};
	oGlobal.com.meridian = oGlobal.com.meridian || {};
	oGlobal.com.meridian.lib = oGlobal.com.meridian.lib || {};
	oGlobal.com.meridian.lib.reuse = oGlobal.com.meridian.lib.reuse || {};
	oGlobal.com.meridian.lib.reuse.messages = oMessages;

	return oMessages;
});
