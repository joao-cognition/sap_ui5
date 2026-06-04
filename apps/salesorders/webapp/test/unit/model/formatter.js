sap.ui.define([
	"com/meridian/salesorders/model/formatter"
], function (formatter) {
	"use strict";

	QUnit.module("formatter - statusState");

	QUnit.test("Completed -> Success", function (assert) {
		assert.strictEqual(formatter.statusState("Completed"), "Success");
	});

	QUnit.test("Blocked -> Error", function (assert) {
		assert.strictEqual(formatter.statusState("Blocked"), "Error");
	});

	QUnit.test("In Process -> Warning", function (assert) {
		assert.strictEqual(formatter.statusState("In Process"), "Warning");
	});

	QUnit.test("unknown -> None", function (assert) {
		assert.strictEqual(formatter.statusState("Something"), "None");
	});

	QUnit.module("formatter - statusIcon");

	QUnit.test("Completed -> accept icon", function (assert) {
		assert.strictEqual(formatter.statusIcon("Completed"), "sap-icon://accept");
	});

	QUnit.test("Blocked -> decline icon", function (assert) {
		assert.strictEqual(formatter.statusIcon("Blocked"), "sap-icon://decline");
	});

	QUnit.test("unknown -> pending icon", function (assert) {
		assert.strictEqual(formatter.statusIcon("Open"), "sap-icon://pending");
	});

	QUnit.module("formatter - amountOnly");

	QUnit.test("formats decimal string", function (assert) {
		var sResult = formatter.amountOnly("18450.00");
		assert.ok(sResult.indexOf("18") > -1, "contains 18450");
	});

	QUnit.test("empty input returns empty", function (assert) {
		assert.strictEqual(formatter.amountOnly(""), "");
		assert.strictEqual(formatter.amountOnly(null), "");
		assert.strictEqual(formatter.amountOnly(undefined), "");
	});

	QUnit.test("numeric zero formats instead of returning empty", function (assert) {
		assert.strictEqual(formatter.amountOnly(0), "0.00", "numeric 0 -> 0.00");
		assert.strictEqual(formatter.amountOnly("0"), "0.00", "string '0' -> 0.00");
	});
});
