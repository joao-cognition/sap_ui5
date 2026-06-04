sap.ui.define([
	"com/meridian/salesorders/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.meridian.salesorders.controller.Worklist", {

		onInit: function () {
			var oViewModel = new JSONModel({ orderCount: 0 });
			this.setModel(oViewModel, "worklistView");

			// update the count once the table has data - uses updateFinished event
			var oTable = this.byId("ordersTable");
			oTable.attachUpdateFinished(function (oEvent) {
				oViewModel.setProperty("/orderCount", oEvent.getParameter("total"));
			});

			this._aActiveFilters = [];
		},

		onRefresh: function () {
			// debounced refresh via the reuse base controller helper
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
				aFilters.push(new Filter({
					filters: [
						new Filter("OrderID", FilterOperator.Contains, sQuery),
						new Filter("CustomerName", FilterOperator.Contains, sQuery)
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
				aFilters.push(new Filter("SalesOrg", FilterOperator.EQ, sKey));
			}
			this._applyFilters(aFilters);
		},

		_applyFilters: function (aFilters) {
			var oTable = this.byId("ordersTable");
			oTable.getBinding("items").filter(aFilters);
		},

		onSelectOrder: function (oEvent) {
			var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			var sOrderId = oCtx.getProperty("OrderID");
			this.getRouter().navTo("object", { orderId: sOrderId });
		}
	});
});
