sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (Opa5, Press) {
	"use strict";

	var sViewName = "com.meridian.salesorders.view.Object";

	Opa5.createPageObjects({
		onTheObjectPage: {

			actions: {

				iPressTheBackButton: function () {
					return this.waitFor({
						id: "objectPage",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Could not press the nav back button"
					});
				}
			},

			assertions: {

				iSeeTheObjectPage: function () {
					return this.waitFor({
						id: "objectPage",
						viewName: sViewName,
						success: function (oPage) {
							Opa5.assert.ok(oPage, "The Object page is shown with title: " + oPage.getTitle());
						},
						errorMessage: "The Object page is not shown"
					});
				},

				iSeeTheLineItems: function () {
					return this.waitFor({
						id: "itemsTable",
						viewName: sViewName,
						matchers: function (oTable) {
							return oTable.getItems().length > 0;
						},
						success: function (oTable) {
							Opa5.assert.ok(oTable.getItems().length > 0,
								"The line items table shows " + oTable.getItems().length + " item(s)");
						},
						errorMessage: "The line items table has no rows"
					});
				}
			}
		}
	});
});
