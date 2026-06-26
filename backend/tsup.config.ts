import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/server.ts"],
	target: "node25",
	format: ["esm"],
	clean: true,
	splitting: false,
	outExtension() {
		return {
			js: ".js",
		};
	},
	sourcemap: true,
	shims: true,
	dts: false,
});
