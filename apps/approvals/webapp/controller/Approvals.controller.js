/*!
 * Approvals controller. Uses the hand-rolled ServiceClient for I/O, drives a JSONModel by
 * hand, broadcasts on the GLOBAL event bus (AP-05), and keeps formatter functions as plain
 * methods. Migration AP-03/AP-04/AP-05.
 */
jQuery.sap.declare("com.meridian.approvals.controller.Approvals");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("com.meridian.approvals.util.ServiceClient");
jQuery.sap.require("com.meridian.lib.reuse.formatter");
jQuery.sap.require("com.meridian.lib.reuse.messages");

sap.ui.core.mvc.Controller.extend("com.meridian.approvals.controller.Approvals", {

	onInit: function () {
		// subscribe to a global channel so other apps/tiles could trigger a reload - debt X-05
		sap.ui.getCore().getEventBus().subscribe("approvals", "reload", this.onReload, this);
		this.onReload();
	},

	onExit: function () {
		sap.ui.getCore().getEventBus().unsubscribe("approvals", "reload", this.onReload, this);
	},

	_getDataModel: function () {
		return this.getView().getModel("data");
	},

	onReload: function () {
		var oModel = this._getDataModel();
		oModel.setProperty("/busy", true);
		com.meridian.approvals.util.ServiceClient.readApprovals(
			function (aResults) {
				oModel.setProperty("/approvals", aResults);
				oModel.setProperty("/busy", false);
			},
			function () {
				oModel.setProperty("/busy", false);
				com.meridian.lib.reuse.messages.error("Could not load approvals.");
			}
		);
	},

	_rowContext: function (oEvent) {
		// walk up to the ColumnListItem to read its binding context against the "data" model
		var oCtx = oEvent.getSource().getBindingContext("data");
		return oCtx ? oCtx.getObject() : null;
	},

	onApprove: function (oEvent) {
		this._changeStatus(this._rowContext(oEvent), "Approved");
	},

	onReject: function (oEvent) {
		this._changeStatus(this._rowContext(oEvent), "Rejected");
	},

	_changeStatus: function (oRow, sStatus) {
		if (!oRow) { return; }
		var that = this;
		com.meridian.approvals.util.ServiceClient.setStatus(oRow.ApprovalID, sStatus, function () {
			// optimistic local update of the JSON model (find the row by id, mutate, refresh)
			var oModel = that._getDataModel();
			var aApprovals = oModel.getProperty("/approvals");
			for (var i = 0; i < aApprovals.length; i++) {
				if (aApprovals[i].ApprovalID === oRow.ApprovalID) {
					aApprovals[i].ApprovalStatus = sStatus;
					break;
				}
			}
			oModel.setProperty("/approvals", aApprovals);
			oModel.refresh(true);
			jQuery.sap.require("sap.m.MessageToast");
			sap.m.MessageToast.show(oRow.ApprovalID + " -> " + sStatus);
			// notify the world on the global bus
			sap.ui.getCore().getEventBus().publish("approvals", "changed", { id: oRow.ApprovalID });
		});
	},

	// formatter methods kept on the controller (referenced from the JS view)
	statusState: function (sStatus) {
		return com.meridian.lib.reuse.formatter.statusState(sStatus);
	},

	isPending: function (sStatus) {
		return sStatus === "Pending";
	}
});
