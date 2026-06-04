/*!
 * Business Partners controller. Builds the entire table imperatively in onInit (BP-03),
 * emulates two-way binding with manual change handlers (BP-04), and persists via the
 * hand-rolled ODataHelper $batch (BP-01). Extends the reuse BaseController (jQuery.sap debt).
 */
jQuery.sap.declare("com.meridian.partners.controller.Partners");
jQuery.sap.require("com.meridian.lib.reuse.BaseController");
jQuery.sap.require("com.meridian.lib.reuse.formatter");
jQuery.sap.require("com.meridian.lib.reuse.messages");
jQuery.sap.require("com.meridian.partners.service.ODataHelper");

com.meridian.lib.reuse.BaseController.extend("com.meridian.partners.controller.Partners", {

	onInit: function () {
		this._helper = com.meridian.partners.service.ODataHelper.create(
			this.getOwnerComponent().getServiceUrl()
		);
		this._buildTable();
		this._loadPartners();
	},

	/**
	 * Imperative UI construction - this should all be declarative XML in Partners.view.xml.
	 */
	_buildTable: function () {
		var that = this;

		var oSearch = new sap.m.SearchField({
			width: "20rem",
			placeholder: "Filter by name or city",
			// manual two-way binding emulation: liveChange -> write into the data model (BP-04)
			liveChange: function (oEvent) {
				that.getView().getModel("data").setProperty("/searchTerm", oEvent.getParameter("newValue"));
				that._applyClientFilter();
			}
		});

		var oTable = new sap.m.Table({
			headerToolbar: new sap.m.Toolbar({
				content: [
					new sap.m.Title({ text: "Business Partners" }),
					new sap.m.ToolbarSpacer(),
					oSearch,
					new sap.m.Button({
						icon: "sap-icon://refresh",
						press: function () { that._loadPartners(); }
					})
				]
			}),
			columns: [
				new sap.m.Column({ header: new sap.m.Text({ text: "Partner" }) }),
				new sap.m.Column({ header: new sap.m.Text({ text: "Type" }) }),
				new sap.m.Column({ header: new sap.m.Text({ text: "Location" }) }),
				new sap.m.Column({ header: new sap.m.Text({ text: "Contact" }) }),
				new sap.m.Column({ hAlign: "Center", header: new sap.m.Text({ text: "Blocked" }) })
			]
		});

		var oTemplate = new sap.m.ColumnListItem({
			cells: [
				new sap.m.ObjectIdentifier({ title: "{data>Name}", text: "{data>PartnerID}" }),
				new sap.m.Text({ text: "{data>PartnerType}" }),
				new sap.m.Text({ text: "{data>City}, {data>Country}" }),
				new sap.m.Link({ text: "{data>Email}", href: "mailto:{data>Email}" }),
				new sap.m.Switch({
					state: "{data>Blocked}",
					change: function (oEvent) {
						var oCtx = oEvent.getSource().getBindingContext("data");
						that._onToggleBlocked(oCtx.getObject(), oEvent.getParameter("state"));
					}
				})
			]
		});
		oTable.bindAggregation("items", { path: "data>/partners", template: oTemplate });

		// inject into the page declared in the XML view
		this.byId("partnerPage").addContent(oTable);
		this._oTable = oTable;
	},

	_loadPartners: function () {
		var oModel = this.getView().getModel("data");
		oModel.setProperty("/busy", true);
		var that = this;
		this._helper.readPartners(function (aPartners) {
			that._aAll = aPartners;
			oModel.setProperty("/partners", aPartners);
			oModel.setProperty("/busy", false);
		}, function () {
			oModel.setProperty("/busy", false);
			com.meridian.lib.reuse.messages.error("Failed to load partners.");
		});
	},

	_applyClientFilter: function () {
		var sTerm = (this.getView().getModel("data").getProperty("/searchTerm") || "").toLowerCase();
		var aAll = this._aAll || [];
		if (!sTerm) {
			this.getView().getModel("data").setProperty("/partners", aAll);
			return;
		}
		var aFiltered = aAll.filter(function (o) {
			return (o.Name || "").toLowerCase().indexOf(sTerm) > -1 ||
				(o.City || "").toLowerCase().indexOf(sTerm) > -1;
		});
		this.getView().getModel("data").setProperty("/partners", aFiltered);
	},

	_onToggleBlocked: function (oPartner, bState) {
		var that = this;
		this._helper.setBlocked(oPartner.PartnerID, bState, function () {
			// optimistic local mutation
			oPartner.Blocked = bState;
			that.getView().getModel("data").refresh(true);
			that.toast(oPartner.Name + (bState ? " blocked" : " unblocked"));
		}, function () {
			com.meridian.lib.reuse.messages.error("Could not update partner.");
		});
	}
});
