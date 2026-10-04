import * as reports from "../lib/reports.js";
import config from "../../exports.config.json" with { type: "json" };

type Formatter = (rows: reports.Row[]) => string;

/** Runs every export listed in exports.config.json. Formatters are looked up by name. */
export function runExports(rows: reports.Row[]) {
	return config.exports.map(({ name, formatter }) => {
		const format = (reports as unknown as Record<string, Formatter>)[formatter];
		return { name, body: format(rows) };
	});
}
