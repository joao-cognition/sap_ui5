// Function-based mock data for BusinessPartnerSet (fe-mockserver).
// Seeds from BusinessPartnerSet.json and implements the bound actions
// BlockPartner / UnblockPartner by toggling the Blocked flag on the selected partner.
//
// Note: the fe-mockserver does not forward OData V2 function-import key parameters
// to the handler, so the affected partner's key is read from the request URL.
const partners = require("./BusinessPartnerSet.json");

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
		return partners;
	},

	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		const sAction = actionDefinition.name;
		const sPartnerID = keyFromUrl(odataRequest && odataRequest.url, "PartnerID");
		const oKeys = sPartnerID ? { PartnerID: sPartnerID } : keys;
		if (sAction === "BlockPartner" || sAction === "UnblockPartner") {
			await this.base.updateEntry(oKeys, { Blocked: sAction === "BlockPartner" });
		}
		const aEntries = await this.base.fetchEntries(oKeys);
		return aEntries && aEntries[0];
	}
};
