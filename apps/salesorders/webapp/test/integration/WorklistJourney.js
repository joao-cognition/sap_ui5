sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Worklist",
	"./pages/Object"
], function (opaTest) {
	"use strict";

	QUnit.module("Sales Orders - Worklist Journey");

	opaTest("Should show the orders table with all rows", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "com.meridian.salesorders",
				async: true
			}
		});

		// Assertions
		Then.onTheWorklistPage.iSeeTheOrdersTable();
		Then.onTheWorklistPage.iShouldSeeTheRowCount(6);
	});

	opaTest("Should filter the table when searching for Atlas", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iSearchFor("Atlas");

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheRowCount(1);
		Then.onTheWorklistPage.iShouldSeeOrderInTable("4500000001");
	});

	opaTest("Should navigate to the order detail with line items", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iPressOnOrder("4500000001");

		// Assertions
		Then.onTheObjectPage.iSeeTheObjectPage();
		Then.onTheObjectPage.iSeeTheLineItems();
	});

	opaTest("Should navigate back to the worklist", function (Given, When, Then) {
		// Actions
		When.onTheObjectPage.iPressTheBackButton();

		// Assertions
		Then.onTheWorklistPage.iSeeTheOrdersTable();

		// Cleanup
		Then.iTeardownMyApp();
	});
});
