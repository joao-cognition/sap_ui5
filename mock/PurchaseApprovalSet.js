// Function-based mock data for PurchaseApprovalSet (fe-mockserver).
// Seeds from PurchaseApprovalSet.json and implements the bound actions
// ApprovePurchase / RejectPurchase by setting ApprovalStatus on the selected approval.
//
// Note: the fe-mockserver does not forward OData V2 function-import key parameters
// to the handler, so the affected approval's key is read from the request URL.
const approvals = require("./PurchaseApprovalSet.json");

function keyFromUrl(url, keyName) {
	if (!url) {
		return undefined;
	}
	const match = new RegExp(keyName + "=([^&]+)").exec(url);
	if (!match) {
		return undefined;
	}
	return decodeURIComponent(match[1]).replace(/^'|'$/g, "");
}

module.exports = {
	getInitialDataSet: function () {
		return approvals;
	},

	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		const sAction = actionDefinition.name;
		const sApprovalID = keyFromUrl(odataRequest && odataRequest.url, "ApprovalID");
		const oKeys = sApprovalID ? { ApprovalID: sApprovalID } : keys;
		if (sAction === "ApprovePurchase") {
			await this.base.updateEntry(oKeys, { ApprovalStatus: "Approved" });
		} else if (sAction === "RejectPurchase") {
			await this.base.updateEntry(oKeys, { ApprovalStatus: "Rejected" });
		}
		const aEntries = await this.base.fetchEntries(oKeys);
		return aEntries && aEntries[0];
	}
};
