import { expect, test } from "bun:test";
import { formatBRL } from "./money";

test("formats cents as BRL with thousands and decimal separators", () => {
	expect(formatBRL(123450)).toBe("R$ 1.234,50");
	expect(formatBRL(5)).toBe("R$ 0,05");
	expect(formatBRL(0)).toBe("R$ 0,00");
});
