/* eslint-disable */
// Legacy grunt build. Pre-dates @ui5/cli (ui5-tooling). Kept for the on-prem ABAP
// upload pipeline (grunt-openui5 -> openui5_preload -> nwabap upload, done manually).
// NOTE: grunt-openui5@0.10 will not install on Node >= 12. Migration item X-07.
module.exports = function (grunt) {
	"use strict";

	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
		dir: {
			apps: "apps",
			dist: "dist"
		},

		clean: {
			dist: ["<%= dir.dist %>"]
		},

		copy: {
			apps: {
				files: [{
					expand: true,
					cwd: "<%= dir.apps %>",
					src: ["**/webapp/**", "!**/test/**"],
					dest: "<%= dir.dist %>"
				}]
			},
			shared: {
				files: [{
					expand: true,
					cwd: "shared",
					src: ["**"],
					dest: "<%= dir.dist %>/resources"
				}]
			}
		},

		openui5_preload: {
			salesorders: {
				options: {
					resources: { cwd: "apps/salesorders/webapp", prefix: "com/meridian/salesorders" },
					dest: "dist/salesorders"
				},
				components: "com/meridian/salesorders"
			},
			approvals: {
				options: {
					resources: { cwd: "apps/approvals/webapp", prefix: "com/meridian/approvals" },
					dest: "dist/approvals"
				},
				components: "com/meridian/approvals"
			},
			partners: {
				options: {
					resources: { cwd: "apps/partners/webapp", prefix: "com/meridian/partners" },
					dest: "dist/partners"
				},
				components: "com/meridian/partners"
			}
			// NOTE: "materials" has no Component.js, so it cannot be preloaded. Migration item MM-01.
		},

		connect: {
			serve: {
				options: {
					port: 8080,
					hostname: "localhost",
					base: ".",
					keepalive: true
					// CORS proxy to the Gateway box was configured manually in SAP Web IDE,
					// not reproducible here. Use the mockserver instead.
				}
			}
		}
	});

	grunt.registerTask("build", ["clean", "copy", "openui5_preload"]);
	grunt.registerTask("serve", ["connect:serve"]);
	grunt.registerTask("default", ["build"]);
};
