sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press"
], function (Opa5, opaTest, Press) {
	"use strict";

	// OPA5 integration journey for the Sales Orders Fiori elements app (List Report + Object Page).
	// Runs against the local fe-mockserver (mock/metadata.xml). Open via test/integration/opaTests.qunit.html
	// while `npm run start:salesorders` is running.
	Opa5.extendConfig({
		autoWait: true,
		timeout: 60,
		appParams: {
			"sap-ui-animation": false
		}
	});

	QUnit.module("Sales Orders Journey");

	opaTest("List Report loads and shows sales orders, then navigates to the Object Page", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame("../../index.html");

		// Actions + Assertions: the List Report table eventually renders rows from the mock service.
		Then.waitFor({
			controlType: "sap.m.Table",
			matchers: function (oTable) {
				return oTable.getItems().length > 0;
			},
			success: function (aTables) {
				Opa5.assert.ok(true, "List Report table rendered " + aTables[0].getItems().length + " sales orders");
			},
			errorMessage: "The List Report table did not render any sales orders"
		});

		// Navigate to the Object Page by pressing the first row.
		When.waitFor({
			controlType: "sap.m.ColumnListItem",
			matchers: function (oItem) {
				return oItem.getType() === "Navigation";
			},
			actions: new Press(),
			errorMessage: "Could not press the first sales order row"
		});

		// The Object Page header (ObjectPageLayout) becomes visible.
		Then.waitFor({
			controlType: "sap.uxap.ObjectPageLayout",
			success: function () {
				Opa5.assert.ok(true, "Object Page opened for the selected sales order");
			},
			errorMessage: "The Object Page did not open"
		});

		// Cleanup
		Then.iTeardownMyApp();
	});
});
