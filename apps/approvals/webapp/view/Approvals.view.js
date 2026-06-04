/*!
 * Approvals JS view (migration AP-01: convert to XML). The entire UI is assembled
 * imperatively in JS, with controls bound to the "data" JSONModel that the controller fills
 * from raw jQuery.ajax. Lots of inline new sap.m.* calls - the opposite of declarative XML.
 */
sap.ui.jsview("com.meridian.approvals.view.Approvals", {

	getControllerName: function () {
		return "com.meridian.approvals.controller.Approvals";
	},

	createContent: function (oController) {
		var oTable = new sap.m.Table(this.createId("approvalTable"), {
			headerToolbar: new sap.m.Toolbar({
				content: [
					new sap.m.Title({ text: "Pending Purchase Approvals" }),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						icon: "sap-icon://refresh",
						tooltip: "Reload",
						press: [oController.onReload, oController]
					})
				]
			}),
			columns: [
				new sap.m.Column({ header: new sap.m.Text({ text: "Approval" }) }),
				new sap.m.Column({ header: new sap.m.Text({ text: "PO / Vendor" }) }),
				new sap.m.Column({ header: new sap.m.Text({ text: "Requester" }) }),
				new sap.m.Column({ hAlign: "End", header: new sap.m.Text({ text: "Amount" }) }),
				new sap.m.Column({ hAlign: "Center", header: new sap.m.Text({ text: "Status" }) }),
				new sap.m.Column({ hAlign: "Center", header: new sap.m.Text({ text: "Actions" }) })
			]
		});

		var oTemplate = new sap.m.ColumnListItem({
			cells: [
				new sap.m.ObjectIdentifier({ title: "{data>ApprovalID}", text: "{data>PurchaseOrderID}" }),
				new sap.m.Text({ text: "{data>Vendor}" }),
				new sap.m.Text({ text: "{data>Requester}" }),
				new sap.m.ObjectNumber({ number: "{data>Amount}", unit: "{data>Currency}" }),
				new sap.m.ObjectStatus({
					text: "{data>ApprovalStatus}",
					// formatter referenced as a string path resolved against the controller
					state: { path: "data>ApprovalStatus", formatter: oController.statusState }
				}),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							icon: "sap-icon://accept",
							type: "Accept",
							tooltip: "Approve",
							enabled: { path: "data>ApprovalStatus", formatter: oController.isPending },
							press: [oController.onApprove, oController]
						}),
						new sap.m.Button({
							icon: "sap-icon://decline",
							type: "Reject",
							tooltip: "Reject",
							enabled: { path: "data>ApprovalStatus", formatter: oController.isPending },
							press: [oController.onReject, oController]
						})
					]
				})
			]
		});

		oTable.bindAggregation("items", { path: "data>/approvals", template: oTemplate });

		return new sap.m.Page(this.createId("page"), {
			title: "Purchase Approvals",
			busy: "{data>/busy}",
			content: [oTable]
		});
	}
});
