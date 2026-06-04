sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/BindingPath"
], function (Opa5, Press, EnterText, PropertyStrictEquals, Properties, AggregationLengthEquals, BindingPath) {
	"use strict";

	var sViewName = "com.meridian.salesorders.view.Worklist";

	Opa5.createPageObjects({
		onTheWorklistPage: {

			actions: {

				iSearchFor: function (sQuery) {
					return this.waitFor({
						controlType: "sap.m.SearchField",
						viewName: sViewName,
						actions: new EnterText({ text: sQuery, clearTextFirst: true, pressEnterKey: true }),
						errorMessage: "Could not find the SearchField"
					});
				},

				iPressOnOrder: function (sOrderId) {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						viewName: sViewName,
						matchers: new BindingPath({
							path: "/SalesOrderSet('" + sOrderId + "')"
						}),
						actions: new Press(),
						errorMessage: "Could not press order " + sOrderId
					});
				}
			},

			assertions: {

				iSeeTheOrdersTable: function () {
					return this.waitFor({
						id: "ordersTable",
						viewName: sViewName,
						matchers: function (oTable) {
							return oTable.getItems().length > 0;
						},
						success: function (oTable) {
							Opa5.assert.ok(oTable.getItems().length > 0,
								"The orders table is shown with " + oTable.getItems().length + " rows");
						},
						errorMessage: "The orders table has no rows"
					});
				},

				iShouldSeeTheRowCount: function (iCount) {
					return this.waitFor({
						id: "ordersTable",
						viewName: sViewName,
						matchers: new AggregationLengthEquals({ name: "items", length: iCount }),
						success: function () {
							Opa5.assert.ok(true, "The table shows exactly " + iCount + " row(s)");
						},
						errorMessage: "The table does not show " + iCount + " row(s)"
					});
				},

				iShouldSeeOrderInTable: function (sOrderId) {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						viewName: sViewName,
						matchers: new BindingPath({
							path: "/SalesOrderSet('" + sOrderId + "')"
						}),
						success: function () {
							Opa5.assert.ok(true, "Order " + sOrderId + " is visible in the table");
						},
						errorMessage: "Order " + sOrderId + " is not visible"
					});
				}
			}
		}
	});
});
