import { evaluate, evaluateExpression } from "../src/evaluator";

describe("Evaluator", () => {
    it("should evaluate simple addition", () => {
        const result = evaluate("2 + 3");
        expect(result).toBe(5);
    });

    it("should evaluate simple subtraction", () => {
        const result = evaluate("5 - 2");
        expect(result).toBe(3);
    });

    it("should evaluate simple multiplication", () => {
        const result = evaluate("4 * -3");
        expect(result).toBe(-12);
    });

    it("should evaluate simple division", () => {
        const result = evaluate("10 / 2");
        expect(result).toBe(5);
    });

    it("should evaluate complex expression", () => {
        const result = evaluate("2 + 3 * 4 - 6 / 2");
        expect(result).toBe(11);
    });

    it("should handle parentheses", () => {
        const result = evaluate("(2 + 3) * 4");
        expect(result).toBe(20);
    });

    it("should handle negative numbers", () => {
        const result = evaluate("-5 + 3");
        expect(result).toBe(-2);
    });

    it("should handle single number", () => {
        const result = evaluate("5");
        expect(result).toBe(5);
    });

    it("should throw an error for invalid expression", () => {
        expect(() => evaluate("2 +")).toThrow();
    });

    it("should throw an error for invalid expression type", () => {
        expect(() => evaluateExpression({
            type: "WEIRD" as any,
            operator: "%",
            left: { type: "VALUE", value: 2 },
            right: { type: "VALUE", value: 3 },
        })).toThrow("Invalid expression");
    });

    it("should throw an error for invalid operator", () => {
        expect(() => evaluateExpression({
            type: "OPERATOR",
            operator: "%",
            left: { type: "VALUE", value: 2 },
            right: { type: "VALUE", value: 3 },
        })).toThrow("Invalid operator");
    });
});