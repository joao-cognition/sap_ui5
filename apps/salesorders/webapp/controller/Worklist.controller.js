/*!
 * Worklist controller. Demonstrates: manual JSONModel for view state, filtering with the
 * deprecated sap.ui.model.Filter import path via jQuery.sap.require, global core byId lookups,
 * and jQuery.sap.delayedCall debounce inherited from the reuse base. Migration X-04/X-05.
 */
jQuery.sap.declare("com.meridian.salesorders.controller.Worklist");
jQuery.sap.require("com.meridian.salesorders.controller.BaseController");
jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.ui.model.Filter");
jQuery.sap.require("sap.ui.model.FilterOperator");

com.meridian.salesorders.controller.BaseController.extend("com.meridian.salesorders.controller.Worklist", {

	onInit: function () {
		var oViewModel = new sap.ui.model.json.JSONModel({ orderCount: 0 });
		this.setModel(oViewModel, "worklistView");

		// update the count once the table has data — uses updateFinished event
		var oTable = this.byId("ordersTable");
		oTable.attachUpdateFinished(function (oEvent) {
			oViewModel.setProperty("/orderCount", oEvent.getParameter("total"));
		});

		this._aActiveFilters = [];
	},

	onRefresh: function () {
		// debounced refresh via the deprecated jQuery.sap.delayedCall (in reuse base)
		var that = this;
		this.scheduleRefresh(function () {
			that.getView().getModel().refresh(true);
			that.toast("Refreshed");
		});
	},

	onSearch: function (oEvent) {
		var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue") || "";
		var aFilters = [];
		if (sQuery) {
			aFilters.push(new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sQuery)
				],
				and: false
			}));
		}
		this._applyFilters(aFilters);
	},

	onFilterOrg: function (oEvent) {
		var sKey = oEvent.getParameter("selectedItem").getKey();
		var aFilters = [];
		if (sKey) {
			aFilters.push(new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.EQ, sKey));
		}
		this._applyFilters(aFilters);
	},

	_applyFilters: function (aFilters) {
		// looks the binding up via the GLOBAL core, not this.byId — debt X-05
		var oTable = sap.ui.getCore().byId(this.getView().getId() + "--ordersTable");
		if (!oTable) {
			oTable = this.byId("ordersTable");
		}
		oTable.getBinding("items").filter(aFilters);
	},

	onSelectOrder: function (oEvent) {
		var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
		var oCtx = oItem.getBindingContext();
		var sOrderId = oCtx.getProperty("OrderID");
		this.getRouter().navTo("object", { orderId: sOrderId });
	}
});
