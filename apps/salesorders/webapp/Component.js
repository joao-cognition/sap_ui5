sap.ui.define([
	"sap/suite/ui/generic/template/lib/AppComponent"
], function (AppComponent) {
	"use strict";

	// SAP Fiori elements (smart template) application component. The List Report and
	// Object Page floorplans are assembled from the manifest's sap.ui.generic.app
	// descriptor and the local UI annotations (annotations.xml).
	return AppComponent.extend("com.meridian.salesorders.Component", {
		metadata: {
			manifest: "json"
		}
	});
});
